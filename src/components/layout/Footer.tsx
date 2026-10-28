"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { navLinks, site, socials } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { TransitionLink } from "@/components/ui/TransitionLink";

function LocalTime() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: site.timeZone,
      }).format(new Date());
    const tick = () => setTime(format());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

/**
 * Acid-green footer that is revealed from underneath the page
 * (the wrapper clips a fixed footer). The giant name rises letter by letter.
 */
export function Footer() {
  const wrapper = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(wrapper);
      const word = q(".footer-word")[0] as HTMLElement;
      const box = q(".footer-word-box")[0] as HTMLElement;

      // Size the name to span the full width
      const fit = () => {
        word.style.fontSize = "100px";
        word.style.fontSize = `${(100 * box.clientWidth) / word.scrollWidth}px`;
      };
      fit();
      document.fonts?.ready.then(fit);
      window.addEventListener("resize", fit);

      gsap.fromTo(
        q(".footer-char"),
        { yPercent: 100, rotate: 10 },
        {
          yPercent: 0,
          rotate: 0,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapper.current, start: "top 90%", end: "bottom bottom", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        q(".footer-top"),
        { y: -60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { trigger: wrapper.current, start: "top 70%", end: "top 20%", scrub: true },
        },
      );

      return () => window.removeEventListener("resize", fit);
    },
    { scope: wrapper },
  );

  return (
    <div
      ref={wrapper}
      className="relative h-[90svh] min-h-[620px]"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="fixed bottom-0 h-[90svh] min-h-[620px] w-full">
        <footer className="container-x flex h-full flex-col justify-between bg-acid pt-28 pb-6 text-ink">
          <div className="footer-top grid grid-cols-2 gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="mb-4 text-xs tracking-[0.18em] uppercase opacity-60">Menu</p>
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <TransitionLink href={link.href} className="group/roll text-lg font-medium">
                      <RollText text={link.label} />
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3">
              <p className="mb-4 text-xs tracking-[0.18em] uppercase opacity-60">Socials</p>
              <ul className="flex flex-col gap-1">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="group/roll text-lg font-medium">
                      <RollText text={s.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 flex flex-col gap-6 md:col-span-6 md:items-end md:text-right">
              <div>
                <p className="mb-2 text-xs tracking-[0.18em] uppercase opacity-60">Local time · {site.location}</p>
                <p className="font-display text-3xl font-bold md:text-4xl">
                  <LocalTime />
                </p>
              </div>
              <a href={`mailto:${site.email}`} className="group/roll font-display text-xl font-bold md:text-2xl">
                <RollText text={site.email} />
              </a>
            </div>
          </div>

          <div>
            <div className="footer-word-box w-full overflow-hidden">
              <p
                aria-label={site.name}
                className="footer-word inline-flex pt-[0.06em] font-display leading-[0.8] font-black whitespace-nowrap uppercase"
              >
                {Array.from(site.name).map((c, i) => (
                  <span key={i} aria-hidden className="footer-char inline-block origin-bottom-left">
                    {c === " " ? " " : c}
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/20 pt-5 text-sm">
              <span>
                © {site.year} {site.name}. All rights reserved.
              </span>
              <span className="hidden opacity-60 md:inline">Next.js · GSAP · Motion · Lenis · Three.js</span>
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollToTarget(0, { duration: 2.4 })}
                  className="flex size-14 items-center justify-center rounded-full bg-ink text-bone transition-transform duration-500 ease-out-expo hover:-rotate-45"
                  aria-label="Back to top"
                >
                  ↑
                </button>
              </Magnetic>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
