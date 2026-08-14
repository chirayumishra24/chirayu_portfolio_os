"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useOSStore, ThemeName } from "../../store/osStore";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";

// Map OS themes to vivid 3D particle colors
const THEME_3D_COLORS: Record<ThemeName, { primary: string; secondary: string }> = {
  tokyonight: { primary: "#7aa2f7", secondary: "#bb9af7" },
  onedark: { primary: "#61afef", secondary: "#c678dd" },
  dracula: { primary: "#bd93f9", secondary: "#ff79c6" },
  nord: { primary: "#88c0d0", secondary: "#81a1c1" },
  githublight: { primary: "#0969da", secondary: "#1f2328" },
  catppuccin: { primary: "#cba6f7", secondary: "#f5c2e7" },
  cyberpunk: { primary: "#00f0ff", secondary: "#ffe600" },
  matrix: { primary: "#00ff66", secondary: "#008f11" },
  minimalwhite: { primary: "#64748b", secondary: "#94a3b8" },
  midnightblue: { primary: "#38bdf8", secondary: "#6366f1" },
  kratos: { primary: "#ef4444", secondary: "#f87171" },
  spiderverse: { primary: "#f43f5e", secondary: "#06b6d4" },
  heisenberg: { primary: "#38bdf8", secondary: "#0284c7" },
  hazmat: { primary: "#eab308", secondary: "#f97316" },
  tonystark: { primary: "#eab308", secondary: "#dc2626" },
  thor: { primary: "#38bdf8", secondary: "#a855f7" },
  johnwick: { primary: "#f59e0b", secondary: "#71717a" },
};

function ConstellationParticles({ color, mousePos }: { color: string; mousePos: { x: number; y: number } }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 350;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, mousePos.y * 0.15, 0.05);
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, mousePos.x * 0.15, 0.05);
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function SynthwaveGrid({ color }: { color: string }) {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!gridRef.current) return;
    gridRef.current.position.z += delta * 2;
    if (gridRef.current.position.z > 5) {
      gridRef.current.position.z = 0;
    }
  });

  return (
    <group ref={gridRef} position={[0, -5, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <gridHelper args={[80, 40, color, color]} />
    </group>
  );
}

function OrbitCore({ color, secColor }: { color: string; secColor: string }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.4;
      coreRef.current.rotation.y += delta * 0.6;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.5;
      ringRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[3, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[5, 0.05, 16, 100]} />
        <meshBasicMaterial color={secColor} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function StarfieldVortex({ color }: { color: string }) {
  const starRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!starRef.current) return;
    starRef.current.rotation.z += delta * 0.08;
    starRef.current.position.z += delta * 0.5;
    if (starRef.current.position.z > 10) starRef.current.position.z = 0;
  });

  return (
    <Points ref={starRef} positions={positions} stride={3}>
      <PointMaterial transparent color={color} size={0.08} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
    </Points>
  );
}

export default function WallpaperCanvas() {
  const { theme, wallpaperStyle } = useOSStore();
  const { isMobile } = useResponsiveMode();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const themeColors = THEME_3D_COLORS[theme] || { primary: "#38bdf8", secondary: "#818cf8" };

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  if (wallpaperStyle === "minimal") {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-45 transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        gl={{ powerPreference: "low-power", antialias: false }}
        dpr={isMobile ? 1 : [1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        {wallpaperStyle === "constellation" && (
          <ConstellationParticles color={themeColors.primary} mousePos={mousePos} />
        )}
        {wallpaperStyle === "grid" && <SynthwaveGrid color={themeColors.primary} />}
        {wallpaperStyle === "orbit" && (
          <OrbitCore color={themeColors.primary} secColor={themeColors.secondary} />
        )}
        {wallpaperStyle === "starfield" && <StarfieldVortex color={themeColors.primary} />}
      </Canvas>
    </div>
  );
}
