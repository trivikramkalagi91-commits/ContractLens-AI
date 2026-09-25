"use client";

import React from "react";
import { AlertOctagon, ShieldAlert, CheckCircle, Zap, Filter } from "lucide-react";
import { ClauseCategory, RiskTag } from "@/lib/schemas";

interface HeatmapSummaryProps {
  totalClauses: number;
  highRiskCount: number;
  criticalCount: number;
  missingProtectionsCount: number;
  isCacheHit: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedRiskTag: string;
  onSelectRiskTag: (tag: string) => void;
}

export const HeatmapSummary: React.FC<HeatmapSummaryProps> = ({
  totalClauses,
  highRiskCount,
  criticalCount,
  missingProtectionsCount,
  isCacheHit,
  selectedCategory,
  onSelectCategory,
  selectedRiskTag,
  onSelectRiskTag,
}) => {
  const categories = ["All", "Payment", "Termination", "IP", "Liability", "Confidentiality", "Governing Law", "Other"];
  const riskTags = ["All", "Critical", "High", "Medium", "Safe"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl">
      {/* Top Metric Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100">
              Contract Risk Heatmap Analysis
            </h3>
            {isCacheHit && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>0ms Dual-Cache Hit</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            <strong>{totalClauses} clauses analyzed</strong> — {highRiskCount + criticalCount} high/critical risk clauses identified.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
              <AlertOctagon className="w-4 h-4" />
              <span>{criticalCount} Critical</span>
            </span>
          )}
          {highRiskCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>{highRiskCount} High Risk</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>{missingProtectionsCount} Missing Safeguards</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-400 font-medium shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Risk Level Filters */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-medium">Risk:</span>
          {riskTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectRiskTag(tag)}
              className={`px-2 py-0.5 rounded font-bold text-[11px] transition-all ${
                selectedRiskTag === tag
                  ? "bg-slate-200 text-slate-950"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
