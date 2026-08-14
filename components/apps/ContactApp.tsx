"use client";

import React, { useState } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Mail, Send, Trash2, ArrowLeft, SendHorizontal, 
  Code2, Briefcase, MessageCircle, Calendar, AlertCircle, Copy, Check
} from "lucide-react";
import { profile, socialLinks, SocialLink } from "../../data/portfolio";

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
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

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

    const lastSent = localStorage.getItem("last_email_sent");
    if (lastSent && Date.now() - parseInt(lastSent) < 30000) {
      setErrorMsg("Please wait 30 seconds before sending another message.");
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
        pushNotification({ type: "success", title: "Message Sent", message: `Your message to Chirayu has been dispatched successfully.` });
        
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Sending failed.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Server error. Please try again.";
      setErrorMsg(`${message} You can still reach Chirayu directly using the email client fallback button.`);
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

  const visibleLinks = socialLinks.filter((link) => link.visible && link.href);
  const mailtoDraftHref = `mailto:${profile.email}?subject=${encodeURIComponent(subject || "Portfolio Contact")}&body=${encodeURIComponent(
    message
      ? `${message}\n\nFrom: ${name || "Sender"}${email ? ` (${email})` : ""}`
      : `Hi Chirayu,\n\nI reviewed your portfolio and would like to connect.\n\nFrom: ${name || "Sender"}${email ? ` (${email})` : ""}`
  )}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      playSound("success");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setErrorMsg(`Copy failed. Email directly at ${profile.email}.`);
      playSound("error");
    }
  };

  const linkIcons: Record<SocialLink["kind"], React.ReactNode> = {
    github: <Code2 size={14} className="text-sys-accent" />,
    email: <Mail size={14} className="text-sys-accent" />,
    linkedin: <Briefcase size={14} className="text-sys-accent" />,
    x: <MessageCircle size={14} className="text-sys-accent" />,
    calendar: <Calendar size={14} className="text-sys-accent" />,
  };

  return (
    <div className="flex h-full w-full flex-col text-zinc-300 select-text md:flex-row font-sans">
      {/* Side Links Pane */}
      <div className="flex w-full shrink-0 flex-col gap-3 border-b border-sys-border bg-zinc-950/70 p-3 select-none md:w-56 md:justify-between md:border-b-0 md:border-r md:p-4">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5">
            <Mail size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Direct Channels</span>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900/60 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-850 active:scale-95"
            >
              {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-sys-accent" />}
              <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900/60 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-850 active:scale-95"
            >
              <Mail size={13} className="text-sys-accent" />
              <span>Mail App</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none md:block md:space-y-1.5 md:overflow-visible">
            {visibleLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.kind === "email" ? undefined : "_blank"}
                rel={link.kind === "email" ? undefined : "noopener noreferrer"}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-sys-border bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-850 active:scale-95 md:w-full md:rounded-lg"
              >
                {linkIcons[link.kind]}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* System Email Signature */}
        <div className="hidden text-[10px] text-zinc-500 space-y-1 border-t border-sys-border/50 pt-3 md:block">
          <p className="font-bold text-zinc-300">{profile.name}</p>
          <p>{profile.location}</p>
          <p className="font-mono text-[9px] text-sys-accent">{profile.email}</p>
        </div>
      </div>

      {/* Gmail Inbox Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-zinc-950/30 p-4 sm:p-6 overscroll-contain">
        {isSuccess ? (
          <div className="my-auto max-w-md mx-auto text-center space-y-4 animate-in zoom-in-95 duration-200 select-none">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/20">
              <SendHorizontal size={24} className="animate-[pulse_1.5s_infinite]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-100 text-sm tracking-wide">Mail Dispatched Successfully!</h3>
              <p className="text-xs text-sys-text-secondary leading-relaxed">
                Thank you for reaching out. Chirayu will review your message and respond promptly.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-sys-border text-xs font-semibold mx-auto transition-colors active:scale-95"
            >
              <ArrowLeft size={13} />
              <span>Compose New Message</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="my-auto max-w-xl mx-auto w-full space-y-3.5">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-sys-border/50 pb-2.5 select-none">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sys-accent">
                <Send size={13} /> Send a Message
              </span>
              <button
                type="button"
                onClick={() => { setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                className="text-zinc-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                title="Discard Draft"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="space-y-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 select-none">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
                <a
                  href={mailtoDraftHref}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-900/40 px-2.5 py-1 text-[11px] font-bold text-red-200 transition-colors"
                >
                  <Mail size={12} />
                  Open Default Mail Client
                </a>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Smith"
                    className="touch-target w-full rounded-xl border border-sys-border bg-zinc-900/80 px-3 py-2 text-xs transition-colors focus:border-sys-accent focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="touch-target w-full rounded-xl border border-sys-border bg-zinc-900/80 px-3 py-2 text-xs transition-colors focus:border-sys-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Project Inquiry or Full-Time Opportunity"
                  className="touch-target w-full rounded-xl border border-sys-border bg-zinc-900/80 px-3 py-2 text-xs transition-colors focus:border-sys-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-sys-border bg-zinc-900/80 px-3 py-2.5 text-xs transition-colors scrollbar-thin focus:border-sys-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <a
                href={mailtoDraftHref}
                className="flex items-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 active:scale-95"
              >
                <Mail size={13} />
                <span>Open in App</span>
              </a>
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 py-2 px-5 rounded-xl bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-sys-accent/20 disabled:opacity-50 active:scale-95"
              >
                {isSending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <SendHorizontal size={13} />
                    <span>Send Message</span>
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
