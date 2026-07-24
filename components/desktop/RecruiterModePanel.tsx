"use client";

import React, { useEffect, useState } from "react";
import { Code2, ExternalLink, FileText, Folder, Mail, Sparkles, X } from "lucide-react";
import { profile, resume } from "../../data/portfolio";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";

export default function RecruiterModePanel() {
  const { openWindow } = useOSStore();
  const { playSound } = useSystemSound();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem("chirayu-os-recruiter-panel-dismissed");
    setIsOpen(dismissed !== "true");

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-recruiter-mode", handleOpen);
    return () => window.removeEventListener("open-recruiter-mode", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        playSound("click");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, playSound]);

  const openApp = (id: "about" | "projects" | "resume" | "contact") => {
    playSound("click");
    openWindow(id);
  };

  const dismiss = () => {
    playSound("click");
    window.localStorage.setItem("chirayu-os-recruiter-panel-dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      data-recruiter-panel="true"
      className="fixed left-2 right-2 top-[calc(var(--topbar-height)+0.5rem)] z-[60] rounded-2xl border border-sys-border-active bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto sm:left-4 sm:right-auto sm:w-[360px]"
      aria-label="Recruiter quick summary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sys-accent">
            <Sparkles size={12} />
            Recruiter Mode
          </p>
          <h2 className="text-sm font-bold text-zinc-100">{profile.name}</h2>
          <p className="text-[11px] font-semibold text-zinc-300">{profile.role}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss recruiter quick summary"
          className="touch-target flex items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200 sm:min-h-0 sm:min-w-0 sm:p-1"
        >
          <X size={15} />
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-sys-text-secondary">{profile.recruiterSummary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.focusTags.slice(0, 5).map((tag) => (
          <span key={tag} className="rounded border border-sys-border bg-zinc-900 px-2 py-1 text-[9px] font-bold text-zinc-300">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => openApp("projects")}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-sys-accent/30 bg-sys-accent/15 px-3 py-2 text-sys-accent transition-colors hover:bg-sys-accent/25"
        >
          <Folder size={12} />
          Projects
        </button>
        <button
          type="button"
          onClick={() => openApp("resume")}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-sys-border bg-zinc-900 px-3 py-2 text-zinc-200 transition-colors hover:border-sys-border-active"
        >
          <FileText size={12} />
          Resume
        </button>
        <button
          type="button"
          onClick={() => openApp("contact")}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-sys-border bg-zinc-900 px-3 py-2 text-zinc-200 transition-colors hover:border-sys-border-active"
        >
          <Mail size={12} />
          Contact
        </button>
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-sys-border bg-zinc-900 px-3 py-2 text-zinc-200 transition-colors hover:border-sys-border-active"
        >
          <Code2 size={12} />
          GitHub
        </a>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-sys-border/60 pt-3 text-[10px] text-zinc-500">
        <a href={resume.publicPath} download={resume.downloadName} className="inline-flex items-center gap-1 hover:text-sys-accent">
          <FileText size={11} />
          Download CV
        </a>
        <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:text-sys-accent">
          <ExternalLink size={11} />
          Email directly
        </a>
      </div>
    </aside>
  );
}
