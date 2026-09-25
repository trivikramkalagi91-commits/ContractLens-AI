"use client";

import React from "react";
import { X, Keyboard, ShieldCheck, Zap, Sparkles, MessageSquare, AlertCircle, FileEdit } from "lucide-react";

interface QuickTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickTourModal: React.FC<QuickTourModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
          aria-label="Close Tour Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              ContractLens AI — Quick Tour & Keyboard Shortcuts
            </h2>
            <p className="text-xs text-slate-400">
              Navigate quickly using hotkeys and explore all 4 analysis tabs.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-5 max-h-[70vh] overflow-y-auto pr-2 text-slate-200 text-xs">
          {/* Keyboard Shortcuts Table */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Switch to Tab 1 (Contract Analyzer)</span>
                <kbd className="px-2 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 rounded text-blue-400">1</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Switch to Tab 2 (Ask Q&A Chat)</span>
                <kbd className="px-2 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 rounded text-blue-400">2</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Switch to Tab 3 (Missing Protections)</span>
                <kbd className="px-2 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 rounded text-blue-400">3</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Switch to Tab 4 (Safer Clause Rewriter)</span>
                <kbd className="px-2 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 rounded text-blue-400">4</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Open / Close Quick Tour</span>
                <kbd className="px-2 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 rounded text-blue-400">?</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Close Modals / Overlays</span>
                <kbd className="px-2 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 rounded text-blue-400">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Key Features Overview */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> Core Platform Capabilities
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100">Client-Side PII Masking</h4>
                  <p className="text-slate-400 text-[11px]">
                    Names, emails, phone numbers, and money amounts are sanitized inside your browser before sending data to Gemini.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100">Strict SSE Contract Chat</h4>
                  <p className="text-slate-400 text-[11px]">
                    Ask contract questions with real-time SSE streaming. Answers strictly cite clauses and state if details are missing.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100">10 Protection Gap Checklist</h4>
                  <p className="text-slate-400 text-[11px]">
                    Automatically audits contracts for mutual indemnity, liability caps, clear payment schedules, and termination rights.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <FileEdit className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100">Safer Clause Rewriter & Negotiation Drafts</h4>
                  <p className="text-slate-400 text-[11px]">
                    Transforms aggressive clauses into fair terms and generates polite email templates to send to opposing parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
          >
            Got It (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
