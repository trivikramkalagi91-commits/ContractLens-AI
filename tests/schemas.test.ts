import { describe, it, expect } from "vitest";
import {
  AnalyzeRequestSchema,
  ClauseAnalysisSchema,
  ChatRequestSchema,
  GapsRequestSchema,
  RewriteRequestSchema,
  ClauseCategoryEnum,
  RiskTagEnum,
} from "@/lib/schemas";

describe("Zod API Schemas Validation", () => {
  it("should validate valid AnalyzeRequest payload", () => {
    const valid = { contractText: "This is a valid test contract text with more than 10 characters." };
    const res = AnalyzeRequestSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("should reject AnalyzeRequest payload under 10 characters", () => {
    const invalid = { contractText: "Short" };
    const res = AnalyzeRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("should validate valid ClauseAnalysis object", () => {
    const validClause = {
      title: "Uncapped Liability",
      category: "Liability",
      originalSnippet: "Contractor liability shall be uncapped.",
      plainEnglish: "You could lose an unlimited amount of money.",
      riskScore: 95,
      riskTag: "Critical",
      advice: "Insert a cap equal to 12 months fees.",
    };
    const res = ClauseAnalysisSchema.safeParse(validClause);
    expect(res.success).toBe(true);
  });

  it("should reject ClauseAnalysis object with invalid risk score out of 0-100 range", () => {
    const invalidClause = {
      title: "Bad Risk",
      category: "Payment",
      originalSnippet: "Snippet",
      plainEnglish: "Explanation",
      riskScore: 150, // Out of range
      riskTag: "High",
      advice: "Advice",
    };
    const res = ClauseAnalysisSchema.safeParse(invalidClause);
    expect(res.success).toBe(false);
  });

  it("should reject ClauseAnalysis with unknown category enum", () => {
    const invalidClause = {
      title: "Unknown Category",
      category: "ArbitraryCategory",
      originalSnippet: "Snippet",
      plainEnglish: "Explanation",
      riskScore: 50,
      riskTag: "Medium",
      advice: "Advice",
    };
    const res = ClauseAnalysisSchema.safeParse(invalidClause);
    expect(res.success).toBe(false);
  });

  it("should validate all allowed categories", () => {
    const validCategories = ["Payment", "Termination", "IP", "Liability", "Confidentiality", "Governing Law", "Other"];
    validCategories.forEach((cat) => {
      expect(ClauseCategoryEnum.safeParse(cat).success).toBe(true);
    });
  });

  it("should validate all allowed risk tags", () => {
    const validTags = ["Safe", "Medium", "High", "Critical"];
    validTags.forEach((tag) => {
      expect(RiskTagEnum.safeParse(tag).success).toBe(true);
    });
  });

  it("should validate ChatRequest schema with messages thread", () => {
    const validChat = {
      contractText: "Valid contract text over 10 chars.",
      messages: [{ role: "user", content: "What is the notice period?" }],
    };
    expect(ChatRequestSchema.safeParse(validChat).success).toBe(true);
  });

  it("should validate GapsRequest schema", () => {
    const validGaps = { contractText: "Sample agreement text for gap analysis." };
    expect(GapsRequestSchema.safeParse(validGaps).success).toBe(true);
  });

  it("should validate RewriteRequest schema", () => {
    const validRewrite = {
      clauseTitle: "Late Fee Penalty",
      category: "Payment",
      originalSnippet: "Client shall pay $500 per day for late invoices.",
      riskScore: 80,
      riskTag: "High",
    };
    expect(RewriteRequestSchema.safeParse(validRewrite).success).toBe(true);
  });
});
