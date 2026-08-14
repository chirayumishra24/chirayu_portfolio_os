"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import {
  FolderOpen, File, ChevronRight, ArrowLeft, RefreshCw,
  FileCode, FileJson, FileText, FileImage, Loader2, Home
} from "lucide-react";
import { clsx } from "clsx";

interface FileItem {
  name: string;
  type: "file" | "dir";
  size: number;
  path: string;
}

interface FileContent {
  name: string;
  path: string;
  size: number;
  content: string;
  language: string;
}

const extColorMap: Record<string, string> = {
  ts: "text-blue-400", tsx: "text-cyan-400", js: "text-yellow-400", jsx: "text-yellow-300",
  css: "text-purple-400", html: "text-orange-400", json: "text-amber-400", md: "text-zinc-300",
  py: "text-green-400", rs: "text-orange-500", go: "text-sky-400", prisma: "text-teal-400",
  env: "text-zinc-500", lock: "text-zinc-600", gitignore: "text-zinc-500",
  png: "text-pink-400", jpg: "text-pink-400", svg: "text-pink-300", ico: "text-pink-300",
  pdf: "text-red-400",
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "gif", "svg", "ico", "webp"].includes(ext)) return <FileImage size={14} />;
  if (["json", "lock"].includes(ext)) return <FileJson size={14} />;
  if (["md", "txt", "env", "gitignore"].includes(ext)) return <FileText size={14} />;
  if (["ts", "tsx", "js", "jsx", "py", "rs", "go", "css", "html", "prisma", "sh", "sql"].includes(ext)) return <FileCode size={14} />;
  return <File size={14} />;
}

function getFileColor(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return extColorMap[ext] || "text-zinc-400";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileManagerApp() {
  const { unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();
  const { isMobile } = useResponsiveMode();

  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [hasOpenedFile, setHasOpenedFile] = useState(false);
  const [repo] = useState("chirayu_portfolio_os");

  const fetchDir = useCallback(async (path: string) => {
    setLoading(true);
    setSelectedFile(null);
    try {
      const res = await fetch(`/api/github/files?repo=${repo}&path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        setCurrentPath(path);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  const fetchFile = async (path: string) => {
    setFileLoading(true);
    playSound("click");
    try {
      const res = await fetch(`/api/github/files?repo=${repo}&file=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.content !== undefined) {
        setSelectedFile(data);

        if (!hasOpenedFile) {
          setHasOpenedFile(true);
          unlockAchievement("Source Diver");
        }
      }
    } catch {
      setSelectedFile(null);
    } finally {
      setFileLoading(false);
    }
  };

  useEffect(() => {
    fetchDir("");
  }, [fetchDir]);

  const navigateTo = (path: string) => {
    playSound("click");
    fetchDir(path);
  };

  const goUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    navigateTo(parts.join("/"));
  };

  const breadcrumbs = currentPath ? currentPath.split("/").filter(Boolean) : [];

  return (
    <div className="w-full h-full flex flex-col text-zinc-300 font-sans select-text">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-sys-border bg-zinc-950/70 shrink-0">
        <button
          onClick={goUp}
          disabled={!currentPath}
          aria-label="Go to parent directory"
          className="touch-target p-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-30 transition-colors active:scale-95 sm:min-h-0 sm:min-w-0"
        >
          <ArrowLeft size={14} />
        </button>
        <button
          onClick={() => navigateTo("")}
          aria-label="Go to root repository directory"
          className="touch-target p-1.5 rounded-lg hover:bg-zinc-800 transition-colors active:scale-95 sm:min-h-0 sm:min-w-0"
        >
          <Home size={14} />
        </button>
        <button
          onClick={() => fetchDir(currentPath)}
          aria-label="Refresh current directory"
          className="touch-target p-1.5 rounded-lg hover:bg-zinc-800 transition-colors active:scale-95 sm:min-h-0 sm:min-w-0"
        >
          <RefreshCw size={14} />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 ml-2 flex-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => navigateTo("")}
            className="text-[10.5px] font-bold text-sys-accent hover:underline shrink-0"
          >
            {repo}
          </button>
          {breadcrumbs.map((part, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={10} className="text-zinc-600 shrink-0" />
              <button
                onClick={() => navigateTo(breadcrumbs.slice(0, i + 1).join("/"))}
                className="text-[10.5px] font-semibold text-zinc-300 hover:text-sys-accent hover:underline shrink-0 font-mono"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* File List (Left Panel / Full on Mobile) */}
        <div className={clsx(
          "overflow-y-auto scrollbar-thin border-r border-sys-border overscroll-contain",
          selectedFile && isMobile ? "hidden" : "w-full",
          selectedFile && !isMobile && "w-[260px] shrink-0"
        )}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={22} className="animate-spin text-sys-accent" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-6 text-center">
              <FolderOpen size={32} className="mb-2 opacity-30" />
              <p className="text-xs">No files in this directory</p>
            </div>
          ) : (
            <div className="py-1">
              {currentPath && (
                <button
                  onClick={goUp}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-800/50 transition-colors text-left"
                >
                  <ArrowLeft size={13} className="text-zinc-500" />
                  <span className="text-xs text-zinc-500 font-mono">..</span>
                </button>
              )}
              {items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => item.type === "dir" ? navigateTo(item.path) : fetchFile(item.path)}
                  className={clsx(
                    "w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-zinc-800/50 transition-colors text-left group active:scale-98",
                    selectedFile?.path === item.path && "bg-sys-accent/10 border-l-2 border-l-sys-accent"
                  )}
                >
                  {item.type === "dir" ? (
                    <FolderOpen size={15} className="text-amber-400 shrink-0" />
                  ) : (
                    <span className={clsx("shrink-0", getFileColor(item.name))}>
                      {getFileIcon(item.name)}
                    </span>
                  )}
                  <span className="text-xs font-mono truncate flex-1 group-hover:text-zinc-100">
                    {item.name}
                  </span>
                  {item.type === "file" && (
                    <span className="text-[10px] text-zinc-500 shrink-0 font-mono">{formatSize(item.size)}</span>
                  )}
                  {item.type === "dir" && (
                    <ChevronRight size={13} className="text-zinc-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File Preview (Right Panel / Full on Mobile) */}
        {selectedFile && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* File Header */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-sys-border bg-zinc-900/40 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {isMobile && (
                  <button
                    onClick={() => {
                      playSound("click");
                      setSelectedFile(null);
                    }}
                    className="mr-1 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
                    title="Back to file list"
                  >
                    <ArrowLeft size={15} />
                  </button>
                )}
                <span className={getFileColor(selectedFile.name)}>
                  {getFileIcon(selectedFile.name)}
                </span>
                <span className="text-xs font-bold text-zinc-200 truncate font-mono">{selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9.5px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono uppercase">{selectedFile.language}</span>
                <span className="text-[9.5px] text-zinc-500 font-mono">{formatSize(selectedFile.size)}</span>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto scrollbar-thin p-3 bg-zinc-950/40 font-mono text-[11px] leading-relaxed">
              {fileLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={22} className="animate-spin text-sys-accent" />
                </div>
              ) : (
                <pre className="text-zinc-200 whitespace-pre overflow-x-auto">
                  {selectedFile.content.split("\n").map((line, i) => (
                    <div key={i} className="flex hover:bg-zinc-800/30 transition-colors">
                      <span className="w-8 shrink-0 text-right pr-3 text-zinc-600 select-none">{i + 1}</span>
                      <span className="flex-1">{line || " "}</span>
                    </div>
                  ))}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
