"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ClauseAnalysis, RiskTag } from "@/lib/schemas";

interface ClauseCardProps {
  clause: ClauseAnalysis;
  onRewrite: (clause: ClauseAnalysis) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, onRewrite }) => {
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const getRiskStyles = (tag: RiskTag) => {
    switch (tag) {
      case "Critical":
        return {
          cardBorder: "border-red-500/50 hover:border-red-500",
          badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
          scoreBg: "bg-red-500 text-white",
          icon: AlertOctagon,
          iconColor: "text-red-400",
        };
      case "High":
        return {
          cardBorder: "border-orange-500/50 hover:border-orange-500",
          badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
          scoreBg: "bg-orange-500 text-white",
          icon: AlertTriangle,
          iconColor: "text-orange-400",
        };
      case "Medium":
        return {
          cardBorder: "border-yellow-500/40 hover:border-yellow-500/70",
          badgeBg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
          scoreBg: "bg-yellow-500 text-slate-950",
          icon: Info,
          iconColor: "text-yellow-400",
        };
      case "Safe":
      default:
        return {
          cardBorder: "border-emerald-500/30 hover:border-emerald-500/60",
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          scoreBg: "bg-emerald-500 text-slate-950",
          icon: ShieldCheck,
          iconColor: "text-emerald-400",
        };
    }
  };

  const styles = getRiskStyles(clause.riskTag);
  const Icon = styles.icon;

  return (
    <div className={`bg-slate-900 border ${styles.cardBorder} rounded-2xl p-5 shadow-xl transition-all mb-4`}>
      {/* Top Bar: Category, Title & Risk Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${styles.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {clause.category}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${styles.badgeBg}`}>
                {clause.riskTag} Risk
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-1">
              {clause.title}
            </h4>
          </div>
        </div>

        {/* Risk Score Pill */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Score</span>
            <span className="text-xs font-semibold text-slate-300">{clause.riskScore}/100</span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md ${styles.scoreBg}`}>
            {clause.riskScore}
          </div>
        </div>
      </div>

      {/* Main Content: Plain-English Translation */}
      <div className="py-3">
        <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Plain-English Translation (Grade-8 Reading Level)
        </h5>
        <p className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          {clause.plainEnglish}
        </p>
      </div>

      {/* What To Do Advice */}
      <div className="py-2">
        <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Actionable Advice ("What To Do")
        </h5>
        <p className="text-xs text-slate-300 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
          {clause.advice}
        </p>
      </div>

      {/* Expandable Original Snippet */}
      <div className="pt-2">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium py-1 focus:outline-none"
        >
          {showOriginal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showOriginal ? "Hide Legal Snippet" : "View Original Legal Snippet"}</span>
        </button>

        {showOriginal && (
          <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-150">
            {clause.originalSnippet}
          </div>
        )}
      </div>

      {/* Action Footer: Rewrite Button for High/Critical clauses */}
      {(clause.riskTag === "High" || clause.riskTag === "Critical" || clause.riskTag === "Medium") && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onRewrite(clause)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Generate Safer Clause & Negotiation Draft</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
