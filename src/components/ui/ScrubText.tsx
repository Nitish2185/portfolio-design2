"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  /** Words that light up in the accent colour. */
  highlight?: string[];
};

/** Paragraph whose words light up one by one as you scroll through it. */
export function ScrubText({ text, className = "", highlight = [] }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const marked = new Set(highlight.map((w) => w.toLowerCase()));
      const split = SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          self.words.forEach((word) => {
            const clean = word.textContent?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
            if (marked.has(clean)) word.classList.add("text-acid");
          });
          return gsap.fromTo(
            self.words,
            { opacity: 0.12, filter: "blur(3px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: true },
            },
          );
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
