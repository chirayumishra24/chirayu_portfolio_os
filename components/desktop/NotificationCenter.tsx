"use client";

import React, { useState, useEffect } from "react";
import { useOSStore, OSNotification } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { Bell, X, Trash2, Check, MessageSquare, Trophy, Music, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";

const notifIcon = (type: OSNotification["type"]) => {
  switch (type) {
    case "success": return <Check size={14} className="text-emerald-400" />;
    case "achievement": return <Trophy size={14} className="text-amber-400" />;
    case "music": return <Music size={14} className="text-green-400" />;
    case "error": return <AlertCircle size={14} className="text-red-400" />;
    default: return <Info size={14} className="text-sky-400" />;
  }
};

const notifAccent = (type: OSNotification["type"]) => {
  switch (type) {
    case "success": return "border-l-emerald-500";
    case "achievement": return "border-l-amber-500";
    case "music": return "border-l-green-500";
    case "error": return "border-l-red-500";
    default: return "border-l-sky-500";
  }
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "Just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Toast Renderer (top-right floating toasts) ──────────────
export function NotificationToasts() {
  const { notifications } = useOSStore();
  const [visibleToasts, setVisibleToasts] = useState<OSNotification[]>([]);

  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    // Don't show if already visible
    if (visibleToasts.find((t) => t.id === latest.id)) return;

    setVisibleToasts((prev) => [latest, ...prev].slice(0, 3));

    const timer = setTimeout(() => {
      setVisibleToasts((prev) => prev.filter((t) => t.id !== latest.id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className="fixed top-14 right-4 z-[99998] flex flex-col gap-2 pointer-events-none max-w-sm">
      <AnimatePresence>
        {visibleToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={clsx(
              "pointer-events-auto rounded-xl border border-sys-border bg-zinc-950/90 backdrop-blur-xl p-3 flex gap-3 items-start shadow-2xl border-l-2",
              notifAccent(toast.type)
            )}
          >
            <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-800/80">{notifIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-zinc-100 truncate">{toast.title}</p>
              <p className="text-[10px] text-zinc-400 truncate">{toast.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Bell Icon + Dropdown Panel ──────────────────────────────
export default function NotificationCenter() {
  const { notifications, unreadCount, markAllRead, clearNotifications } = useOSStore();
  const { playSound } = useSystemSound();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    playSound("click");
    if (!open) markAllRead();
    setOpen(!open);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative flex items-center gap-1 hover:text-sys-text-primary transition-colors"
      >
        <Bell size={13} className={unreadCount > 0 ? "text-sys-accent" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[9990]" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute right-0 top-8 w-80 max-h-96 rounded-xl border border-sys-border bg-zinc-950/95 backdrop-blur-2xl shadow-2xl z-[9991] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-sys-border">
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Notifications</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={() => { clearNotifications(); playSound("click"); }}
                      className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={10} /> Clear
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto max-h-72 scrollbar-none">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                    <Bell size={28} className="mb-3 opacity-30" />
                    <p className="text-xs font-semibold">All caught up! 🎉</p>
                    <p className="text-[10px] mt-1">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={clsx(
                        "px-4 py-3 border-b border-sys-border/50 flex gap-3 items-start hover:bg-zinc-900/50 transition-colors border-l-2",
                        notifAccent(n.type),
                        !n.read && "bg-zinc-900/30"
                      )}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-800/60 shrink-0">{notifIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-bold text-zinc-200 truncate">{n.title}</p>
                          <span className="text-[9px] text-zinc-600 shrink-0 font-mono">{timeAgo(n.timestamp)}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
