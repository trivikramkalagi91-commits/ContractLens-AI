import { z } from "zod";

// Category & Risk Enums
export const ClauseCategoryEnum = z.enum([
  "Payment",
  "Termination",
  "IP",
  "Liability",
  "Confidentiality",
  "Governing Law",
  "Other",
]);

export type ClauseCategory = z.infer<typeof ClauseCategoryEnum>;

export const RiskTagEnum = z.enum(["Safe", "Medium", "High", "Critical"]);
export type RiskTag = z.infer<typeof RiskTagEnum>;

// Individual Clause Analysis Schema
export const ClauseAnalysisSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Clause title is required"),
  category: ClauseCategoryEnum,
  originalSnippet: z.string().min(1, "Original snippet is required"),
  plainEnglish: z.string().min(1, "Plain English explanation is required"),
  riskScore: z.number().min(0).max(100),
  riskTag: RiskTagEnum,
  advice: z.string().min(1, "Advice is required"),
});

export type ClauseAnalysis = z.infer<typeof ClauseAnalysisSchema>;

// API Request: /api/analyze
export const AnalyzeRequestSchema = z.object({
  contractText: z
    .string()
    .min(10, "Contract text must be at least 10 characters")
    .max(100000, "Contract text is too long (max 100,000 characters)"),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

// API Response: /api/analyze
export const AnalyzeResponseSchema = z.object({
  clauses: z.array(ClauseAnalysisSchema),
  summary: z.object({
    totalClauses: z.number(),
    highRiskCount: z.number(),
    criticalCount: z.number(),
    missingProtectionsCount: z.number(),
    readabilityOriginalScore: z.number(),
    readabilityPlainScore: z.number(),
    readabilityImprovementPercent: z.number(),
  }),
});

export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

// API Request: /api/chat
export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
});

export const ChatRequestSchema = z.object({
  contractText: z.string().min(10),
  messages: z.array(ChatMessageSchema).min(1),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Protection Gap Item Schema
export const GapCheckItemSchema = z.object({
  protectionName: z.string(),
  description: z.string(),
  isPresent: z.boolean(),
  status: z.enum(["Present", "Missing"]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  clauseSnippet: z.string().optional(),
  whyItMatters: z.string(),
  recommendation: z.string(),
});

export type GapCheckItem = z.infer<typeof GapCheckItemSchema>;

// API Request/Response: /api/gaps
export const GapsRequestSchema = z.object({
  contractText: z.string().min(10),
});

export type GapsRequest = z.infer<typeof GapsRequestSchema>;

export const GapsResponseSchema = z.object({
  protections: z.array(GapCheckItemSchema),
  score: z.number().min(0).max(100),
  presentCount: z.number(),
  missingCount: z.number(),
});

export type GapsResponse = z.infer<typeof GapsResponseSchema>;

// API Request/Response: /api/rewrite
export const RewriteRequestSchema = z.object({
  clauseTitle: z.string(),
  category: ClauseCategoryEnum,
  originalSnippet: z.string().min(10),
  riskScore: z.number(),
  riskTag: RiskTagEnum,
});

export type RewriteRequest = z.infer<typeof RewriteRequestSchema>;

export const RewriteResponseSchema = z.object({
  clauseTitle: z.string(),
  originalSnippet: z.string(),
  balancedClause: z.string().min(10),
  negotiationEmailDraft: z.string().min(10),
  keyChangesExplanation: z.string(),
});

export type RewriteResponse = z.infer<typeof RewriteResponseSchema>;
