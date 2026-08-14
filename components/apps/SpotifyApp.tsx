"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Play, Pause, SkipForward, SkipBack,
  Link, Radio, CloudRain, Coffee, Sparkles
} from "lucide-react";
import { clsx } from "clsx";

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const playlists = {
  lofi: [
    { title: "Can't Stay Down", artist: "Quincy Larson", url: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3", cover: "bg-indigo-950" }
  ],
  synthwave: [
    { title: "Scratching the Surface", artist: "Quincy Larson", url: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3", cover: "bg-pink-950" }
  ],
  nature: [
    { title: "Sailing Away", artist: "Quincy Larson", url: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3", cover: "bg-emerald-950" }
  ]
};

export default function SpotifyApp() {
  const { 
    soundMuted, 
    spotifyConnected,
    currentTrackIndex, setCurrentTrackIndex,
    isPlaying, setIsPlaying,
    unlockAchievement,
    pushNotification
  } = useOSStore();

  const { playSound } = useSystemSound();
  const [activeTab, setActiveTab] = useState<"tracks" | "ambient" | "spotify">("tracks");
  const [activePlaylist, setActivePlaylist] = useState<keyof typeof playlists>("lofi");
  const tracks = playlists[activePlaylist];
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const audioRef = useRef<HTMLAudioElement>(null);

  // Ambient Synthesizer State
  const [ambientActive, setAmbientActive] = useState(false);
  const [rainVol, setRainVol] = useState(50);
  const [cafeVol, setCafeVol] = useState(30);
  const [droneVol, setDroneVol] = useState(40);

  const ambientCtxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const cafeGainRef = useRef<GainNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const [playlistUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chirayu-os-spotify-url") || "";
    }
    return "";
  });
  
  const [inputUrl, setInputUrl] = useState(playlistUrl);

  useEffect(() => {
    if (!audioRef.current || spotifyConnected || activeTab !== "tracks") return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex, activePlaylist, spotifyConnected, setIsPlaying, activeTab]);

  useEffect(() => {
    if (isPlaying && !spotifyConnected && currentTrack && activeTab === "tracks") {
      pushNotification({
        type: "music",
        title: "Now Playing",
        message: `"${currentTrack.title}" by ${currentTrack.artist}`
      });
      unlockAchievement("Audio Explorer");
    }
  }, [isPlaying, currentTrackIndex, spotifyConnected, currentTrack, pushNotification, unlockAchievement, activeTab]);

  // Handle Ambient Synthesizers
  const startAmbient = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as WindowWithWebkitAudioContext).webkitAudioContext;
      if (!AudioCtx) return;
      if (!ambientCtxRef.current) {
        ambientCtxRef.current = new AudioCtx();
      }
      const ctx = ambientCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      // Master Rain synth (filtered pink noise)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "lowpass";
      rainFilter.frequency.value = 1000;

      const rainGain = ctx.createGain();
      rainGain.gain.value = (rainVol / 100) * 0.6;
      rainGainRef.current = rainGain;

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(ctx.destination);
      whiteNoise.start();

      // Cosmic Drone (Twin Oscillators)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.value = 110;
      osc2.frequency.value = 112;

      const droneGain = ctx.createGain();
      droneGain.gain.value = (droneVol / 100) * 0.15;
      droneGainRef.current = droneGain;

      osc1.connect(droneGain);
      osc2.connect(droneGain);
      droneGain.connect(ctx.destination);
      osc1.start();
      osc2.start();

      // Lo-Fi Cafe Vinyl crackle
      const cafeGain = ctx.createGain();
      cafeGain.gain.value = (cafeVol / 100) * 0.3;
      cafeGainRef.current = cafeGain;
      rainFilter.connect(cafeGain);
      cafeGain.connect(ctx.destination);

      setAmbientActive(true);
      setIsPlaying(true);
    } catch {
      // AudioContext unavailable
    }
  }, [rainVol, droneVol, cafeVol, setIsPlaying]);

  const stopAmbient = useCallback(() => {
    if (ambientCtxRef.current) {
      ambientCtxRef.current.close().catch(() => {});
      ambientCtxRef.current = null;
    }
    setAmbientActive(false);
    setIsPlaying(false);
  }, [setIsPlaying]);

  useEffect(() => {
    if (rainGainRef.current && ambientCtxRef.current) {
      rainGainRef.current.gain.value = (rainVol / 100) * 0.6;
    }
    if (cafeGainRef.current && ambientCtxRef.current) {
      cafeGainRef.current.gain.value = (cafeVol / 100) * 0.3;
    }
    if (droneGainRef.current && ambientCtxRef.current) {
      droneGainRef.current.gain.value = (droneVol / 100) * 0.15;
    }
  }, [rainVol, cafeVol, droneVol]);

  useEffect(() => {
    return () => {
      if (ambientCtxRef.current) {
        ambientCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handlePlayPause = () => {
    playSound("click");
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    playSound("click");
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
  };

  const handleBack = () => {
    playSound("click");
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const handlePlaylistSelect = (key: keyof typeof playlists) => {
    playSound("click");
    setActivePlaylist(key);
    setCurrentTrackIndex(0);
  };

  const getEmbedUrl = (raw: string) => {
    if (!raw) return "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0";
    try {
      const parsed = new URL(raw);
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed") return raw;
      if (parts.length >= 2) {
        return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}?utm_source=generator&theme=0`;
      }
      return raw;
    } catch {
      return "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0";
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 p-4 font-sans text-zinc-300 select-none overflow-y-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        muted={soundMuted}
        onEnded={handleNext}
      />

      {/* Top Header Mode Tabs */}
      <div className="flex shrink-0 items-center justify-between border-b border-sys-border pb-3 mb-3">
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-sys-border">
          <button
            onClick={() => { playSound("click"); setActiveTab("tracks"); }}
            className={clsx(
              "px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all",
              activeTab === "tracks" ? "bg-sys-accent text-zinc-950 shadow" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Tracks
          </button>
          <button
            onClick={() => { playSound("click"); setActiveTab("ambient"); }}
            className={clsx(
              "px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1",
              activeTab === "ambient" ? "bg-sys-accent text-zinc-950 shadow" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <CloudRain size={11} /> Ambient
          </button>
          <button
            onClick={() => { playSound("click"); setActiveTab("spotify"); }}
            className={clsx(
              "px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1",
              activeTab === "spotify" ? "bg-sys-accent text-zinc-950 shadow" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Link size={11} /> Spotify
          </button>
        </div>
      </div>

      {/* Mode 1: Tracks Player */}
      {activeTab === "tracks" && (
        <div className="flex min-h-0 flex-1 flex-col justify-between">
          <div className="my-auto flex flex-col items-center justify-center space-y-4">
            <div className={clsx(
              "w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl relative border border-sys-border overflow-hidden shrink-0",
              currentTrack.cover
            )}>
              <div className="absolute inset-0 bg-gradient-to-tr from-sys-accent/20 to-transparent animate-pulse" />
              <Radio size={40} className="text-sys-accent animate-bounce" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-bold text-zinc-100 text-sm tracking-wide">{currentTrack.title}</h3>
              <p className="text-[11px] text-sys-text-secondary">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Visualizer */}
          <div className="w-full h-8 bg-zinc-950/70 rounded-xl overflow-hidden border border-sys-border mb-3 flex items-center justify-center gap-1 px-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <span 
                key={i} 
                className={clsx(
                  "w-1 rounded-full transition-all duration-150 bg-sys-accent",
                  isPlaying ? "animate-pulse" : "h-1 opacity-20"
                )}
                style={{ 
                  height: isPlaying ? `${Math.max(4, (Math.sin(i + Date.now() * 0.005) * 12 + 14))}px` : "3px",
                  animationDelay: `${i * 40}ms`
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mb-3 flex shrink-0 items-center justify-center gap-6">
            <button onClick={handleBack} className="rounded-full p-2.5 transition-colors hover:bg-zinc-900 hover:text-sys-accent active:scale-95">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={handlePlayPause} 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-sys-accent text-zinc-950 shadow-lg transition-all hover:scale-105 hover:bg-sys-accent-hover active:scale-95"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="rounded-full p-2.5 transition-colors hover:bg-zinc-900 hover:text-sys-accent active:scale-95">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Playlist Presets */}
          <div className="grid w-full shrink-0 grid-cols-3 gap-2 border-t border-sys-border pt-3 text-center text-[10px] font-bold uppercase tracking-wider">
            {(["lofi", "synthwave", "nature"] as (keyof typeof playlists)[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePlaylistSelect(p)}
                className={clsx(
                  "rounded-xl py-1.5 transition-colors active:scale-95",
                  activePlaylist === p ? "bg-sys-accent/20 text-sys-accent border border-sys-accent/40 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Ambient Soundscape Studio */}
      {activeTab === "ambient" && (
        <div className="flex flex-1 flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
              <Sparkles size={13} className="text-sys-accent" /> Ambient Focus Studio
            </h4>
            <p className="text-[11px] text-sys-text-secondary">Synthesize multi-channel calming background audio streams.</p>
          </div>

          <div className="space-y-3">
            {/* Rain Channel */}
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-sys-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                <span className="flex items-center gap-2">
                  <CloudRain size={14} className="text-sky-400" /> Cyberpunk Rain
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{rainVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainVol}
                onChange={(e) => setRainVol(Number(e.target.value))}
                className="w-full accent-sys-accent h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Coffee Shop Channel */}
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-sys-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                <span className="flex items-center gap-2">
                  <Coffee size={14} className="text-amber-400" /> Lo-Fi Cafe Crackle
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{cafeVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cafeVol}
                onChange={(e) => setCafeVol(Number(e.target.value))}
                className="w-full accent-sys-accent h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Space Drone Channel */}
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-sys-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-400" /> Deep Space Binaural Drone
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{droneVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={droneVol}
                onChange={(e) => setDroneVol(Number(e.target.value))}
                className="w-full accent-sys-accent h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => {
              playSound("click");
              if (ambientActive) stopAmbient();
              else startAmbient();
            }}
            className={clsx(
              "w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
              ambientActive 
                ? "bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                : "bg-sys-accent text-zinc-950 hover:bg-sys-accent-hover"
            )}
          >
            {ambientActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            <span>{ambientActive ? "Stop Ambient Generator" : "Start Ambient Soundscape"}</span>
          </button>
        </div>
      )}

      {/* Mode 3: Spotify Stream Config */}
      {activeTab === "spotify" && (
        <div className="flex flex-1 flex-col justify-between space-y-4 select-text">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-100">Connect Spotify Stream</h4>
            <p className="text-[11px] text-sys-text-secondary leading-normal">
              Paste any public Spotify Playlist or Track link:
            </p>
          </div>

          <input
            type="text"
            placeholder="https://open.spotify.com/playlist/..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full rounded-xl border border-sys-border bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-sys-accent focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold select-none">
            <button
              onClick={() => { setInputUrl("https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn"); playSound("click"); }}
              className="rounded-xl border border-sys-border bg-zinc-900 py-2 text-center text-zinc-300 hover:bg-zinc-850 active:scale-95"
            >
              ☕ Lofi Focus
            </button>
            <button
              onClick={() => { setInputUrl("https://open.spotify.com/playlist/37i9dQZF1DXdLTE7587tRX"); playSound("click"); }}
              className="rounded-xl border border-sys-border bg-zinc-900 py-2 text-center text-zinc-300 hover:bg-zinc-850 active:scale-95"
            >
              🌌 Synthwave
            </button>
          </div>

          <iframe 
            src={getEmbedUrl(inputUrl || playlistUrl)} 
            width="100%" 
            height="220" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="h-[220px] rounded-2xl border border-sys-border shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
