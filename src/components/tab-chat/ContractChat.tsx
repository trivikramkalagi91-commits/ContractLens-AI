"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, HelpCircle, Bot, User, AlertCircle } from "lucide-react";
import { z } from "zod";
import { ChatMessageSchema } from "@/lib/schemas";

type ChatMessage = z.infer<typeof ChatMessageSchema>;

interface ContractChatProps {
  messages: ChatMessage[];
  onSendMessage: (question: string) => void;
  isStreaming: boolean;
  hasContract: boolean;
}

export const ContractChat: React.FC<ContractChatProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  hasContract,
}) => {
  const [inputQuery, setInputQuery] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What happens if I quit or terminate early?",
    "Can the price or rent increase without notice?",
    "Who owns the intellectual property I create?",
    "What is the maximum liability cap in this agreement?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isStreaming || !hasContract) return;
    onSendMessage(inputQuery.trim());
    setInputQuery("");
  };

  const handleChipClick = (question: string) => {
    if (isStreaming || !hasContract) return;
    onSendMessage(question);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Ask About My Contract
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Strict SSE Stream
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Answers are cited directly from your agreement. Unmentioned terms return "This contract does not mention that."
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="py-3 border-b border-slate-800/80 shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Suggested "What If?" Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(q)}
              disabled={isStreaming || !hasContract}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 text-xs font-medium rounded-xl transition-all text-left disabled:opacity-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {!hasContract && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-slate-200">No Active Contract Loaded</h4>
            <p className="text-xs mt-1 max-w-sm text-slate-400">
              Please return to Tab 1 (Contract Analyzer) and paste a contract before asking questions.
            </p>
          </div>
        )}

        {hasContract && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-slate-200">Ask Any Question About Your Contract</h4>
            <p className="text-xs mt-1 max-w-md text-slate-400">
              Try asking about payment delays, non-compete terms, eviction clauses, or ownership rights.
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none shadow-md font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content || (isStreaming && index === messages.length - 1 ? "Thinking..." : "")}</div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box Form */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-800 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isStreaming || !hasContract}
            placeholder={
              hasContract
                ? "Ask a question about your contract... (e.g., 'What is the notice period for termination?')"
                : "Paste contract first in Tab 1..."
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-4 pr-12 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none disabled:opacity-50 transition-all"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isStreaming || !hasContract}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors focus:ring-2 focus:ring-indigo-500 outline-none"
            aria-label="Send Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
