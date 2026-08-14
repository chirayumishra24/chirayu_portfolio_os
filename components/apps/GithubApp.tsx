"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
        <Activity size={22} className="animate-spin text-sys-accent" />
        <span>Synchronizing GitHub metrics...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-400 font-mono text-xs gap-3">
        <ShieldAlert size={22} />
        <span>Failed to load GitHub activity data.</span>
      </div>
    );
  }

  // Draw Contribution Activity Grid
  const drawContributionGrid = () => {
    const colors = ["bg-zinc-900", "bg-emerald-950", "bg-emerald-800", "bg-emerald-500", "bg-emerald-400"];
    return Array.from({ length: 140 }).map((_, i) => {
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      return (
        <div
          key={i}
          className={clsx("w-2.5 h-2.5 rounded-xs shrink-0 hover:scale-125 transition-transform duration-100 cursor-pointer border border-black/20", colorClass)}
          title={`Activity ${i + 1}`}
        />
      );
    });
  };

  return (
    <div className="h-full w-full space-y-5 overflow-y-auto p-4 text-zinc-300 select-text font-sans scrollbar-thin sm:p-6 overscroll-contain">
      
      {/* Upper Panel: Profile header & metrics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-sys-border pb-5">
        <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-sys-border overflow-hidden select-none shrink-0 shadow">
            {data.user.avatar_url ? (
              <Image src={data.user.avatar_url} alt={data.user.name} width={56} height={56} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-zinc-300 font-bold text-lg">
                CM
              </div>
            )}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center justify-center sm:justify-start gap-1.5 truncate">
              <Code2 size={15} className="text-sys-accent shrink-0" />
              <span>{data.user.name}</span>
              <span className="text-zinc-500 text-xs font-mono">(@{data.user.login})</span>
            </h3>
            <p className="text-xs text-sys-text-secondary leading-normal">{data.user.bio}</p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2.5 text-xs select-none shrink-0">
          <div className="rounded-2xl border border-sys-border bg-zinc-950/40 px-3.5 py-2 text-center min-w-[72px]">
            <p className="text-base font-bold text-zinc-100 flex items-center justify-center gap-1 font-mono">
              <Star size={13} className="text-amber-400" />
              <span>{data.user.total_stars}</span>
            </p>
            <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Stars</p>
          </div>
          <div className="rounded-2xl border border-sys-border bg-zinc-950/40 px-3.5 py-2 text-center min-w-[72px]">
            <p className="text-base font-bold text-zinc-100 flex items-center justify-center gap-1 font-mono">
              <GitFork size={13} className="text-sys-accent" />
              <span>{data.user.total_forks}</span>
            </p>
            <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Forks</p>
          </div>
        </div>
      </div>

      {/* Contributions Grid Container */}
      <div className="p-4 bg-zinc-950/40 rounded-2xl border border-sys-border space-y-2.5">
        <span className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
          <Activity size={12} className="text-emerald-400 animate-pulse" /> Commit Frequency Grid
        </span>
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
            {drawContributionGrid()}
          </div>
        </div>
      </div>

      {/* Grid of Pinned Repos & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Pinned Repositories */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1 select-none">
            <BookOpen size={12} className="text-sys-accent" /> Pinned Repositories
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.pinnedRepos.map((repo) => (
              <div 
                key={repo.name}
                className="p-3.5 bg-zinc-950/30 rounded-2xl border border-sys-border hover:border-sys-border-active flex flex-col justify-between gap-2.5 transition-all duration-200"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-100 hover:text-sys-accent cursor-pointer transition-colors font-mono">
                    {repo.name}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-sys-text-secondary">{repo.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-[10px] select-none text-zinc-500 border-t border-sys-border/40 pt-2 font-mono">
                  <span className="font-semibold text-sys-accent">{repo.language}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-400" /> {repo.stars}</span>
                    <span className="flex items-center gap-0.5"><GitFork size={10} /> {repo.forks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Commits */}
        <div className="space-y-3">
          <span className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1 select-none">
            <GitCommit size={12} className="text-sys-accent" /> Recent Commit Feed
          </span>

          <div className="p-3.5 bg-zinc-950/30 rounded-2xl border border-sys-border space-y-3.5 max-h-[260px] overflow-y-auto scrollbar-thin">
            {data.latestCommits.map((commit, idx) => (
              <div key={idx} className="space-y-0.5 text-xs border-l border-sys-accent/40 pl-3 relative">
                <span className="w-1.5 h-1.5 rounded-full bg-sys-accent absolute -left-[4px] top-1.5" />
                <div className="flex items-center justify-between text-[9.5px] select-none text-zinc-500 font-mono">
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
