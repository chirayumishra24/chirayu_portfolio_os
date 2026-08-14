"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Gamepad2, Trophy, RotateCcw, Play, Brain, Grid3X3, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";

type GameType = "menu" | "snake" | "quiz" | "memory" | "tictactoe";

// ─── Snake Game ────────────────────────────────────────────
function SnakeGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const { playSound } = useSystemSound();
  const { unlockAchievement } = useOSStore();

  const setDirection = useCallback((x: number, y: number) => {
    const current = dirRef.current;
    if (x !== 0 && current.x === 0) dirRef.current = { x, y };
    if (y !== 0 && current.y === 0) dirRef.current = { x, y };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const gridSize = 20;
    const cols = canvas.width / gridSize;
    const rows = canvas.height / gridSize;

    const snake = [{ x: 5, y: 5 }];
    let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    let localScore = 0;

    const techLabels = ["TS", "Go", "Rx", "Nxt", "Py", "Rs", "Dk", "K8"];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") setDirection(0, -1);
      if (e.key === "ArrowDown" || e.key === "s") setDirection(0, 1);
      if (e.key === "ArrowLeft" || e.key === "a") setDirection(-1, 0);
      if (e.key === "ArrowRight" || e.key === "d") setDirection(1, 0);
    };
    window.addEventListener("keydown", handleKey);

    const interval = setInterval(() => {
      const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

      // Wall collision
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        clearInterval(interval);
        setGameOver(true);
        if (localScore >= 5) unlockAchievement("Snake Charmer");
        return;
      }

      // Self collision
      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        clearInterval(interval);
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        localScore++;
        setScore(localScore);
        playSound("success");
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
      ctx.fillStyle = "#000";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(techLabels[localScore % techLabels.length], food.x * gridSize + gridSize / 2, food.y * gridSize + 14);

      // Snake
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#7aa2f7" : "#3b82f6";
        ctx.beginPath();
        ctx.roundRect(s.x * gridSize + 1, s.y * gridSize + 1, gridSize - 2, gridSize - 2, 4);
        ctx.fill();
      });
    }, 120);

    return () => { clearInterval(interval); window.removeEventListener("keydown", handleKey); };
  }, [playSound, setDirection, unlockAchievement]);

  const restart = () => { setGameOver(false); setScore(0); dirRef.current = { x: 1, y: 0 }; };

  return (
    <div className="flex flex-col items-center gap-3 p-4 select-none h-full justify-between overflow-y-auto font-sans">
      <div className="flex items-center justify-between w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-sys-accent transition-colors">
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-sys-accent font-mono">Score: {score}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={360} 
        height={260} 
        className="w-full max-w-[360px] aspect-[18/13] rounded-2xl border border-sys-border bg-zinc-950 shadow-2xl shrink-0" 
      />

      {/* Touch D-Pad for Mobile */}
      <div className="grid grid-cols-3 gap-2 w-44 shrink-0">
        <span />
        <button onClick={() => setDirection(0, -1)} className="touch-target h-11 w-full rounded-xl border border-sys-border bg-zinc-900/80 text-sm font-bold active:scale-95 flex items-center justify-center">↑</button>
        <span />
        <button onClick={() => setDirection(-1, 0)} className="touch-target h-11 w-full rounded-xl border border-sys-border bg-zinc-900/80 text-sm font-bold active:scale-95 flex items-center justify-center">←</button>
        <button onClick={() => setDirection(0, 1)} className="touch-target h-11 w-full rounded-xl border border-sys-border bg-zinc-900/80 text-sm font-bold active:scale-95 flex items-center justify-center">↓</button>
        <button onClick={() => setDirection(1, 0)} className="touch-target h-11 w-full rounded-xl border border-sys-border bg-zinc-900/80 text-sm font-bold active:scale-95 flex items-center justify-center">→</button>
      </div>

      {gameOver && (
        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-red-400">Game Over! Score: {score}</p>
          <button onClick={restart} className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-sys-accent text-zinc-950 font-bold text-xs mx-auto active:scale-95">
            <RotateCcw size={12} /> Restart
          </button>
        </div>
      )}
    </div>
  );
}

// ─── JS Quiz ───────────────────────────────────────────────
const quizQuestions = [
  { q: "What does `typeof null` return?", opts: ['"null"', '"object"', '"undefined"', '"boolean"'], answer: 1 },
  { q: "What is `[] + []` in JavaScript?", opts: ['""', '"[]"', '0', 'undefined'], answer: 0 },
  { q: "What does `!!\"\"` evaluate to?", opts: ['true', 'false', '""', 'undefined'], answer: 1 },
  { q: "What is `0.1 + 0.2 === 0.3`?", opts: ['true', 'false', 'NaN', 'Error'], answer: 1 },
  { q: "What does `typeof NaN` return?", opts: ['"NaN"', '"number"', '"undefined"', '"object"'], answer: 1 },
];

function QuizGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const { playSound } = useSystemSound();
  const { unlockAchievement } = useOSStore();

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === quizQuestions[current].answer) {
      setScore((s) => s + 1);
      playSound("success");
    } else {
      playSound("error");
    }
    setTimeout(() => {
      if (current < quizQuestions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (score + (idx === quizQuestions[current].answer ? 1 : 0) >= 4) unlockAchievement("JS Guru");
      }
    }, 1200);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center select-none h-full font-sans">
        <Trophy size={44} className="text-amber-400" />
        <h3 className="text-sm font-bold text-zinc-100">Quiz Completed!</h3>
        <p className="text-xs text-sys-text-secondary">Final Score: {score}/{quizQuestions.length}</p>
        <button onClick={onBack} className="text-xs font-bold text-sys-accent hover:underline">← Back to Arcade</button>
      </div>
    );
  }

  const q = quizQuestions[current];
  return (
    <div className="flex flex-col items-center gap-4 p-5 max-w-md mx-auto select-none h-full justify-between font-sans">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-xs text-zinc-400 hover:text-sys-accent transition-colors">
        <ArrowLeft size={13} />
        <span>Back</span>
      </button>

      <div className="w-full space-y-3">
        <div className="text-[10px] text-zinc-500 font-mono text-center">Question {current + 1} of {quizQuestions.length}</div>
        <p className="text-sm font-bold text-zinc-100 text-center font-mono bg-zinc-900/60 p-4 rounded-2xl border border-sys-border">
          {q.q}
        </p>
      </div>

      <div className="w-full grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2">
        {q.opts.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={clsx(
              "py-3 px-4 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 text-center font-mono",
              selected === null && "bg-zinc-900/50 border-sys-border hover:border-sys-accent hover:bg-zinc-850 text-zinc-200",
              selected === idx && idx === q.answer && "bg-emerald-950 border-emerald-500 text-emerald-300",
              selected === idx && idx !== q.answer && "bg-red-950 border-red-500 text-red-300",
              selected !== null && idx === q.answer && selected !== idx && "bg-emerald-950/40 border-emerald-500/30 text-emerald-400",
              selected !== null && idx !== q.answer && selected !== idx && "opacity-40"
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      <span className="text-xs font-mono font-bold text-sys-accent">Current Score: {score}</span>
    </div>
  );
}

// ─── Memory Match ──────────────────────────────────────────
function MemoryGame({ onBack }: { onBack: () => void }) {
  const icons = ["⚛️", "🦀", "🐹", "🟦", "🐳", "⚡"];
  const [cards] = useState(() => {
    const doubled = [...icons, ...icons];
    return doubled.sort(() => Math.random() - 0.5).map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const { playSound } = useSystemSound();
  const { unlockAchievement } = useOSStore();

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.has(cards[idx].icon)) return;
    playSound("click");
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      if (cards[newFlipped[0]].icon === cards[newFlipped[1]].icon) {
        playSound("success");
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(cards[newFlipped[0]].icon);
          return next;
        });
        setFlipped([]);
        if (matched.size + 1 === icons.length) unlockAchievement("Memory Master");
      } else {
        setTimeout(() => { setFlipped([]); playSound("error"); }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-5 select-none h-full justify-between font-sans">
      <div className="flex items-center justify-between w-full max-w-xs">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-sys-accent transition-colors">
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-sys-accent font-mono">Moves: {moves}</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.has(card.icon);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(idx)}
              className={clsx(
                "h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border text-xl flex items-center justify-center transition-all duration-200 active:scale-95 font-mono",
                isFlipped ? "bg-zinc-900 border-sys-accent scale-105 shadow-lg" : "bg-zinc-950/60 border-sys-border hover:border-zinc-700"
              )}
            >
              {isFlipped ? card.icon : "?"}
            </button>
          );
        })}
      </div>

      {matched.size === icons.length ? (
        <p className="text-xs text-emerald-400 font-bold">🎉 Complete in {moves} moves!</p>
      ) : (
        <span className="text-[10px] text-zinc-500 font-mono">Match all pairs to win</span>
      )}
    </div>
  );
}

