"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useOSStore } from "../store/osStore";
import { useSystemSound } from "../hooks/useSystemSound";
import { ShieldCheck, Wifi, Battery, Command, Sparkles, Briefcase } from "lucide-react";

// Desktop components
import StartupSequence from "../components/desktop/StartupSequence";
import DesktopGrid from "../components/desktop/DesktopGrid";
import WindowFrame from "../components/desktop/WindowFrame";
import Taskbar from "../components/desktop/Taskbar";
import ContextMenu from "../components/desktop/ContextMenu";
import CommandPalette from "../components/desktop/CommandPalette";
import NotificationCenter, { NotificationToasts } from "../components/desktop/NotificationCenter";
import AIChatAssistant from "../components/desktop/AIChatAssistant";
import RecruiterModePanel from "../components/desktop/RecruiterModePanel";

const AppLoading = () => (
  <div className="flex h-full w-full items-center justify-center bg-zinc-950/40 p-6 text-center font-mono text-xs text-sys-text-secondary">
    Loading application...
  </div>
);

// Applications split dynamically
const AboutApp = dynamic(() => import("../components/apps/AboutApp"), { loading: AppLoading });
const ProjectsApp = dynamic(() => import("../components/apps/ProjectsApp"), { loading: AppLoading });
const SkillsApp = dynamic(() => import("../components/apps/SkillsApp"), { loading: AppLoading });
const ExperienceApp = dynamic(() => import("../components/apps/ExperienceApp"), { loading: AppLoading });
const ResumeApp = dynamic(() => import("../components/apps/ResumeApp"), { loading: AppLoading });
const GithubApp = dynamic(() => import("../components/apps/GithubApp"), { loading: AppLoading });
const TerminalApp = dynamic(() => import("../components/apps/TerminalApp"), { loading: AppLoading });
const PlaygroundApp = dynamic(() => import("../components/apps/PlaygroundApp"), { loading: AppLoading });
const ContactApp = dynamic(() => import("../components/apps/ContactApp"), { loading: AppLoading });
const SpotifyApp = dynamic(() => import("../components/apps/SpotifyApp"), { loading: AppLoading });
const GamesApp = dynamic(() => import("../components/apps/GamesApp"), { loading: AppLoading });
const SettingsApp = dynamic(() => import("../components/apps/SettingsApp"), { loading: AppLoading });
const FileManagerApp = dynamic(() => import("../components/apps/FileManagerApp"), { loading: AppLoading });
const DeploymentsApp = dynamic(() => import("../components/apps/DeploymentsApp"), { loading: AppLoading });
const WallpaperCanvas = dynamic(() => import("../components/desktop/WallpaperCanvas"), { ssr: false });

interface BatteryInfo extends EventTarget {
  level: number;
  charging: boolean;
  addEventListener(type: "levelchange" | "chargingchange", listener: () => void): void;
  removeEventListener(type: "levelchange" | "chargingchange", listener: () => void): void;
}

interface NetworkInfo extends EventTarget {
  downlink?: number;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

interface NavigatorWithSystemInfo extends Navigator {
  getBattery?: () => Promise<BatteryInfo>;
  connection?: NetworkInfo;
  mozConnection?: NetworkInfo;
  webkitConnection?: NetworkInfo;
}

const ACHIEVEMENT_DESCRIPTIONS: Record<string, string> = {
  "Curious Inspector": "Unlocked by exploring the right-click desktop context menu.",
  "Keyboard Ninja": "Unlocked by opening the Raycast command palette.",
  "Matrix Modder": "Unlocked by entering matrix falling rain simulation.",
  "Hired Chirayu!": "Unlocked by executing the 'sudo hire chirayu' terminal script.",
  "Spotify Connected": "Unlocked by connecting to the Spotify application player.",
  "Resume Printed": "Unlocked by triggering resume print dialog.",
  "Resume Downloaded": "Unlocked by downloading the resume PDF document.",
  "Code Runner": "Unlocked by executing custom JavaScript in the playground.",
  "Snake Charmer": "Unlocked by scoring 5+ points in the retro Snake game.",
  "JS Guru": "Unlocked by scoring 4+ correct answers in the JS output quiz.",
  "Memory Master": "Unlocked by matching all cards in the developer Memory game.",
  "Tic Tac Champion": "Unlocked by beating the minimax Tic Tac Toe AI opponent.",
  "Message Delivered": "Unlocked by sending an email query using the contact form.",
  "AI Explorer": "Unlocked by asking ChirayuAI your first question.",
  "Source Diver": "Unlocked by exploring source code in the File Manager.",
};

export default function Home() {
  const { bootState, theme, achievements, commandPaletteOpen, setCommandPaletteOpen, activeWindowId, closeWindow, isPlaying } = useOSStore();
  const { playSound } = useSystemSound();
  const [mounted, setMounted] = useState(false);
  
  // Track achievements count to trigger popup
  const [unlockedCount, setUnlockedCount] = useState<number>(() => achievements.length);

  const [batteryLevel, setBatteryLevel] = useState("100%");
  const [isCharging, setIsCharging] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState("100Mbps");

  // Prevent hydration mismatch & fetch system APIs
  useEffect(() => {
    setMounted(true);

    // Get real battery info
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const systemNavigator = navigator as NavigatorWithSystemInfo;

      if (systemNavigator.getBattery) {
        systemNavigator.getBattery().then((battery) => {
          const updateBattery = () => {
            setBatteryLevel(`${Math.round(battery.level * 100)}%`);
            setIsCharging(battery.charging);
          };
          updateBattery();
          battery.addEventListener("levelchange", updateBattery);
          battery.addEventListener("chargingchange", updateBattery);
        });
      }

      // Get real network info
      const conn = systemNavigator.connection || systemNavigator.mozConnection || systemNavigator.webkitConnection;
      if (conn) {
        const updateConnection = () => {
          if (conn.downlink) {
            setNetworkSpeed(`${conn.downlink}Mbps`);
          }
        };
        updateConnection();
        conn.addEventListener("change", updateConnection);
      }
    }
  }, []);

