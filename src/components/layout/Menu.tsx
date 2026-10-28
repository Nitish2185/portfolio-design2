"use client";

import { motion } from "motion/react";
import { navLinks, site, socials } from "@/content/site";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { RollText } from "@/components/ui/RollText";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Full-screen menu that grows out of the menu button as a circle. */
export function Menu({ onClose }: { onClose: () => void }) {
  const navigate = usePageTransition();

  const go = (href: string, label: string) => {
    onClose();
    // Let the menu start closing before we scroll or change page
    window.setTimeout(() => navigate(href, label), 350);
  };

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ clipPath: "circle(0% at 94% 6%)" }}
      animate={{ clipPath: "circle(150% at 94% 6%)" }}
      exit={{ clipPath: "circle(0% at 94% 6%)" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="container-x fixed inset-0 z-[110] flex flex-col justify-between overflow-hidden bg-acid pt-28 pb-8 text-ink"
      data-lenis-prevent
    >
      {/* Giant drifting monogram in the background */}
      <motion.span
        aria-hidden
        initial={{ x: "20%", rotate: -12 }}
        animate={{ x: "0%", rotate: 0 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="pointer-events-none absolute -right-[5vw] -bottom-[8vw] font-display text-[42vw] leading-none font-black text-ink/[0.06]"
      >
        {site.monogram}
      </motion.span>

      <ul className="group/list relative flex flex-col">
        {navLinks.map((link, i) => (
          <li key={link.href} className="overflow-hidden">
            <motion.a
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                go(link.href, link.label);
              }}
              initial={{ y: "110%", rotate: 6 }}
              animate={{ y: "0%", rotate: 0 }}
              exit={{ y: "-110%", rotate: -4, transition: { duration: 0.4, delay: i * 0.03, ease: EASE } }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease: EASE }}
              className="group/roll flex origin-bottom-left items-center gap-4 py-1 font-display text-[11vw] leading-[0.95] font-black uppercase transition-opacity duration-300 group-hover/list:opacity-30 hover:!opacity-100 md:text-[6.5vw]"
            >
              <RollText text={link.label} />
              <span
                aria-hidden
                className="inline-block -translate-x-6 text-[0.5em] opacity-0 transition-all duration-500 ease-out-expo group-hover/roll:translate-x-0 group-hover/roll:opacity-100"
              >
                ↗
              </span>
            </motion.a>
          </li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative flex flex-wrap items-end justify-between gap-6 text-sm"
      >
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.18em] text-ink/60 uppercase">Get in touch</span>
          <a href={`mailto:${site.email}`} className="group/roll font-display text-lg font-bold">
            <RollText text={site.email} />
          </a>
        </div>
        <ul className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} className="group/roll font-medium">
                <RollText text={s.label} />
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
