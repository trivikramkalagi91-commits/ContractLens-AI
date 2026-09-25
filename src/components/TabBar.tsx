"use client";

import React from "react";
import { FileSearch, MessageSquare, AlertTriangle, PenTool } from "lucide-react";

interface TabBarProps {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
  hasAnalysis: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  hasAnalysis,
}) => {
  const tabs = [
    {
      id: 1,
      title: "Contract Analyzer",
      icon: FileSearch,
      badge: "1",
      description: "Clause breakdown & risk heatmap",
    },
    {
      id: 2,
      title: "Ask About My Contract",
      icon: MessageSquare,
      badge: "2",
      description: "Interactive SSE Q&A",
    },
    {
      id: 3,
      title: "Missing Protections Check",
      icon: AlertTriangle,
      badge: "3",
      description: "10-point contract audit",
    },
    {
      id: 4,
      title: "Safer Clause Suggestions",
      icon: PenTool,
      badge: "4",
      description: "Balanced rewrites & email drafts",
    },
  ];

  return (
    <div className="w-full bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-[89px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none"
          role="tablist"
          aria-label="ContractLens Tab Navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.title}</span>

                {/* Keyboard shortcut indicator */}
                <kbd
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${
                    isActive
                      ? "bg-blue-700 text-blue-100"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {tab.badge}
                </kbd>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
