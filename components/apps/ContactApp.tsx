"use client";

import React, { useState } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Mail, Send, Trash2, ArrowLeft, SendHorizontal, 
  Code2, Briefcase, MessageCircle, FileText, Calendar, AlertCircle
} from "lucide-react";
import { clsx } from "clsx";

export default function ContactApp() {
  const { unlockAchievement, pushNotification } = useOSStore();
  const { playSound } = useSystemSound();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg("All fields are required.");
      playSound("error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Invalid email address.");
      playSound("error");
      return;
    }

    // Rate Limiting (1 message every 30 seconds)
    const lastSent = localStorage.getItem("last_email_sent");
    if (lastSent && Date.now() - parseInt(lastSent) < 30000) {
      setErrorMsg("Please wait 30 seconds before sending another mail.");
      playSound("error");
      return;
    }

    setIsSending(true);
    playSound("click");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (res.ok) {
        setIsSuccess(true);
        localStorage.setItem("last_email_sent", Date.now().toString());
        playSound("success");
        unlockAchievement("Message Delivered");
        pushNotification({ type: "success", title: "Message Sent", message: `Your email to Chirayu has been delivered successfully.` });
        
        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Sending failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Server error. Please try again.");
      playSound("error");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    playSound("click");
    setIsSuccess(false);
    setErrorMsg("");
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row text-zinc-300 select-text">
      {/* Side Links Pane */}
      <div className="w-full md:w-56 bg-zinc-950/60 border-b md:border-b-0 md:border-r border-sys-border p-4 flex flex-col justify-between gap-6 shrink-0 font-sans select-none">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5">
            <Mail size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Quick Connect</span>
          </div>

          {/* Socials & Booking Grid */}
          <div className="space-y-2">
            <a
              href="https://github.com/chirayumishra24"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 text-xs py-2 px-3 rounded hover:bg-zinc-900 border border-sys-border transition-colors text-zinc-300"
            >
              <Code2 size={14} className="text-sys-accent" />
              <span>GitHub Profile</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-2.5 text-xs py-2 px-3 rounded hover:bg-zinc-900 border border-sys-border transition-colors text-zinc-300"
            >
              <Briefcase size={14} className="text-sys-accent" />
              <span>LinkedIn Profile</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-2.5 text-xs py-2 px-3 rounded hover:bg-zinc-900 border border-sys-border transition-colors text-zinc-300"
            >
              <MessageCircle size={14} className="text-sys-accent" />
              <span>X / Twitter</span>
            </a>
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-2.5 text-xs py-2 px-3 rounded hover:bg-zinc-900 border border-sys-border transition-colors text-zinc-300"
            >
              <Calendar size={14} className="text-sys-accent" />
              <span>Book Calendar Match</span>
            </a>
          </div>
        </div>

        {/* System Email Signature */}
        <div className="text-[10px] text-zinc-500 space-y-1 border-t border-sys-border/50 pt-3">
          <p className="font-bold">Chirayu Dev</p>
          <p>Bangalore, IN</p>
          <p className="font-mono text-[9px]">chirayu@dev.inbox</p>
        </div>
      </div>

      {/* Gmail Inbox Content */}
      <div className="flex-1 bg-zinc-950/20 p-6 flex flex-col justify-center min-w-0">
        {isSuccess ? (
          <div className="max-w-md mx-auto text-center space-y-5 animate-in zoom-in-95 duration-200 select-none">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/20">
              <SendHorizontal size={24} className="animate-[pulse_1.5s_infinite]" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-semibold text-zinc-100 text-sm tracking-wide">Mail Dispatched Successfully!</h3>
              <p className="text-xs text-sys-text-secondary leading-relaxed">
                Your message has been safely routed to Chirayu's Gmail inbox. Expect a response within 24 hours.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 py-2 px-4 rounded bg-zinc-900 hover:bg-zinc-800 border border-sys-border text-xs mx-auto transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Compose New Mail</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto w-full">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-sys-border/50 pb-2 mb-2 select-none">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sys-accent">
                <Send size={12} /> New Message Compose
              </span>
              <button
                type="button"
                onClick={() => { setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                title="Discard Draft"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg flex items-center gap-2.5 text-xs text-red-400 select-none">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-zinc-950/60 border border-sys-border focus:border-sys-border-active rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-zinc-950/60 border border-sys-border focus:border-sys-border-active rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Project Consultation / Job Opportunity"
                  className="w-full bg-zinc-950/60 border border-sys-border focus:border-sys-border-active rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your email details here..."
                  rows={6}
                  className="w-full bg-zinc-950/60 border border-sys-border focus:border-sys-border-active rounded px-3 py-2 text-xs focus:outline-none transition-colors resize-none scrollbar-thin"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 py-2 px-5 rounded bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-sys-accent/15 disabled:opacity-50 select-none"
              >
                {isSending ? (
                  <span>DISPATCHING...</span>
                ) : (
                  <>
                    <SendHorizontal size={12} />
                    <span>SEND MAIL</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
