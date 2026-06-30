"use client";

import React, { useRef, useState, useEffect } from "react";
import { AppId, useOSStore } from "../../store/osStore";
import { useSystemSound } from "../../hooks/useSystemSound";
import { X, Minus, Square, Minimize2 } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  const isActive = activeWindowId === id;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (windowState.isMaximized || isMobile) return;
    if ((e.target as HTMLElement).closest("button")) return; // Don't drag if clicking buttons
    
    focusWindow(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
    e.preventDefault();
  };

  // Handle Resizing
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMobile) {
        // Enforce boundary checks
        const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
        updateWindowPosition(id, newX, newY);
      }

      if (isResizing && !isMobile) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(300, resizeStart.w + deltaX);
        const newHeight = Math.max(200, resizeStart.h + deltaY);
        updateWindowSize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, id, updateWindowPosition, updateWindowSize, isMobile]);

  const handleClose = () => {
    playSound("click");
    closeWindow(id);
  };

  const handleMinimize = () => {
    playSound("click");
    minimizeWindow(id);
  };

  const handleMaximize = () => {
    playSound("click");
    maximizeWindow(id);
  };

  if (!windowState || !windowState.isOpen || windowState.isMinimized) return null;

  return (
    <div
      ref={frameRef}
      onClick={() => focusWindow(id)}
      style={{
        position: "absolute",
        left: (windowState.isMaximized || isMobile) ? 0 : windowState.x,
        top: (windowState.isMaximized || isMobile) ? 40 : windowState.y, // Leave space for top system bar
        width: (windowState.isMaximized || isMobile) ? "100%" : windowState.width,
        height: (windowState.isMaximized || isMobile) ? "calc(100vh - 88px)" : windowState.height, // Leave space for system bar + taskbar
        zIndex: windowState.zIndex,
      }}
      className={clsx(
        "glass-panel rounded-xl overflow-hidden flex flex-col transition-all duration-75 select-text shadow-2xl border pointer-events-auto",
        isActive ? "border-sys-border-active shadow-sys-accent/10" : "border-sys-border",
        isDragging && "opacity-90 scale-[0.99]"
      )}
    >
      {/* Header Bar */}
      <div
        onMouseDown={handleDragStart}
        onDoubleClick={handleMaximize}
        className={clsx(
          "h-10 px-4 flex items-center justify-between border-b select-none shrink-0 font-sans text-xs tracking-wide",
          (windowState.isMaximized || isMobile) ? "cursor-default" : "cursor-move",
          isActive ? "bg-zinc-950/40 text-sys-text-primary border-sys-border-active/40" : "bg-zinc-950/20 text-sys-text-secondary border-sys-border"
        )}
      >
        <span className="font-semibold">{windowState.title}</span>
        
        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Minimize */}
          <button
            onClick={handleMinimize}
            className="w-5 h-5 rounded-full bg-yellow-500/20 hover:bg-yellow-500/80 text-transparent hover:text-yellow-950 flex items-center justify-center transition-all duration-150"
            title="Minimize"
          >
            <Minus size={10} />
          </button>
          
          {/* Maximize */}
          {!isMobile && (
            <button
              onClick={handleMaximize}
              className="w-5 h-5 rounded-full bg-green-500/20 hover:bg-green-500/80 text-transparent hover:text-green-950 flex items-center justify-center transition-all duration-150"
              title={windowState.isMaximized ? "Restore" : "Maximize"}
            >
              {windowState.isMaximized ? <Minimize2 size={10} /> : <Square size={8} />}
            </button>
          )}

          {/* Close */}
          <button
            onClick={handleClose}
            className="w-5 h-5 rounded-full bg-red-500/20 hover:bg-red-500/80 text-transparent hover:text-red-950 flex items-center justify-center transition-all duration-150"
            title="Close"
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-auto bg-zinc-950/40">
        {children}
      </div>

      {/* Resize Handle */}
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
  );
}
