"use client";

import React, { useState } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { 
  ZoomIn, ZoomOut, Download, Printer, ChevronLeft, 
  ChevronRight, FileText, Mail, Phone, MapPin 
} from "lucide-react";

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
    link.href = "/resume.pdf";
    link.download = "Chirayu_Mishra_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-300 font-sans select-none">
      
      {/* PDF Tool bar */}
      <div className="h-10 px-4 border-b border-sys-border bg-zinc-900/60 flex items-center justify-between gap-4 shrink-0 text-xs select-none">
        
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-sys-accent" />
          <span className="font-semibold text-zinc-200">Chirayu_Mishra_Resume.pdf</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
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
      <div className="flex-1 p-4 bg-zinc-900/40 select-text">
        <iframe
          src="/resume.pdf"
          className="w-full h-full border-none bg-white rounded-lg shadow-2xl"
          title="Resume PDF"
        />
      </div>
    </div>
  );
}
