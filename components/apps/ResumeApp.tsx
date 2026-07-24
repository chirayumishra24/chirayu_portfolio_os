"use client";

import React from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Download, ExternalLink, Printer, FileText } from "lucide-react";
import { resume } from "../../data/portfolio";

export default function ResumeApp() {
  const { unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();

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
      
      {/* PDF Tool bar */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-sys-border bg-zinc-900/60 px-3 py-3 text-xs select-none sm:h-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-0">
        
        <div className="flex min-w-0 items-center gap-2">
          <FileText size={14} className="text-sys-accent" />
          <span className="truncate font-semibold text-zinc-200">{resume.fileName}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={resume.publicPath}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded border border-sys-border bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-zinc-800"
          >
            <ExternalLink size={12} />
            <span>Open PDF</span>
          </a>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 py-1 px-3 rounded bg-zinc-950 hover:bg-zinc-800 border border-sys-border font-semibold text-[11px] transition-colors"
          >
            <Download size={12} />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 py-1 px-3 rounded bg-sys-accent hover:bg-sys-accent-hover text-zinc-950 font-bold text-[11px] transition-colors"
          >
            <Printer size={12} />
            <span>Print CV</span>
          </button>
        </div>
      </div>

      {/* CV Document Container */}
      <div className="min-h-0 flex-1 bg-zinc-900/40 p-2 select-text sm:p-4">
        <iframe
          src={resume.publicPath}
          className="h-full min-h-[420px] w-full rounded-lg border-none bg-white shadow-2xl"
          title="Resume PDF"
        />
      </div>
    </div>
  );
}
