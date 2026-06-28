"use client";

import React from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Award, Code, Globe, User, BookOpen, Coffee, HelpCircle, FileText } from "lucide-react";

export default function AboutApp() {
  const { openWindow } = useOSStore();
  const { playSound } = useSystemSound();

  const handleOpenResume = () => {
    playSound("click");
    openWindow("resume");
  };

  const stats = [
    { label: "B.Tech CGPA", value: "7.5", icon: <Award className="text-amber-500" /> },
    { label: "Completed Projects", value: "5+", icon: <Code className="text-sys-accent" /> },
    { label: "Backend Intern", value: "SkilliZee", icon: <Globe className="text-emerald-500" /> },
    { label: "Core Technologies", value: "MERN", icon: <Coffee className="text-rose-500" /> }
  ];

  return (
    <div className="w-full h-full p-6 space-y-6 text-zinc-300 font-sans select-text">
      {/* Hero Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-sys-border pb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sys-accent to-pink-500 p-0.5 shadow-xl select-none">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-2xl text-sys-accent">
            C
          </div>
        </div>
        
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-xl font-bold text-zinc-100">Chirayu Mishra</h2>
          <p className="text-xs text-sys-accent font-semibold uppercase tracking-wider font-mono">Full-Stack Developer &amp; Product Associate</p>
          <p className="text-xs text-sys-text-secondary">Bridging the gap between engineering, product design, and real-world user experiences.</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-zinc-950/40 rounded-xl border border-sys-border flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900">{stat.icon}</div>
            <div className="space-y-0.5">
              <p className="text-base font-bold text-zinc-100 leading-none">{stat.value}</p>
              <p className="text-[9px] text-sys-text-secondary uppercase font-bold tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Text Info Column */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Biography */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
            <User size={13} /> Biography
          </h3>
          <p className="text-xs leading-relaxed text-sys-text-secondary">
            Hello, I&apos;m Chirayu Mishra. I am a Full-Stack Developer and Product Associate with a strong foundation in building scalable web applications, optimizing user experience (UX), and steering cross-functional alignment between engineering and product design teams.
          </p>
          <p className="text-xs leading-relaxed text-sys-text-secondary">
            I specialize in the MERN stack and PostgreSQL, with experience in deploying AI-assisted developer environments and cloud serverless infrastructures. I enjoy technical product ownership, requirements elicitation, PRD writing, and managing end-to-end agile sprint delivery.
          </p>

          {/* Quick Actions */}
          <div className="pt-3">
            <button
              onClick={handleOpenResume}
              className="flex items-center gap-2 py-2 px-4 rounded bg-sys-accent/15 border border-sys-accent/30 hover:bg-sys-accent/25 text-sys-accent font-bold text-xs transition-all select-none"
            >
              <FileText size={12} />
              <span>Launch Resume Application</span>
            </button>
          </div>
        </div>

        {/* Interests & Side Facts */}
        <div className="space-y-4 bg-zinc-950/20 p-4 rounded-xl border border-sys-border">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
              <BookOpen size={12} /> Core Focus
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {["MERN Stack", "PostgreSQL", "PRD Authoring", "AI Prototyping", "User Research", "Agile Sprints"].map((tag, idx) => (
                <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-sys-border text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 select-none">
              <HelpCircle size={12} /> Passions
            </h4>
            <ul className="text-xs space-y-1.5 text-sys-text-secondary list-disc pl-4">
              <li>Technical product ownership</li>
              <li>Speech-to-text systems</li>
              <li>Minimalist UI/UX design</li>
              <li>Agile backlog grooming</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
