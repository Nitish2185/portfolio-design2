"use client";

import { motion } from "motion/react";
import type { Service } from "@/content/site";

const loop = { repeat: Infinity, ease: "easeInOut" } as const;

/** Looping Motion graphics, one per service card. */
export function Glyph({ type, className = "" }: { type: Service["glyph"]; className?: string }) {
  switch (type) {
    case "grid":
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <motion.rect
              key={i}
              x={(i % 3) * 40 + 4}
              y={Math.floor(i / 3) * 40 + 4}
              width={32}
              height={32}
              fill="currentColor"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scale: [1, 0.25, 1], rotate: [0, 90, 180] }}
              transition={{ ...loop, duration: 2.4, delay: ((i % 3) + Math.floor(i / 3)) * 0.15 }}
            />
          ))}
        </svg>
      );
    case "orbit":
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden>
          <circle cx="60" cy="60" r="14" fill="currentColor" />
          {[28, 44, 58].map((r, i) => (
            <motion.g
              key={r}
              style={{ transformBox: "view-box", transformOrigin: "60px 60px" }}
              animate={{ rotate: i % 2 ? -360 : 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 6 + i * 4 }}
            >
              <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeOpacity="0.35" />
              <circle cx={60 + r} cy="60" r={4 + i} fill="currentColor" />
            </motion.g>
          ))}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <motion.path
              key={i}
              d={`M0 ${36 + i * 16} Q 15 ${24 + i * 16} 30 ${36 + i * 16} T 60 ${36 + i * 16} T 90 ${36 + i * 16} T 120 ${36 + i * 16}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 1], pathOffset: [0, 0, 1] }}
              transition={{ ...loop, duration: 3, delay: i * 0.2 }}
            />
          ))}
        </svg>
      );
    case "star":
    default:
      return (
        <motion.svg
          viewBox="0 0 64 64"
          className={className}
          aria-hidden
          animate={{ rotate: [0, 90, 180], scale: [1, 0.7, 1] }}
          transition={{ ...loop, duration: 4 }}
        >
          <path fill="currentColor" d="M32 0l6.4 25.6L64 32l-25.6 6.4L32 64l-6.4-25.6L0 32l25.6-6.4z" />
        </motion.svg>
      );
  }
}
