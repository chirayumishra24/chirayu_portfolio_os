"use client";

import React, { useState, useEffect } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Shield, Cpu, Play, Volume2, VolumeX, FastForward } from "lucide-react";
import { profile } from "../../data/portfolio";

const BIOS_LOGS = [
  "CHIRAYU-OS PORTFOLIO BOOTLOADER v2.26",
  "Copyright (C) 2026, Chirayu Mishra. All rights reserved.",
  "--------------------------------------------------",
  "Loading verified profile metadata... OK",
  "Mounting project workspace: chirayu_portfolio_os... OK",
  "Preparing responsive interactive CV viewer... OK",
  "Preparing contact client & notification center... OK",
  "Preparing GitHub data adapter & analytics... OK",
  "Preparing command palette & mobile app launcher... OK",
  "Preparing accessibility & reduced-motion rules... OK",
  "Mounting window manager sheets & dock... OK",
  "--------------------------------------------------",
  "PORTFOLIO DESKTOP READY.",
  "CONTINUE TO DESKTOP INTERFACE."
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
    }, 120);

    return () => clearInterval(interval);
  }, [playSound]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    playSound("boot");
    setTimeout(() => {
      setBootState("desktop");
    }, 1200);
  };

  const handleSkipBoot = () => {
    playSound("click");
    setBootState("desktop");
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-green-500 font-mono text-xs sm:text-sm overflow-hidden flex flex-col p-4 sm:p-6 select-text">
      {currentStep === "bios" ? (
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 overflow-y-auto max-h-[82dvh] pr-2 scrollbar-none font-mono">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {idx === logs.length - 1 && log !== BIOS_LOGS[BIOS_LOGS.length - 1] ? (
                  <span className="w-1.5 h-3.5 bg-green-500 animate-ping inline-block shrink-0" />
                ) : null}
                <p className="leading-relaxed whitespace-pre-wrap">{log}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-green-900/60 pt-3 flex flex-row items-center justify-between text-[11px] text-green-700 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Cpu size={13} /> OS Boot</span>
              <span className="hidden sm:flex items-center gap-1"><Shield size={13} /> SECURED</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={toggleSoundMuted} 
                className="touch-target flex items-center gap-1 hover:text-green-400 transition-colors sm:min-h-0 sm:min-w-0"
              >
                {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className="hidden sm:inline">{soundMuted ? "UNMUTE" : "MUTE"}</span>
              </button>
              <button
                onClick={handleSkipBoot}
                className="touch-target flex items-center gap-1 rounded-xl border border-green-900 px-3 py-1.5 text-green-400 hover:bg-green-950/60 transition-colors active:scale-95 sm:min-h-0 sm:min-w-0 font-bold"
              >
                <FastForward size={13} />
                <span>SKIP</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-2">
          <form 
            onSubmit={handleLogin}
            className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center space-y-5 text-zinc-200"
          >
            {/* User Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">{profile.initials}</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md -z-10" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold tracking-wide text-zinc-100 font-sans">Chirayu OS</h2>
              <p className="text-xs text-zinc-400 font-sans">Interactive Portfolio Desktop</p>
            </div>

            {/* Credentials Fields */}
            <div className="w-full space-y-2.5 font-sans">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-semibold">User Account</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="touch-target w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-semibold">Password (Demo)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="touch-target w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="touch-target w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl py-3 font-bold text-xs transition-all duration-200 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
                </div>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>LOGIN TO DESKTOP</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
