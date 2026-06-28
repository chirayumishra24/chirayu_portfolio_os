"use client";

import React, { useState } from "react";
import { Brain, Layers, Database, Server } from "lucide-react";
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
    setSelectedSkill(skill);
  };

  const handleCategorySwitch = (cat: keyof typeof skillsData) => {
    playSound("click");
    setActiveCategory(cat);
    setSelectedSkill(null);
  };

  return (
    <div className="w-full h-full p-5 flex flex-col md:flex-row text-zinc-300 font-sans select-none">
      {/* Category selector left sidebar */}
      <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-sys-border pr-0 md:pr-4 pb-4 md:pb-0 flex md:flex-col gap-2 shrink-0 select-none">
        <div className="hidden md:flex items-center gap-2 text-sys-accent border-b border-sys-border pb-2.5 mb-2.5">
          <Brain size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Expertise Grid</span>
        </div>

        <button
          onClick={() => handleCategorySwitch("frontend")}
          className={clsx(
            "flex-1 md:flex-initial py-2.5 px-3.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors",
            activeCategory === "frontend" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-zinc-400"
          )}
        >
          <span>Client Frameworks</span>
          <span className="hidden md:inline-block text-[10px] text-zinc-500">4 Items</span>
        </button>

        <button
          onClick={() => handleCategorySwitch("backend")}
          className={clsx(
            "flex-1 md:flex-initial py-2.5 px-3.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors",
            activeCategory === "backend" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-zinc-400"
          )}
        >
          <span>Server / APIs</span>
          <span className="hidden md:inline-block text-[10px] text-zinc-500">4 Items</span>
        </button>

        <button
          onClick={() => handleCategorySwitch("infrastructure")}
          className={clsx(
            "flex-1 md:flex-initial py-2.5 px-3.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors",
            activeCategory === "infrastructure" ? "bg-sys-accent/15 text-sys-accent border border-sys-accent/20" : "bg-zinc-900/40 hover:bg-zinc-900 border border-sys-border text-zinc-400"
          )}
        >
          <span>Database / Cloud</span>
          <span className="hidden md:inline-block text-[10px] text-zinc-500">4 Items</span>
        </button>
      </div>

      {/* Main content grid */}
      <div className="flex-1 flex flex-col lg:flex-row p-0 md:pl-5 pt-4 md:pt-0 overflow-auto gap-5 min-w-0">
        
        {/* Skills Cards Grid */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 border-b border-sys-border pb-2 text-xs font-semibold text-zinc-400 select-none">
            {skillsData[activeCategory].icon}
            <span className="capitalize">{activeCategory} Core technologies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {skillsData[activeCategory].list.map((skill) => (
              <button
                key={skill.name}
                onClick={() => handleSelectSkill(skill)}
                className={clsx(
                  "p-4 rounded-xl border text-left flex flex-col justify-between hover:bg-zinc-950/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 select-none",
                  selectedSkill?.name === skill.name 
                    ? "border-sys-border-active bg-zinc-950/40" 
                    : "border-sys-border bg-zinc-950/20"
                )}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">{skill.name}</span>
                  <span className="text-[10px] text-sys-accent font-semibold">{skill.level}%</span>
                </div>
                
                {/* Level Gauge Bar */}
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-sys-border mt-3">
                  <div className="h-full bg-sys-accent rounded-full transition-all duration-500" style={{ width: `${skill.level}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Skill Details Side View */}
        <div className="w-full lg:w-80 p-5 bg-zinc-950/40 border border-sys-border rounded-xl flex flex-col justify-between gap-5 shrink-0">
          {selectedSkill ? (
            <div className="space-y-4 select-text">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">{selectedSkill.name}</h4>
                <p className="text-[10px] text-sys-accent font-semibold">Technical breakdown</p>
              </div>

              <div className="grid grid-cols-2 gap-3 select-none">
                <div className="p-3 bg-zinc-950/50 rounded-lg border border-sys-border text-center">
                  <p className="text-base font-bold text-zinc-200">{selectedSkill.years}</p>
                  <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Years Active</p>
                </div>
                <div className="p-3 bg-zinc-950/50 rounded-lg border border-sys-border text-center">
                  <p className="text-base font-bold text-zinc-200">{selectedSkill.projectsCount}</p>
                  <p className="text-[9px] uppercase font-bold tracking-wider text-sys-text-secondary mt-0.5">Projects Built</p>
                </div>
              </div>

              {/* Related Technologies */}
              <div className="space-y-2 select-none">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Related Stack Integration</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.related.map((t) => (
                    <span key={t} className="text-[9px] font-bold px-2.5 py-0.5 rounded bg-zinc-900 border border-sys-border text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-xs">
              <Brain size={35} className="text-sys-border mb-3 animate-pulse" />
              <span>Select a technology card to view in-depth details, years active, and related integrations.</span>
            </div>
          )}
          
          <div className="text-[10px] text-zinc-500 font-mono select-none">
            CHIRAYU-OS SKILLS ENGINE
          </div>
        </div>
        
      </div>
    </div>
  );
}