  // Sync theme class to document body
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    const classes = body.className.split(" ").filter((c) => !c.startsWith("theme-"));
    body.className = [...classes, `theme-${theme}`].join(" ");
  }, [theme, mounted]);

  // Listen for new achievements
  useEffect(() => {
    if (!mounted) return;
    if (achievements.length > unlockedCount) {
      const latest = achievements[achievements.length - 1];
      const description = ACHIEVEMENT_DESCRIPTIONS[latest] || "Secret milestone unlocked!";
      
      useOSStore.getState().pushNotification({
        type: "achievement",
        title: `🏆 Achievement: ${latest}`,
        message: description,
      });

      playSound("achievement");
      setUnlockedCount(achievements.length);
    }
  }, [achievements, unlockedCount, mounted, playSound]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || commandPaletteOpen || !activeWindowId) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (document.querySelector('[role="dialog"]')) return;
      if (document.querySelector("[data-recruiter-panel='true']")) return;
      closeWindow(activeWindowId);
      playSound("click");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWindowId, closeWindow, commandPaletteOpen, mounted, playSound]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-zinc-500 font-mono text-xs select-none">
        LOADING CHIRAYU-OS BOOTLOADER...
      </div>
    );
  }

  // 1. BIOS Startup & Sign In
  if (bootState === "booting" || bootState === "login") {
    return <StartupSequence />;
  }

  // 2. Desktop OS Environment
  return (
    <div className="relative h-[100dvh] w-screen max-w-[100vw] overflow-hidden select-none select-text">
      {/* Dynamic Desktop Wallpaper Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr opacity-25 mix-blend-overlay pointer-events-none" />

      {/* Top Menu / System Navigation Bar */}
      <div className="fixed left-0 top-0 z-[9998] flex h-[calc(var(--topbar-height)+var(--safe-top))] pt-[var(--safe-top)] w-full items-center justify-between gap-2 bg-sys-taskbar px-3 text-xs font-medium backdrop-blur-xl border-b border-sys-border select-none sm:px-6">
        {/* Left: System Actions */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <button 
            onClick={() => { playSound("click"); setCommandPaletteOpen(!commandPaletteOpen); }}
            className="flex items-center gap-1.5 font-bold text-zinc-100 hover:text-sys-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-accent rounded px-1.5 py-1 active:scale-95"
          >
            <Sparkles size={14} className="text-sys-accent animate-pulse" />
            <span className="truncate text-xs font-bold">ChirayuOS</span>
          </button>

          {/* Quick Recruiter Mode button on Mobile / Desktop */}
          <button
            onClick={() => { playSound("click"); window.dispatchEvent(new Event("open-recruiter-mode")); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sys-accent/15 border border-sys-accent/30 text-[10px] font-bold uppercase tracking-wider text-sys-accent hover:bg-sys-accent/25 transition-all active:scale-95"
            title="Recruiter Fast Overview"
          >
            <Briefcase size={11} />
            <span className="hidden min-[360px]:inline">Recruiter</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-4 text-sys-text-secondary">
            <button onClick={() => { playSound("click"); useOSStore.getState().openWindow("about"); }} className="hover:text-sys-text-primary transition-colors">About</button>
            <button onClick={() => { playSound("click"); setCommandPaletteOpen(true); }} className="hover:text-sys-text-primary transition-colors">Find</button>
            <button onClick={() => { playSound("click"); useOSStore.getState().openWindow("settings"); }} className="hover:text-sys-text-primary transition-colors">Preferences</button>
            <button onClick={() => { playSound("click"); useOSStore.getState().openWindow("terminal"); }} className="hover:text-sys-text-primary transition-colors">Developer Shell</button>
          </div>
        </div>

        {/* Center: Live Command Hint (Desktop only) */}
        <button 
          onClick={() => { playSound("click"); setCommandPaletteOpen(true); }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950/30 hover:bg-zinc-950/60 border border-sys-border/60 hover:border-sys-border-active transition-all text-[11px] text-sys-text-secondary hover:text-sys-text-primary group"
        >
          <Command size={11} className="group-hover:scale-105 transition-transform" />
          <span>Press</span>
          <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[9px] font-semibold text-zinc-300">Ctrl+Shift+P</kbd>
          <span>for Command Palette</span>
        </button>

        {/* Right: Quick Indicators */}
        <div className="flex shrink-0 items-center gap-2 text-sys-text-secondary sm:gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            <Wifi size={13} className="text-emerald-500" />
            <span className="text-[10px] font-semibold tracking-wider font-mono hidden md:inline">{networkSpeed}</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery 
              size={13} 
              className={
                isCharging 
                  ? "text-amber-400 animate-pulse" 
                  : (parseInt(batteryLevel) < 20 ? "text-red-500 animate-bounce" : "text-emerald-500")
              } 
            />
            <span className="text-[10px] font-semibold tracking-wider font-mono hidden min-[400px]:inline">
              {isCharging ? `⚡ ${batteryLevel}` : batteryLevel}
            </span>
          </div>
          {/* Live Audio Equalizer Indicator */}
          {isPlaying && (
            <div 
              onClick={() => { playSound("click"); useOSStore.getState().openWindow("spotify"); }}
              className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-sys-accent/15 border border-sys-accent/30 cursor-pointer hover:bg-sys-accent/25 transition-all" 
              title="Music Playing — Open Player"
            >
              <span className="w-0.5 h-3 bg-sys-accent rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 h-4 bg-sys-accent rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 h-2 bg-sys-accent rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-0.5 h-3.5 bg-sys-accent rounded-full animate-bounce [animation-delay:200ms]" />
            </div>
          )}

          <div className="hidden items-center gap-1 md:flex">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">SYS_OK</span>
          </div>
          <NotificationCenter />
        </div>
      </div>

      {/* 3D Interactive R3F Wallpaper Engine */}
      <WallpaperCanvas />

      {/* Desktop Grid Icons */}
      <DesktopGrid />

      {/* Recruiter Mode Executive Summary Panel */}
      <RecruiterModePanel />

      {/* Window Manager Workspace */}
      <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden pt-[calc(var(--topbar-height)+var(--safe-top))] pb-[calc(var(--dock-height)+var(--safe-bottom))]">
        <div className="relative w-full h-full pointer-events-none">
          {/* About App */}
          <WindowFrame id="about">
            <AboutApp />
          </WindowFrame>

          {/* Projects App */}
          <WindowFrame id="projects">
            <ProjectsApp />
          </WindowFrame>

          {/* Skills App */}
          <WindowFrame id="skills">
            <SkillsApp />
          </WindowFrame>

          {/* Experience App */}
          <WindowFrame id="experience">
            <ExperienceApp />
          </WindowFrame>

          {/* Resume App */}
          <WindowFrame id="resume">
            <ResumeApp />
          </WindowFrame>

          {/* GitHub App */}
          <WindowFrame id="github">
            <GithubApp />
          </WindowFrame>

          {/* Terminal App */}
          <WindowFrame id="terminal">
            <TerminalApp />
          </WindowFrame>

          {/* Playground App */}
          <WindowFrame id="playground">
            <PlaygroundApp />
          </WindowFrame>

          {/* Contact App */}
          <WindowFrame id="contact">
            <ContactApp />
          </WindowFrame>

          {/* Spotify App */}
          <WindowFrame id="spotify">
            <SpotifyApp />
          </WindowFrame>

          {/* Games App */}
          <WindowFrame id="games">
            <GamesApp />
          </WindowFrame>

          {/* Settings App */}
          <WindowFrame id="settings">
            <SettingsApp />
          </WindowFrame>

          {/* File Manager App */}
          <WindowFrame id="filemanager">
            <FileManagerApp />
          </WindowFrame>

          {/* Deployments Gallery App */}
          <WindowFrame id="deployments">
            <DeploymentsApp />
          </WindowFrame>
        </div>
      </div>

      {/* Bottom Taskbar/Dock */}
      <Taskbar />

      {/* Right-click Context Menu */}
      <ContextMenu />

      {/* Command Palette (Raycast style) */}
      <CommandPalette />

      {/* AI Chat Assistant */}
      <AIChatAssistant />

      {/* Notification Toasts */}
      <NotificationToasts />

    </div>
  );
}
