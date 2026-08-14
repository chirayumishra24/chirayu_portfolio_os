"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Play, RotateCcw, Trash2, Code, Terminal, Zap } from "lucide-react";
import { clsx } from "clsx";
import { profile } from "../../data/portfolio";

const templates = {
  basic: `// Welcome to ChirayuOS JavaScript Sandbox
// Support async/await, promises, and console.log

console.log("Hello, World!");

const user = {
  name: "${profile.name}",
  role: "${profile.role}",
  focus: "Full-stack development + product execution"
};

console.log("Developer Profile:", user);
`,
  fibonacci: `// Fibonacci Sequence Generator
function fibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

console.log("First 15 Fibonacci numbers:");
console.log(fibonacci(15));
`,
  async: `// Async/Await API Fetching
console.log("Fetching random programming quote...");

async function fetchQuote() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();
    console.log(\`Quote: "\${data.quote}"\`);
    console.log(\`Author: \${data.author}\`);
  } catch (error) {
    console.log("Fallback quote:");
    console.log('"Code is like humor. When you have to explain it, it is bad." - Cory House');
  }
}

await fetchQuote();
`
};

export default function PlaygroundApp() {
  const { theme, unlockAchievement } = useOSStore();
  const { playSound } = useSystemSound();
  
  const [code, setCode] = useState(templates.basic);
  const [consoleLogs, setConsoleLogs] = useState<{ type: "log" | "error" | "info"; text: string }[]>([]);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "console">("editor");
  const sandboxRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleSandboxMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "log") {
        setConsoleLogs((prev) => [...prev, { type: "log", text: msg.data }]);
      } else if (msg.type === "error") {
        setIsRunning(false);
        setConsoleLogs((prev) => [...prev, { type: "error", text: `Error: ${msg.data}` }]);
      } else if (msg.type === "success") {
        setIsRunning(false);
        setExecTime(msg.duration);
        setConsoleLogs((prev) => [...prev, { type: "info", text: `Execution finished successfully.` }]);
        unlockAchievement("Code Runner");
      }
    };

    window.addEventListener("message", handleSandboxMessage);
    return () => window.removeEventListener("message", handleSandboxMessage);
  }, [unlockAchievement]);

  const handleRun = () => {
    playSound("click");
    setConsoleLogs([{ type: "info", text: "Compiling and executing code in sandbox..." }]);
    setIsRunning(true);
    setExecTime(null);
    setMobileTab("console");

    if (sandboxRef.current && sandboxRef.current.contentWindow) {
      sandboxRef.current.contentWindow.postMessage({ type: "run", code }, "*");
    }
  };

  const handleClear = () => {
    playSound("click");
    setConsoleLogs([]);
    setExecTime(null);
  };

  const handleReset = () => {
    playSound("error");
    setCode(templates.basic);
    setConsoleLogs([{ type: "info", text: "Editor code reset to default template." }]);
    setExecTime(null);
  };

  const loadTemplate = (key: keyof typeof templates) => {
    playSound("click");
    setCode(templates[key]);
    setConsoleLogs([{ type: "info", text: `Loaded template: ${key}` }]);
    setExecTime(null);
  };

  const monacoTheme = theme === "githublight" || theme === "minimalwhite" ? "vs-light" : "vs-dark";

  return (
    <div className="flex h-full w-full flex-col text-zinc-300 select-text md:flex-row font-sans">
      {/* Hidden Execution Sandbox Iframe */}
      <iframe
        ref={sandboxRef}
        className="hidden"
        sandbox="allow-scripts"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <script>
                window.addEventListener('error', (e) => {
                  window.parent.postMessage({ type: 'error', data: e.message }, '*');
                });
                window.console.log = (...args) => {
                  const dataStr = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
                  window.parent.postMessage({ type: 'log', data: dataStr }, '*');
                };
                window.addEventListener('message', async (e) => {
                  if (e.data.type === 'run') {
                    const start = performance.now();
                    try {
                      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                      const userFn = new AsyncFunction(e.data.code);
                      await userFn();
                      const duration = performance.now() - start;
                      window.parent.postMessage({ type: 'success', duration }, '*');
                    } catch (err) {
                      window.parent.postMessage({ type: 'error', data: err.message }, '*');
                    }
                  }
                });
              </script>
            </head>
            <body></body>
          </html>
        `}
      />

      {/* Sidebar Controls */}
      <div className="flex w-full shrink-0 flex-col gap-2.5 border-b border-sys-border bg-zinc-950/70 p-3 font-sans select-none md:w-52 md:justify-between md:border-b-0 md:border-r md:p-4">
        <div className="space-y-2.5 md:space-y-4">
          <div className="flex items-center justify-between border-b border-sys-border pb-2">
            <div className="flex items-center gap-2 text-sys-accent">
              <Code size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">JS Sandbox</span>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-sys-border md:hidden">
              <button
                onClick={() => setMobileTab("editor")}
                className={clsx(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase",
                  mobileTab === "editor" ? "bg-sys-accent text-zinc-950" : "text-zinc-400"
                )}
              >
                Code
              </button>
              <button
                onClick={() => setMobileTab("console")}
                className={clsx(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1",
                  mobileTab === "console" ? "bg-sys-accent text-zinc-950" : "text-zinc-400"
                )}
              >
                Logs
                {consoleLogs.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>
          </div>

          {/* Code Templates */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] uppercase font-bold text-zinc-500 tracking-wide">Templates</span>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none md:block md:space-y-1.5 md:overflow-visible">
              <button
                onClick={() => loadTemplate("basic")}
                className="shrink-0 rounded-xl border border-sys-border bg-zinc-900/60 px-3 py-1.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-850 active:scale-95 md:w-full md:rounded-lg"
              >
                Hello Profile
              </button>
              <button
                onClick={() => loadTemplate("fibonacci")}
                className="shrink-0 rounded-xl border border-sys-border bg-zinc-900/60 px-3 py-1.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-850 active:scale-95 md:w-full md:rounded-lg"
              >
                Fibonacci
              </button>
              <button
                onClick={() => loadTemplate("async")}
                className="shrink-0 rounded-xl border border-sys-border bg-zinc-900/60 px-3 py-1.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-850 active:scale-95 md:w-full md:rounded-lg"
              >
                Async API
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:flex-col">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs transition-colors shadow-lg shadow-green-950/20 active:scale-95 disabled:opacity-50 md:w-full md:rounded-lg"
          >
            <Play size={13} fill="currentColor" />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>
          
          <button
            onClick={handleClear}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-sys-border text-xs transition-colors active:scale-95 md:w-full md:rounded-lg"
            title="Clear Console"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline md:inline">Clear Logs</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-sys-border text-xs transition-colors text-red-400 active:scale-95 md:w-full md:rounded-lg"
            title="Reset Template"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split View */}
      <div className="flex min-h-0 flex-1 flex-col md:min-w-0">
        {/* Editor Area */}
        <div className={clsx(
          "min-h-[220px] flex-1 border-b border-sys-border",
          mobileTab !== "editor" && "hidden md:block"
        )}>
          <Editor
            height="100%"
            language="javascript"
            theme={monacoTheme}
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              minimap: { enabled: false },
              automaticLayout: true,
              tabSize: 2,
              lineNumbersMinChars: 3,
              cursorBlinking: "smooth",
            }}
          />
        </div>

        {/* Console Logs Area */}
        <div className={clsx(
          "flex h-52 flex-col bg-zinc-950/90 p-3.5 text-xs select-text font-mono sm:h-56",
          mobileTab !== "console" && "hidden md:flex"
        )}>
          {/* Header info */}
          <div className="flex items-center justify-between border-b border-sys-border/50 pb-2 mb-2 text-zinc-500 select-none">
            <span className="flex items-center gap-1.5 font-sans font-semibold text-[10px] uppercase tracking-wider text-zinc-400">
              <Terminal size={12} /> Output Console
            </span>
            {execTime !== null && (
              <span className="flex items-center gap-1 text-[10px] text-sys-accent font-semibold">
                <Zap size={10} /> Executed in {execTime.toFixed(1)}ms
              </span>
            )}
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
            {consoleLogs.length > 0 ? (
              consoleLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "whitespace-pre-wrap leading-relaxed",
                    log.type === "info" && "text-zinc-500",
                    log.type === "error" && "text-red-400 border-l-2 border-red-500 pl-2",
                    log.type === "log" && "text-zinc-200 font-mono"
                  )}
                >
                  {log.text}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 font-sans text-xs select-none">
                Run JavaScript script above to view real-time console outputs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
