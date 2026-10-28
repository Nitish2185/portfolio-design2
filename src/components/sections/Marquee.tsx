"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { marqueeWords } from "@/content/site";
import { Star } from "@/components/ui/Star";

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {marqueeWords.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-[2vw] whitespace-nowrap">{word}</span>
          <Star className="size-[0.6em] shrink-0 animate-spin-slow" />
        </span>
      ))}
    </div>
  );
}

/**
 * Two crossing "tapes" of giant text. They loop forever, speed up
 * and flip direction with the scroll, and skew with scroll speed.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return; // tapes stay still
      const q = gsap.utils.selector(root);
      const loops = q(".mq-track").map((track, i) =>
        gsap.fromTo(
          track,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 28, ease: "none", repeat: -1 },
        ),
      );
      const skewTargets = q(".mq-skew");

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const boost = 1 + Math.min(Math.abs(velocity) / 200, 8);
          gsap.to(loops, {
            timeScale: self.direction * boost,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(loops, { timeScale: self.direction, duration: 1.2, ease: "power2.out" });
            },
          });
          gsap.to(skewTargets, {
            skewX: gsap.utils.clamp(-14, 14, velocity / -120),
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              gsap.to(skewTargets, { skewX: 0, duration: 0.8, ease: "power3.out" });
            },
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Highlights"
      className="relative flex h-[42vh] items-center overflow-hidden md:h-[62vh]"
    >
      <div className="absolute -left-[10vw] w-[120vw] -rotate-[4deg] border-y border-line bg-coal py-[1.2vw] font-display text-[7vw] font-black text-bone/90 uppercase md:text-[5vw]">
        <div className="mq-skew">
          <div className="mq-track flex w-max">
            <Row />
            <Row />
          </div>
        </div>
      </div>
      <div className="absolute -left-[10vw] w-[120vw] rotate-[3deg] bg-acid py-[1.2vw] font-display text-[7vw] font-black text-ink uppercase shadow-[0_30px_80px_-20px_rgba(203,255,60,0.35)] md:text-[5vw]">
        <div className="mq-skew">
          <div className="mq-track flex w-max">
            <Row />
            <Row />
          </div>
        </div>
      </div>
    </section>
  );
}
