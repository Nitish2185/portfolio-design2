"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services, type Service } from "@/content/site";
import { Glyph } from "@/components/ui/Glyph";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

const themes: Record<Service["theme"], string> = {
  coal: "bg-coal text-bone border border-line",
  acid: "bg-acid text-ink",
  volt: "bg-volt text-bone",
  bone: "bg-bone text-ink",
};

/** Sticky deck of service cards: each one settles back as the next slides over it. */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card", root.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector(".svc-inner"), {
          scale: 0.86,
          rotateX: -12,
          filter: "brightness(0.45)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top 15%",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="container-x relative py-28 md:py-40">
      <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel className="mb-8">Services</SectionLabel>
          <SplitReveal as="h2" by="chars" className="font-display text-[13vw] leading-[0.9] font-black uppercase md:text-[7vw]">
            Lorem services
          </SplitReveal>
        </div>
        <p className="max-w-sm text-lg text-smoke">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.
        </p>
      </div>

      <div className="flex flex-col gap-[6vh]" style={{ perspective: "1200px" }}>
        {services.map((service, i) => (
          <article
            key={service.title}
            className="svc-card sticky"
            style={{ top: `calc(12vh + ${i * 1.75}rem)` }}
          >
            <div
              className={`svc-inner grid min-h-[72vh] origin-top gap-10 p-6 md:grid-cols-12 md:p-12 ${themes[service.theme]}`}
            >
              <div className="flex flex-col justify-between gap-10 md:col-span-7">
                <ul className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li key={tag} className="border border-current/30 px-3 py-1 text-sm">
                      {tag}
                    </li>
                  ))}
                </ul>
                <div>
                  <h3 className="font-display text-[11vw] leading-[0.9] font-black uppercase md:text-[5.5vw]">
                    {service.title}
                  </h3>
                  <p className="mt-6 max-w-lg text-lg leading-relaxed opacity-75">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:col-span-5">
                <Glyph type={service.glyph} className="size-[55vw] max-h-[44vh] md:size-[26vw]" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
