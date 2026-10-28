"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const words = q(".hero-word");
      const title = q(".hero-title")[0] as HTMLElement;

      // Shrink the name if it is wider than the screen (works for any name length)
      const fit = () => {
        title.style.fontSize = "";
        const size = parseFloat(getComputedStyle(title).fontSize);
        const widest = Math.max(...words.map((w) => w.scrollWidth));
        if (widest > title.clientWidth) title.style.fontSize = `${(size * title.clientWidth) / widest}px`;
      };
      fit();
      window.addEventListener("resize", fit);

      const split = SplitText.create(words, { type: "chars", charsClass: "hero-char" });

      gsap.set(split.chars, { yPercent: 115, rotate: 12, transformOrigin: "0% 100%" });
      gsap.set(q(".hero-fade"), { autoAlpha: 0, y: 30 });

      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .to(split.chars, { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.045 })
        .to(q(".hero-fade"), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.6);

      // With "reduce motion" on, show the finished state straight away
      const unsubscribe = onIntroDone(() => (prefersReducedMotion() ? intro.progress(1) : intro.play()));

      // While the hero scrolls away, the two words fly apart
      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      scrollTl
        .to(q(".hero-line-1"), { xPercent: -18, ease: "none" }, 0)
        .to(q(".hero-line-2"), { xPercent: 18, ease: "none" }, 0)
        .to(q(".hero-title"), { yPercent: 40, scale: 0.92, ease: "none" }, 0)
        .to(q(".hero-content"), { autoAlpha: 0.15, ease: "power1.in" }, 0);

      // Subtle mouse parallax on the title
      const xTo = gsap.quickTo(q(".hero-title"), "x", { duration: 1.2, ease: "power3" });
      const onMove = (e: PointerEvent) => xTo((e.clientX / window.innerWidth - 0.5) * -30);
      window.addEventListener("pointermove", onMove, { passive: true });

      ScrollTrigger.refresh();

      return () => {
        unsubscribe();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", fit);
        split.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative h-svh min-h-[640px] overflow-hidden">
      <HeroScene className="absolute inset-0" />
      {/* Fade the scene into the page so the blob never shows a hard edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-ink" />

      {/* mix-blend-difference makes the text invert the colours of the blob behind it */}
      <div className="hero-content container-x pointer-events-none relative flex h-full flex-col justify-between pt-28 pb-8 text-bone mix-blend-difference">
        <div className="hero-fade flex items-start justify-between gap-6">
          <p className="label !text-bone/70">
            Portfolio ©{site.year}
            <br />
            {site.location}
          </p>
          <p className="flex items-center gap-3 text-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-bone opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-bone" />
            </span>
            {site.availability}
          </p>
        </div>

        <h1 className="hero-title font-display text-[21vw] leading-[0.8] font-black tracking-[-0.02em] uppercase md:text-[17.5vw]">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden className="hero-line-1 block overflow-clip pt-[0.06em] pb-[0.02em]">
            <span className="hero-word block whitespace-nowrap">{site.firstName}</span>
          </span>
          <span aria-hidden className="hero-line-2 block overflow-clip pt-[0.06em] pb-[0.02em] text-right md:pr-[4vw]">
            <span className="hero-word block whitespace-nowrap">{site.lastName}</span>
          </span>
        </h1>

        <div className="flex items-end justify-between gap-6">
          <div className="hero-fade max-w-sm">
            <p className="mb-2 font-display text-sm font-bold uppercase">{site.role}</p>
            <p className="text-sm leading-relaxed text-bone/70 md:text-base">{site.tagline}</p>
          </div>

          <button
            type="button"
            onClick={() => scrollToTarget("#about")}
            className="hero-fade pointer-events-auto relative hidden size-28 shrink-0 items-center justify-center md:flex"
            aria-label="Scroll to about section"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
              <defs>
                <path id="scroll-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-bone text-[10.5px] tracking-[0.32em] uppercase">
                <textPath href="#scroll-circle">Scroll · Explore · Scroll · Explore ·</textPath>
              </text>
            </svg>
            <span className="animate-float text-xl">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
