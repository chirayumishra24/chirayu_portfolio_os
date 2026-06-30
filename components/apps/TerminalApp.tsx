"use client";

import React, { useEffect, useRef, useState } from "react";
import { useOSStore, ThemeName, AppId } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import confetti from "canvas-confetti";
import { clsx } from "clsx";

export default function TerminalApp() {
  const { setTheme, openWindow, unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<{ type: "input" | "output" | "error" | "success"; text: string }[]>([
    { type: "output", text: "CHIRAYU-OS Terminal [Version 2.26]" },
    { type: "output", text: "Copyright (C) 2026 Chirayu. All rights reserved." },
    { type: "output", text: "Type 'help' to view available system commands, or trigger 'sudo hire chirayu' directly." },
    { type: "output", text: "" }
  ]);

  const [matrixMode, setMatrixMode] = useState(false);

  useEffect(() => {
    // Scroll to bottom on updates
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Intercept events from Command Palette or other apps
  useEffect(() => {
    const handleRemoteExecute = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        executeCommand(customEvent.detail);
      }
    };
    window.addEventListener("terminal-execute", handleRemoteExecute);
    return () => window.removeEventListener("terminal-execute", handleRemoteExecute);
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLogs = [...terminalLogs, { type: "input" as const, text: `chirayu@portfolio:~$ ${trimmed}` }];
    const args = trimmed.split(" ");
    const commandName = args[0].toLowerCase();
    const commandArg = args[1]?.toLowerCase();

    // Add to history
    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);

    // Command Interpreter
    switch (commandName) {
      case "help":
        newLogs.push({
          type: "output",
          text: `Available commands:\n  help         - Show this menu\n  about        - Biography details\n  projects     - List portfolios key projects\n  skills       - Visual technical skills listing\n  experience   - Work timeline history\n  resume       - Launch CV layout\n  contact      - Compose email panel\n  github       - Show repository details\n  theme [name] - Switch visual theme (e.g. theme dracula)\n  clear        - Clear console logs\n  open [app]   - Open desktop app window (e.g. open games)\n  play [game]  - Launch mini game directly (snake, quiz, bughunt)\n  matrix       - Enter digital falling green code stream\n  sudo hire chirayu - Unlock easter egg & hire candidate`
        });
        break;

      case "about":
        newLogs.push({
          type: "output",
          text: `Chirayu is a Passionate Senior Full-Stack Developer specializing in designing immersive product ecosystems, developer CLI tools, and scalable web apps.\nStack: TypeScript, React, Next.js, Node, Go, Docker, AWS, Prisma.\nLocation: Bangalore, India.\n"Building software that feels like an experience."`
        });
        break;

      case "projects":
        newLogs.push({
          type: "output",
          text: `Key Projects:\n1. ChirayuOS   - Next.js Desktop OS Portfolio (Stack: Three.js, Monaco, xterm)\n2. DevForge    - In-browser code compiler and deployment sandbox (TypeScript, Docker)\n3. FlowState   - Collaborative Git branching visualizer (Go, React Flow)\n4. SynthMedia  - Waveform audio editor & Spotify connector (Rust, WebAudio)\n\nType 'open projects' to view project details.`
        });
        break;

      case "skills":
        newLogs.push({
          type: "output",
          text: `Skills Profile:\n  JavaScript/TS  ██████████████████ 95%\n  React/Next.js  █████████████████░ 92%\n  Node.js / Go   ███████████████░░░ 85%\n  SQL/Prisma     ██████████████░░░░ 80%\n  Docker/K8s     ████████████░░░░░░ 70%`
        });
        break;

      case "experience":
        newLogs.push({
          type: "output",
          text: `Work History:\n- Staff Software Architect @ TechCorp (2024 - Present)\n- Senior Fullstack Engineer @ WebCrafters (2022 - 2024)\n- Frontend Engineer @ CodeSandbox (2020 - 2022)`
        });
        break;

      case "resume":
        newLogs.push({ type: "output", text: "Launching Interactive CV window..." });
        setTimeout(() => openWindow("resume"), 300);
        break;

      case "contact":
        newLogs.push({ type: "output", text: "Launching Gmail Mail Compose window..." });
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
          newLogs.push({ type: "error", text: "Usage: open [about | projects | skills | experience | resume | github | playground | contact | spotify | games | settings]" });
        } else {
          const validApps: AppId[] = ["about", "projects", "skills", "experience", "resume", "github", "playground", "contact", "spotify", "games", "settings"];
          if (validApps.includes(commandArg as AppId)) {
            openWindow(commandArg as AppId);
            playSound("success");
            newLogs.push({ type: "success", text: `Launching ${commandArg} application...` });
          } else {
            newLogs.push({ type: "error", text: `Application '${commandArg}' not found.` });
          }
        }
        break;

      case "play":
        newLogs.push({ type: "output", text: "Opening Arcade Games application..." });
        setTimeout(() => openWindow("games"), 300);
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
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
          newLogs.push({
            type: "success",
            text: `★★★★★ ACCESS GRANTED ★★★★★\nThank you for hiring Chirayu! Confetti deployed successfully.\nContract sent to client. Terminal unlocked.`
          });
        } else {
          newLogs.push({ type: "error", text: "Permission denied. Only 'sudo hire chirayu' is recognized." });
        }
        break;

      default:
        newLogs.push({ type: "error", text: `Command not found: '${commandName}'. Type 'help' to see system commands.` });
    }

    setTerminalLogs(newLogs);
    setInput("");
  };

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
      <div className="w-full h-full bg-black text-green-500 font-mono p-4 flex flex-col items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
        <div className="text-center space-y-4 z-10">
          <h2 className="text-2xl font-bold animate-pulse">MATRIX CORE ONLINE</h2>
          <p className="text-xs text-green-700">Digital rain simulation active... Resuming terminal in 8s.</p>
          <div className="w-64 h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-green-900">
            <div className="h-full bg-green-500 rounded-full animate-[progress_8s_linear_infinite]" style={{ width: "100%" }} />
          </div>
        </div>
        
        {/* Animated Digital Rain columns */}
        <div className="absolute inset-0 flex justify-between px-10 opacity-30 select-none pointer-events-none text-xs leading-none overflow-hidden mask-gradient">
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
    <div className="w-full h-full bg-sys-terminal text-sys-terminal-fg font-mono p-4 flex flex-col overflow-y-auto cursor-text select-text h-[calc(100% - 10px)]" onClick={() => document.getElementById("terminal-input")?.focus()}>
      <div className="flex-1 space-y-1 text-xs">
        {terminalLogs.map((log, idx) => (
          <div 
            key={idx} 
            className={clsx(
              "leading-relaxed whitespace-pre-wrap",
              log.type === "input" && "text-zinc-200 font-semibold",
              log.type === "error" && "text-red-400",
              log.type === "success" && "text-green-400",
              log.type === "output" && "text-sys-terminal-fg"
            )}
          >
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt */}
      <div className="flex items-center gap-1.5 text-xs mt-3 select-none">
        <span className="text-green-400 font-bold shrink-0">chirayu@portfolio:~$</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoFocus
          className="flex-1 bg-transparent text-zinc-100 focus:outline-none caret-sys-accent select-text"
        />
      </div>
    </div>
  );
}
