"use client";

import { useEffect, useRef } from "react";
import { fluidFragmentShader, fluidVertexShader } from "../model/fluidShaders";

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
        camera.position.z = 4.7;
        const geometry = new THREE.SphereGeometry(1, 64, 48);
        const liquid = new THREE.Group();
        const membranes = [0, 1, 2].map((layer) => {
          const uniforms = { uTime: { value: 0 }, uLayer: { value: layer } };
          const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: fluidVertexShader,
            fragmentShader: fluidFragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.setScalar(1 - layer * 0.17);
          mesh.rotation.set(layer * 0.8, layer * 1.1, layer * 0.4);
          liquid.add(mesh);
          return { mesh, material, uniforms };
        });
        scene.add(liquid);
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(84 * 3);
        for (let i = 0; i < 84; i++) {
          const angle = i * 2.39996;
          const radius = 1.35 + (i % 7) * 0.11;
          dustPositions[i * 3] = Math.cos(angle) * radius;
          dustPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.65;
          dustPositions[i * 3 + 2] = Math.sin(i * 1.7) * 0.5;
        }
        dustGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(dustPositions, 3),
        );
        const dustMaterial = new THREE.PointsMaterial({
          color: 0xdce8c7,
          size: 0.012,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const dust = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dust);
        let targetX = 0,
          targetY = 0,
          x = 0,
          y = 0,
          visible = true,
          last = 0,
          phase = 0;
        let staticRendered = false;
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
          camera.position.z = camera.aspect < 1 ? 4.7 / camera.aspect : 4.7;
          staticRendered = false;
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
          if (still && staticRendered) return;
          const elapsed = Math.min((now - last) / 1000, 0.05);
          last = now;
          if (!still) phase += elapsed;
          x += ((still ? 0 : targetX) - x) * 0.08;
          y += ((still ? 0 : targetY) - y) * 0.08;
          for (const membrane of membranes)
            membrane.uniforms.uTime.value = phase;
          liquid.scale.setScalar(1 + Math.sin(phase * 1.1) * 0.045);
          liquid.rotation.set(
            y * 0.5,
            phase * 0.09 + x * 0.7,
            Math.sin(phase * 0.4) * 0.12,
          );
          dust.rotation.z = phase * 0.035;
          renderer.render(scene, camera);
          staticRendered = still;
        });
        cleanup = () => {
          renderer.setAnimationLoop(null);
          observer.disconnect();
          visibility.disconnect();
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
          geometry.dispose();
          dustGeometry.dispose();
          for (const membrane of membranes) membrane.material.dispose();
          dustMaterial.dispose();
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
