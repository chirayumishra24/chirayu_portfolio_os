"use client";

import React from "react";
import { AppId, useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  User, Folder, Brain, GitBranch, FileText, Code2, 
  Terminal, Play, Mail, Music, Gamepad2, Settings, FolderOpen, Globe 
} from "lucide-react";
import { clsx } from "clsx";

export default function DesktopGrid() {
  const { openWindow, focusWindow } = useOSStore();
  const { playSound } = useSystemSound();

  const desktopIcons: { id: AppId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "terminal", label: "Terminal", icon: <Terminal size={24} />, color: "from-emerald-500 to-teal-600" },
    { id: "about", label: "About Me", icon: <User size={24} />, color: "from-indigo-500 to-blue-600" },
    { id: "projects", label: "Projects", icon: <Folder size={24} />, color: "from-amber-500 to-orange-600" },
    { id: "skills", label: "Skills Tree", icon: <Brain size={24} />, color: "from-pink-500 to-rose-600" },
    { id: "experience", label: "Experience", icon: <GitBranch size={24} />, color: "from-cyan-500 to-sky-600" },
    { id: "resume", label: "Resume CV", icon: <FileText size={24} />, color: "from-purple-500 to-indigo-600" },
    { id: "github", label: "GitHub", icon: <Code2 size={24} />, color: "from-zinc-700 to-zinc-900" },
    { id: "playground", label: "JS Sandbox", icon: <Play size={24} />, color: "from-violet-500 to-fuchsia-600" },
    { id: "contact", label: "Contact", icon: <Mail size={24} />, color: "from-red-500 to-orange-600" },
    { id: "spotify", label: "Music Player", icon: <Music size={24} />, color: "from-green-500 to-emerald-600" },
    { id: "games", label: "Arcade Games", icon: <Gamepad2 size={24} />, color: "from-blue-600 to-violet-600" },
    { id: "settings", label: "Preferences", icon: <Settings size={24} />, color: "from-gray-500 to-stone-600" },
    { id: "filemanager", label: "File Manager", icon: <FolderOpen size={24} />, color: "from-sky-500 to-blue-600" },
    { id: "deployments", label: "Vercel Apps", icon: <Globe size={24} />, color: "from-teal-500 to-emerald-600" },
  ];

  const handleLaunch = (id: AppId) => {
    playSound("click");
    openWindow(id);
    focusWindow(id);
  };

  return (
    <div className="absolute inset-0 z-1 grid grid-cols-3 gap-2 overflow-y-auto px-3 pt-[calc(var(--topbar-height)+var(--safe-top)+0.5rem)] pb-[calc(var(--dock-height)+var(--safe-bottom)+1rem)] pointer-events-none select-none scrollbar-none min-[440px]:grid-cols-4 sm:gap-4 sm:px-6 md:grid-flow-col md:grid-cols-none md:auto-cols-[96px] md:grid-rows-[repeat(auto-fill,96px)] md:overflow-visible">
      {desktopIcons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleLaunch(icon.id)}
          className="pointer-events-auto flex h-22 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-transparent text-center transition-all duration-200 hover:border-sys-border hover:bg-zinc-950/25 hover:shadow-lg hover:backdrop-blur-sm active:scale-95 group md:h-22 md:w-24"
        >
          {/* Glowing Icon Wrapper */}
          <div className={clsx(
            "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-200 text-white border border-white/15",
            icon.color
          )}>
            {icon.icon}
          </div>
          
          {/* Label */}
          <span className="text-[10.5px] font-semibold tracking-wide text-zinc-100 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] font-sans px-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-full">
            {icon.label}
          </span>
        </button>
      ))}
    </div>
  );
}
