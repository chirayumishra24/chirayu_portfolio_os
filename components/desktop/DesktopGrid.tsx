"use client";

import React from "react";
import { AppId, useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  User, Folder, Brain, GitBranch, FileText, Code2, 
  Terminal, Play, Mail, Music, Gamepad2, Settings, FolderOpen 
} from "lucide-react";
import { clsx } from "clsx";

export default function DesktopGrid() {
  const { openWindow, focusWindow } = useOSStore();
  const { playSound } = useSystemSound();

  const desktopIcons: { id: AppId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "terminal", label: "xterm Terminal", icon: <Terminal size={26} />, color: "from-emerald-500 to-teal-500" },
    { id: "about", label: "About Me", icon: <User size={26} />, color: "from-indigo-500 to-blue-500" },
    { id: "projects", label: "Projects Explorer", icon: <Folder size={26} />, color: "from-amber-500 to-orange-500" },
    { id: "skills", label: "Skills Tree", icon: <Brain size={26} />, color: "from-pink-500 to-rose-500" },
    { id: "experience", label: "Experience git-log", icon: <GitBranch size={26} />, color: "from-cyan-500 to-sky-500" },
    { id: "resume", label: "Interactive CV", icon: <FileText size={26} />, color: "from-purple-500 to-indigo-500" },
    { id: "github", label: "GitHub Dashboard", icon: <Code2 size={26} />, color: "from-zinc-700 to-zinc-900" },
    { id: "playground", label: "JS Sandbox", icon: <Play size={26} />, color: "from-violet-500 to-fuchsia-500" },
    { id: "contact", label: "Mail Compose", icon: <Mail size={26} />, color: "from-red-500 to-orange-500" },
    { id: "spotify", label: "Music Player", icon: <Music size={26} />, color: "from-green-500 to-emerald-500" },
    { id: "games", label: "Arcade Games", icon: <Gamepad2 size={26} />, color: "from-blue-600 to-violet-600" },
    { id: "settings", label: "System Preferences", icon: <Settings size={26} />, color: "from-gray-500 to-stone-500" },
    { id: "filemanager", label: "File Manager", icon: <FolderOpen size={26} />, color: "from-sky-500 to-blue-600" },
  ];

  const handleLaunch = (id: AppId) => {
    playSound("click");
    openWindow(id);
    focusWindow(id);
  };

  return (
    <div className="absolute inset-0 z-1 grid grid-cols-2 gap-3 overflow-y-auto px-3 pt-[calc(var(--topbar-height)+0.75rem)] pb-[calc(var(--dock-height)+var(--safe-bottom)+1rem)] pointer-events-none select-none scrollbar-none min-[380px]:grid-cols-3 sm:grid-cols-4 sm:gap-6 sm:px-8 md:grid-flow-col md:grid-cols-none md:auto-cols-[100px] md:grid-rows-[repeat(auto-fill,100px)] md:overflow-visible">
      {desktopIcons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleLaunch(icon.id)}
          className="pointer-events-auto flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-transparent text-center transition-all duration-300 hover:border-sys-border hover:bg-zinc-950/20 hover:shadow-lg hover:backdrop-blur-sm group md:w-24"
        >
          {/* Glowing Icon Wrapper */}
          <div className={clsx(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 text-white",
            icon.color
          )}>
            {icon.icon}
          </div>
          
          {/* Label */}
          <span className="text-[11px] font-semibold tracking-wide text-zinc-100 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)] font-sans px-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-full">
            {icon.label}
          </span>
        </button>
      ))}
    </div>
  );
}
