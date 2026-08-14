"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Play, Pause, SkipForward, SkipBack,
  Link, Disc, Radio
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
    spotifyConnected, setSpotifyConnected,
    currentTrackIndex, setCurrentTrackIndex,
    isPlaying, setIsPlaying,
    unlockAchievement,
    pushNotification
  } = useOSStore();

  const { playSound } = useSystemSound();
  const [activePlaylist, setActivePlaylist] = useState<keyof typeof playlists>("lofi");
  const tracks = playlists[activePlaylist];
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [playlistUrl, setPlaylistUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chirayu-os-spotify-url") || "";
    }
    return "";
  });
  
  const [inputUrl, setInputUrl] = useState(playlistUrl);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (!audioRef.current || spotifyConnected) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex, activePlaylist, spotifyConnected, setIsPlaying]);

  useEffect(() => {
    if (isPlaying && !spotifyConnected && currentTrack) {
      pushNotification({
        type: "music",
        title: "Now Playing",
        message: `"${currentTrack.title}" by ${currentTrack.artist}`
      });
    }
  }, [currentTrack, currentTrackIndex, activePlaylist, isPlaying, spotifyConnected, pushNotification]);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current || spotifyConnected) return;

    const setupAnalyser = () => {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as WindowWithWebkitAudioContext).webkitAudioContext;
      if (!AudioContextClass) return;
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
    pushNotification({
      type: "info",
      title: "Spotify Disconnected",
      message: "Switched back to local media player."
    });
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
    setIsPlaying(false);
    unlockAchievement("Spotify Connected");
    pushNotification({
      type: "success",
      title: "Spotify Connected",
      message: "Your Spotify player stream has been connected."
    });
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
    return "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0";
  };

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto bg-zinc-950/70 p-4 font-sans text-zinc-300 select-none scrollbar-none sm:p-5">
      
      {/* Audio Element */}
      {!spotifyConnected && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          loop
          muted={soundMuted}
        />
      )}

      {/* Header bar */}
      <div className="mb-3 flex w-full shrink-0 flex-row items-center justify-between border-b border-sys-border pb-3 text-xs">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sys-accent">
          <Disc size={15} className="animate-spin" /> Media Player
        </span>
        
        {spotifyConnected ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConnectSpotify}
              className="touch-target rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] font-bold text-zinc-300 hover:border-sys-accent active:scale-95"
            >
              Config
            </button>
            <button
              onClick={handleDisconnectSpotify}
              className="touch-target rounded-lg border border-emerald-500/50 bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-400 active:scale-95"
            >
              Connected
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectSpotify}
            className="touch-target flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1 text-[10.5px] font-bold text-zinc-300 hover:border-sys-accent active:scale-95"
          >
            <Link size={11} />
            <span>Connect Spotify</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {showConfig ? (
        <div className="flex-1 flex flex-col justify-center space-y-4 py-2 select-text">
          <div className="space-y-1 text-center">
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">Connect Spotify Stream</h4>
            <p className="text-[11px] text-sys-text-secondary leading-normal">
              Paste any public Spotify Playlist, Album, or Track link:
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="https://open.spotify.com/playlist/..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="touch-target w-full rounded-xl border border-sys-border bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-sys-accent focus:outline-none"
            />
          </div>

          {/* Preset options */}
          <div className="space-y-1.5 select-none">
            <span className="text-[9.5px] uppercase font-bold text-zinc-500 tracking-wider block">Quick Presets</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
              <button
                onClick={() => { setInputUrl("https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn"); playSound("click"); }}
                className="touch-target rounded-xl border border-sys-border bg-zinc-900 py-1.5 text-center text-zinc-300 hover:bg-zinc-850 active:scale-95"
              >
                ☕ Lofi Focus
              </button>
              <button
                onClick={() => { setInputUrl("https://open.spotify.com/playlist/37i9dQZF1DXdLTE7587tRX"); playSound("click"); }}
                className="touch-target rounded-xl border border-sys-border bg-zinc-900 py-1.5 text-center text-zinc-300 hover:bg-zinc-850 active:scale-95"
              >
                🌌 Synthwave
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 select-none">
            <button
              onClick={() => { playSound("click"); setShowConfig(false); }}
              className="touch-target flex-1 rounded-xl border border-sys-border bg-zinc-900 py-2 text-[11px] font-bold text-zinc-400 hover:bg-zinc-800 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveSpotifyUrl(inputUrl)}
              className="touch-target flex-1 rounded-xl bg-sys-accent py-2 text-[11px] font-bold text-zinc-950 hover:bg-sys-accent-hover active:scale-95"
            >
              Save & Connect
            </button>
          </div>
        </div>
      ) : spotifyConnected ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center py-2">
          <iframe 
            src={getEmbedUrl(playlistUrl)} 
            width="100%" 
            height="340" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="h-[min(340px,55dvh)] min-h-[260px] rounded-2xl border border-sys-border shadow-2xl"
          />
        </div>
      ) : (
        <>
          {/* Cover & Track Details */}
          <div className="my-2 flex min-h-0 flex-1 flex-col items-center justify-center space-y-4">
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

          {/* Visualizer Canvas */}
          <div className="w-full h-9 bg-zinc-950/50 rounded-xl overflow-hidden border border-sys-border mb-3 flex items-center shrink-0">
            <canvas ref={canvasRef} className="w-full h-full" width={300} height={36} />
          </div>

          {/* Playback Controls */}
          <div className="mb-3 flex shrink-0 items-center justify-center gap-6">
            <button onClick={handleBack} className="touch-target rounded-full p-2.5 transition-colors hover:bg-zinc-900 hover:text-sys-accent active:scale-95">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={handlePlayPause} 
              className="touch-target flex h-12 w-12 items-center justify-center rounded-full bg-sys-accent text-zinc-950 shadow-lg transition-all hover:scale-105 hover:bg-sys-accent-hover active:scale-95"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="touch-target rounded-full p-2.5 transition-colors hover:bg-zinc-900 hover:text-sys-accent active:scale-95">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Playlist Presets */}
          <div className="grid w-full shrink-0 grid-cols-3 gap-2 border-t border-sys-border pt-3 text-center text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => handlePlaylistSelect("lofi")}
              className={clsx(
                "touch-target rounded-xl py-1.5 transition-colors active:scale-95",
                activePlaylist === "lofi" ? "bg-sys-accent/20 text-sys-accent border border-sys-accent/40 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
              )}
            >
              Lofi
            </button>
            <button
              onClick={() => handlePlaylistSelect("synthwave")}
              className={clsx(
                "touch-target rounded-xl py-1.5 transition-colors active:scale-95",
                activePlaylist === "synthwave" ? "bg-sys-accent/20 text-sys-accent border border-sys-accent/40 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
              )}
            >
              Synthwave
            </button>
            <button
              onClick={() => handlePlaylistSelect("nature")}
              className={clsx(
                "touch-target rounded-xl py-1.5 transition-colors active:scale-95",
                activePlaylist === "nature" ? "bg-sys-accent/20 text-sys-accent border border-sys-accent/40 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400"
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
