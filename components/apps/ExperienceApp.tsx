"use client";

import React, { useState } from "react";
import { GitCommit, GitFork, GitMerge, Briefcase, Calendar, Code } from "lucide-react";
import { clsx } from "clsx";
import { useSystemSound } from "../../hooks/useSystemSound";

interface Experience {
  hash: string;
  branch: "master" | "develop" | "feature";
  company: string;
  role: string;
  duration: string;
  commits: string[];
  tech: string[];
}

const experienceData: Experience[] = [
  {
    hash: "a4f89d2",
    branch: "master",
    company: "SkilliZee",
    role: "Product Associate (Full-Time)",
    duration: "Nov 2025 - Present",
    commits: [
      "Interfaced natively across engineering, UI/UX design, and business teams to transform high-level roadmaps into production-ready tasks.",
      "Drove continuous sprint cycles, grooming meetings, backlog prioritization, and core product roadmapping to preserve steady product releases.",
      "Conducted thorough user research and quantitative usability diagnostics to map and rectify complex friction loops within the application lifecycle."
    ],
    tech: ["Product Roadmapping", "User Flows", "User Research", "Agile Sprints", "Backlog Prioritization", "QA Testing"],
  },
  {
    hash: "b7e2c91",
    branch: "develop",
    company: "SkilliZee",
    role: "Product Associate (Intern)",
    duration: "Sep 2025 - Nov 2025",
    commits: [
      "Spearheaded product discovery and scoped core web feature configurations by authoring concrete Product Requirement Documents (PRDs) and user flows.",
      "Executed extensive market research and competitive benchmarking matrices to identify potential feature vectors and white spaces for product improvements."
    ],
    tech: ["PRD Documentation", "Product Discovery", "Competitive Benchmarking", "User Flows", "Market Research"],
  },
  {
    hash: "c6d1a5f",
    branch: "feature",
    company: "Speech-to-Text Project",
    role: "Backend Engineering Intern",
    duration: "Jan 2025 - July 2025",
    commits: [
      "Developed an end-to-end real-time Speech-to-Text Transcription system powered by Node.js and Mozilla DeepSpeech.",
      "Earned Backend Engineering Internship Certificate for high-performance WebSocket audio stream calculations."
    ],
    tech: ["Node.js", "Mozilla DeepSpeech", "WebSockets", "Audio Streaming", "JavaScript (ES6+)"],
  }
];

export default function ExperienceApp() {
  const { playSound } = useSystemSound();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeExp = experienceData[activeIdx];

  const handleSelectNode = (idx: number) => {
    playSound("click");
    setActiveIdx(idx);
  };

  return (
    <div className="w-full h-full p-6 flex flex-col lg:flex-row text-zinc-300 font-mono text-xs select-text">
      {/* Git Timeline Graphical Panel */}
      <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-sys-border pr-0 lg:pr-6 pb-6 lg:pb-0 flex flex-col justify-between gap-4 shrink-0 select-none">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5 mb-2.5">
            <GitFork size={14} />
            <span className="font-sans font-bold uppercase tracking-wider text-[10px]">Repository Timeline</span>
          </div>

          <p className="text-[10px] text-sys-text-secondary leading-normal font-sans">
            Click on any git commit node in the repository tree to analyze candidate achievements and deployment configurations.
          </p>
        </div>

        {/* Tree Graph Layout */}
        <div className="flex-1 flex flex-col justify-center py-6 pl-4 relative space-y-12">
          {/* Vertical Branch lines */}
          <div className="absolute top-8 bottom-8 left-12 w-0.5 bg-zinc-800" />
          <div className="absolute top-24 bottom-24 left-[72px] w-0.5 bg-zinc-800/60 border-dashed border-l border-zinc-800/80" />

          {experienceData.map((exp, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={exp.hash}
                onClick={() => handleSelectNode(idx)}
                className="flex items-center gap-6 group text-left relative focus:outline-none"
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
      <div className="flex-1 p-0 lg:pl-6 pt-6 lg:pt-0 overflow-auto flex flex-col justify-between gap-6">
        
        <div className="space-y-5">
          {/* Header Card */}
          <div className="space-y-2 border-b border-sys-border/50 pb-4 select-none font-sans">
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              commit verified
            </span>
            
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
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
              {activeExp.commits.map((commit, idx) => (
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
