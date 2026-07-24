"use client";

import React, { useState, useEffect } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Shield, Cpu, Play, Volume2, VolumeX, FastForward } from "lucide-react";
import { profile } from "../../data/portfolio";

const BIOS_LOGS = [
  "CHIRAYU-OS PORTFOLIO BOOTLOADER",
  "Copyright (C) 2026, Chirayu Mishra.",
  "--------------------------------------------------",
  "Loading verified profile metadata... OK",
  "Mounting project workspace: chirayu_portfolio_os... OK",
  "Preparing resume viewer... OK",
  "Preparing contact form and notification center... OK",
  "Preparing GitHub data adapter... OK",
  "Preparing command palette and terminal shortcuts... OK",
  "Preparing accessibility and reduced-motion preferences... OK",
  "Preparing desktop window manager... OK",
  "--------------------------------------------------",
  "PORTFOLIO DESKTOP READY.",
  "CONTINUE TO PROFILE HIGHLIGHTS."
];

export default function StartupSequence() {
  const { setBootState, soundMuted, toggleSoundMuted } = useOSStore();
  const { playSound } = useSystemSound();
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"bios" | "login">("bios");
  const [username, setUsername] = useState("Guest");
  const [password, setPassword] = useState("••••••••");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BIOS_LOGS.length) {
        setLogs((prev) => [...prev, BIOS_LOGS[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          playSound("success");
          setCurrentStep("login");
        }, 800);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [playSound]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    playSound("boot");
    setTimeout(() => {
      setBootState("desktop");
    }, 1500);
  };

  const handleSkipBoot = () => {
    playSound("click");
    setBootState("desktop");
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-green-500 font-mono text-sm overflow-hidden flex flex-col p-6 select-text">
      {currentStep === "bios" ? (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 overflow-y-auto max-h-[85vh] pr-2">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {idx === logs.length - 1 && log !== BIOS_LOGS[BIOS_LOGS.length - 1] ? (
                  <span className="w-2 h-4 bg-green-500 animate-ping inline-block shrink-0" />
                ) : null}
                <p className="leading-relaxed whitespace-pre-wrap">{log}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-green-900/50 pt-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs text-green-700">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Cpu size={14} /> Portfolio Shell</span>
              <span className="flex items-center gap-1"><Shield size={14} /> SSL SECURED</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleSoundMuted} 
                className="flex items-center gap-1 hover:text-green-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {soundMuted ? "UNMUTE AUDIO" : "MUTE AUDIO"}
              </button>
              <button
                onClick={handleSkipBoot}
                className="flex items-center gap-1 rounded border border-green-900/70 px-2 py-1 text-green-500 hover:bg-green-950/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <FastForward size={14} />
                SKIP BOOT
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-radial-gradient">
          <form 
            onSubmit={handleLogin}
            className="w-full max-w-sm p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-6 text-zinc-200"
          >
            {/* User Avatar Group */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">{profile.initials}</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md -z-10 group-hover:bg-indigo-500/30 transition-all duration-300" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold tracking-wide text-zinc-100 font-sans">Chirayu OS</h2>
              <p className="text-xs text-zinc-500 font-sans">Portfolio Desktop • Opens with profile highlights</p>
            </div>

            {/* Credentials Fields */}
            <div className="w-full space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-sans">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-sans">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg py-2.5 font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
                </div>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  <span>BOOT DESKTOP</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
