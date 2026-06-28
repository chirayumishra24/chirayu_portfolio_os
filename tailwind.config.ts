import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sys: {
          accent: "var(--accent)",
          "accent-hover": "var(--accent-hover)",
          "accent-muted": "var(--accent-muted)",
          "text-primary": "var(--text-primary)",
          "text-secondary": "var(--text-secondary)",
          window: "var(--bg-window)",
          border: "var(--border-window)",
          "border-active": "var(--border-active)",
          taskbar: "var(--taskbar-bg)",
          terminal: "var(--terminal-bg)",
          "terminal-fg": "var(--terminal-fg)",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};
export default config;
