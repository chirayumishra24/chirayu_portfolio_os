"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSStore, AppId, ThemeName } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Search, Terminal, ArrowDown, ArrowUp, CornerDownLeft } from "lucide-react";
import { clsx } from "clsx";

interface CommandItem {
  id: string;
  category: string;
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

export default function CommandPalette() {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    openWindow, 
    setTheme, 
    unlockAchievement 
  } = useOSStore();
  
  const { playSound } = useSystemSound();
  
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl+Shift+P or Cmd+Shift+P
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        playSound("click");
      }
      
      // Toggle with Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        playSound("click");
      }

      // Close with Escape
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, playSound, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      unlockAchievement("Keyboard Ninja");
    }
  }, [commandPaletteOpen, unlockAchievement]);

  if (!commandPaletteOpen) return null;

  const handleLaunchApp = (appId: AppId) => {
    openWindow(appId);
    setCommandPaletteOpen(false);
    playSound("success");
  };

  const handleSetTheme = (themeName: ThemeName) => {
    setTheme(themeName);
    setCommandPaletteOpen(false);
    playSound("theme");
  };

  const handleHireEgg = () => {
    openWindow("terminal");
    setCommandPaletteOpen(false);
    playSound("achievement");
    // Trigger hire command in terminal after small delay
    setTimeout(() => {
      const event = new CustomEvent("terminal-execute", { detail: "sudo hire chirayu" });
      window.dispatchEvent(event);
    }, 300);
  };

  const handleMatrixEgg = () => {
    openWindow("terminal");
    setCommandPaletteOpen(false);
    playSound("theme");
    setTimeout(() => {
      const event = new CustomEvent("terminal-execute", { detail: "matrix" });
      window.dispatchEvent(event);
    }, 300);
  };

  const handleRecruiterMode = () => {
    setCommandPaletteOpen(false);
    playSound("click");
    window.dispatchEvent(new Event("open-recruiter-mode"));
  };

  const commandsList: CommandItem[] = [
    { id: "quick-recruiter", category: "Quick Actions", label: "Open Recruiter Mode summary", action: handleRecruiterMode },
    { id: "app-about", category: "Applications", label: "Open About Me (System Info)", action: () => handleLaunchApp("about") },
    { id: "app-projects", category: "Applications", label: "Open Projects Explorer (VS Code)", action: () => handleLaunchApp("projects") },
    { id: "app-skills", category: "Applications", label: "Open Skills Tree (Brain Graph)", action: () => handleLaunchApp("skills") },
    { id: "app-experience", category: "Applications", label: "Open Experience git-log", action: () => handleLaunchApp("experience") },
    { id: "app-resume", category: "Applications", label: "Open Interactive CV (PDF/Print)", action: () => handleLaunchApp("resume") },
    { id: "app-github", category: "Applications", label: "Open GitHub Dashboard (Analytics)", action: () => handleLaunchApp("github") },
    { id: "app-terminal", category: "Applications", label: "Open Terminal (xterm.js)", action: () => handleLaunchApp("terminal") },
    { id: "app-playground", category: "Applications", label: "Open JavaScript Sandbox", action: () => handleLaunchApp("playground") },
    { id: "app-contact", category: "Applications", label: "Open Mail Compose (Gmail client)", action: () => handleLaunchApp("contact") },
    { id: "app-spotify", category: "Applications", label: "Open Spotify Player", action: () => handleLaunchApp("spotify") },
    { id: "app-games", category: "Applications", label: "Open Arcade Games Center", action: () => handleLaunchApp("games") },
    { id: "app-settings", category: "Applications", label: "Open System Preferences", action: () => handleLaunchApp("settings") },
    { id: "app-filemanager", category: "Applications", label: "Open File Manager (GitHub Explorer)", action: () => handleLaunchApp("filemanager") },
    
    { id: "theme-tokyonight", category: "Themes", label: "Switch Theme: Tokyo Night", action: () => handleSetTheme("tokyonight") },
    { id: "theme-onedark", category: "Themes", label: "Switch Theme: One Dark", action: () => handleSetTheme("onedark") },
    { id: "theme-dracula", category: "Themes", label: "Switch Theme: Dracula", action: () => handleSetTheme("dracula") },
    { id: "theme-nord", category: "Themes", label: "Switch Theme: Nord", action: () => handleSetTheme("nord") },
    { id: "theme-githublight", category: "Themes", label: "Switch Theme: GitHub Light", action: () => handleSetTheme("githublight") },
    { id: "theme-catppuccin", category: "Themes", label: "Switch Theme: Catppuccin Mocha", action: () => handleSetTheme("catppuccin") },
    { id: "theme-cyberpunk", category: "Themes", label: "Switch Theme: Cyberpunk Neon", action: () => handleSetTheme("cyberpunk") },
    { id: "theme-matrix", category: "Themes", label: "Switch Theme: Matrix Terminal Mode", action: () => handleSetTheme("matrix") },
    { id: "theme-minimalwhite", category: "Themes", label: "Switch Theme: Minimal White", action: () => handleSetTheme("minimalwhite") },
    { id: "theme-midnightblue", category: "Themes", label: "Switch Theme: Midnight Blue", action: () => handleSetTheme("midnightblue") },
    { id: "theme-kratos", category: "Themes", label: "Switch Theme: Kratos (God of War)", action: () => handleSetTheme("kratos") },
    { id: "theme-spiderverse", category: "Themes", label: "Switch Theme: Spiderverse", action: () => handleSetTheme("spiderverse") },
    { id: "theme-heisenberg", category: "Themes", label: "Switch Theme: Heisenberg", action: () => handleSetTheme("heisenberg") },
    { id: "theme-hazmat", category: "Themes", label: "Switch Theme: Hazmat Suit", action: () => handleSetTheme("hazmat") },
    { id: "theme-tonystark", category: "Themes", label: "Switch Theme: Tony Stark (Iron Man)", action: () => handleSetTheme("tonystark") },
    { id: "theme-thor", category: "Themes", label: "Switch Theme: Thor (Asgard Lightning)", action: () => handleSetTheme("thor") },
    { id: "theme-johnwick", category: "Themes", label: "Switch Theme: John Wick", action: () => handleSetTheme("johnwick") },

    { id: "egg-hire", category: "Easter Eggs", label: "Trigger: sudo hire chirayu", action: handleHireEgg },
    { id: "egg-matrix", category: "Easter Eggs", label: "Trigger: matrix falling rain", action: handleMatrixEgg },
  ];

  const filteredCommands = commandsList.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredCommands.length === 0) return;
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredCommands.length === 0) return;
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-start justify-center bg-black/60 px-2 pt-14 font-sans backdrop-blur-sm select-none sm:px-4 sm:pt-[12vh]">
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-sys-accent/30 bg-zinc-950/90 shadow-2xl animate-in zoom-in-95 duration-150 sm:max-h-[70dvh]"
      >
        {/* Input Bar */}
        <div className="flex min-h-14 items-center gap-3 border-b border-sys-border bg-zinc-950/40 px-3 sm:px-4">
          <Search size={18} className="text-sys-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search portfolio..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="hidden rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400 shadow sm:inline">ESC</kbd>
        </div>

        {/* Results Area */}
        <div className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={clsx(
                    "w-full rounded-lg px-3.5 py-3 text-left transition-all duration-100 sm:py-2.5",
                    isSelected ? "bg-sys-accent/20 text-sys-accent shadow-sm" : "text-zinc-400 hover:bg-zinc-900/40"
                  )}
                >
                  <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <Terminal size={14} className={clsx(isSelected ? "text-sys-accent" : "text-zinc-600")} />
                      <span className="text-xs font-medium leading-snug">{cmd.label}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      <span className={clsx(
                        "text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold border",
                        isSelected ? "bg-sys-accent/15 border-sys-accent/30 text-sys-accent" : "bg-zinc-900/50 border-zinc-800/80 text-zinc-500"
                      )}>
                        {cmd.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft size={10} className="text-sys-accent animate-pulse" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-zinc-500 font-medium">
              No system commands found for &quot;{search}&quot;
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex min-h-9 items-center justify-between gap-3 border-t border-sys-border bg-zinc-950/60 px-3 py-2 text-[10px] text-zinc-500 sm:px-4 sm:py-0">
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1"><ArrowUp size={10} /><ArrowDown size={10} /> Navigate</span>
            <span className="flex items-center gap-1"><CornerDownLeft size={10} /> Execute</span>
          </div>
          <span className="font-semibold text-sys-accent/80">Quick Menu</span>
        </div>
      </div>
    </div>
  );
}
