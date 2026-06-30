"use client";

import React, { useState } from "react";
import { useOSStore, ThemeName } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import {
  Settings, Paintbrush, Volume2, VolumeX, Eye, Monitor,
  Accessibility, Code, RotateCcw, Download, Upload, Sun, Trophy
} from "lucide-react";
import { clsx } from "clsx";

type SettingsTab = "appearance" | "audio" | "accessibility" | "developer" | "achievements";

export default function SettingsApp() {
  const {
    theme, setTheme,
    soundMuted, toggleSoundMuted,
    soundVolume, setSoundVolume,
    achievements,
    resetWindows,
  } = useOSStore();
  const { playSound } = useSystemSound();
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  const themes: { name: ThemeName; label: string; preview: string }[] = [
    { name: "tokyonight", label: "Tokyo Night", preview: "bg-indigo-900" },
    { name: "onedark", label: "One Dark", preview: "bg-stone-800" },
    { name: "dracula", label: "Dracula", preview: "bg-purple-900" },
    { name: "nord", label: "Nord", preview: "bg-cyan-800" },
    { name: "githublight", label: "GitHub Light", preview: "bg-zinc-100" },
    { name: "catppuccin", label: "Catppuccin", preview: "bg-pink-900" },
    { name: "cyberpunk", label: "Cyberpunk", preview: "bg-yellow-600" },
    { name: "matrix", label: "Matrix", preview: "bg-green-900" },
    { name: "minimalwhite", label: "Minimal White", preview: "bg-white border border-zinc-300" },
    { name: "midnightblue", label: "Midnight Blue", preview: "bg-blue-950" },
    { name: "kratos", label: "Kratos", preview: "bg-red-800" },
    { name: "spiderverse", label: "Spiderverse", preview: "bg-rose-600" },
    { name: "heisenberg", label: "Heisenberg", preview: "bg-amber-600" },
    { name: "hazmat", label: "Hazmat Suit", preview: "bg-lime-500" },
    { name: "tonystark", label: "Tony Stark", preview: "bg-red-500" },
    { name: "thor", label: "Thor", preview: "bg-cyan-500" },
    { name: "johnwick", label: "John Wick", preview: "bg-yellow-400" },
  ];

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "appearance", label: "Appearance", icon: <Paintbrush size={14} /> },
    { id: "audio", label: "Audio", icon: <Volume2 size={14} /> },
    { id: "accessibility", label: "Accessibility", icon: <Accessibility size={14} /> },
    { id: "developer", label: "Developer", icon: <Code size={14} /> },
    { id: "achievements", label: "Achievements", icon: <Trophy size={14} /> },
  ];

  const handleExportSettings = () => {
    playSound("success");
    const data = JSON.stringify({ theme, soundMuted, soundVolume, achievements });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chirayu-os-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = () => {
    playSound("click");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.theme) setTheme(data.theme);
          if (typeof data.soundMuted === "boolean") toggleSoundMuted();
          if (data.soundVolume) setSoundVolume(data.soundVolume);
          playSound("success");
        } catch {
          playSound("error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetAll = () => {
    playSound("error");
    localStorage.removeItem("chirayu-os-preferences");
    setTheme("tokyonight");
    setSoundVolume(50);
    resetWindows();
  };

  return (
    <div className="w-full h-full flex text-zinc-300 font-sans select-none">
      {/* Sidebar Navigation */}
      <div className="w-48 bg-zinc-950/60 border-r border-sys-border p-3 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5 mb-2">
          <Settings size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Preferences</span>
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { playSound("click"); setActiveTab(tab.id); }}
            className={clsx(
              "py-2 px-3 rounded-lg flex items-center gap-2.5 text-xs transition-colors",
              activeTab === tab.id
                ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-sys-border pb-4">
              <h3 className="text-sm font-bold text-zinc-100">Desktop Theme</h3>
              <p className="text-xs text-sys-text-secondary">Select a visual theme. Changes apply instantly across all windows and system components.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { playSound("theme"); setTheme(t.name); }}
                  className={clsx(
                    "p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 hover:shadow-lg",
                    theme === t.name
                      ? "border-sys-accent bg-sys-accent/10 shadow-md shadow-sys-accent/10"
                      : "border-sys-border hover:border-zinc-600 bg-zinc-950/20"
                  )}
                >
                  <div className={clsx("w-8 h-8 rounded-lg shrink-0 shadow", t.preview)} />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-zinc-200">{t.label}</span>
                    {theme === t.name && <span className="block text-[9px] text-sys-accent font-bold mt-0.5">Active</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "audio" && (
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-sys-border pb-4">
              <h3 className="text-sm font-bold text-zinc-100">Sound & Audio</h3>
              <p className="text-xs text-sys-text-secondary">Control system sounds, UI feedback, and music playback volume.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">System Sounds</span>
                <button
                  onClick={() => { toggleSoundMuted(); playSound("click"); }}
                  className={clsx(
                    "py-1.5 px-4 rounded-lg text-xs font-bold border transition-colors",
                    soundMuted
                      ? "bg-red-950/40 border-red-500/30 text-red-400"
                      : "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  )}
                >
                  {soundMuted ? "Muted" : "Enabled"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-sys-text-secondary">
                  <span>Master Volume</span>
                  <span className="font-mono">{soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-sys-accent"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                {["Boot", "Click", "Success", "Error", "Theme", "Achievement"].map((s) => (
                  <button
                    key={s}
                    onClick={() => playSound(s.toLowerCase() as any)}
                    className="py-2 px-3 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-xs font-semibold transition-colors"
                  >
                    ▶ {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "accessibility" && (
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-sys-border pb-4">
              <h3 className="text-sm font-bold text-zinc-100">Accessibility</h3>
              <p className="text-xs text-sys-text-secondary">Adjust settings for improved readability and navigation.</p>
            </div>
            <div className="space-y-3 text-xs text-sys-text-secondary">
              <div className="p-4 bg-zinc-950/40 rounded-xl border border-sys-border space-y-2">
                <h4 className="font-bold text-zinc-200 flex items-center gap-1.5"><Eye size={13} /> Visual Preferences</h4>
                <p>Keyboard shortcut support is enabled by default. All windows support Tab and Arrow navigation. Use <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">Ctrl+Shift+P</kbd> for the command palette.</p>
              </div>
              <div className="p-4 bg-zinc-950/40 rounded-xl border border-sys-border space-y-2">
                <h4 className="font-bold text-zinc-200 flex items-center gap-1.5"><Monitor size={13} /> Reduced Motion</h4>
                <p>Animations respect <code>prefers-reduced-motion</code> media queries. Use GitHub Light or Minimal White themes for maximum contrast.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "developer" && (
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-sys-border pb-4">
              <h3 className="text-sm font-bold text-zinc-100">Developer Options</h3>
              <p className="text-xs text-sys-text-secondary">Manage settings data, reset preferences, and import/export configuration.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={handleExportSettings} className="p-4 rounded-xl bg-zinc-950/20 border border-sys-border hover:border-sys-accent flex flex-col items-center gap-2 transition-colors">
                <Download size={20} className="text-sys-accent" />
                <span className="text-xs font-semibold">Export Settings</span>
              </button>
              <button onClick={handleImportSettings} className="p-4 rounded-xl bg-zinc-950/20 border border-sys-border hover:border-sys-accent flex flex-col items-center gap-2 transition-colors">
                <Upload size={20} className="text-sys-accent" />
                <span className="text-xs font-semibold">Import Settings</span>
              </button>
              <button onClick={handleResetAll} className="p-4 rounded-xl bg-red-950/10 border border-red-500/20 hover:border-red-500/50 flex flex-col items-center gap-2 transition-colors">
                <RotateCcw size={20} className="text-red-400" />
                <span className="text-xs font-semibold text-red-400">Factory Reset</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950/40 rounded-xl border border-sys-border text-xs text-sys-text-secondary space-y-1.5 font-mono">
              <p>OS Version: ChirayuOS v14.0.0</p>
              <p>Framework: Next.js 14 + React 18</p>
              <p>State: Zustand (persisted localStorage)</p>
              <p>Active Theme: {theme}</p>
              <p>Sound State: {soundMuted ? "Muted" : `${soundVolume}%`}</p>
              <p>Achievements Unlocked: {achievements.length}</p>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-sys-border pb-4">
              <h3 className="text-sm font-bold text-zinc-100">Achievements Unlocked</h3>
              <p className="text-xs text-sys-text-secondary">Discover hidden achievements by exploring the portfolio. {achievements.length} unlocked so far.</p>
            </div>

            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((a) => (
                  <div key={a} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center gap-3">
                    <Trophy size={16} className="text-amber-400 shrink-0" />
                    <span className="text-xs font-semibold text-amber-200">{a}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-zinc-500">
                <Trophy size={30} className="mx-auto text-zinc-700 mb-3" />
                <p>No achievements unlocked yet.</p>
                <p className="mt-1">Try running <code className="text-sys-accent">sudo hire chirayu</code> in the terminal!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
