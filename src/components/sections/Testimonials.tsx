"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { clients, testimonials } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Star } from "@/components/ui/Star";

const DURATION = 7000;
const EASE = [0.76, 0, 0.24, 1] as const;

const words = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
  exit: { transition: { staggerChildren: 0.015 } },
};
const word = {
  hidden: { y: "110%", rotate: 8 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: EASE } },
  exit: { y: "-110%", transition: { duration: 0.4, ease: EASE } },
};

/** Auto-advancing quote slider (Motion AnimatePresence) and a wall of client names. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = testimonials[index];

  const go = (step: number) => setIndex((i) => (i + step + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), DURATION);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  return (
    <section id="testimonials" className="container-x relative py-28 md:py-40">
      <SectionLabel className="mb-16">Kind words</SectionLabel>

      <div
        className="relative grid gap-12 md:grid-cols-12"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div className="relative md:col-span-1">
          <motion.span
            aria-hidden
            key={index}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="block font-display text-[8rem] leading-[0.7] font-black text-acid"
          >
            “
          </motion.span>
        </div>

        <div className="md:col-span-11">
          <div aria-live="polite" className="min-h-[13em] md:min-h-[8em]">
            <AnimatePresence mode="wait">
              <motion.figure key={index} initial="hidden" animate="show" exit="exit">
                <motion.blockquote
                  variants={words}
                  className="font-display text-[7vw] leading-[1.15] font-bold md:text-[3.4vw]"
                >
                  {current.quote.split(" ").map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden pr-[0.25em] align-top">
                      <motion.span variants={word} className="inline-block">
                        {w}
                      </motion.span>
                    </span>
                  ))}
                </motion.blockquote>
                <motion.figcaption
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { delay: 0.4 } }, exit: { opacity: 0 } }}
                  className="mt-10 flex items-center gap-4"
                >
                  <span
                    aria-hidden
                    className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-volt to-flare font-display text-sm font-black"
                  >
                    {current.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block font-display font-bold uppercase">{current.name}</span>
                    <span className="text-smoke">{current.title}</span>
                  </span>
                </motion.figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center gap-6">
            {[
              { label: "Previous testimonial", step: -1, icon: "←" },
              { label: "Next testimonial", step: 1, icon: "→" },
            ].map((btn) => (
              <Magnetic key={btn.label}>
                <button
                  type="button"
                  aria-label={btn.label}
                  onClick={() => go(btn.step)}
                  className="flex size-16 items-center justify-center rounded-full border border-bone/40 text-xl transition-colors duration-300 hover:border-acid hover:bg-acid hover:text-ink"
                >
                  {btn.icon}
                </button>
              </Magnetic>
            ))}
            <div className="ml-4 flex flex-1 gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="relative h-1 flex-1 overflow-hidden bg-line"
                >
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-0 origin-left bg-acid"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused ? 0 : 1 }}
                      transition={{ duration: paused ? 0.3 : DURATION / 1000, ease: "linear" }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 bg-bone/50" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client wall */}
      <div className="mt-28 md:mt-40">
        <p className="label mb-8 flex items-center gap-3">
          <Star className="size-3 text-acid" /> Trusted by lorem ipsum
        </p>
        <ul className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
          {clients.map((client, i) => (
            <li key={client} className="group/roll relative border-r border-b border-line">
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-out-expo group-hover/roll:scale-y-100"
              />
              <span
                className={`relative flex h-32 items-center justify-center text-2xl transition-colors duration-500 group-hover/roll:text-ink md:h-44 md:text-3xl ${
                  i % 3 === 0 ? "font-display font-black uppercase" : i % 3 === 1 ? "font-sans font-semibold tracking-tight italic" : "font-display font-light lowercase"
                }`}
              >
                <RollText text={client} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
