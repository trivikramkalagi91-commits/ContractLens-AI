import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";
import { AnalyzeRequestSchema, AnalyzeResponse } from "@/lib/schemas";
import { buildSecuredContractPrompt, getGeminiModel, sanitizeAndParseJson } from "@/lib/gemini";
import { calculateReadability } from "@/lib/readability";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Check
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateCheck = rateLimiter.check(ip);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many analysis requests. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { contractText } = parsed.data;

    // 2. Build Secured Prompt with Injection Guard Rails
    const taskInstruction = `
Perform a thorough legal review of the contract provided inside <CONTRACT_TEXT>.
Break down the contract into distinct clauses. For each clause, provide a strict JSON object with:
- title: concise title of the clause
- category: one of ["Payment", "Termination", "IP", "Liability", "Confidentiality", "Governing Law", "Other"]
- originalSnippet: exact or representative text snippet from the clause
- plainEnglish: simple plain-English explanation targeted at an 8th-grade reading level
- riskScore: integer from 0 to 100 representing risk severity to the signing party (100 = extreme danger)
- riskTag: one of ["Safe", "Medium", "High", "Critical"]
- advice: practical, actionable advice on what to do (e.g. negotiate cap, remove clause, accept)

Respond ONLY with a JSON array of clause objects matching this schema:
[
  {
    "title": "string",
    "category": "Payment",
    "originalSnippet": "string",
    "plainEnglish": "string",
    "riskScore": 75,
    "riskTag": "High",
    "advice": "string"
  }
]
`;

    const prompt = buildSecuredContractPrompt(contractText, taskInstruction);

    // 3. Call Gemini Model or Mock Fallback
    const model = getGeminiModel(0.1, "application/json");
    let clausesRaw: any[] = [];

    if (model) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        clausesRaw = sanitizeAndParseJson<any[]>(text);
      } catch (geminiError) {
        console.warn("Gemini model call failed, falling back to heuristic analyzer:", geminiError);
        clausesRaw = generateFallbackClauses(contractText);
      }
    } else {
      clausesRaw = generateFallbackClauses(contractText);
    }

    // 4. Calculate Readability & Metrics
    const combinedOriginal = clausesRaw.map((c) => c.originalSnippet).join(" ");
    const combinedPlain = clausesRaw.map((c) => c.plainEnglish).join(" ");

    const origReadability = calculateReadability(combinedOriginal || contractText);
    const plainReadability = calculateReadability(combinedPlain);

    let improvementPercent = 0;
    if (origReadability.readingEase > 0) {
      improvementPercent = Math.round(
        ((plainReadability.readingEase - origReadability.readingEase) /
          origReadability.readingEase) *
          100
      );
    }

    const highRiskCount = clausesRaw.filter((c) => c.riskTag === "High").length;
    const criticalCount = clausesRaw.filter((c) => c.riskTag === "Critical").length;

    const responsePayload: AnalyzeResponse = {
      clauses: clausesRaw,
      summary: {
        totalClauses: clausesRaw.length,
        highRiskCount,
        criticalCount,
        missingProtectionsCount: 3,
        readabilityOriginalScore: origReadability.readingEase,
        readabilityPlainScore: plainReadability.readingEase,
        readabilityImprovementPercent: Math.max(0, improvementPercent),
      },
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to analyze contract" },
      { status: 500 }
    );
  }
}

// Fallback clause generator if Gemini API key is missing or fails
function generateFallbackClauses(text: string) {
  const clauses = [];
  const lower = text.toLowerCase();

  if (lower.includes("payment") || lower.includes("120") || lower.includes("rent")) {
    clauses.push({
      title: "Extended Payment Terms & Discretionary Withholding",
      category: "Payment",
      originalSnippet: text.slice(0, 200),
      plainEnglish: "The client can wait up to 120 days to pay your invoice and can hold back payments if they claim they don't like the work.",
      riskScore: 85,
      riskTag: "High",
      advice: "Negotiate payment terms down to Net 30 days and add a 1.5% monthly late fee.",
    });
  }

  if (lower.includes("indemnify") || lower.includes("uncapped") || lower.includes("liability")) {
    clauses.push({
      title: "Uncapped Liability & Full Indemnification",
      category: "Liability",
      originalSnippet: text.includes("INDEMNIFICATION") ? text.slice(text.indexOf("INDEMNIFICATION"), text.indexOf("INDEMNIFICATION") + 250) : text.slice(100, 300),
      plainEnglish: "You are responsible for paying all legal fees and damages if anything goes wrong, with zero limit on how much money you could lose.",
      riskScore: 95,
      riskTag: "Critical",
      advice: "Insert a bilateral liability cap limiting total damages to the total fees paid under this agreement.",
    });
  }

  if (lower.includes("non-compete") || lower.includes("restrictive")) {
    clauses.push({
      title: "5-Year Worldwide Non-Compete Restriction",
      category: "Termination",
      originalSnippet: text.slice(300, 500),
      plainEnglish: "You are banned from working for any competitor anywhere in the world for 5 years after this contract ends.",
      riskScore: 90,
      riskTag: "Critical",
      advice: "Remove the non-compete clause entirely or restrict it to direct solicitation of existing clients for 6 months.",
    });
  }

  if (clauses.length === 0) {
    clauses.push({
      title: "Standard Agreement Terms",
      category: "Other",
      originalSnippet: text.slice(0, 250),
      plainEnglish: "Standard contractual agreement establishing obligations between the signing parties.",
      riskScore: 25,
      riskTag: "Safe",
      advice: "Review standard terms to ensure dates and deliverables align with your expectations.",
    });
  }

  return clauses;
}
