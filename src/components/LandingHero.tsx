"use client";

import React from "react";
import { ShieldAlert, Sparkles, FileText, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { SAMPLE_CONTRACTS } from "@/lib/sample-contracts";

interface LandingHeroProps {
  onSelectSample: (sampleId: string) => void;
  onScrollToTextarea: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectSample,
  onScrollToTextarea,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-12 mb-8 shadow-2xl">
      {/* Glow effect background */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Powered by Gemini 2.5 Flash & Client-Side PII Masker</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight mb-4">
          Understand Every Contract <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Before You Sign.
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Translates dense legal jargon into plain 8th-grade English, highlights predatory risks, audits missing protections, and generates safer counter-proposals in seconds.
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onScrollToTextarea}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <FileText className="w-4 h-4" />
            <span>Paste Your Contract</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onSelectSample(SAMPLE_CONTRACTS[0].id)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Try a Sample Contract</span>
          </button>
        </div>

        {/* Key Selling Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-800/80 pt-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">100% Private & Masked</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Names and amounts never leave your browser unmasked.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Risk Heatmap Audit</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Color-coded scoring from Safe to Critical severity.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Instant Dual-Cache</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">0ms instant re-renders for cached contracts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
