"use client";

import { useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** "lines" slides whole lines up, "chars" flips letters in one by one. */
  by?: "lines" | "chars";
  delay?: number;
  /** Where the trigger fires, as a ScrollTrigger start value. */
  start?: string;
};

/** Text that rises out of hidden masks when it scrolls into view. */
export function SplitReveal({ children, as: Tag = "p", className = "", by = "lines", delay = 0, start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const split = SplitText.create(el, {
        type: by === "chars" ? "words,chars" : "lines",
        mask: by === "chars" ? "words" : "lines",
        autoSplit: true,
        onSplit(self) {
          const targets = by === "chars" ? self.chars : self.lines;
          return gsap.from(targets, {
            yPercent: 120,
            rotate: by === "chars" ? 14 : 3,
            transformOrigin: "0% 100%",
            duration: by === "chars" ? 1.1 : 1.3,
            stagger: by === "chars" ? 0.025 : 0.09,
            ease: "expo.out",
            delay,
            scrollTrigger: { trigger: el, start },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
