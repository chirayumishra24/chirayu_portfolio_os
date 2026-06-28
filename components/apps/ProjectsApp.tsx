"use client";

import React, { useState } from "react";
import { Folder, FileCode, Code2, ExternalLink, Activity, Target } from "lucide-react";
import { clsx } from "clsx";
import { useSystemSound } from "../../hooks/useSystemSound";

interface Project {
  file: string;
  name: string;
  lang: "javascript" | "go" | "typescript" | "rust";
  desc: string;
  metrics: string;
  challenges: string;
  tech: string[];
  github: string;
  live: string;
  codeSnippet: string;
}

const projects: Project[] = [
  {
    file: "chirayu-os.js",
    name: "ChirayuOS Portfolio",
    lang: "javascript",
    desc: "An interactive, web-based operating system portfolio simulating standard desktop experiences with floating resizable windows, terminal shells, Monaco compilation compilers, and customized visual theme injection engines.",
    metrics: "Lighthouse Score: 99/100, 60fps animations, 10+ custom themes.",
    challenges: "Synchronizing window coordinates and active layering (z-index focus) across asynchronous modules without triggering expensive redraw cycles.",
    tech: ["Next.js", "Zustand", "Framer Motion", "Monaco Editor", "xterm.js"],
    github: "https://github.com/chirayumishra24",
    live: "https://github.com/chirayumishra24",
    codeSnippet: `const chirayuOS = {
  version: "14.0.0",
  modules: ["WindowManager", "CommandPalette", "Terminal", "Playground"],
  performance: "60 FPS Eased Springs",
  lighthouse: 99,
  isPremium: true
};

export function runDesktop() {
  return chirayuOS.modules.map(mountWindow);
}`
  },
  {
    file: "flowstate.go",
    name: "FlowState Visualizer",
    lang: "go",
    desc: "A collaborative visual canvas that simplifies complex Git repository tree networks into draggable node diagrams. Links real-time developer branches via WebSockets.",
    metrics: "Fires updates under 10ms, supporting up to 50 concurrent visual connections.",
    challenges: "Writing concurrent message channels in Go that safely throttle coordinate broadcast spikes during drag actions.",
    tech: ["Go", "WebSockets", "React Flow", "Zustand", "PostgreSQL"],
    github: "https://github.com/chirayumishra24",
    live: "https://github.com/chirayumishra24",
    codeSnippet: `package main

import "github.com/gorilla/websocket"

type Node struct {
    ID     string  \`json:"id"\`
    Branch string  \`json:"branch"\`
    X      float64 \`json:"x"\`
    Y      float64 \`json:"y"\`
}

func broadcastCoordinates(nodes []Node) {
    // Websocket broadcast loop
}`
  },
  {
    file: "devforge.ts",
    name: "DevForge Compiler",
    lang: "typescript",
    desc: "An isolated code execution microservice compilation engine compiling and evaluating guest script modules securely inside Docker sandbox cells.",
    metrics: "Executes scripts under 150ms, processing 10K queries daily.",
    challenges: "Configuring process resource limitations (CPU/RAM thresholds) within dynamic Docker layers to mitigate recursive loop attacks.",
    tech: ["TypeScript", "Docker", "Node.js", "Redis", "Express"],
    github: "https://github.com/chirayumishra24",
    live: "https://github.com/chirayumishra24",
    codeSnippet: `import Docker from "dockerode";

export async function executeSandbox(code: string): Promise<string> {
  const container = await docker.createContainer({
    Image: "node:alpine-sandbox",
    Cmd: ["node", "-e", code],
    HostConfig: { Memory: 128 * 1024 * 1024, CpuPeriod: 100000 }
  });
  return container.start();
}`
  },
  {
    file: "synthmedia.rs",
    name: "SynthMedia WebAudio Compiler",
    lang: "rust",
    desc: "A client-side Rust-WASM compilation module that generates dynamic synthesized audio buffers and frequency node streams for web media interfaces.",
    metrics: "Generates synthesized audio signals under 5ms, 0% server footprint.",
    challenges: "Minimizing garbage collection interrupts during real-time signal calculations inside the JS-WASM boundary.",
    tech: ["Rust", "WASM", "Web Audio API", "HTML5 Canvas"],
    github: "https://github.com/chirayumishra24",
    live: "https://github.com/chirayumishra24",
    codeSnippet: `use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Oscillator {
    frequency: f32,
    sample_rate: u32,
}

#[wasm_bindgen]
impl Oscillator {
    pub fn next_sample(&mut self) -> f32 {
        // Synthesizer sine wave output calculations
        (self.frequency * 2.0 * std::f32::consts::PI).sin()
    }
}`
  }
];

