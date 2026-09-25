"use client";

import React from "react";
import { ShieldCheck, Sparkles, HelpCircle, Type, AlertTriangle } from "lucide-react";
import { FontScale } from "@/hooks/useAccessibility";

interface HeaderProps {
  fontScale: FontScale;
  onCycleFontScale: () => void;
  onOpenTour: () => void;
  piiCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  fontScale,
  onCycleFontScale,
  onOpenTour,
  piiCount,
}) => {
  const getFontScaleLabel = () => {
    if (fontScale === "normal") return "A";
    if (fontScale === "large") return "A+";
    return "A++";
  };

  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      {/* Persistent Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-center gap-2 text-center font-medium">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Educational tool — not legal advice.</strong> Consult a licensed attorney for binding legal decisions.
        </span>
      </div>

      {/* Main Top Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
                ContractLens AI
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Legal Contract Translator & Risk Analyzer
            </p>
          </div>
        </div>

        {/* Badges & Accessibility Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Gemini 2.5 Flash</span>
          </div>

          {/* PII Masked Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PII Masked ({piiCount})</span>
          </div>

          {/* Font Scale Button */}
          <button
            onClick={onCycleFontScale}
            aria-label={`Change font scale. Current: ${fontScale}`}
            className="flex items-center justify-center px-2.5 py-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
            title="Toggle Font Size (A / A+ / A++)"
          >
            <Type className="w-3.5 h-3.5 mr-1" />
            <span>{getFontScaleLabel()}</span>
          </button>

          {/* Quick Tour Button */}
          <button
            onClick={onOpenTour}
            aria-label="Open keyboard shortcuts and quick tour modal"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
            title="Press ? for Keyboard Shortcuts & Tour"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Tour</span>
            <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded ml-0.5">
              ?
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
