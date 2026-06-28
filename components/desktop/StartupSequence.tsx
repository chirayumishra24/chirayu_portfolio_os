"use client";

import React, { useState, useEffect } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Terminal, Shield, Cpu, Play, Volume2, VolumeX } from "lucide-react";

export default function StartupSequence() {
  const { setBootState, soundMuted, toggleSoundMuted } = useOSStore();
  const { playSound } = useSystemSound();
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"bios" | "login">("bios");
  const [username, setUsername] = useState("Guest");
  const [password, setPassword] = useState("••••••••");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const biosLogs = [
    "CHIRAYU-OS(R) BIOS Version 2.26",
    "Copyright (C) 2026, Chirayu Dev.",
    "--------------------------------------------------",
    "Initializing CPU: Intel Core i9-14900KS @ 6.2GHz... OK",
    "Total Memory Detected: 65,536 MB (64GB DDR5 Dual Channel)",
    "Storage Interface: NVMe PCIe Gen5 SSD 2TB... MOUNTED",
    "Connecting database adapters (Prisma-SQLite): OK",
    "Checking environment variables (Firebase/Spotify): RESOLVED",
    "Syncing Monaco Playground Secure Sandbox: OK",
    "Syncing xterm.js terminal interpreter profile: OK",
    "Loading achievements registry... 12/12 UNLOCKED",
    "Verifying graphic assets (Tailwind, Three.js, GSAP): OK",
    "Initializing sound systems (Web Audio Synthesizer): OK",
    "Establishing secure guest terminal session... ONLINE",
    "--------------------------------------------------",
    "CHIRAYU-OS BOOT SYSTEM COMPLETED SUCCESSFULLY.",
    "READY FOR USER SIGN-IN."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < biosLogs.length) {
        setLogs((prev) => [...prev, biosLogs[index]]);
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
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    playSound("boot");
    setTimeout(() => {
      setBootState("desktop");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-green-500 font-mono text-sm overflow-hidden flex flex-col p-6 select-text">
      {currentStep === "bios" ? (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 overflow-y-auto max-h-[85vh] pr-2">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {idx === logs.length - 1 && log !== biosLogs[biosLogs.length - 1] ? (
                  <span className="w-2 h-4 bg-green-500 animate-ping inline-block shrink-0" />
                ) : null}
                <p className="leading-relaxed whitespace-pre-wrap">{log}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-green-900/50 pt-4 flex items-center justify-between text-xs text-green-700">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Cpu size={14} /> BIOS Rev. 2.26</span>
              <span className="flex items-center gap-1"><Shield size={14} /> SSL SECURED</span>
            </div>
            <button 
              onClick={toggleSoundMuted} 
              className="flex items-center gap-1 hover:text-green-500 transition-colors"
            >
              {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {soundMuted ? "UNMUTE AUDIO" : "MUTE AUDIO"}
            </button>
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
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">C</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md -z-10 group-hover:bg-indigo-500/30 transition-all duration-300" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold tracking-wide text-zinc-100 font-sans">Chirayu OS</h2>
              <p className="text-xs text-zinc-500 font-sans">v14.0.0 • Portfolio Desktop</p>
            </div>

            {/* Credentials Fields */}
            <div className="w-full space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-sans">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-sans">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg py-2.5 font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
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
