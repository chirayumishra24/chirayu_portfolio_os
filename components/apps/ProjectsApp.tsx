"use client";

import React, { useState } from "react";
import { 
  Folder, FileCode, Code2, ExternalLink, Activity, Target, 
  Layers, CheckCircle2, Lightbulb, Route, Copy, Check 
} from "lucide-react";
import { clsx } from "clsx";
import { useSystemSound } from "../../hooks/useSystemSound";
import { projects } from "../../data/portfolio";

type MobileTab = "overview" | "architecture" | "code";

export default function ProjectsApp() {
  const { playSound } = useSystemSound();
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileTab, setMobileTab] = useState<MobileTab>("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  const activeProject = projects[activeIdx];

  const handleSelectFile = (idx: number) => {
    playSound("click");
    setActiveIdx(idx);
    setCopiedCode(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeProject.codeSnippet);
      setCopiedCode(true);
      playSound("success");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      playSound("error");
    }
  };

  return (
    <div className="flex h-full w-full flex-col text-xs text-zinc-300 select-text font-sans md:flex-row md:font-mono">
      {/* File Explorer Sidebar */}
      <div className="flex w-full shrink-0 flex-col border-b border-sys-border bg-zinc-950/70 select-none md:w-56 md:border-b-0 md:border-r">
        {/* Sidebar Header */}
        <div className="hidden h-9 items-center gap-1.5 border-b border-sys-border px-3 font-sans text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none md:flex">
          <Folder size={13} className="text-amber-400" />
          <span>Workspace Explorer</span>
        </div>

        {/* Sidebar Files / Horizontal bar on mobile */}
        <div className="flex gap-1.5 overflow-x-auto p-2 scrollbar-none md:block md:space-y-1 md:overflow-visible">
          <div className="hidden px-2 py-1 text-[9px] uppercase tracking-wider font-bold text-zinc-500 font-sans md:block">Verified Projects</div>
          {projects.map((p, idx) => (
            <button
              key={p.file}
              onClick={() => handleSelectFile(idx)}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left font-mono text-xs transition-colors md:w-full md:rounded-lg md:py-1.5 active:scale-95",
                activeIdx === idx 
                  ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/30 font-bold" 
                  : "bg-zinc-900/40 border border-sys-border/60 text-zinc-400 hover:bg-zinc-900 md:bg-transparent md:border-transparent"
              )}
            >
              <FileCode size={14} className={clsx(
                p.language === "javascript" && "text-yellow-400",
                p.language === "go" && "text-sky-400",
                p.language === "typescript" && "text-blue-400",
                p.language === "rust" && "text-orange-400"
              )} />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel & Details Viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar: Desktop Tabs + Mobile Segmented Controller */}
        <div className="flex h-10 items-center justify-between border-b border-sys-border bg-zinc-950/40 px-3 select-none">
          {/* Desktop File Tab */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-sys-accent font-semibold">
            <FileCode size={13} className="text-yellow-400" />
            <span>{activeProject.file}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">{activeProject.language}</span>
          </div>

          {/* Mobile Segmented View Tabs */}
          <div className="flex w-full items-center justify-center gap-1 md:hidden">
            <button
              onClick={() => { playSound("click"); setMobileTab("overview"); }}
              className={clsx(
                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors",
                mobileTab === "overview" ? "bg-sys-accent text-zinc-950 shadow" : "text-zinc-400 hover:bg-zinc-900/50"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => { playSound("click"); setMobileTab("architecture"); }}
              className={clsx(
                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors",
                mobileTab === "architecture" ? "bg-sys-accent text-zinc-950 shadow" : "text-zinc-400 hover:bg-zinc-900/50"
              )}
            >
              Architecture
            </button>
            <button
              onClick={() => { playSound("click"); setMobileTab("code"); }}
              className={clsx(
                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors",
                mobileTab === "code" ? "bg-sys-accent text-zinc-950 shadow" : "text-zinc-400 hover:bg-zinc-900/50"
              )}
            >
              Code
            </button>
          </div>

          {/* Copy Code button */}
          <button
            onClick={handleCopyCode}
            className="hidden md:flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-zinc-900 border border-sys-border text-zinc-400 hover:text-zinc-100 hover:border-sys-accent transition-colors"
            title="Copy snippet"
          >
            {copiedCode ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:flex-row">
          
          {/* Code Viewer: Visible always on Desktop, and conditionally on Mobile when Code tab is active */}
          <div className={clsx(
            "min-h-[240px] flex-1 overflow-y-auto border-b border-sys-border/50 bg-zinc-950/20 p-4 font-mono text-[11px] leading-relaxed scrollbar-thin sm:p-5 lg:border-b-0 lg:border-r",
            mobileTab !== "code" && "hidden md:block"
          )}>
            <div className="flex items-center justify-between mb-3 md:hidden">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">{activeProject.file}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-zinc-900 border border-sys-border text-zinc-300"
              >
                {copiedCode ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copiedCode ? "Copied Snippet" : "Copy Code"}</span>
              </button>
            </div>

            <div className="flex items-start gap-4">
              {/* Line Numbers */}
              <div className="text-zinc-600 select-none text-right pr-2 shrink-0">
                {activeProject.codeSnippet.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              
              {/* Highlighted Code */}
              <pre className="flex-1 overflow-x-auto whitespace-pre text-zinc-200 font-mono scrollbar-none">
                {activeProject.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Details Info Panel */}
          <div className={clsx(
            "flex w-full flex-col justify-between gap-5 overflow-y-auto bg-zinc-950/30 p-4 font-sans sm:p-5 lg:w-[400px] shrink-0",
            mobileTab === "code" && "hidden md:flex"
          )}>
            
            {/* Case Study Details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-100">{activeProject.name}</h3>
                <span className="text-[10px] font-bold text-sys-accent uppercase tracking-wider">{activeProject.language} Module</span>
              </div>
              
              <p className="text-xs leading-relaxed text-sys-text-secondary">{activeProject.description}</p>
              
              {/* Overview Tab Content on mobile or full on desktop */}
              {(mobileTab === "overview" || typeof window === "undefined") && (
                <>
                  {/* Problem & Role */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/50 border border-sys-border text-xs">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                      <Target size={13} className="text-amber-400" /> Problem & Role
                    </span>
                    <p className="text-sys-text-secondary leading-relaxed">{activeProject.problem}</p>
                    <p className="text-zinc-200 leading-normal font-semibold pt-1 border-t border-zinc-900">
                      <span className="text-sys-accent">Role:</span> {activeProject.role}
                    </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/50 border border-sys-border text-xs">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                      <Activity size={13} className="text-emerald-400 animate-pulse" /> Core Metrics & Impact
                    </span>
                    <ul className="space-y-1.5 text-sys-text-secondary leading-relaxed list-disc pl-4">
                      {(activeProject.metrics ?? ["Verified project implementation details."]).map((metric) => (
                        <li key={metric}>{metric}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcomes */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/50 border border-sys-border text-xs">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                      <CheckCircle2 size={13} className="text-emerald-400" /> Key Outcomes
                    </span>
                    <ul className="space-y-1.5 text-sys-text-secondary leading-relaxed list-disc pl-4">
                      {activeProject.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Architecture Tab Content on mobile or full on desktop */}
              {(mobileTab === "architecture" || typeof window === "undefined") && (
                <>
                  {/* Architecture Notes */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/50 border border-sys-border text-xs">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                      <Layers size={13} className="text-sys-accent" /> Architecture Highlights
                    </span>
                    <ul className="space-y-1.5 text-sys-text-secondary leading-relaxed list-disc pl-4">
                      {activeProject.architecture.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Major Challenges */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-zinc-950/50 border border-sys-border text-xs">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                      <Target size={13} className="text-amber-400" /> Engineering Challenges
                    </span>
                    <p className="text-sys-text-secondary leading-relaxed">{activeProject.challenges}</p>
                  </div>

                  {/* Learnings & Next Steps */}
                  <div className="grid gap-3 text-xs md:grid-cols-1">
                    <div className="space-y-2 rounded-xl border border-sys-border bg-zinc-950/50 p-3.5">
                      <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                        <Lightbulb size={13} className="text-yellow-400" /> Key Learnings
                      </span>
                      <ul className="space-y-1 text-sys-text-secondary leading-relaxed list-disc pl-4">
                        {activeProject.learnings.map((learning) => (
                          <li key={learning}>{learning}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2 rounded-xl border border-sys-border bg-zinc-950/50 p-3.5">
                      <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[10px] tracking-wider select-none">
                        <Route size={13} className="text-purple-400" /> Roadmap & Next Steps
                      </span>
                      <ul className="space-y-1 text-sys-text-secondary leading-relaxed list-disc pl-4">
                        {activeProject.nextSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions & Tech Badges Footer */}
            <div className="space-y-3.5 border-t border-sys-border pt-4 select-none">
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tech.map((t) => (
                  <span key={t} className="text-[9.5px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-900 border border-sys-border text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-sys-border text-xs font-semibold text-zinc-200 transition-colors active:scale-95"
                  >
                    <Code2 size={13} />
                    <span>GitHub Repo</span>
                  </a>
                )}
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-xs transition-colors active:scale-95"
                  >
                    <ExternalLink size={13} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
