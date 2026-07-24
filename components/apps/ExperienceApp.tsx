"use client";

import React, { useState } from "react";
import { GitCommit, GitFork, GitMerge, Briefcase, Calendar, Code } from "lucide-react";
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
    <div className="flex h-full w-full flex-col overflow-y-auto p-4 font-mono text-xs text-zinc-300 select-text lg:flex-row lg:overflow-hidden lg:p-6">
      {/* Git Timeline Graphical Panel */}
      <div className="flex w-full shrink-0 flex-col justify-between gap-4 border-b border-sys-border pb-6 pr-0 select-none lg:w-96 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5 mb-2.5">
            <GitFork size={14} />
            <span className="font-sans font-bold uppercase tracking-wider text-[10px]">Repository Timeline</span>
          </div>

          <p className="text-[10px] text-sys-text-secondary leading-normal font-sans">
            Click a timeline node to review verified experience notes, responsibilities, and tools.
          </p>
        </div>

        {/* Tree Graph Layout */}
        <div className="relative flex flex-col justify-center space-y-8 py-5 pl-2 min-[380px]:pl-4 sm:space-y-10 lg:flex-1 lg:space-y-12 lg:py-6">
          {/* Vertical Branch lines */}
          <div className="absolute top-8 bottom-8 left-12 w-0.5 bg-zinc-800" />
          <div className="absolute top-24 bottom-24 left-[72px] w-0.5 bg-zinc-800/60 border-dashed border-l border-zinc-800/80" />

          {experienceEntries.map((exp, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={exp.hash}
                onClick={() => handleSelectNode(idx)}
                className="group relative flex touch-target items-center gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent min-[380px]:gap-6"
              >
                {/* Node representation */}
                <div className="relative flex items-center justify-center shrink-0">
                  {/* Branch offset lines */}
                  {exp.branch === "develop" && (
                    <div className="absolute right-[22px] top-1/2 w-4 h-0.5 bg-zinc-800" />
                  )}
                  
                  <div className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center border z-10 transition-all duration-200",
                    isSelected 
                      ? "bg-sys-accent border-sys-accent-hover text-zinc-950 scale-110 shadow-lg shadow-sys-accent/25" 
                      : "bg-zinc-900 border-sys-border text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  )}>
                    {exp.branch === "master" ? <GitCommit size={16} /> : <GitMerge size={16} />}
                  </div>
                </div>

                <div className="space-y-0.5 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-sys-accent bg-sys-accent/15 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      commit {exp.hash}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">[{exp.branch}]</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-sys-accent transition-colors">
                    {exp.company}
                  </h4>
                  <p className="text-[10px] text-sys-text-secondary">{exp.duration}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider select-none">
          git log --graph --oneline --all
        </div>
      </div>

      {/* Commit Metadata Viewer */}
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-6 overflow-auto p-0 pt-6 lg:pl-6 lg:pt-0">
        
        <div className="space-y-5">
          {/* Header Card */}
          <div className="space-y-2 border-b border-sys-border/50 pb-4 select-none font-sans">
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              commit verified
            </span>
            
            <h3 className="flex items-start gap-2 text-sm font-bold text-zinc-100">
              <Briefcase size={15} className="text-sys-accent" />
              <span>{activeExp.role} @ {activeExp.company}</span>
            </h3>

            <div className="flex items-center gap-2.5 text-xs text-sys-text-secondary">
              <span className="flex items-center gap-1"><Calendar size={12} /> {activeExp.duration}</span>
            </div>
          </div>

          {/* Commit Message logs */}
          <div className="space-y-3 font-mono text-[11px] leading-relaxed">
            <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1 select-none">
              Achievements
            </span>
            <div className="space-y-2 select-text">
              {activeExp.bullets.map((commit, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-sys-accent select-none shrink-0">+</span>
                  <p className="text-zinc-300 leading-normal">{commit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies listing */}
        <div className="space-y-2.5 border-t border-sys-border pt-4 select-none font-sans">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
            <Code size={11} className="text-sys-accent" /> Tech Stack Deployed
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeExp.tech.map((t) => (
              <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-sys-border text-zinc-300">
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
