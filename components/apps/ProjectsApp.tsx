"use client";

import React, { useState } from "react";
import { Folder, FileCode, Code2, ExternalLink, Activity, Target } from "lucide-react";
import { clsx } from "clsx";
import { useSystemSound } from "../../hooks/useSystemSound";
import { projects } from "../../data/portfolio";

export default function ProjectsApp() {
  const { playSound } = useSystemSound();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = projects[activeIdx];

  const handleSelectFile = (idx: number) => {
    playSound("click");
    setActiveIdx(idx);
  };

  return (
    <div className="flex h-full w-full flex-col text-xs text-zinc-300 select-text font-mono md:flex-row">
      {/* File Explorer Sidebar */}
      <div className="flex w-full shrink-0 flex-col border-b border-sys-border bg-zinc-950/60 select-none md:w-56 md:border-b-0 md:border-r">
        {/* Sidebar Header */}
        <div className="hidden h-9 items-center gap-1.5 border-b border-sys-border px-3 font-sans text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none md:flex">
          <Folder size={12} className="text-amber-500" />
          <span>Workspace Explorer</span>
        </div>

        {/* Sidebar Files */}
        <div className="flex gap-2 overflow-x-auto p-2 scrollbar-none md:block md:space-y-0.5 md:overflow-visible">
          <div className="hidden px-2 py-1 text-[9px] uppercase tracking-wider font-bold text-zinc-600 font-sans md:block">Projects</div>
          {projects.map((p, idx) => (
            <button
              key={p.file}
              onClick={() => handleSelectFile(idx)}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded px-2.5 py-2 text-left transition-colors hover:bg-zinc-900 md:w-full md:py-1.5",
                activeIdx === idx ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "text-zinc-400"
              )}
            >
              <FileCode size={13} className={clsx(
                p.language === "javascript" && "text-yellow-400",
                p.language === "go" && "text-sky-400",
                p.language === "typescript" && "text-blue-400",
                p.language === "rust" && "text-orange-400"
              )} />
              <span>{p.file}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel & Details Viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs bar */}
        <div className="flex h-9 items-center gap-1 overflow-x-auto border-b border-sys-border bg-zinc-950/40 px-2 select-none scrollbar-none">
          {projects.map((p, idx) => (
            <button
              key={p.file}
              onClick={() => handleSelectFile(idx)}
              className={clsx(
                "flex h-full shrink-0 items-center gap-2 border-r border-sys-border px-3 text-[10px] tracking-wide transition-colors sm:px-4",
                activeIdx === idx ? "bg-zinc-950/20 text-sys-accent border-t-2 border-t-sys-accent" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <FileCode size={11} className={clsx(
                p.language === "javascript" && "text-yellow-400",
                p.language === "go" && "text-sky-400",
                p.language === "typescript" && "text-blue-400",
                p.language === "rust" && "text-orange-400"
              )} />
              <span>{p.file}</span>
            </button>
          ))}
        </div>

        {/* Split View Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:flex-row">
          {/* Left panel: Code Editor View */}
          <div className="min-h-[220px] flex-1 overflow-y-auto border-b border-sys-border/40 bg-zinc-950/10 p-4 scrollbar-thin sm:p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-start gap-4 font-mono text-[11px] leading-relaxed">
              {/* Line Numbers */}
              <div className="text-zinc-600 select-none text-right pr-2">
                {activeProject.codeSnippet.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              
              {/* Highlighted Code */}
              <pre className="flex-1 overflow-x-auto whitespace-pre text-zinc-300">
                {activeProject.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Right panel: Application Details Info Cards */}
          <div className="flex w-full flex-col justify-between gap-6 overflow-y-auto bg-zinc-950/30 p-4 font-sans sm:p-5 lg:w-96">
            
            {/* Description */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-100">{activeProject.name}</h3>
                <span className="text-[10px] font-bold text-sys-accent uppercase tracking-wider">{activeProject.language} Module</span>
              </div>
              
              <p className="text-xs leading-relaxed text-sys-text-secondary">{activeProject.description}</p>
              
              {/* Key Metrics */}
              <div className="space-y-2 p-3 rounded-lg bg-zinc-950/40 border border-sys-border text-[11px]">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[9px] tracking-wider select-none">
                  <Activity size={12} className="text-sys-accent animate-pulse" /> Core Metrics
                </span>
                <ul className="space-y-1 text-sys-text-secondary leading-normal list-disc pl-4">
                  {(activeProject.metrics ?? ["Verified project details are being prepared."]).map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </div>

              {/* Major Challenges */}
              <div className="space-y-1 p-3 rounded-lg bg-zinc-950/40 border border-sys-border text-[11px]">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[9px] tracking-wider select-none">
                  <Target size={12} className="text-amber-500" /> Engineering Challenges
                </span>
                <p className="text-sys-text-secondary leading-normal">{activeProject.challenges}</p>
              </div>
            </div>

            {/* Actions & Tech Badges */}
            <div className="space-y-4 border-t border-sys-border pt-4 select-none">
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tech.map((t) => (
                  <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-sys-border text-zinc-400">
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
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-zinc-900 hover:bg-zinc-800 border border-sys-border text-[11px] font-semibold text-zinc-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent"
                  >
                    <Code2 size={12} />
                    <span>GitHub Repository</span>
                  </a>
                )}
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent"
                  >
                    <ExternalLink size={12} />
                    <span>Launch Live Demo</span>
                  </a>
                )}
                {!activeProject.githubUrl && !activeProject.liveUrl && (
                  <p className="text-[10px] text-zinc-500">Verified public links are not available for this project yet.</p>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
