"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { AppId, useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { X, Minus, Square, Minimize2, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface WindowFrameProps {
  id: AppId;
  children: React.ReactNode;
}

export default function WindowFrame({ id, children }: WindowFrameProps) {
  const { 
    windows, 
    activeWindowId, 
    focusWindow, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    updateWindowPosition, 
    updateWindowSize 
  } = useOSStore();
  
  const { playSound } = useSystemSound();
  const windowState = windows[id];
  const frameRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });
  const { isMobile } = useResponsiveMode();

  // Touch swipe-down to close on mobile
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);

  const isActive = activeWindowId === id;

  const handleClose = useCallback(() => {
    playSound("click");
    closeWindow(id);
  }, [closeWindow, id, playSound]);

  const handleMinimize = useCallback(() => {
    playSound("click");
    minimizeWindow(id);
  }, [id, minimizeWindow, playSound]);

  const handleMaximize = useCallback(() => {
    if (isMobile) return;
    playSound("click");
    maximizeWindow(id);
  }, [isMobile, id, maximizeWindow, playSound]);

  // Handle Desktop Mouse Dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (windowState.isMaximized || isMobile) return;
    if ((e.target as HTMLElement).closest("button")) return;
    
    focusWindow(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
    e.preventDefault();
  };

  // Handle Desktop Resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    if (windowState?.isMaximized || isMobile) return;
    focusWindow(id);
    setIsResizing(true);
    setResizeStart({
      w: windowState?.width ?? 0,
      h: windowState?.height ?? 0,
      x: e.clientX,
      y: e.clientY
    });
    e.preventDefault();
    e.stopPropagation();
  };

  // Touch swipe to dismiss on mobile header
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStartY(e.touches[0].clientY);
    setTouchDeltaY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStartY === null) return;
    const delta = e.touches[0].clientY - touchStartY;
    if (delta > 0) {
      setTouchDeltaY(delta);
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    if (touchDeltaY > 120) {
      handleClose();
    }
    setTouchStartY(null);
    setTouchDeltaY(0);
  };

  const [snapPreview, setSnapPreview] = useState<"left" | "right" | "top" | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMobile) {
        const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
        updateWindowPosition(id, newX, newY);

        // Aero Snap Edge Detection
        if (e.clientX < 25) {
          setSnapPreview("left");
        } else if (e.clientX > window.innerWidth - 25) {
          setSnapPreview("right");
        } else if (e.clientY < 35) {
          setSnapPreview("top");
        } else {
          setSnapPreview(null);
        }
      }

      if (isResizing && !isMobile) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(300, resizeStart.w + deltaX);
        const newHeight = Math.max(200, resizeStart.h + deltaY);
        updateWindowSize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && !isMobile) {
        if (e.clientX < 25) {
          // Snap Left 50%
          playSound("click");
          updateWindowPosition(id, 0, 36);
          updateWindowSize(id, Math.floor(window.innerWidth / 2), window.innerHeight - 36 - 60);
        } else if (e.clientX > window.innerWidth - 25) {
          // Snap Right 50%
          playSound("click");
          updateWindowPosition(id, Math.floor(window.innerWidth / 2), 36);
          updateWindowSize(id, Math.floor(window.innerWidth / 2), window.innerHeight - 36 - 60);
        } else if (e.clientY < 35) {
          // Maximize
          playSound("click");
          maximizeWindow(id);
        }
      }

      setIsDragging(false);
      setIsResizing(false);
      setSnapPreview(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, id, updateWindowPosition, updateWindowSize, isMobile, maximizeWindow, playSound]);

  if (!windowState || !windowState.isOpen || windowState.isMinimized) return null;

  return (
    <>
      {/* Aero Snap Ghost Preview Overlay */}
      {snapPreview && !isMobile && (
        <div
          style={{
            position: "fixed",
            left: snapPreview === "right" ? "50vw" : 0,
            top: "var(--topbar-height)",
            width: snapPreview === "top" ? "100vw" : "50vw",
            height: "calc(100vh - var(--topbar-height) - var(--dock-height))",
            zIndex: 99998,
          }}
          className="pointer-events-none rounded-xl border-2 border-sys-accent bg-sys-accent/15 backdrop-blur-sm shadow-2xl transition-all duration-150 animate-pulse"
        />
      )}

      <div
        ref={frameRef}
        onClick={() => focusWindow(id)}
      style={{
        position: isMobile ? "fixed" : "absolute",
        left: (windowState.isMaximized || isMobile) ? 0 : windowState.x,
        top: (windowState.isMaximized || isMobile) ? "var(--topbar-height)" : windowState.y,
        width: (windowState.isMaximized || isMobile) ? "100vw" : windowState.width,
        height: (windowState.isMaximized || isMobile)
          ? "calc(100dvh - var(--topbar-height) - var(--dock-height) - var(--safe-bottom))"
          : windowState.height,
        zIndex: windowState.zIndex,
        transform: isMobile && touchDeltaY > 0 ? `translateY(${touchDeltaY}px)` : undefined,
        transition: isDragging || touchDeltaY > 0 ? "none" : "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={clsx(
        "glass-panel flex flex-col overflow-hidden border shadow-2xl select-text pointer-events-auto",
        isMobile ? "rounded-t-2xl border-t-2 border-b-0 border-x-0 sm:rounded-none" : "rounded-xl",
        isActive ? "border-sys-border-active shadow-sys-accent/15" : "border-sys-border",
        isDragging && "opacity-90 scale-[0.99]"
      )}
    >
      {/* Mobile drag-down indicator */}
      {isMobile && (
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full flex items-center justify-center pt-1.5 pb-0.5 bg-zinc-950/70 select-none cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1 rounded-full bg-zinc-600/80" />
        </div>
      )}

      {/* Header Bar */}
      <div
        onMouseDown={handleDragStart}
        onDoubleClick={handleMaximize}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={clsx(
          "h-10 px-3 sm:px-4 flex items-center justify-between border-b select-none shrink-0 font-sans text-xs tracking-wide",
          (windowState.isMaximized || isMobile) ? "cursor-default" : "cursor-move",
          isActive ? "bg-zinc-950/60 text-sys-text-primary border-sys-border-active/40" : "bg-zinc-950/30 text-sys-text-secondary border-sys-border"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isMobile && (
            <button
              onClick={handleClose}
              className="p-1 -ml-1 text-sys-text-secondary hover:text-sys-text-primary active:scale-95"
              aria-label="Dismiss app sheet"
            >
              <ChevronDown size={18} className="text-sys-accent" />
            </button>
          )}
          <span className="truncate font-semibold text-xs text-zinc-100">{windowState.title}</span>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Minimize */}
          <button
            onClick={handleMinimize}
            aria-label={`Minimize ${windowState.title}`}
            className="flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-300 sm:text-transparent transition-all duration-150 hover:bg-yellow-500/80 hover:text-yellow-950 active:scale-90"
            title="Minimize"
          >
            <Minus size={11} className="sm:w-2 sm:h-2" />
          </button>
          
          {/* Maximize (Desktop only) */}
          {!isMobile && (
            <button
              onClick={handleMaximize}
              aria-label={windowState.isMaximized ? `Restore ${windowState.title}` : `Maximize ${windowState.title}`}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-transparent transition-all duration-150 hover:bg-green-500/80 hover:text-green-950 active:scale-90"
              title={windowState.isMaximized ? "Restore" : "Maximize"}
            >
              {windowState.isMaximized ? <Minimize2 size={9} /> : <Square size={8} />}
            </button>
          )}

          {/* Close */}
          <button
            onClick={handleClose}
            aria-label={`Close ${windowState.title}`}
            className="flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500/20 text-red-300 sm:text-transparent transition-all duration-150 hover:bg-red-500/80 hover:text-red-950 active:scale-90"
            title="Close"
          >
            <X size={11} className="sm:w-2.5 sm:h-2.5" />
          </button>
        </div>
      </div>

      {/* Body Area */}
      <div className="min-h-0 flex-1 overflow-auto bg-zinc-950/40 overscroll-contain">
        {children}
      </div>

      {/* Desktop Resize Handle */}
      {!windowState.isMaximized && !isMobile && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-50 select-none"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className="text-sys-text-secondary opacity-60">
            <line x1="6" y1="0" x2="6" y2="6" stroke="currentColor" strokeWidth="1" />
            <line x1="3" y1="3" x2="6" y2="3" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="6" x2="6" y2="6" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
    </>
  );
}
