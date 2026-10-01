"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** K8 is real, articulated WebGL geometry. The bitmap is only a graceful fallback. */
export function K8Mascot({
  onOpen,
  motionOff = false,
}: {
  onOpen: () => void;
  motionOff?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef(0);
  const pointerRef = useRef(0);
  const motionOffRef = useRef(motionOff);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    motionOffRef.current = motionOff;
  }, [motionOff]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let release: (() => void) | undefined;
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
          setFailed(true);
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.6;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0.45, 6.3);
        camera.lookAt(0, 0.1, 0);
        scene.add(new THREE.AmbientLight(0xffffff, 2.4));
        const key = new THREE.DirectionalLight(0xffffff, 4.2);
        key.position.set(-3, 5, 6);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xa5c8ae, 3.8);
        rim.position.set(3, 2, -4);
        scene.add(rim);

        const forest = new THREE.MeshStandardMaterial({
          color: 0x1b3b2b,
          metalness: 0.75,
          roughness: 0.27,
        });
        const sage = new THREE.MeshStandardMaterial({
          color: 0x7d9b8a,
          metalness: 0.64,
          roughness: 0.3,
        });
        const ivory = new THREE.MeshStandardMaterial({
          color: 0xf4f1ea,
          metalness: 0.25,
          roughness: 0.3,
        });
        const dark = new THREE.MeshStandardMaterial({
          color: 0x06100c,
          metalness: 0.38,
          roughness: 0.2,
        });
        const orange = new THREE.MeshStandardMaterial({
          color: 0xe4774d,
          emissive: 0xa83f21,
          emissiveIntensity: 0.65,
          metalness: 0.35,
          roughness: 0.26,
        });
        const glass = new THREE.MeshPhysicalMaterial({
          color: 0x173e34,
          metalness: 0.15,
          roughness: 0.12,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
        });
        const robot = new THREE.Group();
        scene.add(robot);
        const addBall = (
          parent: InstanceType<typeof THREE.Group>,
          material: InstanceType<typeof THREE.MeshStandardMaterial>,
          xyz: [number, number, number],
          scale: [number, number, number],
        ) => {
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 24, 16),
            material,
          );
          mesh.position.set(...xyz);
          mesh.scale.set(...scale);
          parent.add(mesh);
          return mesh;
        };
        const addCylinder = (
          parent: InstanceType<typeof THREE.Group>,
          material: InstanceType<typeof THREE.MeshStandardMaterial>,
          xyz: [number, number, number],
          top: number,
          bottom: number,
          height: number,
        ) => {
          const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(top, bottom, height, 12),
            material,
          );
          mesh.position.set(...xyz);
          parent.add(mesh);
          return mesh;
        };

        // Rounded body and seated haunches preserve a friendly security-dog silhouette.
        addBall(robot, forest, [0, -0.35, -0.1], [0.78, 0.9, 0.57]);
        addBall(robot, sage, [0, -0.29, 0.37], [0.53, 0.62, 0.23]);
        addBall(robot, ivory, [0, -0.26, 0.53], [0.39, 0.48, 0.065]);
        addBall(robot, orange, [0, -0.48, 0.604], [0.085, 0.085, 0.03]);
        for (const side of [-1, 1]) {
          addBall(robot, forest, [side * 0.58, -0.9, -0.08], [0.3, 0.45, 0.42]);
          addBall(robot, ivory, [side * 0.59, -1.28, 0.25], [0.27, 0.14, 0.42]);
          addCylinder(
            robot,
            sage,
            [side * 0.54, -1.18, 0.54],
            0.11,
            0.14,
            0.33,
          );
        }

        const head = new THREE.Group();
        head.position.set(0, 0.7, 0.25);
        robot.add(head);
        addBall(head, forest, [0, 0, 0], [0.76, 0.61, 0.56]);
        addBall(head, sage, [0, 0.34, 0.39], [0.42, 0.16, 0.19]);
        addBall(head, ivory, [0, -0.21, 0.46], [0.46, 0.29, 0.24]);
        addBall(head, dark, [0, -0.18, 0.7], [0.15, 0.09, 0.07]);
        for (const side of [-1, 1]) {
          const ear = new THREE.Mesh(
            new THREE.ConeGeometry(0.19, 0.5, 5),
            forest,
          );
          ear.position.set(side * 0.51, 0.65, -0.03);
          ear.rotation.z = -side * 0.17;
          head.add(ear);
          addBall(head, glass, [side * 0.31, 0.07, 0.51], [0.14, 0.11, 0.065]);
          addBall(
            head,
            orange,
            [side * 0.31, 0.07, 0.573],
            [0.052, 0.055, 0.022],
          );
          addBall(
            head,
            ivory,
            [side * 0.288, 0.09, 0.594],
            [0.018, 0.018, 0.008],
          );
        }
        const paw = new THREE.Group();
        paw.position.set(0.62, -0.14, 0.45);
        robot.add(paw);
        addBall(paw, sage, [0, -0.28, 0], [0.16, 0.4, 0.19]);
        addBall(paw, ivory, [0, -0.58, 0.12], [0.22, 0.15, 0.27]);
        for (const offset of [-0.095, 0, 0.095])
          addBall(paw, sage, [offset, -0.61, 0.35], [0.035, 0.04, 0.025]);
        const otherPaw = new THREE.Group();
        otherPaw.position.set(-0.62, -0.14, 0.45);
        robot.add(otherPaw);
        addBall(otherPaw, sage, [0, -0.35, 0], [0.16, 0.4, 0.19]);
        addBall(otherPaw, ivory, [0, -0.72, 0.13], [0.22, 0.15, 0.28]);

        const resize = () => {
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          if (!width || !height) return;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          renderer.render(scene, camera);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        resize();
        setReady(true);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        renderer.setAnimationLoop(() => {
          if (document.hidden) return;
        const time = performance.now() / 1000;
          const still = motionOffRef.current || reduced.matches;
          const wave =
            !still &&
            (performance.now() - waveRef.current < 2100 ||
              (time % 11 > 8.8 && time % 11 < 10.4));
          robot.position.y = still ? 0 : Math.sin(time * 1.5) * 0.035;
          robot.rotation.y +=
            (pointerRef.current * 0.17 - robot.rotation.y) * 0.065;
          head.rotation.z = still ? 0 : Math.sin(time * 0.85) * 0.025;
          paw.rotation.z +=
            ((wave ? -0.8 + Math.sin(time * 12) * 0.22 : 0) - paw.rotation.z) *
            0.14;
          paw.rotation.x += ((wave ? -0.45 : 0) - paw.rotation.x) * 0.14;
          renderer.render(scene, camera);
        });
        release = () => {
          renderer.setAnimationLoop(null);
          observer.disconnect();
          scene.traverse((item) => {
            if (item instanceof THREE.Mesh) item.geometry.dispose();
          });
          for (const material of [forest, sage, ivory, dark, orange, glass])
            material.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
        };
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      release?.();
    };
  }, []);

  return (
    <button
      type="button"
      className="demo-k8"
      aria-label="Abrir a K8, acompañante documental"
      title="Pregúntale a K8"
      onClick={() => {
        waveRef.current = performance.now();
        onOpen();
      }}
      onPointerEnter={() => {
        waveRef.current = performance.now();
      }}
      onPointerMove={(event) => {
        pointerRef.current =
          (event.clientX - event.currentTarget.getBoundingClientRect().left) /
            event.currentTarget.clientWidth -
          0.5;
      }}
      onPointerLeave={() => {
        pointerRef.current = 0;
      }}
      onFocus={() => {
        waveRef.current = performance.now();
      }}
    >
      <span className="demo-k8-stage" aria-hidden="true">
        <Image
          src="/brand/k8-robot.png"
          alt=""
          width={110}
          height={134}
          loading="eager"
          className="demo-k8-fallback"
          style={{ opacity: ready && !failed ? 0 : 1 }}
        />
        {!failed ? <canvas ref={canvasRef} className="demo-k8-canvas" /> : null}
      </span>
      <span className="demo-k8-label">
        K8 <span>IA</span>
      </span>
    </button>
  );
}
