"use client";

import React, { useEffect, useState } from "react";
import { useOSStore } from "../store/osStore";
import { useSystemSound } from "../hooks/useSystemSound";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, ShieldCheck, Wifi, Battery, Command, Sparkles } from "lucide-react";

// Desktop components
import StartupSequence from "../components/desktop/StartupSequence";
import DesktopGrid from "../components/desktop/DesktopGrid";
import WindowFrame from "../components/desktop/WindowFrame";
import Taskbar from "../components/desktop/Taskbar";
import ContextMenu from "../components/desktop/ContextMenu";
import CommandPalette from "../components/desktop/CommandPalette";
import NotificationCenter, { NotificationToasts } from "../components/desktop/NotificationCenter";
import AIChatAssistant from "../components/desktop/AIChatAssistant";

// Applications
import AboutApp from "../components/apps/AboutApp";
import ProjectsApp from "../components/apps/ProjectsApp";
import SkillsApp from "../components/apps/SkillsApp";
import ExperienceApp from "../components/apps/ExperienceApp";
import ResumeApp from "../components/apps/ResumeApp";
import GithubApp from "../components/apps/GithubApp";
import TerminalApp from "../components/apps/TerminalApp";
import PlaygroundApp from "../components/apps/PlaygroundApp";
import ContactApp from "../components/apps/ContactApp";
import SpotifyApp from "../components/apps/SpotifyApp";
import GamesApp from "../components/apps/GamesApp";
import SettingsApp from "../components/apps/SettingsApp";
import FileManagerApp from "../components/apps/FileManagerApp";

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
  const { bootState, theme, achievements, commandPaletteOpen, setCommandPaletteOpen } = useOSStore();
  const { playSound } = useSystemSound();
  const [mounted, setMounted] = useState(false);
  
  // Track achievements count to trigger popup
  const [unlockedCount, setUnlockedCount] = useState<number>(0);

  const [batteryLevel, setBatteryLevel] = useState("100%");
  const [isCharging, setIsCharging] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState("100Mbps");

  // Prevent hydration mismatch & fetch system APIs
  useEffect(() => {
    setMounted(true);
    if (achievements) {
      setUnlockedCount(achievements.length);
    }

    // Get real battery info
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      if ("getBattery" in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
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
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
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
    // Remove existing theme classes
    const classes = body.className.split(" ").filter((c) => !c.startsWith("theme-"));
    body.className = [...classes, `theme-${theme}`].join(" ");
  }, [theme, mounted]);

  // Listen for new achievements
  useEffect(() => {
    if (!mounted) return;
    if (achievements.length > unlockedCount) {
      const latest = achievements[achievements.length - 1];
      const description = ACHIEVEMENT_DESCRIPTIONS[latest] || "Secret milestone unlocked!";
      
      // Push system notification which triggers toast
      useOSStore.getState().pushNotification({
        type: "achievement",
        title: `🏆 Achievement Unlocked: ${latest}`,
        message: description,
      });

      playSound("achievement");
      setUnlockedCount(achievements.length);
    }
  }, [achievements, unlockedCount, mounted]);

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
    <div className="relative w-screen h-screen overflow-hidden select-none select-text">
      {/* Dynamic Desktop Wallpaper Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr opacity-25 mix-blend-overlay pointer-events-none" />

      {/* Top Menu / System Navigation Bar */}
      <div className="h-10 w-full fixed top-0 left-0 bg-sys-taskbar border-b border-sys-border backdrop-blur-xl flex items-center justify-between px-6 z-[9998] select-none text-xs font-medium">
        {/* Left: System Actions */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => { playSound("click"); setCommandPaletteOpen(!commandPaletteOpen); }}
            className="flex items-center gap-1.5 font-bold text-zinc-100 hover:text-sys-accent transition-colors"
          >
            <Sparkles size={13} className="text-sys-accent animate-pulse" />
            <span>ChirayuOS</span>
          </button>
          
          <div className="hidden md:flex items-center gap-4 text-sys-text-secondary">
            <button onClick={() => { playSound("click"); useOSStore.getState().openWindow("about"); }} className="hover:text-sys-text-primary transition-colors">About</button>
            <button onClick={() => { playSound("click"); setCommandPaletteOpen(true); }} className="hover:text-sys-text-primary transition-colors">Find</button>
            <button onClick={() => { playSound("click"); useOSStore.getState().openWindow("settings"); }} className="hover:text-sys-text-primary transition-colors">Preferences</button>
            <button onClick={() => { playSound("click"); useOSStore.getState().openWindow("terminal"); }} className="hover:text-sys-text-primary transition-colors">Developer Shell</button>
          </div>
        </div>

        {/* Center: Live Command Hint */}
        <button 
          onClick={() => { playSound("click"); setCommandPaletteOpen(true); }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950/30 hover:bg-zinc-950/60 border border-sys-border/60 hover:border-sys-border-active transition-all text-[11px] text-sys-text-secondary hover:text-sys-text-primary group"
        >
          <Command size={11} className="group-hover:scale-105 transition-transform" />
          <span>Press</span>
          <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[9px] font-semibold text-zinc-300">Ctrl+Shift+P</kbd>
          <span>for Command Palette</span>
        </button>

        {/* Right: Quick Indicators */}
        <div className="flex items-center gap-4 text-sys-text-secondary">
          <div className="flex items-center gap-1">
            <Wifi size={13} className="text-emerald-500" />
            <span className="text-[10px] font-semibold tracking-wider font-mono hidden sm:inline">{networkSpeed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Battery 
              size={14} 
              className={
                isCharging 
                  ? "text-amber-400 animate-pulse" 
                  : (parseInt(batteryLevel) < 20 ? "text-red-500 animate-bounce" : "text-emerald-500")
              } 
            />
            <span className="text-[10px] font-semibold tracking-wider font-mono hidden sm:inline">
              {isCharging ? `⚡ ${batteryLevel}` : batteryLevel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans hidden sm:inline">SYS_OK</span>
          </div>
          <NotificationCenter />
        </div>
      </div>

      {/* Desktop Grid Icons */}
      <DesktopGrid />

      {/* Window Manager Workspace */}
      <div className="absolute inset-0 pt-10 pb-12 w-full h-full overflow-hidden pointer-events-none">
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
        </div>
      </div>

      {/* Bottom Taskbar/Dock */}
      <Taskbar />

      {/* Right-click Context Menu */}
      <ContextMenu />

      {/* Command Palette (Raycast style) */}
      <CommandPalette />

      {/* AI Chat Assistant (Clippy-style) */}
      <AIChatAssistant />

      {/* Notification Toasts (top-right) */}
      <NotificationToasts />

    </div>
  );
}
