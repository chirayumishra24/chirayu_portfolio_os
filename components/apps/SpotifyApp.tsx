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

  // Custom Spotify URL state
  const [playlistUrl, setPlaylistUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chirayu-os-spotify-url") || "";
    }
    return "";
  });
  
  const [inputUrl, setInputUrl] = useState(playlistUrl);
  const [showConfig, setShowConfig] = useState(false);

  // Sync Play/Pause for local audio (only when NOT using active Spotify connection)
  useEffect(() => {
    if (!audioRef.current || spotifyConnected) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex, activePlaylist, spotifyConnected]);

  // Audio Visualizer Setup (only when NOT using active Spotify connection)
  useEffect(() => {
    if (!audioRef.current || !canvasRef.current || spotifyConnected) return;

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
          canvasCtx.fillStyle = `rgba(122, 162, 247, ${0.4 + barHeight / 200})`;
          canvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      } else {
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
  }, [isPlaying, spotifyConnected]);

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
    playSound("click");
    setShowConfig(true);
  };

  const handleDisconnectSpotify = () => {
    playSound("click");
    setSpotifyConnected(false);
  };

  const handleSaveSpotifyUrl = (url: string) => {
    const targetUrl = url.trim();
    if (targetUrl) {
      localStorage.setItem("chirayu-os-spotify-url", targetUrl);
      setPlaylistUrl(targetUrl);
    } else {
      localStorage.removeItem("chirayu-os-spotify-url");
      setPlaylistUrl("");
    }
    playSound("success");
    setSpotifyConnected(true);
    setShowConfig(false);
    setIsPlaying(false); // Stop local audio
    unlockAchievement("Spotify Connected");
  };

  const handlePlaylistSelect = (name: keyof typeof playlists) => {
    playSound("click");
    setActivePlaylist(name);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  const getEmbedUrl = (url: string) => {
    try {
      const cleanUrl = url.trim().split("?")[0];
      const parts = cleanUrl.split("/");
      const type = parts[parts.length - 2];
      const id = parts[parts.length - 1];
      if (["playlist", "album", "track"].includes(type) && id) {
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback default lofi playlist
    return "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0";
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 bg-zinc-950/70 text-zinc-300 font-sans select-none overflow-y-auto scrollbar-none">
      
      {/* Local player audio source */}
      {!spotifyConnected && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          loop
          muted={soundMuted}
        />
      )}

      {/* Header bar */}
      <div className="w-full flex items-center justify-between border-b border-sys-border pb-3 text-xs mb-3 shrink-0">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sys-accent">
          <Disc size={15} className="animate-spin-slow" /> Media Room
        </span>
        
        {spotifyConnected ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConnectSpotify}
              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 hover:border-sys-accent text-[9px] font-bold text-zinc-400"
            >
              Config Link
            </button>
            <button
              onClick={handleDisconnectSpotify}
              className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-[9px] font-bold text-emerald-400"
            >
              Connected
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectSpotify}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-zinc-900 border-zinc-700 hover:border-sys-accent text-zinc-400"
          >
            <Link size={10} />
            <span>Connect Spotify</span>
          </button>
        )}
      </div>

      {/* Main Panel Content */}
      {showConfig ? (
        // Configuration Form for Spotify URL
        <div className="flex-1 flex flex-col justify-center space-y-4 py-2 select-text">
          <div className="space-y-1 text-center">
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">Connect Spotify Stream</h4>
            <p className="text-[10px] text-sys-text-secondary leading-normal">
              Paste any public Spotify Playlist, Album, or Track link to listen in ChirayuOS:
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="https://open.spotify.com/playlist/..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-sys-border rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-sys-accent"
            />
          </div>

          {/* Preset options */}
          <div className="space-y-1.5 select-none">
            <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Quick Presets</span>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-semibold">
              <button
                onClick={() => { setInputUrl("https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn"); playSound("click"); }}
                className="py-1 bg-zinc-900 hover:bg-zinc-800 border border-sys-border rounded text-center text-zinc-300"
              >
                ☕ Lofi Beats
              </button>
              <button
                onClick={() => { setInputUrl("https://open.spotify.com/playlist/37i9dQZF1DXdLTE7587tRX"); playSound("click"); }}
                className="py-1 bg-zinc-900 hover:bg-zinc-800 border border-sys-border rounded text-center text-zinc-300"
              >
                🌌 Synthwave Retro
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 select-none">
            <button
              onClick={() => { playSound("click"); setShowConfig(false); }}
              className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-zinc-400 border border-sys-border"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveSpotifyUrl(inputUrl)}
              className="flex-1 py-1.5 rounded bg-sys-accent hover:bg-sys-accent-hover text-[10px] font-bold text-zinc-950"
            >
              Connect Player
            </button>
          </div>
        </div>
      ) : spotifyConnected ? (
        // Iframe Embed Spotify Player
        <div className="flex-1 flex flex-col justify-center py-2">
          <iframe 
            src={getEmbedUrl(playlistUrl)} 
            width="100%" 
            height="340" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="rounded-xl border border-sys-border shadow-2xl"
          />
        </div>
      ) : (
        // Fallback: Local Audio Player
        <>
          {/* Album Cover & Track Details */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 my-2">
            <div className={clsx(
              "w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl relative border border-sys-border overflow-hidden shrink-0",
              currentTrack.cover
            )}>
              <div className="absolute inset-0 bg-gradient-to-tr from-sys-accent/20 to-transparent animate-pulse" />
              <Radio size={40} className="text-sys-accent animate-bounce" />
            </div>
            
            <div className="text-center space-y-0.5">
              <h3 className="font-semibold text-zinc-100 text-xs tracking-wide">{currentTrack.title}</h3>
              <p className="text-[10px] text-sys-text-secondary">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Audio Visualizer Canvas */}
          <div className="w-full h-8 bg-zinc-950/40 rounded-lg overflow-hidden border border-sys-border mb-3 flex items-center shrink-0">
            <canvas ref={canvasRef} className="w-full h-full" width={300} height={32} />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-6 mb-3 shrink-0">
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-zinc-900 hover:text-sys-accent transition-colors">
              <SkipBack size={16} />
            </button>
            <button 
              onClick={handlePlayPause} 
              className="w-10 h-10 rounded-full bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-zinc-900 hover:text-sys-accent transition-colors">
              <SkipForward size={16} />
            </button>
          </div>

          {/* Playlists presets */}
          <div className="w-full grid grid-cols-3 gap-2 border-t border-sys-border pt-3 text-[9px] font-bold uppercase tracking-wider text-center shrink-0">
            <button
              onClick={() => handlePlaylistSelect("lofi")}
              className={clsx(
                "py-1 rounded transition-colors",
                activePlaylist === "lofi" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
              )}
            >
              Lofi Code
            </button>
            <button
              onClick={() => handlePlaylistSelect("synthwave")}
              className={clsx(
                "py-1 rounded transition-colors",
                activePlaylist === "synthwave" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
              )}
            >
              Synthwave
            </button>
            <button
              onClick={() => handlePlaylistSelect("nature")}
              className={clsx(
                "py-1 rounded transition-colors",
                activePlaylist === "nature" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
              )}
            >
              Nature
            </button>
          </div>
        </>
      )}
    </div>
  );
}
