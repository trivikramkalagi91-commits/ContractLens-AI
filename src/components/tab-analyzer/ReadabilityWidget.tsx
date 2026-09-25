"use client";

import React from "react";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { calculateImprovement } from "@/lib/readability";

interface ReadabilityWidgetProps {
  originalText: string;
  plainEnglishText: string;
}

export const ReadabilityWidget: React.FC<ReadabilityWidgetProps> = ({
  originalText,
  plainEnglishText,
}) => {
  if (!originalText || !plainEnglishText) return null;

  const metrics = calculateImprovement(originalText, plainEnglishText);

  return (
    <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 shadow-xl mb-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Flesch-Kincaid Readability Score Improvement
            </h3>
            <p className="text-xs text-slate-400">
              Measures how much easier the contract becomes to read after AI translation.
            </p>
          </div>
        </div>

        {/* Improvement Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>+{metrics.improvementPercent}% Easier to Read</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Original Legal Score */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Original Legal Agreement
            </span>
            <span className="text-slate-200 font-medium">
              Grade {metrics.originalGrade} Reading Level
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block">Reading Ease</span>
            <span className="text-sm font-bold text-amber-400">{metrics.originalScore} / 100</span>
          </div>
        </div>

        {/* Plain English Score */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ContractLens Plain English
            </span>
            <span className="text-slate-200 font-medium">
              Grade {metrics.plainGrade} Reading Level (8th Grade Aimed)
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block">Reading Ease</span>
            <span className="text-sm font-bold text-emerald-400">{metrics.plainScore} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
