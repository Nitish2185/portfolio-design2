"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Star } from "@/components/ui/Star";

const previewColors = ["#cbff3c", "#4d5bff", "#ff4d6d", "#ecebe6"];

/**
 * Timeline of roles. Rows flood with colour on hover while a preview
 * card follows the cursor; a line draws down the side as you scroll.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // Preview card position, smoothed with springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q(".exp-line"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: q(".exp-list")[0], start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.from(q(".exp-row"), {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".exp-list")[0], start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="experience"
      className="container-x relative py-28 md:py-40"
      onPointerMove={(e) => {
        const rect = root.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
    >
      <SectionLabel className="mb-8">Experience</SectionLabel>
      <SplitReveal as="h2" by="chars" className="mb-16 font-display text-[13vw] leading-[0.9] font-black uppercase md:mb-24 md:text-[7vw]">
        Lorem journey
      </SplitReveal>

      <div className="exp-list relative pl-6 md:pl-10">
        <div className="absolute top-0 bottom-0 left-0 w-px bg-line">
          <div className="exp-line h-full w-full origin-top bg-acid" />
        </div>

        <ul onPointerLeave={() => setActive(null)}>
          {experience.map((job, i) => (
            <li
              key={job.role}
              className="exp-row group relative border-b border-line"
              onPointerEnter={() => setActive(i)}
            >
              {/* Colour flood on hover */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
              />
              <Star className="absolute top-1/2 -left-[calc(1.5rem+6px)] size-3 -translate-y-1/2 text-acid md:-left-[calc(2.5rem+6px)]" />
              <div className="relative grid gap-3 py-8 transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-4 group-hover:text-ink md:grid-cols-12 md:items-center md:gap-6 md:py-10">
                <span className="text-sm tracking-[0.18em] uppercase opacity-60 md:col-span-2">{job.period}</span>
                <h3 className="font-display text-2xl font-bold uppercase md:col-span-5 md:text-4xl">{job.role}</h3>
                <span className="text-lg md:col-span-2">{job.company}</span>
                <p className="text-sm leading-relaxed opacity-70 md:col-span-3">{job.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating preview that follows the cursor (mouse devices) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="h-56 w-72 -translate-1/2 overflow-hidden"
          initial={false}
          animate={{ scale: active === null ? 0 : 1, rotate: active === null ? -8 : 4 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
        <motion.div
          className="flex flex-col"
          animate={{ y: `${(-(active ?? 0) * 100) / experience.length}%` }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {experience.map((job, i) => (
            <div
              key={job.company}
              className="flex h-56 w-72 shrink-0 flex-col justify-between p-5 text-ink"
              style={{ background: previewColors[i % previewColors.length] }}
            >
              <Star className="size-8 animate-spin-slow" />
              <span className="font-display text-2xl leading-tight font-black uppercase">{job.company}</span>
            </div>
          ))}
        </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
