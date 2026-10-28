"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { site } from "@/content/site";

const WORDS = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"];
const COLUMNS = 5;
const SEEN_KEY = "intro-seen";

/**
 * Intro screen: a 000→100 counter with rolling words,
 * then two layers of columns sweep up to reveal the site.
 * Repeat visits in the same session get a shorter version.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      lockScroll();

      const done = () => {
        unlockScroll();
        gsap.set(el, { display: "none" });
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      };

      if (prefersReducedMotion()) {
        finishIntro();
        done();
        return;
      }

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}

      const q = gsap.utils.selector(el);
      const duration = seen ? 0.9 : 2.6;
      const count = { value: 0 };
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" }, onComplete: done });

      tl.to(
        count,
        {
          value: 100,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current) {
              counter.current.textContent = String(Math.round(count.value)).padStart(3, "0");
            }
          },
        },
        0,
      ).fromTo(q(".pl-bar"), { scaleX: 0 }, { scaleX: 1, duration, ease: "power2.inOut" }, 0);

      if (!seen) {
        const words = q(".pl-word");
        gsap.set(words, { yPercent: 110, autoAlpha: 1 });
        const step = duration / words.length;
        words.forEach((word, i) => {
          tl.to(word, { yPercent: 0, duration: step * 0.5, ease: "power3.out" }, i * step).to(
            word,
            { yPercent: -110, duration: step * 0.45, ease: "power3.in" },
            i * step + step * 0.55,
          );
        });
      }

      tl.to(q(".pl-content"), { yPercent: -20, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, ">")
        .to(q(".pl-col-a"), { yPercent: -100, duration: 1.1, stagger: 0.07 }, ">-0.15")
        .to(q(".pl-col-b"), { yPercent: -100, duration: 1.1, stagger: 0.07 }, "<0.2")
        .call(finishIntro, [], "<0.35");
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="preloader fixed inset-0 z-[300] overflow-hidden select-none"
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} className="pl-col-b -mr-px h-full flex-1 bg-acid" />
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} className="pl-col-a -mr-px h-full flex-1 bg-ink" />
        ))}
      </div>

      <div className="pl-content container-x absolute inset-0 flex flex-col justify-between py-6 md:py-8">
        <div className="label flex justify-between">
          <span>{site.name}</span>
          <span>Portfolio ©{site.year}</span>
        </div>

        <div className="relative mx-auto h-[1.15em] w-full overflow-hidden text-center font-display text-4xl font-bold uppercase md:text-7xl">
          {WORDS.map((word) => (
            <span key={word} className="pl-word invisible absolute inset-0">
              {word}
            </span>
          ))}
        </div>

        <div className="flex items-end gap-6">
          <div className="mb-[3vw] h-px flex-1 bg-line">
            <div className="pl-bar h-px origin-left bg-acid" style={{ transform: "scaleX(0)" }} />
          </div>
          <span
            ref={counter}
            className="inline-block w-[3.2ch] text-right font-display text-[24vw] leading-[0.78] font-black text-bone md:text-[15vw]"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
