"use client";

import React, { useState } from "react";
import { useOSStore, ThemeName } from "../../store/osStore";
import { SystemSoundType, useSystemSound } from "../../hooks/useSystemSound";
import {
  Settings, Paintbrush, Volume2, Eye, Monitor,
  Accessibility, Code, RotateCcw, Download, Upload, Trophy
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
    pushNotification,
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
    { id: "audio", label: "Audio & Sounds", icon: <Volume2 size={14} /> },
    { id: "accessibility", label: "Accessibility", icon: <Accessibility size={14} /> },
    { id: "developer", label: "System & State", icon: <Code size={14} /> },
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
    <div className="flex h-full w-full flex-col text-zinc-300 select-none font-sans md:flex-row">
      {/* Sidebar Navigation / Horizontal Pills on Mobile */}
      <div className="flex w-full shrink-0 gap-1.5 overflow-x-auto border-b border-sys-border bg-zinc-950/70 p-2.5 scrollbar-none md:w-52 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-3">
        <div className="hidden items-center gap-2 text-sys-accent border-b border-sys-border pb-2 mb-2 md:flex">
          <Settings size={15} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Preferences</span>
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { playSound("click"); setActiveTab(tab.id); }}
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors active:scale-95 md:w-full md:rounded-lg",
              activeTab === tab.id
                ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/30 font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin sm:p-6 overscroll-contain">
        {activeTab === "appearance" && (
          <div className="space-y-5">
            <div className="space-y-1 border-b border-sys-border pb-3">
              <h3 className="text-sm font-bold text-zinc-100">Desktop Theme</h3>
              <p className="text-xs text-sys-text-secondary">Select an OS theme. Colors update across all windows instantly.</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-3">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    playSound("theme");
                    setTheme(t.name);
                    pushNotification({
                      type: "info",
                      title: "Theme Applied",
                      message: `System theme changed to ${t.label}.`
                    });
                  }}
                  className={clsx(
                    "p-3 rounded-2xl border flex items-center gap-3 transition-all duration-150 hover:shadow-lg active:scale-95",
                    theme === t.name
                      ? "border-sys-accent bg-sys-accent/15 shadow-md shadow-sys-accent/10"
                      : "border-sys-border hover:border-zinc-600 bg-zinc-950/30"
                  )}
                >
                  <div className={clsx("w-8 h-8 rounded-xl shrink-0 shadow border border-white/10", t.preview)} />
                  <div className="text-left min-w-0">
                    <span className="text-xs font-bold text-zinc-200 block truncate">{t.label}</span>
                    {theme === t.name ? (
                      <span className="text-[9.5px] text-sys-accent font-bold">Active</span>
                    ) : (
                      <span className="text-[9.5px] text-zinc-500">Select</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "audio" && (
          <div className="space-y-5">
            <div className="space-y-1 border-b border-sys-border pb-3">
              <h3 className="text-sm font-bold text-zinc-100">Sound & Audio</h3>
              <p className="text-xs text-sys-text-secondary">Configure system audio cues, haptic vibrations, and playback volume.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 border border-sys-border">
                <span className="text-xs font-bold text-zinc-200">System Sound Effects</span>
                <button
                  onClick={() => { toggleSoundMuted(); playSound("click"); }}
                  className={clsx(
                    "py-1.5 px-4 rounded-xl text-xs font-bold border transition-colors active:scale-95",
                    soundMuted
                      ? "bg-red-950/40 border-red-500/30 text-red-400"
                      : "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  )}
                >
                  {soundMuted ? "Muted" : "Active"}
                </button>
              </div>

              <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-950/40 border border-sys-border">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-bold">Master Volume</span>
                  <span className="font-mono text-sys-accent font-bold">{soundVolume}%</span>
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

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Test Audio Cues</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(["boot", "click", "success", "error", "theme", "achievement"] satisfies SystemSoundType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => playSound(s)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-sys-border text-xs font-semibold transition-colors active:scale-95 text-zinc-300"
                    >
                      ▶ {s[0].toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "accessibility" && (
          <div className="space-y-5">
            <div className="space-y-1 border-b border-sys-border pb-3">
              <h3 className="text-sm font-bold text-zinc-100">Accessibility</h3>
              <p className="text-xs text-sys-text-secondary">Accessibility and navigation assistance.</p>
            </div>
            <div className="space-y-3 text-xs text-sys-text-secondary">
              <div className="p-4 bg-zinc-950/40 rounded-2xl border border-sys-border space-y-2">
                <h4 className="font-bold text-zinc-200 flex items-center gap-1.5"><Eye size={13} className="text-sys-accent" /> Keyboard Navigation</h4>
                <p className="leading-relaxed">Full keyboard shortcuts enabled: <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">Ctrl+K</kbd> / <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">Ctrl+Shift+P</kbd> opens Command Palette. <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px]">Esc</kbd> closes active dialogs.</p>
              </div>
              <div className="p-4 bg-zinc-950/40 rounded-2xl border border-sys-border space-y-2">
                <h4 className="font-bold text-zinc-200 flex items-center gap-1.5"><Monitor size={13} className="text-sys-accent" /> Motion & Contrast</h4>
                <p className="leading-relaxed">Animations adapt to system reduced-motion settings. High-contrast theme options available (GitHub Light, Minimal White).</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "developer" && (
          <div className="space-y-5">
            <div className="space-y-1 border-b border-sys-border pb-3">
              <h3 className="text-sm font-bold text-zinc-100">System State & Backup</h3>
              <p className="text-xs text-sys-text-secondary">Import or export your configuration and unlock states.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button onClick={handleExportSettings} className="p-4 rounded-2xl bg-zinc-950/30 border border-sys-border hover:border-sys-accent flex flex-col items-center gap-2 transition-colors active:scale-95">
                <Download size={20} className="text-sys-accent" />
                <span className="text-xs font-bold text-zinc-200">Export Config</span>
              </button>
              <button onClick={handleImportSettings} className="p-4 rounded-2xl bg-zinc-950/30 border border-sys-border hover:border-sys-accent flex flex-col items-center gap-2 transition-colors active:scale-95">
                <Upload size={20} className="text-sys-accent" />
                <span className="text-xs font-bold text-zinc-200">Import Config</span>
              </button>
              <button onClick={handleResetAll} className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 hover:border-red-500/60 flex flex-col items-center gap-2 transition-colors active:scale-95">
                <RotateCcw size={20} className="text-red-400" />
                <span className="text-xs font-bold text-red-400">Factory Reset</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950/50 rounded-2xl border border-sys-border text-xs text-zinc-400 space-y-1.5 font-mono">
              <p>OS Version: ChirayuOS v14.0.0</p>
              <p>Framework: Next.js 14 App Router</p>
              <p>Active Theme: {theme}</p>
              <p>Achievements: {achievements.length} unlocked</p>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-5">
            <div className="space-y-1 border-b border-sys-border pb-3">
              <h3 className="text-sm font-bold text-zinc-100">Achievements Unlocked ({achievements.length})</h3>
              <p className="text-xs text-sys-text-secondary">Badges earned by exploring the interactive portfolio system.</p>
            </div>

            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {achievements.map((a) => (
                  <div key={a} className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-3">
                    <Trophy size={18} className="text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-amber-200">{a}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-zinc-500 space-y-2">
                <Trophy size={32} className="mx-auto text-zinc-700 mb-2" />
                <p>No achievements unlocked yet.</p>
                <p className="text-sys-accent">Try running <code>sudo hire chirayu</code> in the terminal!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
