"use client";

import React, { useEffect, useState } from "react";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Code2, Star, GitFork, BookOpen, Activity, GitCommit, ShieldAlert } from "lucide-react";
import { clsx } from "clsx";

interface GithubData {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
    total_forks: number;
  };
  pinnedRepos: { name: string; description: string; language: string; stars: number; forks: number }[];
  languages: { name: string; value: number }[];
  latestCommits: { repo: string; message: string; date: string }[];
}

export default function GithubApp() {
  const { playSound } = useSystemSound();
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitData = async () => {
      try {
        const res = await fetch("/api/github");
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGitData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-xs gap-3">
        <Activity size={20} className="animate-spin text-sys-accent" />
        <span>Synchronizing developer analytics profile...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-400 font-mono text-xs gap-3">
        <ShieldAlert size={20} />
        <span>Failed to sync GitHub profile statistics.</span>
      </div>
    );
  }

  // Draw Mock Github Contributions Grid (52 weeks x 7 days = 364 boxes)
  const drawContributionGrid = () => {
    const colors = ["bg-zinc-900", "bg-emerald-950", "bg-emerald-800", "bg-emerald-500", "bg-emerald-300"];
    return Array.from({ length: 154 }).map((_, i) => {
      // Pick random color to simulate real commit volume
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      return (
        <div
          key={i}
          className={clsx("w-2.5 h-2.5 rounded-sm hover:scale-125 transition-transform duration-100 cursor-pointer border border-black/20", colorClass)}
          title={`Commits: ${Math.floor(Math.random() * 8)}`}
        />
      );
    });
  };

  return (
    <div className="w-full h-full p-5 space-y-6 text-zinc-300 font-sans select-text overflow-y-auto scrollbar-thin">
      
      {/* Upper Panel: Profile header & metrics */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-sys-border pb-5">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-sys-border overflow-hidden select-none">
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-zinc-400 font-bold text-xl">
              CD
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-100 flex items-center justify-center md:justify-start gap-1.5">
              <Code2 size={16} className="text-sys-accent" />
              <span>{data.user.name} ({data.user.login})</span>
            </h3>
            <p className="text-xs text-sys-text-secondary">{data.user.bio}</p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3 select-none text-xs">
          <div className="px-4 py-2 bg-zinc-950/40 rounded-xl border border-sys-border text-center min-w-20">
            <p className="text-base font-bold text-zinc-100 flex items-center justify-center gap-1">
              <Star size={13} className="text-amber-500" />
              <span>{data.user.total_stars}</span>
            </p>
            <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Stars</p>
          </div>
          <div className="px-4 py-2 bg-zinc-950/40 rounded-xl border border-sys-border text-center min-w-20">
            <p className="text-base font-bold text-zinc-100 flex items-center justify-center gap-1">
              <GitFork size={13} className="text-sys-accent" />
              <span>{data.user.total_forks}</span>
            </p>
            <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Forks</p>
          </div>
        </div>
      </div>

      {/* Contributions Grid */}
      <div className="p-4 bg-zinc-950/40 rounded-xl border border-sys-border space-y-3">
        <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1 select-none">
          <Activity size={12} className="text-sys-accent animate-pulse" /> Contributions Calendar (1,840 Commits Last Year)
        </span>
        <div className="flex flex-wrap gap-1.5 justify-center py-2">
          {drawContributionGrid()}
        </div>
      </div>

      {/* Grid of Pinned Repos & Latest Commits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pinned Repositories */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1 select-none">
            <BookOpen size={12} className="text-sys-accent" /> Pinned Repositories
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.pinnedRepos.map((repo) => (
              <div 
                key={repo.name}
                className="p-4 bg-zinc-950/20 rounded-xl border border-sys-border hover:border-sys-border-active flex flex-col justify-between gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-200 hover:text-sys-accent cursor-pointer transition-colors">
                    {repo.name}
                  </h4>
                  <p className="text-[11px] leading-normal text-sys-text-secondary">{repo.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-[10px] select-none text-zinc-500 border-t border-sys-border/50 pt-2.5 mt-2">
                  <span className="font-semibold">{repo.language}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-500" /> {repo.stars}</span>
                    <span className="flex items-center gap-0.5"><GitFork size={10} /> {repo.forks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Commits */}
        <div className="space-y-4">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1 select-none">
            <GitCommit size={12} className="text-sys-accent" /> Activity Timeline
          </span>

          <div className="p-4 bg-zinc-950/20 rounded-xl border border-sys-border space-y-4 max-h-[280px] overflow-y-auto scrollbar-thin">
            {data.latestCommits.map((commit, idx) => (
              <div key={idx} className="space-y-1 text-xs border-l border-sys-accent/40 pl-3.5 relative">
                <span className="w-1.5 h-1.5 rounded-full bg-sys-accent absolute -left-[4px] top-1.5 shadow shadow-sys-accent" />
                <div className="flex items-center justify-between text-[10px] select-none text-zinc-500 font-mono">
                  <span className="font-bold text-sys-accent">{commit.repo}</span>
                  <span>{commit.date}</span>
                </div>
                <p className="text-zinc-300 leading-snug font-mono text-[10.5px]">{commit.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
