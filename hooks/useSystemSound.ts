import { useOSStore } from "../store/osStore";

export const useSystemSound = () => {
  const { soundMuted, soundVolume } = useOSStore();

  const playSound = (
    type: "boot" | "click" | "error" | "success" | "theme" | "notify" | "achievement"
  ) => {
    if (soundMuted) return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime((soundVolume / 100) * 0.15, ctx.currentTime);
      gainNode.connect(ctx.destination);

      if (type === "click") {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
        gainNode.gain.setValueAtTime((soundVolume / 100) * 0.05, ctx.currentTime);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.12);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === "success") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "triangle";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc1.start();
        osc2.start(ctx.currentTime + 0.08);
        osc1.stop(ctx.currentTime + 0.25);
        osc2.stop(ctx.currentTime + 0.35);
      } else if (type === "theme") {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.25);
        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "notify") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08); // E6
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc1.start();
        osc2.start(ctx.currentTime + 0.08);
        osc1.stop(ctx.currentTime + 0.22);
        osc2.stop(ctx.currentTime + 0.3);
      } else if (type === "achievement") {
        const now = ctx.currentTime;
        // Rising pentatonic arpeggio (C major pentatonic: C, D, E, G, A, C)
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          osc.connect(gainNode);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.2);
        });
      } else if (type === "boot") {
        const now = ctx.currentTime;
        const baseFreq = 130.81; // C3
        // Warm synth minor 9th / major 9th chord
        const chord = [1, 1.2, 1.5, 1.875, 2.25]; // C, Eb, G, Bb, D (C minor 9th)
        chord.forEach((mult, idx) => {
          const osc = ctx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(baseFreq * mult, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * mult * 1.01, now + 1.6);
          
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(300 + idx * 100, now);
          filter.frequency.exponentialRampToValueAtTime(1200, now + 1.2);
          
          osc.connect(filter);
          filter.connect(gainNode);
          osc.start();
          osc.stop(now + 2.0);
        });
      }
    } catch (e) {
      console.warn("AudioContext failed:", e);
    }
  };

  return { playSound };
};
