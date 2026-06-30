"use client";

import React, { useState, useEffect } from "react";
import { AppId, useOSStore, ThemeName } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  User, Folder, Brain, GitBranch, FileText, Code2, 
  Terminal, Play, Mail, Music, Gamepad2, Settings, 
  Volume2, VolumeX, Sun, Clock, Power, ShieldCheck
} from "lucide-react";
import { clsx } from "clsx";

export default function Taskbar() {
  const { 
    theme, setTheme, 
    soundMuted, toggleSoundMuted, 
    soundVolume, setSoundVolume,
    windows, openWindow, resetWindows,
    setBootState
  } = useOSStore();
  const { playSound } = useSystemSound();

  const [timeStr, setTimeStr] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const appsList: { id: AppId; label: string; icon: React.ReactNode }[] = [
    { id: "about", label: "About Me", icon: <User size={20} /> },
    { id: "projects", label: "Projects Explorer", icon: <Folder size={20} /> },
    { id: "skills", label: "Skills Tree", icon: <Brain size={20} /> },
    { id: "experience", label: "Experience log", icon: <GitBranch size={20} /> },
    { id: "resume", label: "Interactive CV", icon: <FileText size={20} /> },
    { id: "github", label: "GitHub Dashboard", icon: <Code2 size={20} /> },
    { id: "terminal", label: "Terminal", icon: <Terminal size={20} /> },
    { id: "playground", label: "JS Sandbox", icon: <Play size={20} /> },
    { id: "contact", label: "Mail Compose", icon: <Mail size={20} /> },
    { id: "spotify", label: "Music Player", icon: <Music size={20} /> },
    { id: "games", label: "Arcade Games", icon: <Gamepad2 size={20} /> },
    { id: "settings", label: "System Preferences", icon: <Settings size={20} /> },
  ];

  const handleAppClick = (id: AppId) => {
    playSound("click");
    openWindow(id);
  };

  const themesList: { name: ThemeName; label: string; bg: string }[] = [
    { name: "tokyonight", label: "Tokyo Night", bg: "bg-indigo-600" },
    { name: "onedark", label: "One Dark", bg: "bg-stone-700" },
    { name: "dracula", label: "Dracula", bg: "bg-purple-600" },
    { name: "nord", label: "Nord", bg: "bg-sky-400" },
    { name: "githublight", label: "GitHub Light", bg: "bg-zinc-200" },
    { name: "catppuccin", label: "Catppuccin", bg: "bg-pink-300" },
    { name: "cyberpunk", label: "Cyberpunk", bg: "bg-yellow-400" },
    { name: "matrix", label: "Matrix", bg: "bg-green-600" },
    { name: "minimalwhite", label: "Minimal White", bg: "bg-white border border-zinc-300" },
    { name: "midnightblue", label: "Midnight Blue", bg: "bg-blue-900" },
  ];

  const handleThemeChange = (newTheme: ThemeName) => {
    playSound("theme");
    setTheme(newTheme);
  };

  const handleRestart = () => {
    playSound("error");
    setBootState("booting");
  };

  return (
    <div className="h-12 w-full fixed bottom-0 left-0 bg-sys-taskbar border-t border-sys-border backdrop-blur-xl flex items-center justify-between px-6 z-[9999] select-none">
      {/* Start Button & Quick Stats */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleRestart}
          className="h-8 w-8 rounded-lg bg-zinc-950/50 hover:bg-zinc-950 text-sys-accent flex items-center justify-center border border-sys-border hover:border-sys-border-active transition-all duration-150 group"
          title="Restart OS"
        >
          <Power size={15} className="group-hover:rotate-12 transition-transform" />
        </button>
        <span className="text-xs font-semibold tracking-widest text-sys-text-primary hidden sm:inline-block">CHIRAYU_OS</span>
      </div>

      {/* Dock Area (Central App Icons) */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-950/20 border border-sys-border/35 shadow-inner max-w-[50%] sm:max-w-[65%] md:max-w-none overflow-x-auto scrollbar-none">
        {appsList.map((app) => {
          const isOpen = windows[app.id]?.isOpen;
          const isActive = windows[app.id]?.zIndex > 1 && isOpen;

          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={clsx(
                "relative group p-2 rounded-lg text-sys-text-secondary hover:text-sys-accent hover:bg-zinc-950/40 hover:-translate-y-0.5 transition-all duration-200",
                isActive && "text-sys-accent bg-zinc-950/30"
              )}
            >
              {app.icon}
              
              {/* Tooltip */}
              <span className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-zinc-950 text-zinc-100 text-[10px] py-1 px-2 rounded border border-zinc-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl">
                {app.label}
              </span>

              {/* Status Dot */}
              {isOpen && (
                <span className={clsx(
                  "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-sys-accent scale-110 shadow-sm shadow-sys-accent" : "bg-sys-text-secondary opacity-60"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Clock & System Settings Dropdown */}
      <div className="flex items-center gap-4 relative">
        {/* Toggle Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={clsx(
            "flex items-center gap-2 px-2.5 py-1 rounded-lg text-sys-text-primary hover:bg-zinc-950/30 transition-all duration-150 border border-transparent",
            showSettings && "bg-zinc-950/30 border-sys-border-active"
          )}
        >
          <Clock size={14} className="text-sys-accent" />
          <span className="text-xs font-semibold tracking-wider font-mono">{timeStr}</span>
        </button>

        {/* Quick Settings Drawer */}
        {showSettings && (
          <div className="absolute bottom-14 right-0 w-[calc(100vw-32px)] sm:w-80 p-5 rounded-2xl glass-panel border border-sys-border-active shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* Quick Title */}
            <div className="flex items-center justify-between border-b border-sys-border pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-sys-text-primary">System Dashboard</span>
              <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                <ShieldCheck size={12} /> SECURE
              </span>
            </div>

            {/* Volume Control */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-sys-text-secondary">
                <span>Sound Volume</span>
                <span>{soundMuted ? "Muted" : `${soundVolume}%`}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSoundMuted}
                  className="p-1.5 rounded-lg bg-zinc-950/40 text-sys-accent hover:bg-zinc-950 transition-colors border border-sys-border"
                >
                  {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-zinc-950/60 rounded-lg appearance-none cursor-pointer accent-sys-accent"
                />
              </div>
            </div>

            {/* Theme Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-sys-text-secondary">
                <span>Active Desktop Theme</span>
                <span className="text-[10px] uppercase font-bold text-sys-accent">{theme}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {themesList.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleThemeChange(t.name)}
                    className={clsx(
                      "h-7 rounded-md transition-all duration-150 flex items-center justify-center relative hover:scale-105 shadow",
                      t.bg,
                      theme === t.name ? "ring-2 ring-sys-accent shadow-md shadow-sys-accent/20" : "opacity-80 hover:opacity-100"
                    )}
                    title={t.label}
                  >
                    {t.name === "githublight" || t.name === "minimalwhite" ? (
                      <Sun size={12} className="text-zinc-900" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Utility Actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-sys-border pt-3">
              <button
                onClick={() => { resetWindows(); setShowSettings(false); playSound("success"); }}
                className="py-1.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-950 border border-sys-border text-[11px] font-semibold text-sys-text-primary text-center transition-colors"
              >
                Reset Windows
              </button>
              <button
                onClick={() => { handleRestart(); setShowSettings(false); }}
                className="py-1.5 rounded-lg bg-red-650/10 hover:bg-red-650/20 border border-red-500/20 text-red-400 text-[11px] font-semibold text-center transition-colors"
              >
                Sign Out / Boot OS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
