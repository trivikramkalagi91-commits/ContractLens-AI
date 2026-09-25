"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { PIIMaskResult } from "@/lib/pii";

interface PrivacyShieldProps {
  piiResult: PIIMaskResult | null;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const PrivacyShield: React.FC<PrivacyShieldProps> = ({
  piiResult,
  isEnabled,
  onToggle,
}) => {
  const counts = piiResult?.detectedTypes ?? {
    emails: 0,
    phones: 0,
    amounts: 0,
    parties: 0,
    addresses: 0,
  };

  const totalMasked = piiResult?.replacementsCount ?? 0;

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Privacy Shield (Client-Side PII Masking)
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Zero Cloud Leak
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifiable names, monetary amounts, emails, and phone numbers are anonymized in browser.
            </p>
          </div>
        </div>

        {/* Masking Toggle Switch */}
        <button
          onClick={() => onToggle(!isEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isEnabled
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
          }`}
        >
          {isEnabled ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masking Active</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Masking Paused</span>
            </>
          )}
        </button>
      </div>

      {/* PII Breakdown Metrics */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Names/Parties</span>
          <span className="text-emerald-400 font-bold text-sm">{counts.parties}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Emails</span>
          <span className="text-emerald-400 font-bold text-sm">{counts.emails}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone Numbers</span>
          <span className="text-emerald-400 font-bold text-sm">{counts.phones}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Monetary Amounts</span>
          <span className="text-emerald-400 font-bold text-sm">{counts.amounts}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total PII Masked</span>
          <span className="text-emerald-400 font-bold text-sm">{totalMasked}</span>
        </div>
      </div>
    </div>
  );
};
