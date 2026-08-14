"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOSStore, ThemeName, AppId } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import confetti from "canvas-confetti";
import { clsx } from "clsx";
import { experienceEntries, profile, projects } from "../../data/portfolio";
import { Terminal as TerminalIcon, Sparkles } from "lucide-react";

export default function TerminalApp() {
  const { setTheme, openWindow, unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<{ type: "input" | "output" | "error" | "success"; text: string }[]>([
    { type: "output", text: "CHIRAYU-OS Terminal [Version 2.26]" },
    { type: "output", text: "Copyright (C) 2026 Chirayu Mishra. All rights reserved." },
    { type: "output", text: "Type 'help' or tap any quick action chip below to run commands." },
    { type: "output", text: "" }
  ]);

  const [matrixMode, setMatrixMode] = useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Quick Command Chips for mobile/desktop
  const quickCommands = [
    { label: "help", cmd: "help" },
    { label: "about", cmd: "about" },
    { label: "projects", cmd: "projects" },
    { label: "sudo hire chirayu", cmd: "sudo hire chirayu", highlight: true },
    { label: "theme dracula", cmd: "theme dracula" },
    { label: "theme kratos", cmd: "theme kratos" },
    { label: "matrix", cmd: "matrix" },
    { label: "clear", cmd: "clear" },
  ];

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLogs = [...terminalLogs, { type: "input" as const, text: `chirayu@portfolio:~$ ${trimmed}` }];
    const args = trimmed.split(" ");
    const commandName = args[0].toLowerCase();
    const commandArg = args[1]?.toLowerCase();

    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);

    switch (commandName) {
      case "help":
        newLogs.push({
          type: "output",
          text: `Available commands:\n  help         - Show this menu\n  about        - Biography details\n  projects     - List verified key projects\n  skills       - Technical skills overview\n  experience   - Work timeline history\n  resume       - Launch CV layout\n  contact      - Compose email panel\n  github       - Show repository stats\n  theme [name] - Switch visual theme (e.g. theme dracula)\n  clear        - Clear console logs\n  open [app]   - Open desktop app window\n  matrix       - Enter digital falling green code stream\n  sudo hire chirayu - Trigger hire candidate celebration`
        });
        break;

      case "about":
        newLogs.push({
          type: "output",
          text: `${profile.name} is a ${profile.role}.\nFocus: ${profile.focusTags.slice(0, 6).join(", ")}.\nLocation: ${profile.location}.\n${profile.headline}`
        });
        break;

      case "projects":
        newLogs.push({
          type: "output",
          text: `Verified Projects:\n${projects.map((project, index) => `${index + 1}. ${project.name} - ${project.description}`).join("\n")}\n\nType 'open projects' to view project details.`
        });
        break;

      case "skills":
        newLogs.push({
          type: "output",
          text: `Skills Profile:\n${profile.focusTags.map((tag) => `  - ${tag}`).join("\n")}`
        });
        break;

      case "experience":
        newLogs.push({
          type: "output",
          text: `Work History:\n${experienceEntries.map((entry) => `- ${entry.role} @ ${entry.company} (${entry.duration})`).join("\n")}`
        });
        break;

      case "resume":
        newLogs.push({ type: "output", text: "Launching Interactive CV window..." });
        setTimeout(() => openWindow("resume"), 300);
        break;

      case "contact":
        newLogs.push({ type: "output", text: "Launching Mail Compose window..." });
        setTimeout(() => openWindow("contact"), 300);
        break;

      case "github":
        newLogs.push({ type: "output", text: "Opening GitHub Dashboard analyzer..." });
        setTimeout(() => openWindow("github"), 300);
        break;

      case "clear":
        setTerminalLogs([]);
        setInput("");
        return;

      case "theme":
        if (!commandArg) {
          newLogs.push({ type: "error", text: "Usage: theme [tokyonight | onedark | dracula | nord | githublight | catppuccin | cyberpunk | matrix | kratos | spiderverse | heisenberg | hazmat | tonystark | thor | johnwick]" });
        } else {
          const themes: ThemeName[] = [
            "tokyonight", "onedark", "dracula", "nord", "githublight", "catppuccin", "cyberpunk", "matrix", "minimalwhite", "midnightblue",
            "kratos", "spiderverse", "heisenberg", "hazmat", "tonystark", "thor", "johnwick"
          ];
          if (themes.includes(commandArg as ThemeName)) {
            setTheme(commandArg as ThemeName);
            playSound("theme");
            newLogs.push({ type: "success", text: `Theme successfully switched to: ${commandArg}` });
          } else {
            newLogs.push({ type: "error", text: `Theme '${commandArg}' not recognized. Try 'theme kratos'` });
          }
        }
        break;

      case "open":
        if (!commandArg) {
          newLogs.push({ type: "error", text: "Usage: open [about | projects | skills | experience | resume | github | playground | contact | spotify | games | settings | filemanager | deployments]" });
        } else {
          const validApps: AppId[] = ["about", "projects", "skills", "experience", "resume", "github", "playground", "contact", "spotify", "games", "settings", "filemanager", "deployments"];
          if (validApps.includes(commandArg as AppId)) {
            openWindow(commandArg as AppId);
            playSound("success");
            newLogs.push({ type: "success", text: `Launching ${commandArg} application...` });
          } else {
            newLogs.push({ type: "error", text: `Application '${commandArg}' not found.` });
          }
        }
        break;

      case "matrix":
        setMatrixMode(true);
        unlockAchievement("Matrix Modder");
        playSound("theme");
        setTimeout(() => {
          setMatrixMode(false);
          setTerminalLogs((prev) => [...prev, { type: "success", text: "Exited digital rain session." }]);
        }, 8000);
        break;

      case "sudo":
        if (args[1]?.toLowerCase() === "hire" && args[2]?.toLowerCase() === "chirayu") {
          playSound("achievement");
          unlockAchievement("Hired Chirayu!");
          confetti({
            particleCount: 160,
            spread: 85,
            origin: { y: 0.6 }
          });
          newLogs.push({
            type: "success",
            text: `★★★★★ ACCESS GRANTED ★★★★★\nThank you for hiring Chirayu! Confetti deployed successfully.\nContract packet sent. System unlocked.`
          });
        } else {
          newLogs.push({ type: "error", text: "Permission denied. Try 'sudo hire chirayu'." });
        }
        break;

      default:
        newLogs.push({ type: "error", text: `Command not found: '${commandName}'. Type 'help' to see commands.` });
    }

    setTerminalLogs(newLogs);
    setInput("");
  }, [openWindow, playSound, setTheme, terminalLogs, unlockAchievement]);

  useEffect(() => {
    const handleRemoteExecute = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        executeCommand(customEvent.detail);
      }
    };
    window.addEventListener("terminal-execute", handleRemoteExecute);
    return () => window.removeEventListener("terminal-execute", handleRemoteExecute);
  }, [executeCommand]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      playSound("click");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setTerminalLogs([]);
      setInput("");
    }
  };

  if (matrixMode) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black p-4 font-mono text-green-500">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
        <div className="text-center space-y-4 z-10">
          <h2 className="text-center text-xl font-bold animate-pulse sm:text-2xl">MATRIX CORE ONLINE</h2>
          <p className="text-xs text-green-700">Digital rain simulation active... Resuming terminal in 8s.</p>
          <div className="mx-auto h-1.5 w-full max-w-64 overflow-hidden rounded-full border border-green-900 bg-zinc-950">
            <div className="h-full bg-green-500 rounded-full animate-[progress_8s_linear_infinite]" style={{ width: "100%" }} />
          </div>
        </div>
        
        <div className="absolute inset-0 flex justify-between overflow-hidden px-4 text-xs leading-none opacity-30 select-none pointer-events-none sm:px-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="animate-[matrix-fall_5s_linear_infinite] whitespace-pre" style={{ animationDelay: `${i * 0.3}s` }}>
              {Array.from({ length: 40 }).map(() => String.fromCharCode(33 + Math.floor(Math.random() * 93))).join("\n")}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex h-full w-full cursor-text flex-col justify-between overflow-hidden bg-sys-terminal p-3 font-mono text-sys-terminal-fg select-text sm:p-4" 
      onClick={() => document.getElementById("terminal-input")?.focus()}
    >
      {/* Logs Scroll Area */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-1 text-[11px] sm:text-xs pr-1 overscroll-contain scrollbar-thin">
        {terminalLogs.map((log, idx) => (
          <div 
            key={idx} 
            className={clsx(
              "leading-relaxed whitespace-pre-wrap",
              log.type === "input" && "text-zinc-100 font-bold",
              log.type === "error" && "text-red-400",
              log.type === "success" && "text-emerald-400 font-semibold",
              log.type === "output" && "text-sys-terminal-fg"
            )}
          >
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Bottom Area: Input Prompt + Quick Action Chips */}
      <div className="mt-2 border-t border-sys-border/50 pt-2 space-y-2 shrink-0 select-none">
        
        {/* Quick Command Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickCommands.map((item) => (
            <button
              key={item.cmd}
              type="button"
              onClick={() => {
                executeCommand(item.cmd);
                playSound("click");
              }}
              className={clsx(
                "px-2.5 py-1 rounded-lg text-[10px] font-mono shrink-0 transition-all active:scale-95 border",
                item.highlight 
                  ? "bg-sys-accent/20 border-sys-accent/50 text-sys-accent font-bold"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              )}
            >
              {item.highlight && <Sparkles size={10} className="inline mr-1 animate-pulse" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Real Shell Prompt Input */}
        <div className="flex items-center gap-2 text-xs">
          <span className="shrink-0 font-bold text-emerald-400 flex items-center gap-1">
            <TerminalIcon size={12} className="hidden sm:inline" />
            chirayu@os:~$
          </span>
          <input
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-zinc-100 caret-sys-accent focus:outline-none select-text text-xs"
          />
        </div>
      </div>
    </div>
  );
}
