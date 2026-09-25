import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";
import { GapsRequestSchema, GapsResponse, GapCheckItem } from "@/lib/schemas";
import { buildSecuredContractPrompt, getGeminiModel, sanitizeAndParseJson } from "@/lib/gemini";

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
    const parsed = GapsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid gaps request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { contractText } = parsed.data;

    const taskInstruction = `
Audit the contract provided inside <CONTRACT_TEXT> against the standard 10 essential legal contract protections:
1. Mutual Indemnity
2. Limitation of Liability / Liability Cap
3. Clear Payment Terms & Schedules
4. Termination for Convenience
5. IP Ownership & Assignment Clarity
6. Governing Law & Jurisdiction
7. Dispute Resolution & Arbitration Terms
8. Confidentiality Time Limits & Exceptions
9. Amendment & Modification Process
10. Force Majeure Clause

For each of the 10 protections, evaluate whether it is present in the contract.
Respond ONLY with a JSON array of 10 items matching this schema:
[
  {
    "protectionName": "Mutual Indemnity",
    "description": "Protects both parties equally from third-party claims.",
    "isPresent": false,
    "status": "Missing",
    "severity": "High",
    "whyItMatters": "Without mutual indemnity, you bear one-sided legal costs.",
    "recommendation": "Add a reciprocal indemnity clause."
  }
]
`;

    const prompt = buildSecuredContractPrompt(contractText, taskInstruction);
    const model = getGeminiModel(0.1, "application/json");

    let protections: GapCheckItem[] = [];

    if (model) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        protections = sanitizeAndParseJson<GapCheckItem[]>(text);
      } catch (geminiError) {
        console.warn("Gemini gaps check failed, using fallback auditor:", geminiError);
        protections = generateFallbackGaps(contractText);
      }
    } else {
      protections = generateFallbackGaps(contractText);
    }

    const presentCount = protections.filter((p) => p.isPresent).length;
    const missingCount = protections.length - presentCount;
    const score = Math.round((presentCount / protections.length) * 100);

    const responsePayload: GapsResponse = {
      protections,
      score,
      presentCount,
      missingCount,
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to analyze contract gaps" },
      { status: 500 }
    );
  }
}

function generateFallbackGaps(text: string): GapCheckItem[] {
  const lower = text.toLowerCase();

  return [
    {
      protectionName: "Mutual Indemnity",
      description: "Protects both parties equally from third-party lawsuits and damages.",
      isPresent: lower.includes("indemnify") && lower.includes("mutual"),
      status: lower.includes("indemnify") && lower.includes("mutual") ? "Present" : "Missing",
      severity: "High",
      whyItMatters: "Unilateral indemnity forces you to cover the other party's legal bills without reciprocal protection.",
      recommendation: "Ensure indemnity obligations are mutual and balanced.",
    },
    {
      protectionName: "Limitation of Liability / Liability Cap",
      description: "Caps total monetary damages to a reasonable dollar amount (e.g., 12 months of fees).",
      isPresent: lower.includes("liability") && (lower.includes("cap") || lower.includes("exceed")),
      status: lower.includes("liability") && (lower.includes("cap") || lower.includes("exceed")) ? "Present" : "Missing",
      severity: "Critical",
      whyItMatters: "Uncapped liability exposes your personal or corporate assets to infinite risk.",
      recommendation: "Add a clause limiting total liability to fees paid in the past 12 months.",
    },
    {
      protectionName: "Clear Payment Terms & Schedules",
      description: "Defines exact invoice payment due dates (Net 30) and late fee terms.",
      isPresent: lower.includes("payment") || lower.includes("invoice") || lower.includes("net 30"),
      status: lower.includes("payment") || lower.includes("invoice") || lower.includes("net 30") ? "Present" : "Missing",
      severity: "Medium",
      whyItMatters: "Vague payment terms lead to delayed compensation and cash flow disruption.",
      recommendation: "Specify Net 30 payment terms with 1.5% interest on late invoices.",
    },
    {
      protectionName: "Termination for Convenience",
      description: "Allows either party to terminate the contract with reasonable advance notice (e.g. 30 days).",
      isPresent: lower.includes("terminate") && lower.includes("convenience"),
      status: lower.includes("terminate") && lower.includes("convenience") ? "Present" : "Missing",
      severity: "High",
      whyItMatters: "Without convenience termination, you remain locked into a toxic relationship.",
      recommendation: "Add a 30-day notice termination for convenience clause.",
    },
    {
      protectionName: "IP Ownership & Assignment Clarity",
      description: "Clearly demarcates who owns pre-existing tools vs newly created deliverables.",
      isPresent: lower.includes("intellectual property") || lower.includes("ip ownership"),
      status: lower.includes("intellectual property") || lower.includes("ip ownership") ? "Present" : "Missing",
      severity: "High",
      whyItMatters: "Vague IP wording can cause accidental transfer of your background tools or code.",
      recommendation: "Explicitly reserve pre-existing IP rights and grant a license for deliverables upon full payment.",
    },
    {
      protectionName: "Governing Law & Jurisdiction",
      description: "Specifies which state or national laws govern disputes and court venues.",
      isPresent: lower.includes("governing law") || lower.includes("jurisdiction"),
      status: lower.includes("governing law") || lower.includes("jurisdiction") ? "Present" : "Missing",
      severity: "Medium",
      whyItMatters: "Prevents having to travel to distant foreign courts for litigation.",
      recommendation: "Select your local state/country jurisdiction.",
    },
    {
      protectionName: "Dispute Resolution & Arbitration",
      description: "Requires negotiation or mediation before expensive court trials.",
      isPresent: lower.includes("dispute resolution") || lower.includes("arbitration"),
      status: lower.includes("dispute resolution") || lower.includes("arbitration") ? "Present" : "Missing",
      severity: "Medium",
      whyItMatters: "Mediation and arbitration reduce legal costs significantly compared to litigation.",
      recommendation: "Include a mandatory 30-day executive negotiation period before litigation.",
    },
    {
      protectionName: "Confidentiality Time Limits & Exceptions",
      description: "Defines confidentiality bounds and standard exceptions (e.g., publicly known info).",
      isPresent: lower.includes("confidentiality") || lower.includes("proprietary information"),
      status: lower.includes("confidentiality") || lower.includes("proprietary information") ? "Present" : "Missing",
      severity: "Medium",
      whyItMatters: "Perpetual non-disclosure without standard exceptions creates compliance hazards.",
      recommendation: "Set a 2 to 3 year time limit on confidentiality obligations.",
    },
    {
      protectionName: "Amendment & Modification Process",
      description: "Requires all contract changes to be signed in writing by both authorized reps.",
      isPresent: lower.includes("amendment") || lower.includes("modification"),
      status: lower.includes("amendment") || lower.includes("modification") ? "Present" : "Missing",
      severity: "Low",
      whyItMatters: "Prevents oral agreements or informal email threads from altering binding terms.",
      recommendation: "Specify that amendments require written signatures from both parties.",
    },
    {
      protectionName: "Force Majeure Clause",
      description: "Excuses performance delays caused by natural disasters, acts of God, or wars.",
      isPresent: lower.includes("force majeure") || lower.includes("act of god"),
      status: lower.includes("force majeure") || lower.includes("act of god") ? "Present" : "Missing",
      severity: "Low",
      whyItMatters: "Protects against breach of contract claims during unforeseen global crises.",
      recommendation: "Add a standard force majeure clause.",
    },
  ];
}
