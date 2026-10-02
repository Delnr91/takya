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
  const verticalRef = useRef(0);
  const turnRef = useRef(0);
  const dragRef = useRef<number | null>(null);
  const movedRef = useRef(false);
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
        const ears: InstanceType<typeof THREE.Group>[] = [];
        const eyes: InstanceType<typeof THREE.Group>[] = [];
        const tail = new THREE.Group();
        tail.position.set(0.65, -0.7, -0.3);
        robot.add(tail);
        addBall(tail, sage, [0.3, 0.1, -0.15], [0.4, 0.12, 0.12]);
        addBall(tail, ivory, [0.58, 0.25, -0.17], [0.13, 0.26, 0.13]);
        head.position.set(0, 0.7, 0.25);
        robot.add(head);
        addBall(head, forest, [0, 0, 0], [0.8, 0.65, 0.56]);
        addBall(head, sage, [0, 0.4, 0.37], [0.28, 0.2, 0.19]);
        addBall(head, ivory, [0, -0.4, 0.47], [0.38, 0.16, 0.24]);
        for (const side of [-1, 1]) {
          addBall(head, ivory, [side * 0.19, -0.25, 0.58], [0.28, 0.24, 0.23]);
          addBall(head, ivory, [side * 0.36, 0.08, 0.45], [0.25, 0.29, 0.15]);
        }
        addBall(head, dark, [0, -0.18, 0.81], [0.16, 0.115, 0.11]);
        addBall(head, glass, [-0.045, -0.145, 0.902], [0.06, 0.025, 0.012]);
        const smile = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.25, -0.34, 0.76),
          new THREE.Vector3(-0.13, -0.4, 0.79),
          new THREE.Vector3(0, -0.36, 0.8),
          new THREE.Vector3(0.13, -0.4, 0.79),
          new THREE.Vector3(0.25, -0.34, 0.76),
        ]);
        head.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(smile, 20, 0.014, 6, false),
            dark,
          ),
        );
        addBall(head, orange, [0, 0.43, 0.54], [0.035, 0.09, 0.025]);
        for (const side of [-1, 1]) {
          const ear = new THREE.Group();
          const outline = new THREE.Shape();
          outline.moveTo(-0.22, 0);
          outline.quadraticCurveTo(-0.27, 0.3, -0.04, 0.79);
          outline.quadraticCurveTo(0, 0.88, 0.055, 0.76);
          outline.quadraticCurveTo(0.29, 0.25, 0.22, 0);
          outline.quadraticCurveTo(0, -0.1, -0.22, 0);
          const armor = new THREE.Mesh(
            new THREE.ExtrudeGeometry(outline, {
              depth: 0.09,
              bevelEnabled: true,
              bevelThickness: 0.035,
              bevelSize: 0.035,
              bevelSegments: 2,
              steps: 1,
            }),
            forest,
          );
          ear.add(armor);
          const inset = new THREE.Mesh(new THREE.ShapeGeometry(outline), sage);
          inset.scale.set(0.7, 0.78, 1);
          inset.position.set(0, 0.04, 0.13);
          ear.add(inset);
          addBall(ear, dark, [0, 0.3, 0.16], [0.11, 0.12, 0.04]);
          addBall(ear, orange, [0, 0.3, 0.19], [0.065, 0.07, 0.025]);
          addBall(ear, dark, [0, 0.3, 0.21], [0.04, 0.045, 0.02]);
          ear.position.set(side * 0.5, 0.45, -0.05);
          ear.rotation.z = -side * 0.17;
          head.add(ear);
          ears.push(ear);
          const eye = new THREE.Group();
          eye.position.set(side * 0.34, 0.1, 0.58);
          head.add(eye);
          eyes.push(eye);
          addBall(eye, dark, [0, 0, 0], [0.175, 0.205, 0.075]);
          addBall(eye, orange, [0, 0, 0.045], [0.115, 0.13, 0.05]);
          addBall(eye, dark, [0, 0.005, 0.08], [0.077, 0.1, 0.04]);
          addBall(eye, ivory, [-0.04, 0.063, 0.115], [0.038, 0.045, 0.015]);
          addBall(eye, ivory, [0.043, -0.044, 0.115], [0.015, 0.018, 0.008]);
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
        let nextBlink = performance.now() + 2400;
        let blinkStarted: number | null = null;
        renderer.setAnimationLoop(() => {
          if (document.hidden) return;
          const now = performance.now();
          const time = now / 1000;
          const still = motionOffRef.current || reduced.matches;
          if (still) {
            blinkStarted = null;
            nextBlink = now + 3000;
          } else if (blinkStarted === null && now >= nextBlink) {
            blinkStarted = now;
          }
          const blinkProgress =
            blinkStarted === null ? 0 : (now - blinkStarted) / 240;
          const eyeOpening =
            blinkStarted === null
              ? 1
              : 1 - Math.sin(Math.min(blinkProgress, 1) * Math.PI) * 0.97;
          for (const eye of eyes) eye.scale.y = eyeOpening;
          if (blinkProgress >= 1) {
            blinkStarted = null;
            nextBlink = now + 2800 + Math.random() * 2800;
          }
          const wave =
            !still &&
            (performance.now() - waveRef.current < 2100 ||
              (time % 11 > 8.8 && time % 11 < 10.4));
          robot.position.y = still ? 0 : Math.sin(time * 1.5) * 0.035;
          robot.scale.set(1, still ? 1 : 1 + Math.sin(time * 1.5) * 0.008, 1);
          robot.rotation.y +=
            (turnRef.current +
              (still ? 0 : pointerRef.current * 0.3) -
              robot.rotation.y) *
            0.065;
          head.rotation.y +=
            ((still ? 0 : pointerRef.current * 0.6) - head.rotation.y) * 0.09;
          head.rotation.x +=
            ((still ? 0 : verticalRef.current * 0.35) - head.rotation.x) * 0.09;
          head.rotation.z = still
            ? 0
            : Math.sin(time * 0.85) * 0.04 + (wave ? 0.09 : 0);
          tail.rotation.x = still ? 0 : Math.sin(time * (wave ? 10 : 3)) * 0.5;
          ears.forEach((ear, index) => {
            ear.rotation.z = (index === 0 ? 1 : -1) * (wave ? 0.06 : 0.17);
            ear.rotation.x = still ? 0 : Math.sin(time * 3 + index) * 0.08;
          });
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
      aria-label="Conversar con K8"
      title="Abre el chat con un clic. Arrastra para girar a K8."
      aria-haspopup="dialog"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          turnRef.current += event.key === "ArrowLeft" ? -0.2 : 0.2;
        }
      }}
      onClick={() => {
        if (movedRef.current) {
          movedRef.current = false;
          return;
        }
        waveRef.current = performance.now();
        onOpen();
      }}
      onPointerEnter={() => {
        waveRef.current = performance.now();
      }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        verticalRef.current =
          (event.clientY - bounds.top) / bounds.height - 0.5;
        if (dragRef.current !== null) {
          const delta = event.clientX - dragRef.current;
          if (Math.abs(delta) > 3) movedRef.current = true;
          turnRef.current += delta * 0.015;
          dragRef.current = event.clientX;
        }
        pointerRef.current =
          (event.clientX - event.currentTarget.getBoundingClientRect().left) /
            event.currentTarget.clientWidth -
          0.5;
      }}
      onPointerDown={(event) => {
        movedRef.current = false;
        dragRef.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={() => {
        dragRef.current = null;
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        movedRef.current = false;
      }}
      onPointerLeave={() => {
        pointerRef.current = 0;
        verticalRef.current = 0;
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
    </button>
  );
}
