import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";
import { RewriteRequestSchema, RewriteResponse } from "@/lib/schemas";
import { getGeminiModel, sanitizeAndParseJson } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateCheck = rateLimiter.check(ip);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = RewriteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid rewrite request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { clauseTitle, category, originalSnippet, riskScore, riskTag } = parsed.data;

    const prompt = `
SYSTEM INSTRUCTION: You are a neutral, highly experienced contract negotiator and legal draftsperson.
Your goal is to take a high-risk or one-sided contract clause and rewrite it into a fair, balanced, standard commercial version that protects both parties while remaining acceptable to the other side.

INPUT CLAUSE:
- Title: ${clauseTitle}
- Category: ${category}
- Risk Level: ${riskTag} (${riskScore}/100)
- Original Text:
"${originalSnippet}"

TASK:
1. Draft a replacement clause ("balancedClause") that is fair and balanced for both parties.
2. Draft a polite, professional negotiation email/message ("negotiationEmailDraft") that the user can copy and send to the other party proposing this change.
3. Provide a brief explanation ("keyChangesExplanation") highlighting what was modified and why it is fair to both sides.

Respond ONLY with a JSON object matching this schema:
{
  "clauseTitle": "${clauseTitle}",
  "originalSnippet": "${originalSnippet.replace(/"/g, '\\"')}",
  "balancedClause": "string",
  "negotiationEmailDraft": "string",
  "keyChangesExplanation": "string"
}
`;

    const model = getGeminiModel(0.3, "application/json");
    let resultPayload: RewriteResponse | null = null;

    if (model) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        resultPayload = sanitizeAndParseJson<RewriteResponse>(text);
      } catch (geminiError) {
        console.warn("Gemini rewrite failed, using fallback negotiator:", geminiError);
        resultPayload = generateFallbackRewrite(clauseTitle, category, originalSnippet);
      }
    } else {
      resultPayload = generateFallbackRewrite(clauseTitle, category, originalSnippet);
    }

    return NextResponse.json(resultPayload);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to rewrite clause" },
      { status: 500 }
    );
  }
}

function generateFallbackRewrite(
  title: string,
  category: string,
  snippet: string
): RewriteResponse {
  if (category === "Payment" || snippet.toLowerCase().includes("120")) {
    return {
      clauseTitle: title,
      originalSnippet: snippet,
      balancedClause:
        "1.1 Client shall pay Contractor for Services rendered within thirty (30) days following receipt of an undisputed invoice. 1.2 Overdue payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law.",
      negotiationEmailDraft:
        "Hi Team,\n\nThanks for sharing the agreement! In Section 1, we noticed the 120-day payment term. As a standard commercial practice, our billing model operates on Net 30 days. We've updated Section 1.1 to reflect Net 30 terms with a standard 1.5% late fee clause. Please let us know if this works for you!\n\nBest regards,",
      keyChangesExplanation:
        "Reduced payment timeframe from 120 days to standard Net 30 days and added late fee interest for overdue balances.",
    };
  }

  if (category === "Liability" || snippet.toLowerCase().includes("indemnify")) {
    return {
      clauseTitle: title,
      originalSnippet: snippet,
      balancedClause:
        "3.1 EACH PARTY AGREES TO INDEMNIFY AND HOLD HARMLESS THE OTHER PARTY FROM THIRD-PARTY CLAIMS ARISING OUT OF MATERIAL BREACH OR GROSS NEGLIGENCE. 3.2 EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL BE LIMITED TO THE TOTAL FEES PAID OR PAYABLE BY CLIENT TO CONTRACTOR IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
      negotiationEmailDraft:
        "Hi Team,\n\nRegarding Section 3 (Indemnification & Liability), we would like to make the indemnification mutual and establish a standard liability cap equal to 12 months of contract value. This ensures balanced risk management for both sides. Attached is the updated wording.\n\nBest regards,",
      keyChangesExplanation:
        "Converted unilateral indemnity into a mutual obligation and capped maximum liability to 12 months of contract fees.",
    };
  }

  return {
    clauseTitle: title,
    originalSnippet: snippet,
    balancedClause:
      "4.1 Both parties agree to act in good faith and provide reasonable written notice prior to enforcing any restrictive covenants or obligations under this Section.",
    negotiationEmailDraft:
      "Hi Team,\n\nWe reviewed the contract and propose a minor adjustment to Section 4 to make the obligations mutual and reasonable for both parties. Please see the suggested text attached.\n\nBest regards,",
    keyChangesExplanation:
      "Made restrictive covenants mutual, reasonable in scope, and subject to good-faith notice.",
  };
}
