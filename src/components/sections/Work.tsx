"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/content/site";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { RollText } from "@/components/ui/RollText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Star } from "@/components/ui/Star";
import { Tilt } from "@/components/ui/Tilt";
import { TransitionLink } from "@/components/ui/TransitionLink";

/**
 * Selected work. On larger screens the section pins and the
 * cards travel sideways as you scroll down; on phones it's a vertical list.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q(".work-track")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q(".work-pin")[0],
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(q(".work-progress"), { scaleX: self.progress }),
          },
        });

        // Cards swing in as they enter from the right
        q(".work-card").forEach((card) => {
          gsap.fromTo(
            card,
            { rotate: 7, yPercent: 14 },
            {
              rotate: 0,
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontal,
                start: "left right",
                end: "left 40%",
                scrub: true,
              },
            },
          );
        });

        // The art inside each cover drifts the other way (parallax)
        q(".work-cover-inner").forEach((inner) => {
          gsap.fromTo(
            inner,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: inner.closest(".work-card"),
                containerAnimation: horizontal,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        // The giant intro words slide apart
        gsap.to(q(".work-intro-word"), {
          xPercent: (i) => (i % 2 ? 25 : -10),
          ease: "none",
          scrollTrigger: {
            trigger: q(".work-intro")[0],
            containerAnimation: horizontal,
            start: "left left",
            end: "right left",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        q(".work-card").forEach((card) => {
          gsap.from(card, {
            y: 80,
            rotate: 3,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative">
      <div className="work-pin relative overflow-hidden md:h-svh">
        <div className="work-track flex flex-col gap-16 px-[clamp(1rem,4vw,3.5rem)] py-24 md:h-full md:w-max md:flex-row md:items-center md:gap-[4vw] md:py-0">
          {/* Intro panel */}
          <div className="work-intro flex shrink-0 flex-col justify-center gap-8 md:w-[52vw]">
            <SectionLabel>Selected work</SectionLabel>
            <h2 className="font-display text-[17vw] leading-[0.85] font-black uppercase md:text-[10vw]">
              <span className="work-intro-word block">Lorem</span>
              <span className="work-intro-word block text-chroma">Works</span>
            </h2>
            <p className="max-w-md text-lg text-smoke">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scroll to explore a few dolor projects.
            </p>
            <span className="hidden items-center gap-3 text-sm md:flex">
              <Star className="size-4 animate-spin-slow text-acid" /> Keep scrolling
            </span>
          </div>

          {projects.map((project) => (
            <article key={project.slug} className="work-card shrink-0 md:w-[min(42vw,720px)]">
              <TransitionLink
                href={`/work/${project.slug}`}
                label={project.title}
                data-cursor="View"
                className="group/roll block"
              >
                <Tilt className="overflow-hidden" max={8}>
                  <ProjectCover
                    project={project}
                    className="aspect-[4/3] transition-transform duration-700 ease-out-expo group-hover/roll:scale-[1.03]"
                    innerClassName="work-cover-inner"
                  />
                </Tilt>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase md:text-3xl">
                      <RollText text={project.title} />
                    </h3>
                    <p className="mt-1 text-smoke">{project.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-display text-sm">{project.year}</span>
                    <ul className="flex flex-wrap justify-end gap-2">
                      {project.tags.map((tag) => (
                        <li key={tag} className="border border-line px-2 py-1 text-xs text-smoke">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TransitionLink>
            </article>
          ))}

          {/* Outro panel */}
          <div className="flex shrink-0 flex-col items-start justify-center gap-6 md:w-[38vw] md:pr-[6vw]">
            <p className="font-display text-4xl leading-tight font-bold md:text-5xl">
              Lorem ipsum <span className="text-acid">dolor</span> sit amet?
            </p>
            <TransitionLink href="/#contact" className="group/roll flex items-center gap-4 text-xl">
              <span className="flex size-16 items-center justify-center rounded-full bg-acid text-2xl text-ink transition-transform duration-500 ease-out-expo group-hover/roll:rotate-45">
                ↗
              </span>
              <RollText text="Start a project" />
            </TransitionLink>
          </div>
        </div>

        {/* Horizontal progress */}
        <div className="absolute inset-x-[clamp(1rem,4vw,3.5rem)] bottom-8 hidden h-px bg-line md:block">
          <div className="work-progress h-full origin-left bg-acid" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
