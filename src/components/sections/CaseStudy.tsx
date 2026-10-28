"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/content/site";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { RollText } from "@/components/ui/RollText";
import { ScrubText } from "@/components/ui/ScrubText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";

const patterns: Project["pattern"][] = ["rings", "grid", "blob", "stripes", "orbit"];

const results = [
  { value: "+240%", label: "Lorem ipsum" },
  { value: "3.2M", label: "Dolor sit amet" },
  { value: "12", label: "Consectetur" },
];

/** Case-study page for one project. */
export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLElement>(null);
  // Gallery tiles reuse the project's colours with different patterns
  const gallery = patterns.filter((p) => p !== project.pattern).slice(0, 3);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      gsap.from(q(".cs-meta > *"), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        delay: 0.7,
      });

      // Cover opens up from a narrow slit, then grows to full width with the scroll
      gsap.fromTo(
        q(".cs-cover"),
        { clipPath: "inset(45% 20% 45% 20%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", delay: 0.7 },
      );
      gsap.fromTo(
        q(".cs-cover-wrap"),
        { scale: 0.86 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: q(".cs-cover-wrap")[0], start: "top 80%", end: "top 10%", scrub: true },
        },
      );
      gsap.fromTo(
        q(".cs-cover-inner"),
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: q(".cs-cover-wrap")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      q(".cs-tile").forEach((tile, i) => {
        gsap.from(tile, {
          yPercent: 20,
          rotate: i % 2 ? 4 : -4,
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: tile, start: "top 90%" },
        });
      });

      gsap.from(q(".cs-result"), {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".cs-results")[0], start: "top 85%" },
      });
    },
    { scope: root, dependencies: [project.slug] },
  );

  return (
    <article ref={root} className="relative z-10 bg-ink">
      <header className="container-x pt-36 pb-16 md:pt-44">
        <SectionLabel className="mb-8">Case study</SectionLabel>
        <SplitReveal
          as="h1"
          by="chars"
          start="top 95%"
          className="font-display text-[15vw] leading-[0.85] font-black uppercase md:text-[10vw]"
        >
          {project.title}
        </SplitReveal>

        <dl className="cs-meta mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
          {[
            ["Client", project.client],
            ["Role", project.role],
            ["Year", project.year],
            ["Category", project.category],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="label mb-2">{term}</dt>
              <dd className="text-lg">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="cs-cover-wrap container-x">
        <ProjectCover
          project={project}
          showTitle={false}
          className="cs-cover aspect-[4/3] md:aspect-[16/8]"
          innerClassName="cs-cover-inner"
        />
      </div>

      <section className="container-x grid gap-10 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-3">
          <SectionLabel>Overview</SectionLabel>
        </div>
        <div className="md:col-span-9">
          <ScrubText
            text={`${project.summary} Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
            highlight={project.tags}
            className="font-display text-3xl leading-tight font-bold md:text-5xl"
          />
          <ul className="mt-10 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="border border-line px-3 py-1 text-sm text-smoke">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x grid gap-16 pb-28 md:grid-cols-2 md:pb-40">
        {[
          {
            title: "The challenge",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
          },
          {
            title: "The approach",
            text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
          },
        ].map((block) => (
          <div key={block.title} className="flex flex-col gap-6">
            <SplitReveal as="h2" className="font-display text-3xl font-bold uppercase md:text-4xl">
              {block.title}
            </SplitReveal>
            <SplitReveal className="text-lg leading-relaxed text-smoke">{block.text}</SplitReveal>
          </div>
        ))}
      </section>

      <section className="container-x grid gap-6 pb-28 md:grid-cols-2 md:pb-40">
        {gallery.map((pattern, i) => (
          <ProjectCover
            key={pattern}
            project={{ ...project, pattern }}
            showTitle={false}
            className={`cs-tile ${i === 0 ? "aspect-[16/9] md:col-span-2" : "aspect-square"}`}
          />
        ))}
      </section>

      <section className="cs-results container-x grid gap-10 border-t border-line py-20 md:grid-cols-3">
        {results.map((r) => (
          <div key={r.label} className="cs-result">
            <p className="font-display text-6xl font-black text-acid md:text-7xl">{r.value}</p>
            <p className="label mt-3">{r.label}</p>
          </div>
        ))}
      </section>

      <TransitionLink
        href={`/work/${next.slug}`}
        label={next.title}
        data-cursor="Next"
        className="group/roll relative block overflow-hidden border-t border-line"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-700 ease-out-expo group-hover/roll:scale-y-100" />
        <span className="container-x relative flex flex-col gap-4 py-24 transition-colors duration-500 group-hover/roll:text-ink md:py-36">
          <span className="label transition-colors duration-500 group-hover/roll:!text-ink">Next project</span>
          <span className="flex items-center justify-between gap-6">
            <span className="font-display text-[12vw] leading-[0.9] font-black uppercase md:text-[8vw]">
              <RollText text={next.title} />
            </span>
            <span className="text-[8vw] transition-transform duration-700 ease-out-expo group-hover/roll:rotate-45 md:text-[5vw]">
              ↗
            </span>
          </span>
        </span>
      </TransitionLink>
    </article>
  );
}
