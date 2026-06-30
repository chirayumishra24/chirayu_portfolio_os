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

  const [zoom, setZoom] = useState(100);
  const [currentPage] = useState(1);
  const totalPages = 1;

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const calculatedZoom = Math.floor(((window.innerWidth - 48) / 650) * 100);
      setZoom(Math.max(calculatedZoom, 45));
    }
  }, []);

  const handleZoomIn = () => {
    playSound("click");
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    playSound("click");
    setZoom((prev) => Math.max(prev - 10, 70));
  };

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
        
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button disabled className="p-1 rounded bg-zinc-950 disabled:opacity-30 border border-sys-border">
            <ChevronLeft size={14} />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled className="p-1 rounded bg-zinc-950 disabled:opacity-30 border border-sys-border">
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <button onClick={handleZoomOut} className="p-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-sys-border" title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <span className="font-mono">{zoom}%</span>
          <button onClick={handleZoomIn} className="p-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-sys-border" title="Zoom In">
            <ZoomIn size={14} />
          </button>
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
      <div className="flex-1 overflow-auto p-6 bg-zinc-900/40 flex justify-center items-start select-text scrollbar-thin">
        
        {/* Transform Wrapper for scaling layout bounds */}
        <div 
          style={{ 
            width: `${650 * (zoom / 100)}px`, 
            height: `${900 * (zoom / 100)}px`, 
            overflow: "hidden" 
          }} 
          className="flex justify-center items-start shrink-0"
        >
          {/* Document Sheet */}
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", width: "650px", minHeight: "880px" }}
            className="p-8 bg-white text-zinc-850 shadow-2xl border border-zinc-200 rounded-lg flex flex-col gap-5 text-left text-black shrink-0 font-sans"
          >
          {/* Header Contact info */}
          <div className="border-b-2 border-zinc-800 pb-4 space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-zinc-900">Chirayu Mishra</h2>
            <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">Full-Stack Developer & Product Associate</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-zinc-600 font-medium">
              <span className="flex items-center gap-1"><Mail size={11} /> chirayumishra24@gmail.com</span>
              <span className="flex items-center gap-1"><Phone size={11} /> +91 9695422487</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> UP, India</span>
              <span className="flex items-center gap-1"><FileText size={11} /> github.com/chirayumishra24</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] uppercase font-bold text-zinc-900 tracking-wider border-b border-zinc-300 pb-1 font-sans">
              Summary
            </h3>
            <p className="text-xs leading-relaxed text-zinc-700">
              Full-Stack Developer and Product Associate with a strong foundation in building scalable web applications,
              optimizing UX, and steering cross-functional alignment between engineering and product design.
              Proficient in the MERN stack, PostgreSQL, and AI-assisted development workflows. Experienced in
              product discovery, PRD authoring, user research, and agile sprint delivery.
            </p>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase font-bold text-zinc-900 tracking-wider border-b border-zinc-300 pb-1">
              Education
            </h3>
            <div className="flex justify-between text-xs font-semibold text-zinc-900">
              <div>
                <span>B.Tech in Computer Science &amp; Engineering</span>
                <p className="text-[10px] text-zinc-500 font-normal">CGPA: 7.5</p>
              </div>
              <span className="text-zinc-500 font-normal">2022 - 2026</span>
            </div>
          </div>

          {/* Core Skills */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase font-bold text-zinc-900 tracking-wider border-b border-zinc-300 pb-1">
              Technical Skills
            </h3>
            <div className="text-xs leading-relaxed text-zinc-700">
              <strong>Languages:</strong> JavaScript (ES6+), Python, SQL, HTML5, CSS3.<br />
              <strong>Frameworks:</strong> React.js, Next.js, Node.js, Express.js, Tailwind CSS, EJS.<br />
              <strong>Databases:</strong> PostgreSQL, Supabase, MongoDB, Firebase/Firestore.<br />
              <strong>Tools:</strong> Git, GitHub, Postman, VS Code, Cursor, Bolt, Vercel.<br />
              <strong>Product:</strong> PRDs, User Flows, Market Research, Agile Sprints, Backlog Prioritization.
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase font-bold text-zinc-900 tracking-wider border-b border-zinc-300 pb-1">
              Professional Experience
            </h3>

            {/* Job 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-zinc-900">
                <span>Product Associate (Full-Time) — SkilliZee</span>
                <span className="text-zinc-500 font-normal">Nov 2025 - Present</span>
              </div>
              <ul className="list-disc pl-4 text-xs text-zinc-700 space-y-1">
                <li>Interfaced across engineering, UI/UX, and business teams to transform roadmaps into production-ready tasks.</li>
                <li>Drove sprint cycles, grooming meetings, backlog prioritization, and core product roadmapping.</li>
                <li>Conducted user research and usability diagnostics to identify and resolve friction loops.</li>
              </ul>
            </div>

            {/* Job 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-zinc-900">
                <span>Product Associate (Intern) — SkilliZee</span>
                <span className="text-zinc-500 font-normal">Sep 2025 - Nov 2025</span>
              </div>
              <ul className="list-disc pl-4 text-xs text-zinc-700 space-y-1">
                <li>Authored Product Requirement Documents (PRDs) and scoped core web feature configurations.</li>
                <li>Executed competitive benchmarking matrices to identify feature vectors and white spaces.</li>
              </ul>
            </div>

            {/* Job 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-zinc-900">
                <span>Backend Engineering Intern — Speech-to-Text Project</span>
                <span className="text-zinc-500 font-normal">Jan 2025 - Jul 2025</span>
              </div>
              <ul className="list-disc pl-4 text-xs text-zinc-700 space-y-1">
                <li>Developed end-to-end real-time Speech-to-Text Transcription system using Node.js and Mozilla DeepSpeech.</li>
                <li>Earned Backend Engineering Internship Certificate for high-performance WebSocket audio processing.</li>
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase font-bold text-zinc-900 tracking-wider border-b border-zinc-300 pb-1">
              Key Projects
            </h3>
            <div className="text-xs text-zinc-700 space-y-1.5">
              <div><strong>ChirayuOS Portfolio</strong> — Interactive desktop OS portfolio (Next.js, Zustand, Framer Motion)</div>
              <div><strong>FlowState Visualizer</strong> — Collaborative Git visualizer with real-time WebSockets (Go, React Flow)</div>
              <div><strong>DevForge Compiler</strong> — Isolated code execution engine with Docker sandboxes (TypeScript, Redis)</div>
            </div>
          </div>
          
        </div>
        </div>
      </div>
    </div>
  );
}
