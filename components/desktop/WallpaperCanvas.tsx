"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useOSStore, ThemeName } from "../../store/osStore";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";

const THEME_3D_COLORS: Record<ThemeName, { primary: number; secondary: number }> = {
  tokyonight: { primary: 0x7aa2f7, secondary: 0xbb9af7 },
  onedark: { primary: 0x61afef, secondary: 0xc678dd },
  dracula: { primary: 0xbd93f9, secondary: 0xff79c6 },
  nord: { primary: 0x88c0d0, secondary: 0x81a1c1 },
  githublight: { primary: 0x0969da, secondary: 0x1f2328 },
  catppuccin: { primary: 0xcba6f7, secondary: 0xf5c2e7 },
  cyberpunk: { primary: 0x00f0ff, secondary: 0xffe600 },
  matrix: { primary: 0x00ff66, secondary: 0x008f11 },
  minimalwhite: { primary: 0x64748b, secondary: 0x94a3b8 },
  midnightblue: { primary: 0x38bdf8, secondary: 0x6366f1 },
  kratos: { primary: 0xef4444, secondary: 0xf87171 },
  spiderverse: { primary: 0xf43f5e, secondary: 0x06b6d4 },
  heisenberg: { primary: 0x38bdf8, secondary: 0x0284c7 },
  hazmat: { primary: 0xeab308, secondary: 0xf97316 },
  tonystark: { primary: 0xeab308, secondary: 0xdc2626 },
  thor: { primary: 0x38bdf8, secondary: 0xa855f7 },
  johnwick: { primary: 0xf59e0b, secondary: 0x71717a },
};

export default function WallpaperCanvas() {
  const { theme, wallpaperStyle } = useOSStore();
  const { isMobile } = useResponsiveMode();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wallpaperStyle === "minimal") return;
    const container = containerRef.current;
    if (!container) return;

    const themeColors = THEME_3D_COLORS[theme] || { primary: 0x38bdf8, secondary: 0x818cf8 };

    // Initialize Native Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    // Wallpaper 1: Constellation Particles
    let pointsMesh: THREE.Points | null = null;
    if (wallpaperStyle === "constellation") {
      const count = isMobile ? 180 : 350;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 35;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: themeColors.primary,
        size: 0.18,
        transparent: true,
        opacity: 0.7,
      });
      pointsMesh = new THREE.Points(geometry, material);
      scene.add(pointsMesh);
    }

    // Wallpaper 2: Synthwave Grid
    let gridHelper: THREE.GridHelper | null = null;
    if (wallpaperStyle === "grid") {
      gridHelper = new THREE.GridHelper(80, 40, themeColors.primary, themeColors.primary);
      gridHelper.position.set(0, -6, 0);
      gridHelper.rotation.x = 0.2;
      scene.add(gridHelper);
    }

    // Wallpaper 3: Orbit Core
    let orbitGroup: THREE.Group | null = null;
    if (wallpaperStyle === "orbit") {
      orbitGroup = new THREE.Group();
      const coreGeo = new THREE.IcosahedronGeometry(3, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: themeColors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      orbitGroup.add(core);

      const ringGeo = new THREE.TorusGeometry(5.5, 0.05, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: themeColors.secondary,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      orbitGroup.add(ring);

      scene.add(orbitGroup);
    }

    // Wallpaper 4: Starfield Vortex
    let starfieldMesh: THREE.Points | null = null;
    if (wallpaperStyle === "starfield") {
      const count = isMobile ? 250 : 500;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 2 + Math.random() * 20;
        const angle = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: themeColors.primary,
        size: 0.12,
        transparent: true,
        opacity: 0.8,
      });
      starfieldMesh = new THREE.Points(geometry, material);
      scene.add(starfieldMesh);
    }

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (pointsMesh) {
        pointsMesh.rotation.y += delta * 0.05;
        pointsMesh.rotation.x += (mouseY * 0.15 - pointsMesh.rotation.x) * 0.05;
        pointsMesh.rotation.z += (mouseX * 0.15 - pointsMesh.rotation.z) * 0.05;
      }

      if (gridHelper) {
        gridHelper.position.z += delta * 2.5;
        if (gridHelper.position.z > 4) gridHelper.position.z = 0;
      }

      if (orbitGroup) {
        orbitGroup.rotation.x += delta * 0.3;
        orbitGroup.rotation.y += delta * 0.5;
      }

      if (starfieldMesh) {
        starfieldMesh.rotation.z += delta * 0.06;
        starfieldMesh.position.z += delta * 1.5;
        if (starfieldMesh.position.z > 8) starfieldMesh.position.z = 0;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [theme, wallpaperStyle, isMobile]);

  if (wallpaperStyle === "minimal") return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-50 transition-opacity duration-1000"
    />
  );
}
