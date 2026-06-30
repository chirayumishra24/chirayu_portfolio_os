import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "resume"
  | "github"
  | "terminal"
  | "playground"
  | "contact"
  | "spotify"
  | "games"
  | "settings";

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export type ThemeName =
  | "tokyonight"
  | "onedark"
  | "dracula"
  | "nord"
  | "githublight"
  | "catppuccin"
  | "cyberpunk"
  | "matrix"
  | "minimalwhite"
  | "midnightblue";

interface OSState {
  theme: ThemeName;
  bootState: "booting" | "login" | "desktop";
  soundMuted: boolean;
  soundVolume: number;
  activeWindowId: AppId | null;
  windows: Record<AppId, WindowState>;
  commandPaletteOpen: boolean;
  searchOpen: boolean;
  achievements: string[];
  maxZIndex: number;
  spotifyConnected: boolean;
  currentTrackIndex: number;
  isPlaying: boolean;

  setTheme: (theme: ThemeName) => void;
  setBootState: (state: "booting" | "login" | "desktop") => void;
  toggleSoundMuted: () => void;
  setSoundVolume: (volume: number) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  unlockAchievement: (id: string) => void;
  
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowPosition: (id: AppId, x: number, y: number) => void;
  updateWindowSize: (id: AppId, width: number, height: number) => void;
  resetWindows: () => void;
  setSpotifyConnected: (connected: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const initialWindows = (): Record<AppId, WindowState> => ({
  about: { id: "about", title: "System Profiler (About)", isOpen: false, isMinimized: false, isMaximized: false, x: 320, y: 60, width: 750, height: 500, zIndex: 1 },
  projects: { id: "projects", title: "Projects Explorer", isOpen: false, isMinimized: false, isMaximized: false, x: 340, y: 100, width: 850, height: 550, zIndex: 1 },
  skills: { id: "skills", title: "Skills Tree", isOpen: false, isMinimized: false, isMaximized: false, x: 380, y: 140, width: 680, height: 480, zIndex: 1 },
  experience: { id: "experience", title: "Experience git-log", isOpen: false, isMinimized: false, isMaximized: false, x: 350, y: 80, width: 800, height: 520, zIndex: 1 },
  resume: { id: "resume", title: "Interactive CV", isOpen: false, isMinimized: false, isMaximized: false, x: 360, y: 120, width: 720, height: 600, zIndex: 1 },
  github: { id: "github", title: "GitHub Analytics", isOpen: false, isMinimized: false, isMaximized: false, x: 330, y: 160, width: 780, height: 540, zIndex: 1 },
  terminal: { id: "terminal", title: "xterm Terminal", isOpen: true, isMinimized: false, isMaximized: false, x: 300, y: 50, width: 700, height: 400, zIndex: 2 },
  playground: { id: "playground", title: "JS Playground", isOpen: false, isMinimized: false, isMaximized: false, x: 380, y: 180, width: 900, height: 580, zIndex: 1 },
  contact: { id: "contact", title: "Mail Compose (Gmail)", isOpen: false, isMinimized: false, isMaximized: false, x: 340, y: 150, width: 650, height: 480, zIndex: 1 },
  spotify: { id: "spotify", title: "Spotify Player", isOpen: false, isMinimized: false, isMaximized: false, x: 420, y: 200, width: 360, height: 470, zIndex: 1 },
  games: { id: "games", title: "Arcade Center", isOpen: false, isMinimized: false, isMaximized: false, x: 350, y: 90, width: 780, height: 540, zIndex: 1 },
  settings: { id: "settings", title: "System Preferences", isOpen: false, isMinimized: false, isMaximized: false, x: 400, y: 250, width: 600, height: 450, zIndex: 1 },
});

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      theme: "tokyonight",
      bootState: "booting",
      soundMuted: false,
      soundVolume: 50,
      activeWindowId: "terminal",
      windows: initialWindows(),
      commandPaletteOpen: false,
      searchOpen: false,
      achievements: [],
      maxZIndex: 5,
      spotifyConnected: false,
      currentTrackIndex: 0,
      isPlaying: false,

      setTheme: (theme) => set({ theme }),
      setBootState: (bootState) => set({ bootState }),
      toggleSoundMuted: () => set((state) => ({ soundMuted: !state.soundMuted })),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      unlockAchievement: (id) =>
        set((state) => {
          if (state.achievements.includes(id)) return {};
          return { achievements: [...state.achievements, id] };
        }),

      openWindow: (id) =>
        set((state) => {
          const nextZ = state.maxZIndex + 1;
          const currentWin = state.windows[id];
          return {
            maxZIndex: nextZ,
            activeWindowId: id,
            windows: {
              ...state.windows,
              [id]: {
                ...currentWin,
                isOpen: true,
                isMinimized: false,
                zIndex: nextZ,
              },
            },
          };
        }),

      closeWindow: (id) =>
        set((state) => {
          const currentWin = state.windows[id];
          const activeId = state.activeWindowId === id ? null : state.activeWindowId;
          return {
            activeWindowId: activeId,
            windows: {
              ...state.windows,
              [id]: {
                ...currentWin,
                isOpen: false,
                isMinimized: false,
                isMaximized: false,
              },
            },
          };
        }),

      minimizeWindow: (id) =>
        set((state) => {
          const currentWin = state.windows[id];
          const activeId = state.activeWindowId === id ? null : state.activeWindowId;
          return {
            activeWindowId: activeId,
            windows: {
              ...state.windows,
              [id]: {
                ...currentWin,
                isMinimized: true,
              },
            },
          };
        }),

      maximizeWindow: (id) =>
        set((state) => {
          const currentWin = state.windows[id];
          return {
            activeWindowId: id,
            windows: {
              ...state.windows,
              [id]: {
                ...currentWin,
                isMaximized: !currentWin.isMaximized,
                isMinimized: false,
              },
            },
          };
        }),

      focusWindow: (id) =>
        set((state) => {
          if (state.activeWindowId === id && state.windows[id].zIndex === state.maxZIndex) return {};
          const nextZ = state.maxZIndex + 1;
          const currentWin = state.windows[id];
          return {
            maxZIndex: nextZ,
            activeWindowId: id,
            windows: {
              ...state.windows,
              [id]: {
                ...currentWin,
                isMinimized: false,
                zIndex: nextZ,
              },
            },
          };
        }),

      updateWindowPosition: (id, x, y) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              x,
              y,
            },
          },
        })),

      updateWindowSize: (id, width, height) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              width,
              height,
            },
          },
        })),

      resetWindows: () =>
        set({
          windows: initialWindows(),
          maxZIndex: 5,
          activeWindowId: "terminal",
        }),

      setSpotifyConnected: (spotifyConnected) => set({ spotifyConnected }),
      setCurrentTrackIndex: (currentTrackIndex) => set({ currentTrackIndex }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
    }),
    {
      name: "chirayu-os-preferences",
      partialize: (state) => ({
        theme: state.theme,
        soundMuted: state.soundMuted,
        soundVolume: state.soundVolume,
        achievements: state.achievements,
      }),
    }
  )
);
