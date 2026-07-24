"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { profile } from "../../data/portfolio";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_CHIPS = [
  "What does Chirayu do?",
  "Show me his projects",
  "Tech stack?",
  "Is he available for hire?",
];

export default function AIChatAssistant() {
  const { unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        playSound("click");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, playSound]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (!hasAsked) {
      setHasAsked(true);
      unlockAchievement("AI Explorer");
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "I couldn't process that. Try again!",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      playSound("notify");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again!" },
      ]);
      playSound("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => {
              playSound("click");
              setOpen(true);
            }}
            aria-label="Open AI portfolio assistant"
            className="fixed bottom-[calc(var(--dock-height)+var(--safe-bottom)+0.75rem)] right-3 z-[9997] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sys-accent to-purple-600 shadow-xl shadow-sys-accent/20 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-sys-accent/30 pointer-events-auto group sm:bottom-16 sm:right-6"
          >
            <Bot size={22} className="text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            role="dialog"
            aria-modal="false"
            aria-label="AI portfolio assistant"
            className="fixed bottom-[calc(var(--dock-height)+var(--safe-bottom)+0.75rem)] left-2 right-2 z-[9997] flex h-[70dvh] max-h-[70dvh] flex-col overflow-hidden rounded-2xl border border-sys-border bg-zinc-950/95 shadow-2xl backdrop-blur-2xl pointer-events-auto sm:bottom-16 sm:left-auto sm:right-6 sm:h-[460px] sm:w-[350px] sm:max-h-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sys-border bg-gradient-to-r from-sys-accent/10 to-purple-500/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sys-accent to-purple-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100">ChirayuAI</h3>
                  <p className="text-[9px] text-emerald-400 font-semibold">● Online</p>
                </div>
              </div>
              <button
                onClick={() => { playSound("click"); setOpen(false); }}
                aria-label="Close AI assistant"
                className="touch-target rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 sm:min-h-0 sm:min-w-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none overscroll-contain">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="bg-zinc-900/60 rounded-xl rounded-tl-sm p-3 border border-sys-border/50 max-w-[85%]">
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Hey! I&apos;m <span className="font-bold text-sys-accent">ChirayuAI</span>, your guide to {profile.name}&apos;s portfolio. Ask me about projects, skills, resume, or contact details.
                    </p>
                  </div>

                  {/* Starter Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {STARTER_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => sendMessage(chip)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800/60 border border-sys-border/50 text-[10px] text-zinc-300 hover:text-sys-accent hover:border-sys-accent/50 transition-all hover:scale-[1.02]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[85%] rounded-xl p-3 text-[11px] leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-br from-sys-accent/20 to-purple-500/20 border border-sys-accent/30 rounded-br-sm text-zinc-200"
                      : "bg-zinc-900/60 border border-sys-border/50 rounded-tl-sm text-zinc-300"
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="bg-zinc-900/60 rounded-xl rounded-tl-sm p-3 border border-sys-border/50 max-w-[85%] flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-sys-accent" />
                  <span className="text-[10px] text-zinc-500">ChirayuAI is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-sys-border flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Chirayu..."
                disabled={loading}
                className="touch-target min-w-0 flex-1 rounded-lg border border-sys-border bg-zinc-900/80 px-3 py-2 text-[11px] text-zinc-200 transition-colors placeholder:text-zinc-600 focus:border-sys-accent/50 focus:outline-none disabled:opacity-50 sm:min-h-0 sm:min-w-0"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="touch-target rounded-lg bg-gradient-to-br from-sys-accent to-purple-600 p-2 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 sm:min-h-0 sm:min-w-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
