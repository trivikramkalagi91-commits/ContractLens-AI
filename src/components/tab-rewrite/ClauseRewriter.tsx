"use client";

import React, { useState } from "react";
import { PenTool, Copy, Check, Sparkles, Mail, ShieldAlert, ArrowLeft, RefreshCw, FileText } from "lucide-react";
import { ClauseAnalysis, RewriteResponse } from "@/lib/schemas";

interface ClauseRewriterProps {
  selectedClause: ClauseAnalysis | null;
  rewriteResult: RewriteResponse | null;
  onRewrite: (clause: ClauseAnalysis) => void;
  isRewriting: boolean;
  allClauses: ClauseAnalysis[];
  onSelectClause: (clause: ClauseAnalysis) => void;
}

export const ClauseRewriter: React.FC<ClauseRewriterProps> = ({
  selectedClause,
  rewriteResult,
  onRewrite,
  isRewriting,
  allClauses,
  onSelectClause,
}) => {
  const [copiedClause, setCopiedClause] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const copyToClipboard = (text: string, type: "clause" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "clause") {
      setCopiedClause(true);
      setTimeout(() => setCopiedClause(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // Filter clauses that are risky or available
  const riskyClauses = allClauses.filter(
    (c) => c.riskTag === "High" || c.riskTag === "Critical" || c.riskTag === "Medium"
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Safer Clause Suggestions & Negotiation Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Generates fair, balanced replacement clauses and polite email drafts for contract negotiations.
            </p>
          </div>
        </div>
      </div>

      {/* Select Clause Dropdown / Selector */}
      {allClauses.length > 0 && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Select a Clause to Rewrite:
          </label>
          <select
            value={selectedClause?.title ?? ""}
            onChange={(e) => {
              const found = allClauses.find((c) => c.title === e.target.value);
              if (found) {
                onSelectClause(found);
                onRewrite(found);
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="" disabled>-- Select a risky clause --</option>
            {allClauses.map((c, idx) => (
              <option key={idx} value={c.title}>
                [{c.riskTag}] {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>
      )}

      {!selectedClause && (
        <div className="p-8 text-center text-slate-400 bg-slate-950/50 rounded-xl border border-slate-800">
          <ShieldAlert className="w-10 h-10 text-purple-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-200">No Clause Selected</h4>
          <p className="text-xs mt-1 text-slate-400 max-w-md mx-auto">
            Please select a high-risk clause from the dropdown above or click "Generate Safer Clause" on any clause card in Tab 1.
          </p>
        </div>
      )}

      {isRewriting && (
        <div className="p-12 text-center text-slate-400 bg-slate-950/50 rounded-xl border border-slate-800">
          <RefreshCw className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-spin" />
          <h4 className="text-sm font-bold text-slate-200">Generating Balanced Alternative Clause...</h4>
          <p className="text-xs mt-1 text-slate-400">
            Consulting legal negotiation patterns to construct a fair replacement and polite negotiation draft.
          </p>
        </div>
      )}

      {rewriteResult && !isRewriting && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section 1: Balanced Replacement Clause */}
          <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Proposed Balanced Replacement Clause
                </h4>
              </div>

              <button
                onClick={() => copyToClipboard(rewriteResult.balancedClause, "clause")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {copiedClause ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedClause ? "Copied!" : "Copy Clause"}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
              {rewriteResult.balancedClause}
            </div>

            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              <strong>Key Improvements:</strong> {rewriteResult.keyChangesExplanation}
            </p>
          </div>

          {/* Section 2: Polite Negotiation Message Draft */}
          <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Polite Negotiation Email / Message Draft
                </h4>
              </div>

              <button
                onClick={() => copyToClipboard(rewriteResult.negotiationEmailDraft, "email")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
              {rewriteResult.negotiationEmailDraft}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
