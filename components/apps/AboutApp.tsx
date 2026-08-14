"use client";

import React from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Award, Code, Globe, User, BookOpen, Coffee, HelpCircle, FileText, Folder, Mail, CheckCircle2, Sparkles } from "lucide-react";
import { profile } from "../../data/portfolio";

export default function AboutApp() {
  const { openWindow } = useOSStore();
  const { playSound } = useSystemSound();

  const handleOpenWindow = (id: "resume" | "projects" | "contact") => {
    playSound("click");
    openWindow(id);
  };

  const statIcons = [
    <Award key="education" size={18} className="text-amber-400" />,
    <Code key="cgpa" size={18} className="text-sys-accent" />,
    <Globe key="project" size={18} className="text-emerald-400" />,
    <Coffee key="stack" size={18} className="text-rose-400" />,
  ];

  return (
    <div className="h-full w-full space-y-5 overflow-y-auto p-4 text-zinc-300 select-text font-sans sm:p-6 overscroll-contain">
      {/* Hero Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-sys-border pb-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sys-accent to-purple-600 p-0.5 shadow-xl select-none shrink-0">
          <div className="w-full h-full rounded-[22px] bg-zinc-950 flex items-center justify-center font-bold text-2xl text-sys-accent shadow-inner">
            {profile.initials}
          </div>
        </div>
        
        <div className="space-y-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl font-bold text-zinc-100">{profile.name}</h2>
          <p className="text-xs text-sys-accent font-semibold uppercase tracking-wider font-mono">{profile.role}</p>
          <p className="text-xs text-sys-text-secondary leading-relaxed">{profile.headline}</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {profile.stats.map((stat, idx) => (
          <div key={idx} className="p-3.5 bg-zinc-950/40 rounded-2xl border border-sys-border flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 shrink-0">{statIcons[idx]}</div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-base font-bold text-zinc-100 leading-none font-mono">{stat.value}</p>
              <p className="text-[9.5px] text-sys-text-secondary uppercase font-bold tracking-wider truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recruiter Summary Card */}
      <section className="rounded-3xl border border-sys-accent/30 bg-sys-accent/10 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sys-accent select-none flex items-center gap-1.5">
              <Sparkles size={13} className="animate-pulse" /> Recruiter Quick Brief
            </h3>
            <p className="text-xs leading-relaxed text-zinc-200">{profile.recruiterSummary}</p>
          </div>

          <div className="space-y-2 border-t border-sys-accent/20 pt-3 md:border-t-0 md:pt-0">
            {profile.strengths.slice(0, 3).map((strength) => (
              <div key={strength} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Info Column */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Biography */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
            <User size={13} /> Biography & Background
          </h3>
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="text-xs leading-relaxed text-sys-text-secondary bg-zinc-950/25 p-3 rounded-xl border border-sys-border/50">
              {paragraph}
            </p>
          ))}

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 pt-2 select-none">
            <button
              onClick={() => handleOpenWindow("projects")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-accent/30 bg-sys-accent/15 py-2.5 px-3 text-xs font-bold text-sys-accent transition-colors hover:bg-sys-accent/25 active:scale-95 text-center"
            >
              <Folder size={13} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => handleOpenWindow("resume")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900 py-2.5 px-3 text-xs font-bold text-zinc-200 transition-colors hover:border-sys-border-active active:scale-95 text-center"
            >
              <FileText size={13} />
              <span>Resume</span>
            </button>
            <button
              onClick={() => handleOpenWindow("contact")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900 py-2.5 px-3 text-xs font-bold text-zinc-200 transition-colors hover:border-sys-border-active active:scale-95 text-center"
            >
              <Mail size={13} />
              <span>Contact</span>
            </button>
          </div>
        </div>

        {/* Interests & Side Facts */}
        <div className="space-y-4 bg-zinc-950/30 p-4 rounded-2xl border border-sys-border">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
              <BookOpen size={13} /> Core Focus
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.focusTags.map((tag) => (
                <span key={tag} className="text-[9.5px] font-bold px-2 py-0.5 rounded-lg bg-zinc-900 border border-sys-border text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
              <HelpCircle size={13} /> Passions
            </h4>
            <ul className="text-xs space-y-1.5 text-sys-text-secondary list-disc pl-4">
              <li>Full-stack product architecture</li>
              <li>High-performance web interactive interfaces</li>
              <li>Clean UI, responsive UX & accessibility</li>
              <li>Agile engineering & rapid prototyping</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
