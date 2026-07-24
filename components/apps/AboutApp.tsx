"use client";

import React from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Award, Code, Globe, User, BookOpen, Coffee, HelpCircle, FileText, Folder, Mail } from "lucide-react";
import { profile } from "../../data/portfolio";

export default function AboutApp() {
  const { openWindow } = useOSStore();
  const { playSound } = useSystemSound();

  const handleOpenWindow = (id: "resume" | "projects" | "contact") => {
    playSound("click");
    openWindow(id);
  };

  const statIcons = [
    <Award key="education" className="text-amber-500" />,
    <Code key="cgpa" className="text-sys-accent" />,
    <Globe key="project" className="text-emerald-500" />,
    <Coffee key="stack" className="text-rose-500" />,
  ];

  return (
    <div className="h-full w-full space-y-5 overflow-y-auto p-4 text-zinc-300 select-text font-sans sm:p-6">
      {/* Hero Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-sys-border pb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sys-accent to-pink-500 p-0.5 shadow-xl select-none">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-2xl text-sys-accent">
            {profile.initials}
          </div>
        </div>
        
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-xl font-bold text-zinc-100">{profile.name}</h2>
          <p className="text-xs text-sys-accent font-semibold uppercase tracking-wider font-mono">{profile.role}</p>
          <p className="text-xs text-sys-text-secondary">{profile.headline}</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-4 md:gap-4">
        {profile.stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-zinc-950/40 rounded-xl border border-sys-border flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900">{statIcons[idx]}</div>
            <div className="space-y-0.5">
              <p className="text-base font-bold text-zinc-100 leading-none">{stat.value}</p>
              <p className="text-[9px] text-sys-text-secondary uppercase font-bold tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Text Info Column */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Biography */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
            <User size={13} /> Biography
          </h3>
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="text-xs leading-relaxed text-sys-text-secondary">
              {paragraph}
            </p>
          ))}

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={() => handleOpenWindow("projects")}
              className="flex w-full items-center justify-center gap-2 rounded border border-sys-accent/30 bg-sys-accent/15 px-4 py-2 text-xs font-bold text-sys-accent transition-all hover:bg-sys-accent/25 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent sm:w-auto"
            >
              <Folder size={12} />
              <span>View Verified Project</span>
            </button>
            <button
              onClick={() => handleOpenWindow("resume")}
              className="flex w-full items-center justify-center gap-2 rounded border border-sys-border bg-zinc-950/40 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-sys-border-active select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent sm:w-auto"
            >
              <FileText size={12} />
              <span>Open Resume</span>
            </button>
            <button
              onClick={() => handleOpenWindow("contact")}
              className="flex w-full items-center justify-center gap-2 rounded border border-sys-border bg-zinc-950/40 px-4 py-2 text-xs font-bold text-zinc-200 transition-all hover:border-sys-border-active select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent sm:w-auto"
            >
              <Mail size={12} />
              <span>Contact</span>
            </button>
          </div>
        </div>

        {/* Interests & Side Facts */}
        <div className="space-y-4 bg-zinc-950/20 p-4 rounded-xl border border-sys-border">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
              <BookOpen size={12} /> Core Focus
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.focusTags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-sys-border text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
              <HelpCircle size={12} /> Passions
            </h4>
            <ul className="text-xs space-y-1.5 text-sys-text-secondary list-disc pl-4">
              <li>Technical product ownership</li>
              <li>Interactive web portfolios</li>
              <li>Clean UI and practical UX</li>
              <li>Agile backlog and QA workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
