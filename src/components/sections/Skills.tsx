"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { skills } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Star } from "@/components/ui/Star";

/** Deterministic pseudo-random so server and client agree. */
function seeded(i: number) {
  const x = Math.sin(i * 91.17 + 12.3) * 10000;
  return x - Math.floor(x);
}

const styles = [
  "bg-acid text-ink",
  "bg-volt text-bone",
  "bg-flare text-ink",
  "bg-bone text-ink",
  "border border-bone/40 bg-ink text-bone",
];
const sizes = ["text-lg px-5 py-3", "text-2xl px-6 py-4", "text-3xl px-7 py-5 md:text-4xl", "text-xl px-5 py-3"];

/** A playground of skill blocks you can drag and throw around (Motion drag + springs). */
export function Skills() {
  const box = useRef<HTMLDivElement>(null);
  // The blocks start above the box, so watch the box itself to know when to drop them
  const inView = useInView(box, { once: true, amount: 0.3 });

  return (
    <section id="skills" className="container-x relative py-28 md:py-40">
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel className="mb-8">Skills</SectionLabel>
          <SplitReveal as="h2" by="chars" className="font-display text-[13vw] leading-[0.9] font-black uppercase md:text-[7vw]">
            Dolor toolbox
          </SplitReveal>
        </div>
        <p className="flex items-center gap-3 text-lg text-smoke">
          <Star className="size-4 animate-spin-slow text-acid" />
          Grab the blocks and throw them around
        </p>
      </div>

      <div
        ref={box}
        data-cursor="Drag"
        className="relative h-[75vh] min-h-[480px] overflow-hidden border border-line bg-coal bg-[linear-gradient(to_right,rgb(236_235_230/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(236_235_230/0.05)_1px,transparent_1px)] bg-[size:64px_64px]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[18vw] font-black text-bone/[0.04] uppercase select-none"
        >
          Play
        </span>

        <ul aria-label="Skills">
          {skills.map((skill, i) => {
            const left = 4 + seeded(i) * 68;
            const top = 6 + seeded(i + 50) * 74;
            const rotate = (seeded(i + 100) - 0.5) * 30;
            return (
              <motion.li
                key={skill}
                drag
                dragConstraints={box}
                dragElastic={0.25}
                dragTransition={{ bounceStiffness: 260, bounceDamping: 14, power: 0.4 }}
                initial={{ y: -900, rotate: rotate * 3, opacity: 0 }}
                animate={inView ? { y: 0, rotate, opacity: 1 } : undefined}
                transition={{ type: "spring", stiffness: 120, damping: 11, delay: i * 0.06 }}
                whileHover={{ scale: 1.08 }}
                whileDrag={{ scale: 1.18, rotate: 0, zIndex: 20 }}
                className={`absolute cursor-grab touch-none font-display font-bold whitespace-nowrap uppercase select-none active:cursor-grabbing ${styles[i % styles.length]} ${sizes[i % sizes.length]} ${i % 6 === 2 ? "rounded-full" : ""}`}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                {skill}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
