import { useState, useCallback } from "react";
import { maskPII, PIIMaskResult } from "@/lib/pii";
import { contractCache } from "@/lib/cache";
import {
  AnalyzeResponse,
  ClauseAnalysis,
  GapsResponse,
  RewriteResponse,
  ChatMessageSchema,
} from "@/lib/schemas";
import { z } from "zod";

type ChatMessage = z.infer<typeof ChatMessageSchema>;

export function useContractAnalysis() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [contractText, setContractText] = useState<string>("");
  const [maskedText, setMaskedText] = useState<string>("");
  const [piiResult, setPiiResult] = useState<PIIMaskResult | null>(null);
  const [isPiiShieldEnabled, setIsPiiShieldEnabled] = useState<boolean>(true);

  // Results State
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(
    null
  );
  const [gapsResult, setGapsResult] = useState<GapsResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedClauseForRewrite, setSelectedClauseForRewrite] =
    useState<ClauseAnalysis | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResponse | null>(
    null
  );

  // Status & Cache Flags
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isCheckingGaps, setIsCheckingGaps] = useState<boolean>(false);
  const [isStreamingChat, setIsStreamingChat] = useState<boolean>(false);
  const [isRewriting, setIsRewriting] = useState<boolean>(false);
  const [isCacheHit, setIsCacheHit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update Contract Text & Run Client-Side PII Masker
  const updateContractText = useCallback((text: string) => {
    setContractText(text);
    setError(null);
    if (!text.trim()) {
      setMaskedText("");
      setPiiResult(null);
      return;
    }
    const result = maskPII(text);
    setMaskedText(result.maskedText);
    setPiiResult(result);
  }, []);

  // Run Contract Analysis (Tab 1)
  const runAnalysis = useCallback(async () => {
    const textToAnalyze = isPiiShieldEnabled ? maskedText : contractText;
    if (!textToAnalyze || textToAnalyze.trim().length < 10) {
      setError("Please paste a valid contract text with at least 10 characters.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setIsCacheHit(false);

    try {
      // 1. Check Dual-Tier Cache (0ms hit)
      const hashKey = await contractCache.hashInput(textToAnalyze);
      const cached = contractCache.get<AnalyzeResponse>(hashKey);

      if (cached) {
        setAnalysisResult(cached);
        setIsCacheHit(true);
        setIsAnalyzing(false);
        return;
      }

      // 2. Fetch from API
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText: textToAnalyze }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Analysis failed with HTTP ${res.status}`);
      }

      const data: AnalyzeResponse = await res.json();
      setAnalysisResult(data);

      // Save to Cache
      contractCache.set(hashKey, data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during analysis.";
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  }, [contractText, maskedText, isPiiShieldEnabled]);

  // Run Missing Protections Check (Tab 3)
  const runGapsCheck = useCallback(async () => {
    const textToAnalyze = isPiiShieldEnabled ? maskedText : contractText;
    if (!textToAnalyze || textToAnalyze.trim().length < 10) {
      setError("No active contract text found. Please paste a contract first.");
      return;
    }

    setIsCheckingGaps(true);
    setError(null);

    try {
      const hashKey = await contractCache.hashInput("gaps_" + textToAnalyze);
      const cached = contractCache.get<GapsResponse>(hashKey);

      if (cached) {
        setGapsResult(cached);
        setIsCheckingGaps(false);
        return;
      }

      const res = await fetch("/api/gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText: textToAnalyze }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Gaps check failed with HTTP ${res.status}`);
      }

      const data: GapsResponse = await res.json();
      setGapsResult(data);
      contractCache.set(hashKey, data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to analyze contract gaps.";
      setError(msg);
    } finally {
      setIsCheckingGaps(false);
    }
  }, [contractText, maskedText, isPiiShieldEnabled]);

  // Send SSE Chat Message (Tab 2)
  const sendChatMessage = useCallback(
    async (userQuestion: string) => {
      const textToAnalyze = isPiiShieldEnabled ? maskedText : contractText;
      if (!textToAnalyze || textToAnalyze.trim().length < 10) {
        setError("Please paste a contract before asking questions.");
        return;
      }

      if (!userQuestion.trim()) return;

      const newMessages: ChatMessage[] = [
        ...chatMessages,
        { role: "user", content: userQuestion },
      ];

      setChatMessages(newMessages);
      setIsStreamingChat(true);
      setError(null);

      // Append empty assistant message for streaming accumulation
      const assistantMessageIndex = newMessages.length;
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractText: textToAnalyze,
            messages: newMessages,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Chat failed with HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("Failed to read response stream.");
        }

        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedContent += parsed.text;
                  setChatMessages((prev) => {
                    const updated = [...prev];
                    if (updated[assistantMessageIndex]) {
                      updated[assistantMessageIndex] = {
                        role: "assistant",
                        content: accumulatedContent,
                      };
                    }
                    return updated;
                  });
                }
              } catch {
                // Ignore chunk parse errors
              }
            }
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Chat streaming failed.";
        setError(msg);
      } finally {
        setIsStreamingChat(false);
      }
    },
    [contractText, maskedText, isPiiShieldEnabled, chatMessages]
  );

  // Run Clause Rewrite (Tab 4)
  const runRewriteClause = useCallback(
    async (clause: ClauseAnalysis) => {
      setSelectedClauseForRewrite(clause);
      setIsRewriting(true);
      setError(null);

      try {
        const hashKey = await contractCache.hashInput("rewrite_" + clause.originalSnippet);
        const cached = contractCache.get<RewriteResponse>(hashKey);

        if (cached) {
          setRewriteResult(cached);
          setIsRewriting(false);
          return;
        }

        const res = await fetch("/api/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clauseTitle: clause.title,
            category: clause.category,
            originalSnippet: clause.originalSnippet,
            riskScore: clause.riskScore,
            riskTag: clause.riskTag,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Rewrite failed with HTTP ${res.status}`);
        }

        const data: RewriteResponse = await res.json();
        setRewriteResult(data);
        contractCache.set(hashKey, data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Clause rewrite failed.";
        setError(msg);
      } finally {
        setIsRewriting(false);
      }
    },
    []
  );

  return {
    activeTab,
    setActiveTab,
    contractText,
    maskedText,
    updateContractText,
    piiResult,
    isPiiShieldEnabled,
    setIsPiiShieldEnabled,
    analysisResult,
    gapsResult,
    chatMessages,
    selectedClauseForRewrite,
    rewriteResult,
    isAnalyzing,
    isCheckingGaps,
    isStreamingChat,
    isRewriting,
    isCacheHit,
    error,
    runAnalysis,
    runGapsCheck,
    sendChatMessage,
    runRewriteClause,
  };
}
