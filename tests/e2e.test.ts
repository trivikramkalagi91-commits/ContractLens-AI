import { describe, it, expect, beforeEach } from "vitest";
import { maskPII, isPIIFree } from "@/lib/pii";
import { contractCache } from "@/lib/cache";
import { calculateReadability, calculateImprovement } from "@/lib/readability";
import { rateLimiter } from "@/lib/rate-limit";
import { sanitizeAndParseJson } from "@/lib/gemini";
import { SAMPLE_CONTRACTS } from "@/lib/sample-contracts";

describe("End-to-End System Flow Integration Suite", () => {
  beforeEach(() => {
    contractCache.clear();
    rateLimiter.clear();
  });

  it("should process end-to-end Contract Analyzer flow", async () => {
    const rawContract = SAMPLE_CONTRACTS[0].text; // Predatory Freelance MSA

    // Step 1: PII Masking
    const piiResult = maskPII(rawContract);
    expect(piiResult.replacementsCount).toBeGreaterThan(0);
    expect(piiResult.maskedText).not.toContain("John Doe");

    // Step 2: Cache Hashing
    const hashKey = await contractCache.hashInput(piiResult.maskedText);
    expect(hashKey).toBeDefined();
    expect(contractCache.get(hashKey)).toBeNull();

    // Step 3: Analysis Payload Simulation
    const mockAnalysisPayload = {
      clauses: [
        {
          title: "Extended Payment Terms",
          category: "Payment",
          originalSnippet: "Payment in 120 days",
          plainEnglish: "You wait 4 months to get paid.",
          riskScore: 85,
          riskTag: "High",
          advice: "Negotiate Net 30 terms.",
        },
      ],
      summary: {
        totalClauses: 1,
        highRiskCount: 1,
        criticalCount: 0,
        missingProtectionsCount: 5,
        readabilityOriginalScore: 40,
        readabilityPlainScore: 75,
        readabilityImprovementPercent: 87,
      },
    };

    // Step 4: Store & Instant Cache Retrieval (0ms)
    contractCache.set(hashKey, mockAnalysisPayload);
    const cachedResult = contractCache.get<typeof mockAnalysisPayload>(hashKey);
    expect(cachedResult).toEqual(mockAnalysisPayload);
    expect(cachedResult?.clauses[0].title).toBe("Extended Payment Terms");
  });

  it("should process end-to-end Readability Score calculation flow", () => {
    const rawText = "In the event that Contractor fails to perform the Services to the sole satisfaction of Client, Client may withhold payment indefinitely without penalty or interest.";
    const plainText = "If you do not complete the work properly, the client can hold back payment.";

    const origMetrics = calculateReadability(rawText);
    const plainMetrics = calculateReadability(plainText);
    const comparison = calculateImprovement(rawText, plainText);

    expect(origMetrics.gradeLevel).toBeGreaterThan(plainMetrics.gradeLevel);
    expect(comparison.improvementPercent).toBeGreaterThan(0);
  });

  it("should enforce Rate Limiter under concurrent request burst", () => {
    const clientIP = "203.0.113.195";
    const options = { maxRequests: 5, windowMs: 60000 };

    for (let i = 0; i < 5; i++) {
      expect(rateLimiter.check(clientIP, options).success).toBe(true);
    }

    // 6th request must be rate limited
    const blocked = rateLimiter.check(clientIP, options);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("should process JSON repair on malformed model responses", () => {
    const rawMarkdownJson = `\`\`\`json
    [
      {
        "title": "Uncapped Liability",
        "riskScore": 95,
      }
    ]
    \`\`\``;

    const parsed = sanitizeAndParseJson<Array<{ title: string; riskScore: number }>>(rawMarkdownJson);
    expect(parsed[0].title).toBe("Uncapped Liability");
    expect(parsed[0].riskScore).toBe(95);
  });
});
