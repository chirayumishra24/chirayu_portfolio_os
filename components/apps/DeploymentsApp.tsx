"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Globe, ExternalLink, RefreshCw, Search, 
  Maximize2, Laptop, Smartphone, 
  Tablet, Code2, CheckCircle2,
  Share2, ArrowLeft, Eye
} from "lucide-react";
import { clsx } from "clsx";
import { DeployedProject, FALLBACK_DEPLOYMENTS } from "../../data/deployments";

export default function DeploymentsApp() {
  const { unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();

  const [deployments, setDeployments] = useState<DeployedProject[]>(FALLBACK_DEPLOYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [focusedProject, setFocusedProject] = useState<DeployedProject | null>(null);
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [reloadingId, setReloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch live Vercel deployments from API
  useEffect(() => {
    let isMounted = true;
    async function fetchDeployments() {
      try {
        const res = await fetch("/api/deployments");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.deployments && Array.isArray(data.deployments)) {
            setDeployments(data.deployments);
          }
        }
      } catch {
        // Fallback already pre-set
      }
    }
    fetchDeployments();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(deployments.map((d) => d.category));
    return ["All", "Featured", ...Array.from(cats)];
  }, [deployments]);

  const filteredDeployments = useMemo(() => {
    return deployments.filter((proj) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Featured" && proj.featured) ||
        proj.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        proj.name.toLowerCase().includes(q) ||
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [deployments, selectedCategory, searchQuery]);

  const handleReloadIframe = (id: string) => {
    playSound("click");
    setReloadingId(id);
    setTimeout(() => {
      setReloadingId(null);
    }, 600);
  };

  const handleCopyLink = (proj: DeployedProject) => {
    playSound("click");
    navigator.clipboard.writeText(proj.url);
    setCopiedId(proj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFocusProject = (proj: DeployedProject) => {
    playSound("click");
    setFocusedProject(proj);
    unlockAchievement("Web Explorer");
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 font-sans select-none overflow-hidden">
      {/* App Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sys-border bg-zinc-900/60 px-3 py-2 sm:px-4 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          {focusedProject ? (
            <button
              onClick={() => {
                playSound("click");
                setFocusedProject(null);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-sys-border transition-all active:scale-95"
            >
              <ArrowLeft size={13} /> Back to Gallery
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sys-accent/15 border border-sys-accent/30 text-sys-accent">
                <Globe size={15} />
              </div>
              <div>
                <h1 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  Live Deployments Gallery
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {deployments.length} Live Apps
                  </span>
                </h1>
                <p className="text-[10.5px] text-zinc-400 hidden sm:block">
                  Live embedded web applications deployed on Vercel & GitHub
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Viewport Scale & Search Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Device Frame Switcher */}
          <div className="flex items-center rounded-lg bg-zinc-900 border border-sys-border p-0.5">
            <button
              onClick={() => {
                playSound("click");
                setDeviceViewport("desktop");
              }}
              title="Desktop View"
              className={clsx(
                "p-1 rounded text-xs transition-colors",
                deviceViewport === "desktop" ? "bg-sys-accent text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Laptop size={13} />
            </button>
            <button
              onClick={() => {
                playSound("click");
                setDeviceViewport("tablet");
              }}
              title="Tablet View (768px)"
              className={clsx(
                "p-1 rounded text-xs transition-colors",
                deviceViewport === "tablet" ? "bg-sys-accent text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Tablet size={13} />
            </button>
            <button
              onClick={() => {
                playSound("click");
                setDeviceViewport("mobile");
              }}
              title="Mobile View (375px)"
              className={clsx(
                "p-1 rounded text-xs transition-colors",
                deviceViewport === "mobile" ? "bg-sys-accent text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Smartphone size={13} />
            </button>
          </div>

          {!focusedProject && (
            <div className="relative w-36 sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deployed apps..."
                className="w-full rounded-lg bg-zinc-900/90 border border-sys-border py-1 pl-7 pr-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-sys-accent focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {focusedProject ? (
        /* Fullscreen Interactive Embed View */
        <div className="flex flex-1 flex-col min-h-0 bg-zinc-950">
          {/* Active Embed Address Bar */}
          <div className="flex items-center justify-between border-b border-sys-border bg-zinc-900/80 px-3 py-1.5 text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-zinc-200 truncate">{focusedProject.title}</span>
              <span className="text-[11px] font-mono text-zinc-500 truncate hidden md:inline">{focusedProject.url}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleReloadIframe(focusedProject.id)}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Reload Live Embed"
              >
                <RefreshCw size={12} className={reloadingId === focusedProject.id ? "animate-spin text-sys-accent" : ""} />
              </button>
              <button
                onClick={() => handleCopyLink(focusedProject)}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Copy Live URL"
              >
                {copiedId === focusedProject.id ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Share2 size={12} />}
              </button>
              <a
                href={focusedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="View GitHub Repository"
              >
                <Code2 size={12} />
              </a>
              <a
                href={focusedProject.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-sys-accent text-zinc-950 font-bold text-[11px] hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={11} /> Open Tab
              </a>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-zinc-900/30 overflow-auto">
            <div
              className={clsx(
                "h-full w-full transition-all duration-300 rounded-xl overflow-hidden border border-sys-border shadow-2xl bg-zinc-950",
                deviceViewport === "mobile" && "max-w-[390px] h-[780px] my-auto",
                deviceViewport === "tablet" && "max-w-[768px] h-[900px] my-auto",
                deviceViewport === "desktop" && "max-w-full h-full"
              )}
            >
              {reloadingId !== focusedProject.id && (
                <iframe
                  src={focusedProject.url}
                  title={focusedProject.title}
                  className="h-full w-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Wall of Embeds Gallery */
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
          {/* Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 border-b border-sys-border/60 bg-zinc-900/40 shrink-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playSound("click");
                  setSelectedCategory(cat);
                }}
                className={clsx(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all",
                  selectedCategory === cat
                    ? "bg-sys-accent text-zinc-950 shadow-md font-bold"
                    : "bg-zinc-900 border border-sys-border text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Live Embeds */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 overscroll-contain">
            {filteredDeployments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
                <Globe size={32} className="mb-2 opacity-40 text-sys-accent" />
                <p className="text-xs font-semibold">No live deployments match your search filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredDeployments.map((proj) => (
                  <div
                    key={proj.id}
                    className="group flex flex-col rounded-2xl bg-zinc-900/60 border border-sys-border/80 hover:border-sys-accent/50 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-sys-accent/5"
                  >
                    {/* Project Embed Header */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900 border-b border-sys-border/60">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-zinc-200 truncate">{proj.title}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleReloadIframe(proj.id)}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                          title="Reload Embed"
                        >
                          <RefreshCw size={11} className={reloadingId === proj.id ? "animate-spin text-sys-accent" : ""} />
                        </button>
                        <button
                          onClick={() => handleFocusProject(proj)}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                          title="Fullscreen Interactive View"
                        >
                          <Maximize2 size={11} />
                        </button>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-sys-accent transition-colors"
                          title="Open External URL"
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>

                    {/* Live Iframe Embed Preview */}
                    <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden border-b border-sys-border/40 group/frame">
                      {reloadingId !== proj.id && (
                        <iframe
                          src={proj.url}
                          title={proj.title}
                          className="h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-white select-none pointer-events-auto"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          loading="lazy"
                        />
                      )}
                      
                      {/* Hover Overlay Button to Interactively Expand */}
                      <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover/frame:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <button
                          onClick={() => handleFocusProject(proj)}
                          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sys-accent text-zinc-950 text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                          <Eye size={13} /> Open Full Interactive App
                        </button>
                      </div>
                    </div>

                    {/* Project Card Footer & Description */}
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <p className="text-[11.5px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-sys-border/40 gap-2">
                        <div className="flex flex-wrap gap-1">
                          {proj.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 border border-sys-border text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(proj)}
                            className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors"
                          >
                            {copiedId === proj.id ? (
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            ) : (
                              <span>Share Link</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
