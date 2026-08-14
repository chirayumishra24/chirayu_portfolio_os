"use client";

import React, { useState } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  Download, ExternalLink, Printer, FileText, 
  Briefcase, GraduationCap, Code2, Award, Eye, FileCode
} from "lucide-react";
import { resume, profile, experienceEntries, projects } from "../../data/portfolio";
import { clsx } from "clsx";

export default function ResumeApp() {
  const { unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();

  const [viewMode, setViewMode] = useState<"html" | "pdf">("html");

  const handlePrint = () => {
    playSound("click");
    unlockAchievement("Resume Printed");
    window.print();
  };

  const handleDownload = () => {
    playSound("success");
    unlockAchievement("Resume Downloaded");
    const link = document.createElement("a");
    link.href = resume.publicPath;
    link.download = resume.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-300 font-sans select-none">
      
      {/* Resume Toolbar */}
      <div className="flex shrink-0 flex-col gap-2.5 border-b border-sys-border bg-zinc-900/80 px-3 py-2.5 text-xs select-none sm:h-11 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-0">
        
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950/80 border border-sys-border">
            <button
              onClick={() => { playSound("click"); setViewMode("html"); }}
              className={clsx(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors",
                viewMode === "html" ? "bg-sys-accent text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Eye size={12} />
              <span>Interactive CV</span>
            </button>
            <button
              onClick={() => { playSound("click"); setViewMode("pdf"); }}
              className={clsx(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors",
                viewMode === "pdf" ? "bg-sys-accent text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <FileCode size={12} />
              <span>PDF Embed</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={resume.publicPath}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-sys-border bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-zinc-800 active:scale-95"
          >
            <ExternalLink size={12} />
            <span>Open PDF</span>
          </a>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-sys-border font-semibold text-[11px] transition-colors active:scale-95 text-zinc-200"
          >
            <Download size={12} />
            <span>Download</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-[11px] transition-colors active:scale-95"
          >
            <Printer size={12} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* CV Document Container */}
      <div className="min-h-0 flex-1 bg-zinc-900/40 p-3 sm:p-5 select-text overflow-y-auto overscroll-contain">
        {viewMode === "html" ? (
          /* Rich Interactive HTML Resume (Perfect on Mobile & Desktop) */
          <div className="max-w-3xl mx-auto rounded-2xl bg-zinc-950 border border-sys-border p-5 sm:p-8 space-y-6 shadow-2xl">
            
            {/* CV Header */}
            <div className="border-b border-sys-border/60 pb-5 space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">{profile.name}</h1>
                <p className="text-xs font-semibold text-sys-accent uppercase tracking-wider font-mono">{profile.role}</p>
                <p className="text-xs text-sys-text-secondary">{profile.headline}</p>
              </div>
              <div className="text-xs text-zinc-400 space-y-1 text-center sm:text-right pt-3 sm:pt-0 font-mono">
                <p>{profile.location}</p>
                <p className="text-sys-accent">{profile.email}</p>
                <p>{profile.education} • CGPA {profile.cgpa}</p>
              </div>
            </div>

            {/* Executive Summary */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sys-accent flex items-center gap-1.5">
                <FileText size={13} /> Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-zinc-300 bg-zinc-900/40 p-3.5 rounded-xl border border-sys-border">
                {profile.recruiterSummary}
              </p>
            </section>

            {/* Experience */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sys-accent flex items-center gap-1.5">
                <Briefcase size={13} /> Verified Work Experience
              </h2>
              <div className="space-y-4">
                {experienceEntries.map((exp) => (
                  <div key={exp.company} className="p-4 rounded-xl bg-zinc-900/30 border border-sys-border space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-100">{exp.role}</h3>
                        <p className="text-xs text-sys-accent font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">{exp.duration}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-sys-text-secondary list-disc pl-4 leading-relaxed">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {exp.tech.map((t) => (
                        <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Projects */}
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sys-accent flex items-center gap-1.5">
                <Code2 size={13} /> Featured Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj) => (
                  <div key={proj.name} className="p-3.5 rounded-xl bg-zinc-900/30 border border-sys-border space-y-2 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{proj.name}</h4>
                      <p className="text-[11px] text-sys-text-secondary mt-1 leading-relaxed">{proj.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-sys-border/40">
                      {proj.tech.map((t) => (
                        <span key={t} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Core Competencies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Education */}
              <section className="p-4 rounded-xl bg-zinc-900/30 border border-sys-border space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-sys-accent flex items-center gap-1.5">
                  <GraduationCap size={13} /> Education & Academics
                </h2>
                <div className="space-y-1 text-xs">
                  <h3 className="font-bold text-zinc-200">{profile.education}</h3>
                  <p className="text-sys-text-secondary">Undergraduate Degree</p>
                  <p className="text-[11px] text-zinc-400 font-mono">CGPA: {profile.cgpa} / 10</p>
                </div>
              </section>

              {/* Focus Strengths */}
              <section className="p-4 rounded-xl bg-zinc-900/30 border border-sys-border space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-sys-accent flex items-center gap-1.5">
                  <Award size={13} /> Core Strengths
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {profile.focusTags.map((tag) => (
                    <span key={tag} className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-sys-border text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>

          </div>
        ) : (
          /* PDF Iframe Embed */
          <div className="h-full min-h-[450px] w-full rounded-xl overflow-hidden shadow-2xl bg-white">
            <iframe
              src={resume.publicPath}
              className="h-full w-full border-none"
              title="Resume PDF"
            />
          </div>
        )}
      </div>
    </div>
  );
}