export default function ProjectsApp() {
  const { playSound } = useSystemSound();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = projects[activeIdx];

  const handleSelectFile = (idx: number) => {
    playSound("click");
    setActiveIdx(idx);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row text-zinc-300 font-mono text-xs select-text">
      {/* File Explorer Sidebar */}
      <div className="w-full md:w-56 bg-zinc-950/60 border-b md:border-b-0 md:border-r border-sys-border flex flex-col shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="h-9 px-3 border-b border-sys-border flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-zinc-400 select-none">
          <Folder size={12} className="text-amber-500" />
          <span>Workspace Explorer</span>
        </div>

        {/* Sidebar Files */}
        <div className="p-2 space-y-0.5">
          <div className="px-2 py-1 text-[9px] uppercase tracking-wider font-bold text-zinc-600 font-sans">Projects</div>
          {projects.map((p, idx) => (
            <button
              key={p.file}
              onClick={() => handleSelectFile(idx)}
              className={clsx(
                "w-full px-2.5 py-1.5 rounded flex items-center gap-2 text-left hover:bg-zinc-900 transition-colors",
                activeIdx === idx ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "text-zinc-400"
              )}
            >
              <FileCode size={13} className={clsx(
                p.lang === "javascript" && "text-yellow-400",
                p.lang === "go" && "text-sky-400",
                p.lang === "typescript" && "text-blue-400",
                p.lang === "rust" && "text-orange-400"
              )} />
              <span>{p.file}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel & Details Viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs bar */}
        <div className="h-9 bg-zinc-950/40 border-b border-sys-border flex items-center px-2 gap-1 select-none">
          {projects.map((p, idx) => (
            <button
              key={p.file}
              onClick={() => handleSelectFile(idx)}
              className={clsx(
                "h-full px-4 flex items-center gap-2 border-r border-sys-border text-[10px] tracking-wide transition-colors",
                activeIdx === idx ? "bg-zinc-950/20 text-sys-accent border-t-2 border-t-sys-accent" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <FileCode size={11} className={clsx(
                p.lang === "javascript" && "text-yellow-400",
                p.lang === "go" && "text-sky-400",
                p.lang === "typescript" && "text-blue-400",
                p.lang === "rust" && "text-orange-400"
              )} />
              <span>{p.file}</span>
            </button>
          ))}
        </div>

        {/* Split View Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
          {/* Left panel: Code Editor View */}
          <div className="flex-1 p-5 bg-zinc-950/10 border-b lg:border-b-0 lg:border-r border-sys-border/40 overflow-y-auto scrollbar-thin">
            <div className="flex items-start gap-4 font-mono text-[11px] leading-relaxed">
              {/* Line Numbers */}
              <div className="text-zinc-600 select-none text-right pr-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              
              {/* Highlighted Code */}
              <pre className="text-zinc-300 whitespace-pre overflow-x-auto flex-1">
                {activeProject.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Right panel: Application Details Info Cards */}
          <div className="w-full lg:w-96 p-5 bg-zinc-950/30 overflow-y-auto flex flex-col justify-between gap-6 font-sans">
            
            {/* Description */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-100">{activeProject.name}</h3>
                <span className="text-[10px] font-bold text-sys-accent uppercase tracking-wider">{activeProject.lang} Module</span>
              </div>
              
              <p className="text-xs leading-relaxed text-sys-text-secondary">{activeProject.desc}</p>
              
              {/* Key Metrics */}
              <div className="space-y-1 p-3 rounded-lg bg-zinc-950/40 border border-sys-border text-[11px]">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 text-[9px] tracking-wider select-none">
                  <Activity size={12} className="text-sys-accent animate-pulse" /> Core Metrics
                </span>
                <p className="text-sys-text-secondary leading-normal">{activeProject.metrics}</p>
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
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-zinc-900 hover:bg-zinc-800 border border-sys-border text-[11px] font-semibold text-zinc-200 transition-colors"
                >
                  <Code2 size={12} />
                  <span>GitHub Repository</span>
                </a>
                <a
                  href={activeProject.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-[11px] transition-colors"
                >
                  <ExternalLink size={12} />
                  <span>Launch Live Demo</span>
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
