"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSStore, ThemeName, AppId } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Monitor, RefreshCw, Terminal } from "lucide-react";

export default function ContextMenu() {
  const { setTheme, resetWindows, openWindow, unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();
  
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Only show if clicking the desktop background, not inside a window/taskbar
      const target = e.target as HTMLElement;
      if (
        target.closest(".glass-panel") || 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") || 
        target.closest("textarea")
      ) {
        return;
      }
      
      e.preventDefault();
      setVisible(true);
      
      // Keep menu inside screen boundaries
      const x = Math.min(e.clientX, window.innerWidth - 180);
      const y = Math.min(e.clientY, window.innerHeight - 200);
      
      setPosition({ x, y });
      playSound("click");
      unlockAchievement("Curious Inspector");
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  const handleOpenApp = (id: AppId) => {
    openWindow(id);
    setVisible(false);
  };

  const handleChangeTheme = (name: ThemeName) => {
    playSound("theme");
    setTheme(name);
    setVisible(false);
  };

  const handleReload = () => {
    playSound("success");
    resetWindows();
    setVisible(false);
  };

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="absolute w-44 rounded-xl border border-sys-border bg-zinc-950/80 backdrop-blur-xl py-1.5 shadow-2xl z-[99999] select-none text-[11px] text-sys-text-primary font-sans"
    >
      <button
        onClick={() => handleOpenApp("terminal")}
        className="w-full text-left px-3.5 py-2 hover:bg-zinc-900 flex items-center gap-2 text-sys-accent transition-colors"
      >
        <Terminal size={12} />
        Open Terminal
      </button>

      <button
        onClick={() => handleOpenApp("settings")}
        className="w-full text-left px-3.5 py-2 hover:bg-zinc-900 flex items-center gap-2 transition-colors"
      >
        <Monitor size={12} />
        System Preferences
      </button>

      <button
        onClick={handleReload}
        className="w-full text-left px-3.5 py-2 hover:bg-zinc-900 border-b border-sys-border/50 pb-2 flex items-center gap-2 transition-colors"
      >
        <RefreshCw size={12} />
        Clean Desktop Layout
      </button>

      {/* Subheading */}
      <div className="px-3.5 py-1 text-[9px] text-sys-text-secondary uppercase font-bold tracking-wider pt-2.5">
        Switch Theme
      </div>

      <button
        onClick={() => handleChangeTheme("tokyonight")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors"
      >
        Tokyo Night
      </button>
      <button
        onClick={() => handleChangeTheme("dracula")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors"
      >
        Dracula
      </button>
      <button
        onClick={() => handleChangeTheme("cyberpunk")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors"
      >
        Cyberpunk
      </button>
      <button
        onClick={() => handleChangeTheme("kratos")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors font-semibold text-red-400"
      >
        Kratos
      </button>
      <button
        onClick={() => handleChangeTheme("spiderverse")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors font-semibold text-rose-400"
      >
        Spiderverse
      </button>
      <button
        onClick={() => handleChangeTheme("heisenberg")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors font-semibold text-amber-400"
      >
        Heisenberg
      </button>
      <button
        onClick={() => handleChangeTheme("johnwick")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors font-semibold text-yellow-400"
      >
        John Wick
      </button>
      <button
        onClick={() => handleChangeTheme("githublight")}
        className="w-full text-left px-3.5 py-1.5 hover:bg-zinc-900 pl-6 transition-colors"
      >
        GitHub Light
      </button>
    </div>
  );
}
