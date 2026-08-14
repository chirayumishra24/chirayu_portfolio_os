"use client";

import React, { useEffect, useState } from "react";
import { Code2, ExternalLink, FileText, Folder, Mail, Sparkles, X, CheckCircle2, Printer, Layers, Laptop, Compass } from "lucide-react";
import { profile, resume } from "../../data/portfolio";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { clsx } from "clsx";

type TargetRole = "fullstack" | "frontend" | "product";

const ROLE_PRESETS: Record<TargetRole, { title: string; desc: string; icon: React.ReactNode; highlights: string[]; stack: string[] }> = {
  fullstack: {
    title: "Full-Stack Engineer",
    desc: "End-to-end web architectures, scalable Next.js App Router, Prisma ORM, and REST/GraphQL APIs.",
    icon: <Layers size={12} />,
    highlights: [
      "Production Next.js 14, Node.js, and TypeScript architectures",
      "Prisma & relational database modeling with ACID transaction safety",
      "Real-time state orchestration and high-concurrency API engineering"
    ],
    stack: ["Next.js 14", "TypeScript", "Node.js", "Prisma", "PostgreSQL", "Tailwind"]
  },
  frontend: {
    title: "Frontend Architect",
    desc: "High-performance interactive interfaces, Three.js 3D web experiences, and micro-animations.",
    icon: <Laptop size={12} />,
    highlights: [
      "Three.js / React Three Fiber interactive 3D WebGL scenes",
      "Tailwind CSS, Glassmorphism, and responsive mobile-first UI/UX",
      "Sub-millisecond reactive state management with Zustand"
    ],
    stack: ["React 18", "Three.js", "R3F", "Tailwind CSS", "Framer Motion", "GSAP"]
  },
  product: {
    title: "Product Engineer",
    desc: "Translating ambiguous business vision into verified, shipped, and user-tested software platforms.",
    icon: <Compass size={12} />,
    highlights: [
      "Shipped 38+ live production deployments across EdTech & SaaS",
      "Data-driven iteration with integrated analytics and user telemetry",
      "Rapid prototyping from Figma design systems to production code"
    ],
    stack: ["Product Design", "Next.js", "Analytics", "Vercel CI/CD", "SEO/AEO", "Design Systems"]
  }
};

export default function RecruiterModePanel() {
  const { openWindow } = useOSStore();
  const { playSound } = useSystemSound();
  const { isMobile } = useResponsiveMode();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<TargetRole>("fullstack");

  useEffect(() => {
    const dismissed = window.localStorage.getItem("chirayu-os-recruiter-panel-dismissed");
    setIsOpen(dismissed !== "true");

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-recruiter-mode", handleOpen);
    return () => window.removeEventListener("open-recruiter-mode", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        playSound("click");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, playSound]);

  const openApp = (id: "about" | "projects" | "resume" | "contact" | "deployments") => {
    playSound("click");
    openWindow(id);
    if (isMobile) setIsOpen(false);
  };

  const dismiss = () => {
    playSound("click");
    window.localStorage.setItem("chirayu-os-recruiter-panel-dismissed", "true");
    setIsOpen(false);
  };

  const handlePrint = () => {
    playSound("click");
    window.print();
  };

  if (!isOpen) return null;

  const currentPreset = ROLE_PRESETS[selectedRole];

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 z-[99990] bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={dismiss}
        />
      )}

      <aside
        data-recruiter-panel="true"
        className={
          isMobile
            ? "fixed left-3 right-3 top-[calc(var(--topbar-height)+var(--safe-top)+0.5rem)] z-[99992] max-h-[85dvh] overflow-y-auto rounded-3xl border border-sys-border-active bg-zinc-950/95 p-5 shadow-2xl backdrop-blur-2xl pointer-events-auto overscroll-contain animate-in zoom-in-95 duration-150"
            : "fixed left-4 top-[calc(var(--topbar-height)+var(--safe-top)+0.75rem)] z-[60] w-[400px] rounded-2xl border border-sys-border-active bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-2xl pointer-events-auto animate-in slide-in-from-top-3 duration-200"
        }
        aria-label="Recruiter executive summary"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sys-border/60 pb-3">
          <div className="min-w-0 space-y-0.5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sys-accent">
              <Sparkles size={12} className="animate-pulse" />
              Recruiter Quick Brief
            </p>
            <h2 className="text-sm font-bold text-zinc-100">{profile.name}</h2>
            <p className="text-[11px] font-semibold text-sys-accent">{profile.role}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print or export brief"
              className="touch-target flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
              title="Print / Save PDF"
            >
              <Printer size={13} />
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss recruiter quick summary"
              className="touch-target flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="mt-3 flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-sys-border">
          {(["fullstack", "frontend", "product"] as TargetRole[]).map((roleKey) => (
            <button
              key={roleKey}
              onClick={() => {
                playSound("click");
                setSelectedRole(roleKey);
              }}
              className={clsx(
                "flex-1 py-1 px-1.5 rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all",
                selectedRole === roleKey
                  ? "bg-sys-accent text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {ROLE_PRESETS[roleKey].icon}
              <span className="truncate">{ROLE_PRESETS[roleKey].title.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-zinc-300 font-medium">{currentPreset.desc}</p>

        {/* Tailored Strengths */}
        <div className="mt-3 space-y-1.5 border-t border-sys-border/40 pt-2.5">
          {currentPreset.highlights.map((st) => (
            <div key={st} className="flex items-start gap-2 text-[11px] text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>{st}</span>
            </div>
          ))}
        </div>

        {/* Tailored Focus Stack */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {currentPreset.stack.map((tag) => (
            <span key={tag} className="rounded-md border border-sys-border bg-zinc-900/80 px-2 py-0.5 text-[9px] font-bold text-zinc-300">
              {tag}
            </span>
          ))}
        </div>

        {/* Quick Launch Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => openApp("deployments")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-accent/40 bg-sys-accent/15 px-3 py-2 text-sys-accent transition-colors hover:bg-sys-accent/25 active:scale-95"
          >
            <Folder size={13} />
            38+ Live Apps
          </button>
          <button
            type="button"
            onClick={() => openApp("resume")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900 px-3 py-2 text-zinc-200 transition-colors hover:border-sys-border-active active:scale-95"
          >
            <FileText size={13} />
            Interactive CV
          </button>
          <button
            type="button"
            onClick={() => openApp("contact")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900 px-3 py-2 text-zinc-200 transition-colors hover:border-sys-border-active active:scale-95"
          >
            <Mail size={13} />
            Contact
          </button>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-sys-border bg-zinc-900 px-3 py-2 text-zinc-200 transition-colors hover:border-sys-border-active active:scale-95"
          >
            <Code2 size={13} />
            GitHub
          </a>
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-sys-border/60 pt-3 text-[10.5px] text-zinc-400">
          <a href={resume.publicPath} download={resume.downloadName} className="inline-flex items-center gap-1 hover:text-sys-accent font-semibold">
            <FileText size={11} />
            Download PDF CV
          </a>
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:text-sys-accent font-semibold">
            <ExternalLink size={11} />
            Email Directly
          </a>
        </div>
      </aside>
    </>
  );
}
