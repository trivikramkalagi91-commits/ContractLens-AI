"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { PrivacyShield } from "@/components/PrivacyShield";
import { QuickTourModal } from "@/components/QuickTourModal";
import { LandingHero } from "@/components/LandingHero";
import { ContractInput } from "@/components/tab-analyzer/ContractInput";
import { HeatmapSummary } from "@/components/tab-analyzer/HeatmapSummary";
import { ClauseCard } from "@/components/tab-analyzer/ClauseCard";
import { ReadabilityWidget } from "@/components/tab-analyzer/ReadabilityWidget";
import { useContractAnalysis } from "@/hooks/useContractAnalysis";
import { useAccessibility } from "@/hooks/useAccessibility";
import { SAMPLE_CONTRACTS } from "@/lib/sample-contracts";
import { ClauseAnalysis } from "@/lib/schemas";
import { AlertCircle, RefreshCw } from "lucide-react";

// Loading Skeleton for dynamically loaded tabs
const TabSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl animate-pulse">
    <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-3 animate-spin" />
    <div className="h-4 bg-slate-800 rounded w-1/3 mx-auto mb-2" />
    <div className="h-3 bg-slate-800/60 rounded w-1/2 mx-auto" />
  </div>
);

// Dynamic Code-Splitting for Tabs 2-4
const ContractChat = dynamic(
  () => import("@/components/tab-chat/ContractChat").then((mod) => mod.ContractChat),
  { ssr: false, loading: () => <TabSkeleton /> }
);

const MissingProtectionsChecklist = dynamic(
  () =>
    import("@/components/tab-gaps/MissingProtectionsChecklist").then(
      (mod) => mod.MissingProtectionsChecklist
    ),
  { ssr: false, loading: () => <TabSkeleton /> }
);

const ClauseRewriter = dynamic(
  () => import("@/components/tab-rewrite/ClauseRewriter").then((mod) => mod.ClauseRewriter),
  { ssr: false, loading: () => <TabSkeleton /> }
);

export default function Home() {
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRiskTag, setSelectedRiskTag] = useState<string>("All");

  const {
    activeTab,
    setActiveTab,
    contractText,
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
  } = useContractAnalysis();

  const { fontScale, cycleFontScale, announcement } = useAccessibility(
    (tabIndex) => setActiveTab(tabIndex),
    () => setIsTourOpen((prev) => !prev),
    () => setIsTourOpen(false)
  );

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_CONTRACTS.find((s) => s.id === sampleId);
    if (sample) {
      updateContractText(sample.text);
    }
  };

  const handleScrollToTextarea = () => {
    const el = document.getElementById("contract-input-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartRewrite = (clause: ClauseAnalysis) => {
    setActiveTab(4);
    runRewriteClause(clause);
  };

  // Filter clauses for Tab 1
  const clauses = analysisResult?.clauses ?? [];
  const filteredClauses = clauses.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesRisk = selectedRiskTag === "All" || c.riskTag === selectedRiskTag;
    return matchesCat && matchesRisk;
  });

  // Sort by risk score descending
  const sortedClauses = [...filteredClauses].sort((a, b) => b.riskScore - a.riskScore);

  const fontScaleClass =
    fontScale === "large"
      ? "font-scale-large"
      : fontScale === "xlarge"
      ? "font-scale-xlarge"
      : "font-scale-normal";

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${fontScaleClass}`}>
      {/* Screen Reader Live Announcement Region */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Header */}
      <Header
        fontScale={fontScale}
        onCycleFontScale={cycleFontScale}
        onOpenTour={() => setIsTourOpen(true)}
        piiCount={piiResult?.replacementsCount ?? 0}
      />

      {/* Top Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={(tabIndex) => setActiveTab(tabIndex)}
        hasAnalysis={Boolean(analysisResult)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Privacy Shield Panel */}
        <div className="mb-6">
          <PrivacyShield
            piiResult={piiResult}
            isEnabled={isPiiShieldEnabled}
            onToggle={setIsPiiShieldEnabled}
          />
        </div>

        {/* Global Error Alert Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-400 text-xs font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: CONTRACT ANALYZER */}
        {activeTab === 1 && (
          <div>
            {!analysisResult && !isAnalyzing && (
              <LandingHero
                onSelectSample={(sampleId) => {
                  handleSelectSample(sampleId);
                  handleScrollToTextarea();
                }}
                onScrollToTextarea={handleScrollToTextarea}
              />
            )}

            <ContractInput
              contractText={contractText}
              onTextChange={updateContractText}
              onAnalyze={runAnalysis}
              isAnalyzing={isAnalyzing}
              onSelectSample={handleSelectSample}
            />

            {analysisResult && (
              <div className="animate-in fade-in duration-300">
                {/* Readability Score Metrics */}
                <ReadabilityWidget
                  originalText={contractText}
                  plainEnglishText={clauses.map((c) => c.plainEnglish).join(" ")}
                />

                {/* Heatmap & Filter Bar */}
                <HeatmapSummary
                  totalClauses={analysisResult.summary.totalClauses}
                  highRiskCount={analysisResult.summary.highRiskCount}
                  criticalCount={analysisResult.summary.criticalCount}
                  missingProtectionsCount={analysisResult.summary.missingProtectionsCount}
                  isCacheHit={isCacheHit}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedRiskTag={selectedRiskTag}
                  onSelectRiskTag={setSelectedRiskTag}
                />

                {/* Risk Sorted Clause Cards */}
                <div className="space-y-4">
                  {sortedClauses.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
                      No clauses match the selected category or risk filter.
                    </div>
                  ) : (
                    sortedClauses.map((clause, idx) => (
                      <ClauseCard
                        key={idx}
                        clause={clause}
                        onRewrite={handleStartRewrite}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ASK ABOUT MY CONTRACT */}
        {activeTab === 2 && (
          <div id="tabpanel-2" role="tabpanel" aria-labelledby="tab-2">
            <ContractChat
              messages={chatMessages}
              onSendMessage={sendChatMessage}
              isStreaming={isStreamingChat}
              hasContract={Boolean(contractText.trim())}
            />
          </div>
        )}

        {/* TAB 3: MISSING PROTECTIONS CHECK */}
        {activeTab === 3 && (
          <div id="tabpanel-3" role="tabpanel" aria-labelledby="tab-3">
            <MissingProtectionsChecklist
              gapsData={gapsResult}
              onRunGapsCheck={runGapsCheck}
              isChecking={isCheckingGaps}
              hasContract={Boolean(contractText.trim())}
            />
          </div>
        )}

        {/* TAB 4: SAFER CLAUSE SUGGESTIONS */}
        {activeTab === 4 && (
          <div id="tabpanel-4" role="tabpanel" aria-labelledby="tab-4">
            <ClauseRewriter
              selectedClause={selectedClauseForRewrite}
              rewriteResult={rewriteResult}
              onRewrite={runRewriteClause}
              isRewriting={isRewriting}
              allClauses={clauses}
              onSelectClause={(clause) => runRewriteClause(clause)}
            />
          </div>
        )}
      </main>

      {/* Quick Tour Modal */}
      <QuickTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
