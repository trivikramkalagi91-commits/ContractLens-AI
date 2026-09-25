"use client";

import React, { useRef } from "react";
import { FileText, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { SAMPLE_CONTRACTS, SampleContract } from "@/lib/sample-contracts";

interface ContractInputProps {
  contractText: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onSelectSample: (sampleId: string) => void;
}

export const ContractInput: React.FC<ContractInputProps> = ({
  contractText,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  onSelectSample,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = contractText.trim()
    ? contractText.trim().split(/\s+/).length
    : 0;
  const charCount = contractText.length;

  return (
    <div id="contract-input-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      {/* Header & Sample Contract Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Paste Contract Text</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Copy and paste any MSA, lease, job offer, or SaaS terms of service.
          </p>
        </div>

        {/* Preset Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Samples:
          </span>
          {SAMPLE_CONTRACTS.map((sample: SampleContract) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
              title={sample.description}
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={contractText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste full agreement text here... (e.g. Master Services Agreement, Lease, Terms of Service)"
          rows={10}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y transition-all"
        />

        {/* Bottom Bar: Character Count & Clear */}
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{charCount.toLocaleString()} characters</span>
          </div>

          {contractText.length > 0 && (
            <button
              onClick={() => onTextChange("")}
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || contractText.trim().length < 10}
          className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Contract with Gemini 2.5...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Analyze Contract & Flag Risks</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
