"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
};

/** Tilts toward the pointer in 3D with a soft glare that follows it (Motion springs). */
export function Tilt({ children, className = "", max = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, spring);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotateY.set((px - 0.5) * max * 2);
        rotateX.set((0.5 - py) * max * 2);
        glareX.set(px * 100);
        glareY.set(py * 100);
        glareOpacity.set(1);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
        glareOpacity.set(0);
      }}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ background: glare, opacity: glareOpacity }}
      />
    </motion.div>
  );
}
