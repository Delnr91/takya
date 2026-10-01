"use client";

import { useEffect, useRef } from "react";

/** Procedural liquid geometry; all interaction stays in the browser. */
export function CognitiveFluidBackground({
  motionOff,
}: {
  motionOff: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionRef = useRef(motionOff);
  useEffect(() => {
    motionRef.current = motionOff;
  }, [motionOff]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import("three")
      .then((THREE) => {
        if (cancelled) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
        camera.position.z = 5;
        scene.add(new THREE.AmbientLight(0xf4f1ea, 2));
        const light = new THREE.DirectionalLight(0xd5ffe6, 7);
        light.position.set(-2, 3, 4);
        scene.add(light);
        const rim = new THREE.PointLight(0xe4774d, 35);
        rim.position.set(3, -1, 2);
        scene.add(rim);
        const geometry = new THREE.SphereGeometry(1, 48, 32);
        const position = geometry.getAttribute("position");
        const original = new Float32Array(position.array);
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x7d9b8a,
          metalness: 0.55,
          roughness: 0.2,
          clearcoat: 1,
          iridescence: 0.65,
        });
        const liquid = new THREE.Mesh(geometry, material);
        scene.add(liquid);
        const ringGeometry = new THREE.TorusGeometry(1.5, 0.025, 8, 80);
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: 0xe4774d,
          emissive: 0xe4774d,
          emissiveIntensity: 0.4,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        scene.add(ring);
        let targetX = 0,
          targetY = 0,
          x = 0,
          y = 0,
          visible = true,
          last = 0,
          phase = 0;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const move = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          targetX = (event.clientX - rect.left) / rect.width - 0.5;
          targetY = (event.clientY - rect.top) / rect.height - 0.5;
        };
        const leave = () => {
          targetX = 0;
          targetY = 0;
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        const resize = () => {
          camera.aspect = host.clientWidth / Math.max(host.clientHeight, 1);
          camera.updateProjectionMatrix();
          renderer.setSize(host.clientWidth, host.clientHeight, false);
          liquid.position.x = camera.aspect > 2 ? 1.7 : 0.7;
          ring.position.copy(liquid.position);
          renderer.render(scene, camera);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        const visibility = new IntersectionObserver(([entry]) => {
          visible = entry?.isIntersecting ?? false;
        });
        visibility.observe(host);
        resize();
        renderer.setAnimationLoop((now) => {
          if (!visible || document.hidden || now - last < 33) return;
          const still = motionRef.current || reduced.matches;
          const elapsed = Math.min((now - last) / 1000, 0.05);
          last = now;
          if (!still) phase += elapsed;
          x += ((still ? 0 : targetX) - x) * 0.08;
          y += ((still ? 0 : targetY) - y) * 0.08;
          for (let i = 0; i < position.count; i++) {
            const ox = original[i * 3] ?? 0,
              oy = original[i * 3 + 1] ?? 0,
              oz = original[i * 3 + 2] ?? 0;
            const radius =
              1 +
              0.12 * Math.sin(oy * 5 + phase * 1.2) +
              0.09 * Math.cos(ox * 4 - phase + oz * 3);
            position.setXYZ(i, ox * radius, oy * radius, oz * radius);
          }
          position.needsUpdate = true;
          geometry.computeVertexNormals();
          liquid.rotation.set(
            y * 0.5,
            phase * 0.15 + x * 0.7,
            Math.sin(phase * 0.4) * 0.15,
          );
          ring.rotation.set(1 + y, phase * 0.12 + x, 0.4);
          renderer.render(scene, camera);
        });
        cleanup = () => {
          renderer.setAnimationLoop(null);
          observer.disconnect();
          visibility.disconnect();
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
          geometry.dispose();
          ringGeometry.dispose();
          material.dispose();
          ringMaterial.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {
        /* The CSS background remains visible without WebGL. */
      });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="demo-ai-fluid" aria-hidden="true" />
  );
}
