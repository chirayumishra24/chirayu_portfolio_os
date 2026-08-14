"use client";

import React, { useState, useEffect } from "react";
import { AppId, useOSStore, ThemeName } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { 
  User, Folder, Brain, GitBranch, FileText, Code2, 
  Terminal, Play, Mail, Music, Gamepad2, Settings, 
  Volume2, VolumeX, Sun, Clock, Power, ShieldCheck, FolderOpen,
  LayoutGrid, X, Search, Globe
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
  const { isMobile } = useResponsiveMode();

  const [timeStr, setTimeStr] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAppDrawer, setShowAppDrawer] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const allApps: { id: AppId; label: string; icon: React.ReactNode; category: string }[] = [
    { id: "about", label: "About Me", icon: <User size={20} />, category: "Profile" },
    { id: "projects", label: "Projects Explorer", icon: <Folder size={20} />, category: "Work" },
    { id: "skills", label: "Skills Tree", icon: <Brain size={20} />, category: "Profile" },
    { id: "experience", label: "Experience log", icon: <GitBranch size={20} />, category: "Work" },
    { id: "resume", label: "Interactive CV", icon: <FileText size={20} />, category: "Profile" },
    { id: "github", label: "GitHub Dashboard", icon: <Code2 size={20} />, category: "Work" },
    { id: "terminal", label: "Terminal", icon: <Terminal size={20} />, category: "Developer" },
    { id: "playground", label: "JS Sandbox", icon: <Play size={20} />, category: "Developer" },
    { id: "filemanager", label: "File Manager", icon: <FolderOpen size={20} />, category: "Developer" },
    { id: "deployments", label: "Vercel Deployments", icon: <Globe size={20} />, category: "Work" },
    { id: "contact", label: "Mail Compose", icon: <Mail size={20} />, category: "Connect" },
    { id: "spotify", label: "Music Player", icon: <Music size={20} />, category: "Media" },
    { id: "games", label: "Arcade Games", icon: <Gamepad2 size={20} />, category: "Media" },
    { id: "settings", label: "Preferences", icon: <Settings size={20} />, category: "System" },
  ];

  // Mobile quick dock apps (most accessed)
  const mobileQuickAppIds: AppId[] = ["about", "projects", "terminal", "contact"];
  const mobileQuickApps = allApps.filter((a) => mobileQuickAppIds.includes(a.id));

  const handleAppClick = (id: AppId) => {
    playSound("click");
    openWindow(id);
    setShowAppDrawer(false);
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
    { name: "kratos", label: "Kratos", bg: "bg-red-800" },
    { name: "spiderverse", label: "Spiderverse", bg: "bg-rose-600" },
    { name: "heisenberg", label: "Heisenberg", bg: "bg-amber-600" },
    { name: "hazmat", label: "Hazmat Suit", bg: "bg-lime-500" },
    { name: "tonystark", label: "Tony Stark", bg: "bg-red-650" },
    { name: "thor", label: "Thor", bg: "bg-cyan-500" },
    { name: "johnwick", label: "John Wick", bg: "bg-yellow-400" },
  ];

  const handleThemeChange = (newTheme: ThemeName) => {
    playSound("theme");
    setTheme(newTheme);
  };

  const handleRestart = () => {
    playSound("error");
    setBootState("booting");
  };

  const filteredDrawerApps = allApps.filter((app) =>
    app.label.toLowerCase().includes(drawerSearch.toLowerCase()) ||
    app.category.toLowerCase().includes(drawerSearch.toLowerCase())
  );

  return (
    <>
      {/* Mobile App Drawer Modal / Sheet */}
      {showAppDrawer && (
        <div className="fixed inset-0 z-[99998] flex items-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowAppDrawer(false)} />
          <div className="relative z-10 w-full max-h-[85dvh] flex flex-col rounded-t-3xl border-t border-sys-border bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl glass-panel pb-[calc(var(--dock-height)+var(--safe-bottom)+1rem)]">
            
            {/* Sheet Handle */}
            <div className="w-12 h-1 rounded-full bg-zinc-600 mx-auto mb-3" />
            
            {/* Header with Search */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-sys-border">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-sys-border">
                <Search size={15} className="text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search portfolio apps..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowAppDrawer(false)}
                className="p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400"
                aria-label="Close app drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Apps Grid in Drawer */}
            <div className="flex-1 overflow-y-auto pt-4 grid grid-cols-3 gap-3 min-[380px]:grid-cols-4 overscroll-contain">
              {filteredDrawerApps.map((app) => {
                const isOpen = windows[app.id]?.isOpen;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-sys-border/40 bg-zinc-900/30 hover:bg-zinc-900 active:scale-95 transition-all text-center group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sys-accent/20 to-purple-500/20 border border-sys-accent/30 flex items-center justify-center text-sys-accent group-hover:scale-110 transition-transform">
                      {app.icon}
                    </div>
                    <span className="text-[11px] font-medium text-zinc-200 truncate max-w-full">
                      {app.label}
                    </span>
                    {isOpen && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sys-accent shadow-sm shadow-sys-accent -mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Dock Bar */}
      <div className="fixed bottom-0 left-0 z-[9999] flex h-[calc(var(--dock-height)+var(--safe-bottom))] w-full items-center justify-between gap-2 border-t border-sys-border bg-sys-taskbar px-2 pb-[var(--safe-bottom)] backdrop-blur-xl select-none sm:px-6">
        
        {/* Start Button / Power */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={handleRestart}
            className="touch-target flex h-9 w-9 items-center justify-center rounded-lg border border-sys-border bg-zinc-950/50 text-sys-accent transition-all duration-150 hover:border-sys-border-active hover:bg-zinc-950 active:scale-95 group sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0"
            title="Restart OS"
          >
            <Power size={15} className="group-hover:rotate-12 transition-transform" />
          </button>
          <span className="text-xs font-semibold tracking-widest text-sys-text-primary hidden sm:inline-block">CHIRAYU_OS</span>
        </div>

        {/* Central Dock Area */}
        {isMobile ? (
          /* Mobile Focused Dock: Quick icons + All Apps Drawer button */
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            {mobileQuickApps.map((app) => {
              const isOpen = windows[app.id]?.isOpen;
              const isActive = windows[app.id]?.zIndex > 1 && isOpen;
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  aria-label={`Open ${app.label}`}
                  className={clsx(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-150 active:scale-95",
                    isActive ? "bg-sys-accent/20 text-sys-accent border border-sys-accent/40" : "text-zinc-300 hover:bg-zinc-900/40"
                  )}
                >
                  {app.icon}
                  {isOpen && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-sys-accent" />
                  )}
                </button>
              );
            })}

            {/* Mobile All Apps Launcher button */}
            <button
              onClick={() => { playSound("click"); setShowAppDrawer(!showAppDrawer); }}
              aria-label="All applications"
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-150 active:scale-95 border",
                showAppDrawer ? "bg-sys-accent text-zinc-950 border-sys-accent shadow-md shadow-sys-accent/30" : "bg-zinc-900/60 border-sys-border text-sys-accent hover:bg-zinc-900"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        ) : (
          /* Desktop Scrollable/Mac-style Dock with all 13 apps */
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto rounded-xl border border-sys-border/35 bg-zinc-950/20 p-1 shadow-inner scrollbar-none sm:gap-2">
            {allApps.map((app) => {
              const isOpen = windows[app.id]?.isOpen;
              const isActive = windows[app.id]?.zIndex > 1 && isOpen;

              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className={clsx(
                    "relative flex items-center justify-center rounded-lg p-2 text-sys-text-secondary transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-950/50 hover:text-sys-accent group active:scale-90",
                    isActive && "text-sys-accent bg-zinc-950/40"
                  )}
                >
                  {app.icon}
                  
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute bottom-12 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-100 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 md:block">
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
        )}

        {/* Clock & System Settings Dropdown */}
        <div className="relative flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={clsx(
              "touch-target flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-sys-text-primary transition-all duration-150 hover:bg-zinc-950/30 sm:min-h-0 sm:min-w-0",
              showSettings && "bg-zinc-950/40 border-sys-border-active"
            )}
          >
            <Clock size={14} className="text-sys-accent" />
            <span className="text-xs font-semibold tracking-wider font-mono hidden min-[360px]:inline">{timeStr}</span>
          </button>

          {/* Quick Settings Drawer */}
          {showSettings && (
            <div className="absolute bottom-[calc(var(--dock-height)+var(--safe-bottom)+0.5rem)] right-0 flex w-[calc(100vw-1rem)] max-w-80 flex-col gap-4 rounded-2xl border border-sys-border-active p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 glass-panel sm:w-80 sm:p-5 z-[99999]">
              {/* Quick Title */}
              <div className="flex items-center justify-between border-b border-sys-border pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-sys-text-primary">System Quick Controls</span>
                <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                  <ShieldCheck size={12} /> OK
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
                    className="p-2 rounded-lg bg-zinc-950/40 text-sys-accent hover:bg-zinc-950 transition-colors border border-sys-border active:scale-95"
                  >
                    {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-zinc-950/60 rounded-lg appearance-none cursor-pointer accent-sys-accent"
                  />
                </div>
              </div>

              {/* Theme Grid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-sys-text-secondary">
                  <span>Active Theme</span>
                  <span className="text-[10px] uppercase font-bold text-sys-accent">{theme}</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {themesList.slice(0, 12).map((t) => (
                    <button
                      key={t.name}
                      onClick={() => handleThemeChange(t.name)}
                      className={clsx(
                        "h-6 rounded-md transition-all duration-150 flex items-center justify-center relative active:scale-90 shadow",
                        t.bg,
                        theme === t.name ? "ring-2 ring-sys-accent shadow-md shadow-sys-accent/20" : "opacity-80 hover:opacity-100"
                      )}
                      title={t.label}
                    >
                      {t.name === "githublight" || t.name === "minimalwhite" ? (
                        <Sun size={10} className="text-zinc-900" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility Actions */}
              <div className="grid grid-cols-2 gap-2 border-t border-sys-border pt-3">
                <button
                  onClick={() => { resetWindows(); setShowSettings(false); playSound("success"); }}
                  className="py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-sys-border text-[11px] font-semibold text-sys-text-primary text-center transition-colors active:scale-95"
                >
                  Reset Windows
                </button>
                <button
                  onClick={() => { handleRestart(); setShowSettings(false); }}
                  className="py-2 rounded-lg bg-red-650/10 hover:bg-red-650/20 border border-red-500/20 text-red-400 text-[11px] font-semibold text-center transition-colors active:scale-95"
                >
                  Reboot System
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
