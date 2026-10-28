"use client";

import { motion } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";

const glitch = (offset: number) => ({
  x: [0, -14 * offset, 10 * offset, -4 * offset, 0],
  y: [0, 5 * offset, -7 * offset, 2 * offset, 0],
  clipPath: [
    "inset(0% 0% 0% 0%)",
    "inset(20% 0% 55% 0%)",
    "inset(60% 0% 10% 0%)",
    "inset(35% 0% 40% 0%)",
    "inset(0% 0% 0% 0%)",
  ],
});

/** Glitching 404 with a way back home. */
export function NotFound() {
  return (
    <section className="container-x relative z-10 flex min-h-svh flex-col items-center justify-center gap-10 bg-ink text-center">
      <h1 aria-label="404 — page not found" className="relative font-display text-[38vw] leading-none font-black md:text-[28vw]">
        <span aria-hidden className="relative z-10">404</span>
        <motion.span
          aria-hidden
          className="absolute inset-0 text-flare mix-blend-screen"
          animate={glitch(1)}
          transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 1.6, ease: "linear" }}
        >
          404
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute inset-0 text-volt mix-blend-screen"
          animate={glitch(-1)}
          transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 1.6, delay: 0.08, ease: "linear" }}
        >
          404
        </motion.span>
      </h1>
      <p className="max-w-md text-lg text-smoke">Lorem ipsum — this page drifted off into the void. Dolor sit amet.</p>
      <TransitionLink
        href="/"
        label="Home"
        className="group/slab relative inline-flex items-center gap-4 overflow-hidden border border-bone px-6 py-4 font-display text-sm font-bold uppercase transition-colors duration-500 ease-out-expo hover:text-ink"
      >
        <span className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-out-expo group-hover/slab:translate-y-0" />
        <span className="relative">Back home</span>
        <span className="relative">↩</span>
      </TransitionLink>
    </section>
  );
}
