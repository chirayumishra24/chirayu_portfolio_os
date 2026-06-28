"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  VolumeX, Link, Disc, Radio, Sliders 
} from "lucide-react";
import { clsx } from "clsx";

interface Track {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const playlists = {
  lofi: [
    { title: "Cyber Sunset", artist: "Lofi Coder", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "bg-indigo-950" },
    { title: "Midnight Brew", artist: "Chill Hop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "bg-purple-950" }
  ],
  synthwave: [
    { title: "Outrun Grid", artist: "Neon Rider", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "bg-pink-950" },
    { title: "Hyperdrive", artist: "Laserhawk", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", cover: "bg-sky-950" }
  ],
  nature: [
    { title: "Rainy Desk", artist: "White Noise", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", cover: "bg-emerald-950" }
  ]
};

export default function SpotifyApp() {
  const { 
    soundMuted, 
    spotifyConnected, setSpotifyConnected,
    currentTrackIndex, setCurrentTrackIndex,
    isPlaying, setIsPlaying,
    unlockAchievement
  } = useOSStore();

  const { playSound } = useSystemSound();
  const [activePlaylist, setActivePlaylist] = useState<keyof typeof playlists>("lofi");
  const tracks = playlists[activePlaylist];
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Audio API Context
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Sync Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex, activePlaylist]);

  // Audio Visualizer Setup
  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const setupAnalyser = () => {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      const source = ctx.createMediaElementSource(audioRef.current!);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    };

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d")!;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      canvasCtx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          
          // Theme accent colors
          canvasCtx.fillStyle = `rgba(122, 162, 247, ${0.4 + barHeight / 200})`;
          canvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          
          x += barWidth;
        }
      } else {
        // Draw idle sine wave
        canvasCtx.beginPath();
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgba(122, 162, 247, 0.3)";
        const sliceWidth = width / 100;
        let x = 0;
        
        for (let i = 0; i < 100; i++) {
          const y = height / 2 + Math.sin(i * 0.15 + Date.now() * 0.005) * 8;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.stroke();
      }
    };

    // Attempt to setup analyzer on first audio interaction
    const handleInteraction = () => {
      try {
        setupAnalyser();
      } catch (e) {
        console.warn("Analyser init failed", e);
      }
    };

    audioRef.current.addEventListener("play", handleInteraction);
    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

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

  const handleConnectSpotify = () => {
    playSound("achievement");
    setSpotifyConnected(true);
    unlockAchievement("Spotify Connected");
  };

  const handlePlaylistSelect = (name: keyof typeof playlists) => {
    playSound("click");
    setActivePlaylist(name);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-zinc-950/70 text-zinc-300 font-sans select-none">
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        muted={soundMuted}
      />

      {/* Spotify Connection Panel / Fallback Header */}
      <div className="w-full flex items-center justify-between border-b border-sys-border pb-3 text-xs">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sys-accent">
          <Disc size={15} className="animate-spin-slow" /> Media Room
        </span>
        <button
          onClick={handleConnectSpotify}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors",
            spotifyConnected 
              ? "bg-emerald-950 border-emerald-500 text-emerald-400" 
              : "bg-zinc-900 border-zinc-700 hover:border-sys-accent text-zinc-400"
          )}
        >
          <Link size={10} />
          {spotifyConnected ? "Connected" : "Connect Spotify"}
        </button>
      </div>

      {/* Album Cover & Track Details */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 my-4">
        <div className={clsx(
          "w-36 h-36 rounded-2xl flex items-center justify-center shadow-2xl relative border border-sys-border overflow-hidden",
          currentTrack.cover
        )}>
          {/* Animated glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-sys-accent/20 to-transparent animate-pulse" />
          <Radio size={50} className="text-sys-accent animate-bounce" />
        </div>
        
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-zinc-100 text-sm tracking-wide">{currentTrack.title}</h3>
          <p className="text-xs text-sys-text-secondary">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Audio Visualizer Canvas */}
      <div className="w-full h-10 bg-zinc-950/40 rounded-lg overflow-hidden border border-sys-border mb-4 flex items-center">
        <canvas ref={canvasRef} className="w-full h-full" width={300} height={40} />
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-6 mb-4">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-zinc-900 hover:text-sys-accent transition-colors">
          <SkipBack size={18} />
        </button>
        <button 
          onClick={handlePlayPause} 
          className="w-12 h-12 rounded-full bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={handleNext} className="p-2 rounded-full hover:bg-zinc-900 hover:text-sys-accent transition-colors">
          <SkipForward size={18} />
        </button>
      </div>

      {/* Playlists presets */}
      <div className="w-full grid grid-cols-3 gap-2 border-t border-sys-border pt-4 text-[10px] font-bold uppercase tracking-wider text-center">
        <button
          onClick={() => handlePlaylistSelect("lofi")}
          className={clsx(
            "py-1.5 rounded transition-colors",
            activePlaylist === "lofi" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
          )}
        >
          Lofi Code
        </button>
        <button
          onClick={() => handlePlaylistSelect("synthwave")}
          className={clsx(
            "py-1.5 rounded transition-colors",
            activePlaylist === "synthwave" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
          )}
        >
          Synthwave
        </button>
        <button
          onClick={() => handlePlaylistSelect("nature")}
          className={clsx(
            "py-1.5 rounded transition-colors",
            activePlaylist === "nature" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
          )}
        >
          Nature
        </button>
      </div>
    </div>
  );
}
