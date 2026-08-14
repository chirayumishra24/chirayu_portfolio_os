"use client";

import React, { useState } from "react";
import { GitCommit, GitFork, GitMerge, Briefcase, Calendar, Code, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { useSystemSound } from "../../hooks/useSystemSound";
import { experienceEntries } from "../../data/portfolio";

export default function ExperienceApp() {
  const { playSound } = useSystemSound();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeExp = experienceEntries[activeIdx];

  const handleSelectNode = (idx: number) => {
    playSound("click");
    setActiveIdx(idx);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-4 font-mono text-xs text-zinc-300 select-text lg:flex-row lg:overflow-hidden lg:p-6 overscroll-contain">
      {/* Git Timeline Graphical Panel */}
      <div className="flex w-full shrink-0 flex-col justify-between gap-3 border-b border-sys-border pb-5 pr-0 select-none lg:w-96 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5 mb-1.5">
            <GitFork size={15} />
            <span className="font-sans font-bold uppercase tracking-wider text-[11px]">Git Experience Log</span>
          </div>

          <p className="text-[11px] text-sys-text-secondary leading-normal font-sans">
            Tap a timeline node to explore company achievements, metrics, and deployed tools.
          </p>
        </div>

        {/* Tree Graph Layout */}
        <div className="relative flex flex-col justify-center space-y-4 py-3 pl-2 sm:space-y-6 lg:flex-1 lg:space-y-8 lg:py-6">
          {/* Vertical Branch line */}
          <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-zinc-800" />

          {experienceEntries.map((exp, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={exp.hash}
                onClick={() => handleSelectNode(idx)}
                className="group relative flex touch-target items-center gap-3.5 text-left active:scale-98 transition-transform"
              >
                {/* Node icon */}
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center border z-10 transition-all duration-200 shrink-0",
                  isSelected 
                    ? "bg-sys-accent border-sys-accent-hover text-zinc-950 scale-105 shadow-lg shadow-sys-accent/25 font-bold" 
                    : "bg-zinc-900 border-sys-border text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                )}>
                  {exp.branch === "master" ? <GitCommit size={17} /> : <GitMerge size={17} />}
                </div>

                <div className="space-y-0.5 font-sans min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[9.5px] font-bold text-sys-accent bg-sys-accent/15 px-1.5 py-0.5 rounded uppercase tracking-wider border border-sys-accent/20">
                      {exp.hash}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">[{exp.branch}]</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-100 group-hover:text-sys-accent transition-colors truncate">
                    {exp.company}
                  </h4>
                  <p className="text-[10.5px] text-sys-text-secondary">{exp.duration}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[9.5px] text-zinc-600 uppercase font-bold tracking-wider select-none font-mono">
          git log --graph --oneline
        </div>
      </div>

      {/* Commit Metadata Viewer */}
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-5 overflow-auto p-0 pt-5 lg:pl-6 lg:pt-0">
        
        <div className="space-y-4">
          {/* Header Card */}
          <div className="space-y-2 border-b border-sys-border/50 pb-3.5 select-none font-sans">
            <span className="text-[9.5px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <CheckCircle2 size={11} /> Verified Employment Role
            </span>
            
            <h3 className="flex items-start gap-2 text-sm font-bold text-zinc-100">
              <Briefcase size={16} className="text-sys-accent mt-0.5 shrink-0" />
              <span>{activeExp.role} @ {activeExp.company}</span>
            </h3>

            <div className="flex items-center gap-2.5 text-xs text-sys-text-secondary">
              <span className="flex items-center gap-1 font-mono text-[11px]"><Calendar size={12} /> {activeExp.duration}</span>
            </div>
          </div>

          {/* Commit Message logs */}
          <div className="space-y-2.5 font-mono text-[11px] leading-relaxed">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1 select-none font-sans">
              Core Responsibilities & Milestones
            </span>
            <div className="space-y-2 select-text bg-zinc-950/30 p-3.5 rounded-2xl border border-sys-border">
              {activeExp.bullets.map((commit, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 select-none shrink-0 font-bold">+</span>
                  <p className="text-zinc-200 leading-relaxed font-sans text-xs">{commit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies listing */}
        <div className="space-y-2 border-t border-sys-border pt-3.5 select-none font-sans">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
            <Code size={12} className="text-sys-accent" /> Technologies & Tools Applied
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeExp.tech.map((t) => (
              <span key={t} className="text-[9.5px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-900 border border-sys-border text-zinc-300">
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
