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
  "Show top projects",
  "Tech stack details",
  "Is he open to work?",
  "How to contact him?",
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
      setTimeout(() => inputRef.current?.focus(), 100);
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
            className="fixed bottom-[calc(var(--dock-height)+var(--safe-bottom)+0.75rem)] right-3 z-[9997] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sys-accent to-purple-600 shadow-xl shadow-sys-accent/25 transition-all hover:scale-110 active:scale-95 pointer-events-auto group sm:bottom-16 sm:right-6"
          >
            <Bot size={22} className="text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-950" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel Modal / Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            role="dialog"
            aria-modal="false"
            aria-label="AI portfolio assistant"
            className="fixed bottom-[calc(var(--dock-height)+var(--safe-bottom)+0.5rem)] left-2 right-2 z-[9997] flex h-[72dvh] max-h-[520px] flex-col overflow-hidden rounded-3xl border border-sys-border bg-zinc-950/95 shadow-2xl backdrop-blur-2xl pointer-events-auto sm:bottom-16 sm:left-auto sm:right-6 sm:h-[480px] sm:w-[360px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sys-border bg-gradient-to-r from-sys-accent/15 to-purple-500/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sys-accent to-purple-600 flex items-center justify-center shadow">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100">ChirayuAI Assistant</h3>
                  <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => { playSound("click"); setOpen(false); }}
                aria-label="Close AI assistant"
                className="touch-target rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 active:scale-95 sm:min-h-0 sm:min-w-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none overscroll-contain">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="bg-zinc-900/70 rounded-2xl rounded-tl-xs p-3.5 border border-sys-border/60 max-w-[90%] shadow-sm">
                    <p className="text-[11.5px] text-zinc-200 leading-relaxed">
                      Hello! I&apos;m <span className="font-bold text-sys-accent">ChirayuAI</span>. Ask me anything about {profile.name}&apos;s background, verified projects, skills, or employment history.
                    </p>
                  </div>

                  {/* Starter Prompts */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block px-1">Suggested Inquiries</span>
                    <div className="flex flex-wrap gap-1.5">
                      {STARTER_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-sys-border text-[10.5px] text-zinc-300 hover:text-sys-accent hover:border-sys-accent/40 active:scale-95 transition-all text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[88%] rounded-2xl p-3 text-[11px] leading-relaxed shadow-sm",
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-br from-sys-accent/25 to-purple-500/25 border border-sys-accent/40 rounded-br-xs text-zinc-100 font-medium"
                      : "bg-zinc-900/80 border border-sys-border/60 rounded-tl-xs text-zinc-200"
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="bg-zinc-900/80 rounded-2xl rounded-tl-xs p-3 border border-sys-border/60 max-w-[85%] flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-sys-accent" />
                  <span className="text-[10px] text-zinc-400 font-medium">ChirayuAI is generating response...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-sys-border bg-zinc-950/70 flex gap-2 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="touch-target min-w-0 flex-1 rounded-xl border border-sys-border bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-sys-accent focus:outline-none disabled:opacity-50 sm:min-h-0 sm:min-w-0"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="touch-target rounded-xl bg-gradient-to-br from-sys-accent to-purple-600 px-3.5 py-2 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 flex items-center justify-center sm:min-h-0 sm:min-w-0 shadow-md shadow-sys-accent/20"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