// ─── Tic Tac Toe ───────────────────────────────────────────
function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const { playSound } = useSystemSound();
  const { unlockAchievement } = useOSStore();

  const checkWinner = (b: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, bx, c] of lines) {
      if (b[a] && b[a] === b[bx] && b[a] === b[c]) return b[a];
    }
    return b.every(Boolean) ? "Draw" : null;
  };

  const aiMove = useCallback((b: (string | null)[]) => {
    const empties = b.map((v, i) => v === null ? i : -1).filter((i) => i !== -1);
    if (empties.length === 0) return;
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, bx, c] of lines) {
      const vals = [b[a], b[bx], b[c]];
      if (vals.filter((v) => v === "O").length === 2 && vals.includes(null)) {
        return [a, bx, c][vals.indexOf(null)];
      }
    }
    for (const [a, bx, c] of lines) {
      const vals = [b[a], b[bx], b[c]];
      if (vals.filter((v) => v === "X").length === 2 && vals.includes(null)) {
        return [a, bx, c][vals.indexOf(null)];
      }
    }
    if (b[4] === null) return 4;
    return empties[Math.floor(Math.random() * empties.length)];
  }, []);

  const handleClick = (idx: number) => {
    if (board[idx] || winner || !isX) return;
    playSound("click");
    const newBoard = [...board];
    newBoard[idx] = "X";
    const w = checkWinner(newBoard);
    setBoard(newBoard);
    if (w) { setWinner(w); if (w === "X") { unlockAchievement("Tic Tac Champion"); playSound("achievement"); } else playSound("error"); return; }
    setIsX(false);

    setTimeout(() => {
      const ai = aiMove(newBoard);
      if (ai !== undefined) {
        newBoard[ai] = "O";
        setBoard([...newBoard]);
        const w2 = checkWinner(newBoard);
        if (w2) { setWinner(w2); playSound("error"); }
      }
      setIsX(true);
    }, 400);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setIsX(true); setWinner(null); };

  return (
    <div className="flex flex-col items-center gap-4 p-5 select-none h-full justify-between font-sans">
      <button onClick={onBack} className="self-start flex items-center gap-1 text-xs text-zinc-400 hover:text-sys-accent transition-colors">
        <ArrowLeft size={13} />
        <span>Back</span>
      </button>

      <p className="text-xs text-zinc-400">Player is <span className="text-sys-accent font-bold">X</span>. Bot is <span className="text-pink-400 font-bold">O</span>.</p>
      
      <div className="grid grid-cols-3 gap-2.5">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={clsx(
              "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border text-2xl font-bold flex items-center justify-center transition-all duration-150 active:scale-95 font-mono",
              cell === "X" && "text-sys-accent bg-sys-accent/15 border-sys-accent/40 shadow",
              cell === "O" && "text-pink-400 bg-pink-950/40 border-pink-500/40 shadow",
              !cell && "bg-zinc-950/40 border-sys-border hover:border-zinc-600 hover:bg-zinc-900/40"
            )}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner ? (
        <div className="text-center space-y-2">
          <p className="text-xs font-bold">{winner === "Draw" ? "Game is a Draw!" : `${winner} wins!`}</p>
          <button onClick={reset} className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-sys-accent text-zinc-950 font-bold text-xs mx-auto active:scale-95">
            <RotateCcw size={12} /> Rematch
          </button>
        </div>
      ) : (
        <span className="text-[10px] text-zinc-500 font-mono">Turn: {isX ? "Your Move" : "AI Thinking..."}</span>
      )}
    </div>
  );
}

// ─── Main Arcade Launcher ──────────────────────────────────
export default function GamesApp() {
  const [activeGame, setActiveGame] = useState<GameType>("menu");
  const { playSound } = useSystemSound();

  const games = [
    { id: "snake" as GameType, label: "Snake Game", desc: "Collect tech tokens", icon: <Play size={20} />, color: "from-emerald-500 to-teal-600" },
    { id: "quiz" as GameType, label: "JS Trivia Quiz", desc: "Test frontend knowledge", icon: <Brain size={20} />, color: "from-violet-500 to-purple-600" },
    { id: "memory" as GameType, label: "Memory Match", desc: "Pair developer icons", icon: <Grid3X3 size={20} />, color: "from-amber-500 to-orange-600" },
    { id: "tictactoe" as GameType, label: "Tic Tac Toe AI", desc: "Beat the minimax bot", icon: <Gamepad2 size={20} />, color: "from-sky-500 to-blue-600" },
  ];

  if (activeGame === "snake") return <SnakeGame onBack={() => setActiveGame("menu")} />;
  if (activeGame === "quiz") return <QuizGame onBack={() => setActiveGame("menu")} />;
  if (activeGame === "memory") return <MemoryGame onBack={() => setActiveGame("menu")} />;
  if (activeGame === "tictactoe") return <TicTacToeGame onBack={() => setActiveGame("menu")} />;

  return (
    <div className="h-full w-full space-y-4 overflow-y-auto p-4 text-zinc-300 select-none font-sans sm:p-6">
      <div className="flex items-center gap-2 text-sys-accent border-b border-sys-border pb-3">
        <Gamepad2 size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">Arcade Games Center</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => { playSound("click"); setActiveGame(game.id); }}
            className="p-4 rounded-2xl border border-sys-border bg-zinc-950/30 hover:bg-zinc-950/60 hover:border-sys-border-active active:scale-98 transition-all duration-200 flex items-center gap-4 text-left group"
          >
            <div className={clsx("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0", game.color)}>
              {game.icon}
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-zinc-100">{game.label}</h4>
              <p className="text-[11px] text-sys-text-secondary">{game.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-[10px] text-zinc-500 text-center pt-2">
        <Trophy size={12} className="inline mr-1 text-amber-400" />
        High scores and game achievements unlock OS badges.
      </div>
    </div>
  );
}
