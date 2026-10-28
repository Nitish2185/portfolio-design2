"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about, site } from "@/content/site";
import { ScrubText } from "@/components/ui/ScrubText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SlabButton } from "@/components/ui/SlabButton";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Star } from "@/components/ui/Star";

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Portrait: wipes open, then drifts with the scroll
      gsap.fromTo(
        q(".about-portrait"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".about-portrait")[0], start: "top 80%" },
        },
      );
      gsap.fromTo(
        q(".about-portrait-inner"),
        { yPercent: -12, scale: 1.25 },
        {
          yPercent: 12,
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: q(".about-portrait")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      // Stats: lines draw in and numbers count up
      q(".about-stat").forEach((stat) => {
        const num = stat.querySelector<HTMLElement>(".about-stat-num");
        const line = stat.querySelector(".about-stat-line");
        if (!num) return;
        const target = Number(num.dataset.value);
        const counter = { value: 0 };
        num.textContent = "0";
        gsap
          .timeline({ scrollTrigger: { trigger: stat, start: "top 88%" } })
          .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" })
          .to(
            counter,
            {
              value: target,
              duration: 2,
              ease: "power3.out",
              onUpdate: () => {
                num.textContent = String(Math.round(counter.value));
              },
            },
            0.2,
          );
      });

      gsap.from(q(".about-fade"), {
        y: 40,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".about-details")[0], start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="container-x relative py-28 md:py-40">
      <SectionLabel className="mb-12 md:mb-16">About</SectionLabel>

      <ScrubText
        text={about.body}
        highlight={["consectetur", "eiusmod", "magna", "exercitation", "reprehenderit"]}
        className="max-w-[22ch] font-display text-[7.5vw] leading-[1.05] font-bold tracking-tight md:max-w-none md:text-[3.6vw]"
      />

      <div className="mt-24 grid gap-12 md:mt-36 md:grid-cols-12 md:gap-8">
        {/* Portrait placeholder – swap for your own photo */}
        <div className="md:col-span-5">
          <div
            className="about-portrait relative aspect-[4/5] overflow-hidden bg-coal"
            data-cursor="Lorem"
          >
            <div className="about-portrait-inner absolute inset-0">
              <div className="absolute top-[10%] left-[5%] size-[70%] animate-float rounded-full bg-volt blur-3xl" />
              <div
                className="absolute right-[0%] bottom-[10%] size-[60%] animate-float rounded-full bg-acid/80 blur-3xl"
                style={{ animationDelay: "-2s", animationDuration: "7s" }}
              />
              <div
                className="absolute top-[40%] left-[30%] size-[45%] animate-float rounded-full bg-flare/80 blur-3xl"
                style={{ animationDelay: "-4s", animationDuration: "9s" }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(236_235_230/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(236_235_230/0.07)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>
            <Star className="absolute inset-0 m-auto size-1/3 animate-spin-slow text-ink mix-blend-overlay" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-ink">
              <span className="font-display text-2xl leading-none font-black uppercase">
                {site.firstName}
                <br />
                {site.lastName}
              </span>
              <span className="text-xs tracking-[0.2em] uppercase">Portrait</span>
            </div>
          </div>
        </div>

        <div className="about-details flex flex-col justify-between gap-12 md:col-span-6 md:col-start-7">
          <div className="flex flex-col gap-6">
            <SplitReveal as="h2" className="font-display text-3xl leading-tight font-bold md:text-4xl">
              {about.heading}
            </SplitReveal>
            {about.details.map((paragraph) => (
              <p key={paragraph} className="about-fade text-lg leading-relaxed text-smoke">
                {paragraph}
              </p>
            ))}
            <div className="about-fade flex flex-wrap gap-4 pt-2">
              <SlabButton href={site.resume} download>
                Download résumé
              </SlabButton>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-10">
            {about.stats.map((stat) => (
              <div key={stat.label} className="about-stat">
                <div className="about-stat-line mb-4 h-px origin-left bg-bone/40" />
                <dt className="label mb-2">{stat.label}</dt>
                <dd className="font-display text-5xl font-black md:text-6xl">
                  <span className="about-stat-num" data-value={stat.value}>
                    {stat.value}
                  </span>
                  <span className="text-acid">{stat.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
