"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, RefreshCw, Filter } from "lucide-react";
import { GapsResponse, GapCheckItem } from "@/lib/schemas";

interface MissingProtectionsChecklistProps {
  gapsData: GapsResponse | null;
  onRunGapsCheck: () => void;
  isChecking: boolean;
  hasContract: boolean;
}

export const MissingProtectionsChecklist: React.FC<MissingProtectionsChecklistProps> = ({
  gapsData,
  onRunGapsCheck,
  isChecking,
  hasContract,
}) => {
  const [filter, setFilter] = useState<"All" | "Present" | "Missing">("All");

  if (!hasContract) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-100">No Contract Loaded</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Please paste a contract in Tab 1 (Contract Analyzer) first to audit missing protections.
        </p>
      </div>
    );
  }

  if (!gapsData && !isChecking) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-100">10-Point Contract Protection Audit</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto mb-6">
          Check if your contract includes essential safeguards like mutual indemnity, liability caps, clear termination rights, and force majeure clauses.
        </p>
        <button
          onClick={onRunGapsCheck}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all focus:ring-2 focus:ring-blue-500 outline-none"
        >
          Run 10-Point Missing Protection Audit
        </button>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
        <RefreshCw className="w-10 h-10 text-blue-400 mx-auto mb-3 animate-spin" />
        <h3 className="text-base font-bold text-slate-100">Auditing 10 Key Protections...</h3>
        <p className="text-xs text-slate-400 mt-1">
          Evaluating liability, indemnity, payment terms, and termination clauses with Gemini.
        </p>
      </div>
    );
  }

  const items = gapsData?.protections ?? [];
  const filteredItems = items.filter((item: GapCheckItem) => {
    if (filter === "Present") return item.isPresent;
    if (filter === "Missing") return !item.isPresent;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Top Audit Score Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Missing Protections Check Results</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit of 10 critical protective clauses every standard agreement should have.
          </p>
        </div>

        {/* Protection Score */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Protection Score</span>
            <span className="text-xs text-slate-300 font-semibold">
              {gapsData?.presentCount}/10 Safeguards Present
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-extrabold text-emerald-400 text-sm shadow-md">
            {gapsData?.score}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "All" ? "bg-blue-600 text-white" : "bg-slate-950 text-slate-400 border border-slate-800"
            }`}
          >
            All (10)
          </button>
          <button
            onClick={() => setFilter("Present")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "Present" ? "bg-emerald-600 text-white" : "bg-slate-950 text-slate-400 border border-slate-800"
            }`}
          >
            Present ({gapsData?.presentCount})
          </button>
          <button
            onClick={() => setFilter("Missing")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "Missing" ? "bg-red-600 text-white" : "bg-slate-950 text-slate-400 border border-slate-800"
            }`}
          >
            Missing ({gapsData?.missingCount})
          </button>
        </div>

        <button
          onClick={onRunGapsCheck}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run Audit</span>
        </button>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {filteredItems.map((item: GapCheckItem, idx: number) => {
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                item.isPresent
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : "bg-red-950/20 border-red-500/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.isPresent ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">
                        {item.protectionName}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          item.isPresent
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Why It Matters
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.whyItMatters}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                    Recommended Action
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
