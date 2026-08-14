"use client";

import React, { useState } from "react";
import { Brain, Layers, Database, Server, X, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { useSystemSound } from "../../hooks/useSystemSound";

interface Skill {
  name: string;
  level: number;
  years: number;
  projectsCount: number;
  related: string[];
}

const skillsData: Record<string, { icon: React.ReactNode; color: string; list: Skill[] }> = {
  frontend: {
    icon: <Layers size={16} />,
    color: "text-sky-400 border-sky-400/20 bg-sky-950/20",
    list: [
      { name: "React.js / Next.js", level: 90, years: 3, projectsCount: 4, related: ["JavaScript (ES6+)", "Tailwind CSS", "EJS"] },
      { name: "Tailwind CSS", level: 95, years: 3, projectsCount: 5, related: ["HTML5", "CSS3", "Responsive Design"] },
      { name: "JavaScript (ES6+)", level: 90, years: 4, projectsCount: 6, related: ["Node.js", "React.js", "Express.js"] },
      { name: "Responsive Web Design", level: 92, years: 4, projectsCount: 6, related: ["HTML5", "CSS3", "Tailwind CSS"] }
    ]
  },
  backend: {
    icon: <Server size={16} />,
    color: "text-emerald-400 border-emerald-400/20 bg-emerald-950/20",
    list: [
      { name: "Node.js / Express.js", level: 88, years: 3, projectsCount: 4, related: ["RESTful APIs", "Token Auth", "MVC Architecture"] },
      { name: "RESTful APIs / Token Auth", level: 85, years: 3, projectsCount: 4, related: ["Node.js", "Express.js", "Token Authentication"] },
      { name: "Python", level: 80, years: 2, projectsCount: 2, related: ["Data Science", "Backend Scripts", "Machine Learning"] },
      { name: "MVC Architecture", level: 85, years: 3, projectsCount: 4, related: ["Design Patterns", "Express.js", "Database Access"] }
    ]
  },
  infrastructure: {
    icon: <Database size={16} />,
    color: "text-amber-400 border-amber-400/20 bg-amber-950/20",
    list: [
      { name: "PostgreSQL / Supabase", level: 85, years: 2, projectsCount: 3, related: ["SQL Schemas", "Federated DB", "Real-time Sync"] },
      { name: "MongoDB / Firebase", level: 82, years: 2, projectsCount: 3, related: ["Cloud Firestore", "Auth", "NoSQL Database"] },
      { name: "PRDs & User Flows", level: 88, years: 1, projectsCount: 3, related: ["Product Discovery", "Requirements", "Specs"] },
      { name: "Developer Tools (Git/GitHub)", level: 90, years: 4, projectsCount: 6, related: ["Postman", "VS Code", "Cursor / Bolt"] }
    ]
  }
};

export default function SkillsApp() {
  const { playSound } = useSystemSound();
  const [activeCategory, setActiveCategory] = useState<keyof typeof skillsData>("frontend");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleSelectSkill = (skill: Skill) => {
    playSound("click");
    setSelectedSkill(selectedSkill?.name === skill.name ? null : skill);
  };

  const handleCategorySwitch = (cat: keyof typeof skillsData) => {
    playSound("click");
    setActiveCategory(cat);
    setSelectedSkill(null);
  };

  return (
    <div className="flex h-full w-full flex-col p-4 text-zinc-300 select-none font-sans sm:p-5 md:flex-row">
      {/* Category selector sidebar / top pills on mobile */}
      <div className="flex w-full shrink-0 gap-2 overflow-x-auto border-b border-sys-border pb-3 pr-0 select-none scrollbar-none md:w-48 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:pb-0 md:pr-4">
        <div className="hidden md:flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5 mb-2.5">
          <Brain size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Expertise Grid</span>
        </div>

        <button
          onClick={() => handleCategorySwitch("frontend")}
          className={clsx(
            "flex shrink-0 items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs transition-colors active:scale-95 md:w-full md:rounded-lg",
            activeCategory === "frontend" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/30 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-zinc-400"
          )}
        >
          <span>Client Frameworks</span>
          <span className="hidden md:inline-block text-[10px] text-zinc-500">4</span>
        </button>

        <button
          onClick={() => handleCategorySwitch("backend")}
          className={clsx(
            "flex shrink-0 items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs transition-colors active:scale-95 md:w-full md:rounded-lg",
            activeCategory === "backend" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/30 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-zinc-400"
          )}
        >
          <span>Server / APIs</span>
          <span className="hidden md:inline-block text-[10px] text-zinc-500">4</span>
        </button>

        <button
          onClick={() => handleCategorySwitch("infrastructure")}
          className={clsx(
            "flex shrink-0 items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs transition-colors active:scale-95 md:w-full md:rounded-lg",
            activeCategory === "infrastructure" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/30 font-bold" : "bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-zinc-400"
          )}
        >
          <span>Database / Cloud</span>
          <span className="hidden md:inline-block text-[10px] text-zinc-500">4</span>
        </button>
      </div>

      {/* Main content grid */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-0 pt-3 md:pl-5 md:pt-0 lg:flex-row">
        
        {/* Skills Cards Grid */}
        <div className="flex-1 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-sys-border pb-2 text-xs font-semibold text-zinc-400 select-none">
            {skillsData[activeCategory].icon}
            <span className="capitalize">{activeCategory} Core Technologies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsData[activeCategory].list.map((skill) => {
              const isSelected = selectedSkill?.name === skill.name;
              return (
                <div key={skill.name} className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSelectSkill(skill)}
                    className={clsx(
                      "p-3.5 rounded-2xl border text-left flex flex-col justify-between hover:bg-zinc-950/50 hover:border-sys-border-active active:scale-98 transition-all duration-200 select-none shadow-sm",
                      isSelected 
                        ? "border-sys-border-active bg-zinc-950/60 shadow-sys-accent/10" 
                        : "border-sys-border bg-zinc-950/30"
                    )}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">{skill.name}</span>
                      <span className="text-[11px] text-sys-accent font-mono font-semibold">{skill.level}%</span>
                    </div>
                    
                    {/* Level Progress Gauge Bar */}
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-sys-border mt-3">
                      <div 
                        className="h-full bg-gradient-to-r from-sys-accent to-purple-500 rounded-full transition-all duration-500" 
                        style={{ width: `${skill.level}%` }} 
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[9.5px] text-zinc-500 font-medium">
                      <span>{skill.years} Years Experience</span>
                      <span>{skill.projectsCount} Projects</span>
                    </div>
                  </button>

                  {/* Inline Mobile Drawer if selected on Mobile */}
                  {isSelected && (
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-sys-border-active text-xs space-y-3 lg:hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-100">{skill.name}</h4>
                        <button onClick={() => setSelectedSkill(null)} className="text-zinc-500 hover:text-zinc-200">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center font-mono">
                        <div className="p-2 rounded-lg bg-zinc-950/60 border border-sys-border">
                          <span className="text-sm font-bold text-zinc-100">{skill.years} yrs</span>
                          <p className="text-[9px] text-zinc-500 uppercase">Active</p>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-950/60 border border-sys-border">
                          <span className="text-sm font-bold text-zinc-100">{skill.projectsCount}</span>
                          <p className="text-[9px] text-zinc-500 uppercase">Projects</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">Related Stack</span>
                        <div className="flex flex-wrap gap-1">
                          {skill.related.map((t) => (
                            <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-950 border border-sys-border text-zinc-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Selected Skill Details Side View */}
        <div className="hidden lg:flex w-80 p-5 bg-zinc-950/40 border border-sys-border rounded-2xl flex-col justify-between gap-5 shrink-0">
          {selectedSkill ? (
            <div className="space-y-4 select-text">
              <div className="space-y-1 border-b border-sys-border pb-3">
                <h4 className="text-sm font-bold text-zinc-100">{selectedSkill.name}</h4>
                <p className="text-[10px] text-sys-accent font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Verified Engineering Skill
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 select-none">
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-sys-border text-center">
                  <p className="text-lg font-bold text-zinc-100 font-mono">{selectedSkill.years}</p>
                  <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Years Active</p>
                </div>
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-sys-border text-center">
                  <p className="text-lg font-bold text-zinc-100 font-mono">{selectedSkill.projectsCount}</p>
                  <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Projects Built</p>
                </div>
              </div>

              {/* Related Technologies */}
              <div className="space-y-2 select-none">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Integrated Technologies</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.related.map((t) => (
                    <span key={t} className="text-[9.5px] font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-sys-border text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-xs">
              <Brain size={36} className="text-sys-border mb-3 animate-pulse" />
              <span>Select any skill card to view years active, project history, and related framework integrations.</span>
            </div>
          )}
          
          <div className="text-[10px] text-zinc-600 font-mono select-none border-t border-sys-border/50 pt-2 text-center">
            CHIRAYU-OS SKILLS ENGINE
          </div>
        </div>
        
      </div>
    </div>
  );
}
