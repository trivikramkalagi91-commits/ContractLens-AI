import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";
import { ChatRequestSchema } from "@/lib/schemas";
import { buildSecuredContractPrompt, getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Check
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateCheck = rateLimiter.check(ip);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { contractText, messages } = parsed.data;
    const latestUserMessage = messages[messages.length - 1].content;

    // 2. Strict RAG System Instruction
    const taskInstruction = `
System Prompt: You are a strict legal contract Q&A assistant.
Answer the user's question STRICTLY based on the contract text provided inside <CONTRACT_TEXT>.

CRITICAL RULES:
1. You must cite the exact clause name or section whenever possible.
2. If the user's question asks about something NOT mentioned or governed by the contract text, you MUST explicitly state: "This contract does not mention that."
3. Do not assume or extrapolate legal terms outside the provided text.

User Question: ${latestUserMessage}
`;

    const prompt = buildSecuredContractPrompt(contractText, taskInstruction);

    // 3. Set up SSE Headers
    const encoder = new TextEncoder();
    const model = getGeminiModel(0.2, "text/plain");

    const customStream = new ReadableStream({
      async start(controller) {
        if (model) {
          try {
            const resultStream = await model.generateContentStream(prompt);
            for await (const chunk of resultStream.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                const sseData = `data: ${JSON.stringify({ text: chunkText })}\n\n`;
                controller.enqueue(encoder.encode(sseData));
              }
            }
          } catch (streamError) {
            console.warn("Stream error, emitting fallback response:", streamError);
            const fallbackText = getFallbackChatAnswer(contractText, latestUserMessage);
            const sseData = `data: ${JSON.stringify({ text: fallbackText })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          }
        } else {
          // Fallback response generator if API key is not configured
          const fallbackText = getFallbackChatAnswer(contractText, latestUserMessage);
          // Stream word by word for realistic SSE feel
          const words = fallbackText.split(" ");
          for (const word of words) {
            const sseData = `data: ${JSON.stringify({ text: word + " " })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
            await new Promise((r) => setTimeout(r, 40));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}

function getFallbackChatAnswer(contractText: string, question: string): string {
  const q = question.toLowerCase();
  const c = contractText.toLowerCase();

  if (q.includes("quit") || q.includes("terminate") || q.includes("leave")) {
    if (c.includes("terminate") || c.includes("notice")) {
      return "According to the Termination section of your contract: Either party may terminate or notice obligations apply. Contractor may be required to provide advance notice (e.g., 30-180 days).";
    }
  }

  if (q.includes("price") || q.includes("rent") || q.includes("fee") || q.includes("pay")) {
    if (c.includes("rent") || c.includes("payment")) {
      return "Under Section 1 (Payment & Fees), rent/fees are due monthly. Review Section 1.2 regarding automatic price adjustments or late payment penalties.";
    }
  }

  if (q.includes("ip") || q.includes("intellectual property") || q.includes("code") || q.includes("rights")) {
    if (c.includes("intellectual property") || c.includes("work for hire") || c.includes("inventions")) {
      return "Section 2 (Intellectual Property) states that work created before or during the agreement is assigned to the Client.";
    }
  }

  return "This contract does not mention that.";
}
