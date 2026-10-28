"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { blobFragment, blobVertex, pointsFragment, pointsVertex } from "./shaders";

/**
 * Full-screen WebGL scene: a noise-displaced, iridescent blob
 * inside a slowly drifting particle field.
 * - Bulges toward the mouse and tilts with it
 * - Erupts while the pointer is held down
 * - Spins and grows as the hero scrolls away
 *
 * Plain Three.js (not react-three-fiber): the canvas is created inside the
 * effect and removed on cleanup, which keeps it safe when Next.js hides
 * and re-shows this page between navigations.
 */
export function HeroScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the CSS glow behind the canvas stays as a fallback
    }

    const reduceMotion = prefersReducedMotion();
    const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 6.5;

    // ---------- Blob ----------
    const blobUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.32 },
      uFreq: { value: 1.15 },
      uMouse: { value: new THREE.Vector2() },
      uDeep: { value: new THREE.Color("#0b0b3a") },
      uBody: { value: new THREE.Color("#4d5bff") },
      uCrest: { value: new THREE.Color("#cbff3c") },
      uRim: { value: new THREE.Color("#ff4d6d") },
    };
    const blob = new THREE.Mesh(
      new THREE.SphereGeometry(1, 220, 220),
      new THREE.ShaderMaterial({
        uniforms: blobUniforms,
        vertexShader: blobVertex,
        fragmentShader: blobFragment,
      }),
    );

    // ---------- Particles ----------
    const COUNT = 1400;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.6;
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 1;
      scales[i] = 0.4 + Math.random() * 1.6;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    const pointsUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new THREE.Color("#ecebe6") },
    };
    const points = new THREE.Points(
      pointsGeometry,
      new THREE.ShaderMaterial({
        uniforms: pointsUniforms,
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );

    const group = new THREE.Group();
    group.add(blob);
    scene.add(group, points);

    // ---------- Layout ----------
    const layout = { x: 0, scale: 1 };
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const desktop = w >= 768;
      layout.x = desktop ? 1.15 : 0;
      layout.scale = desktop ? 1.25 : 0.95;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // ---------- Intro: the blob pops in when the preloader lifts ----------
    const reveal = { value: reduceMotion ? 1 : 0 };
    const unsubscribe = onIntroDone(() => {
      if (!reduceMotion) gsap.to(reveal, { value: 1, duration: 2.2, ease: "elastic.out(1, 0.45)", delay: 0.2 });
    });

    // ---------- Input ----------
    const mouse = new THREE.Vector2();
    const smoothMouse = new THREE.Vector2();
    const press = { value: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    const onDown = () => gsap.to(press, { value: 1, duration: 0.6, ease: "power3.out" });
    const onUp = () => gsap.to(press, { value: 0, duration: 1.6, ease: "elastic.out(1, 0.3)" });
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // ---------- Render loop (paused when off-screen) ----------
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    let last = performance.now();
    let elapsed = 0;
    let frame = 0;
    const render = (now = performance.now()) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;
      elapsed += reduceMotion ? 0 : delta;

      // 0 at the top of the page, 1 when the hero has scrolled away
      const scrollProgress = Math.min(window.scrollY / Math.max(host.clientHeight, 1), 1.5);

      smoothMouse.lerp(mouse, 0.06);
      blobUniforms.uTime.value = elapsed + scrollProgress * 2;
      blobUniforms.uMouse.value.copy(smoothMouse);
      blobUniforms.uAmp.value = 0.3 + press.value * 0.35 + scrollProgress * 0.25;
      pointsUniforms.uTime.value = elapsed;

      const s = layout.scale * reveal.value * (1 + scrollProgress * 0.6);
      group.scale.setScalar(Math.max(s, 0.0001));
      group.position.x = layout.x * (1 - scrollProgress * 0.8) + smoothMouse.x * 0.15;
      group.position.y = smoothMouse.y * 0.15 + scrollProgress * 1.2;
      group.rotation.y = elapsed * 0.15 + smoothMouse.x * 0.5 + scrollProgress * 2.5;
      group.rotation.x = -smoothMouse.y * 0.35 + scrollProgress;

      points.rotation.y = elapsed * 0.03 + smoothMouse.x * 0.1;
      points.rotation.x = smoothMouse.y * 0.06;

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([reveal, press]);
      blob.geometry.dispose();
      (blob.material as THREE.Material).dispose();
      pointsGeometry.dispose();
      (points.material as THREE.Material).dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className={`overflow-hidden ${className}`}>
      {/* Fallback glow, also adds atmosphere behind the 3D blob */}
      <div className="absolute top-1/2 left-1/2 size-[70vmin] -translate-1/2 rounded-full bg-volt/30 blur-[120px] md:left-[68%]" />
    </div>
  );
}
