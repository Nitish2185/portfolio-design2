"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { navLinks, site } from "@/content/site";
import { getLenis } from "@/lib/scroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Menu } from "./Menu";

const quickLinks = navLinks.filter((l) => ["About", "Work", "Services", "Contact"].includes(l.label));

/**
 * Fixed header. It inverts the colours beneath it (blend mode),
 * hides while scrolling down, comes back when scrolling up,
 * and opens a full-screen menu.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 200);
  });

  // Stop the page scrolling and listen for Escape while the menu is open
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="container-x fixed inset-x-0 top-0 z-[120] flex items-center justify-between py-5 text-bone mix-blend-difference"
      >
        <TransitionLink href="/#top" className="group/roll font-display text-sm font-bold tracking-tight uppercase">
          <RollText text={site.name} />
        </TransitionLink>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {quickLinks.map((link) => (
            <TransitionLink key={link.href} href={link.href} className="group/roll text-sm">
              <RollText text={link.label} />
            </TransitionLink>
          ))}
        </nav>

        <Magnetic strength={0.4}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex size-14 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-out-expo hover:scale-110"
          >
            <span className="relative block h-3 w-6">
              <motion.span
                className="absolute inset-x-0 top-0 h-[2px] bg-ink"
                animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: "0%", rotate: 0, y: "0%" }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.span
                className="absolute inset-x-0 bottom-0 h-[2px] bg-ink"
                animate={open ? { bottom: "50%", rotate: -45, y: "50%" } : { bottom: "0%", rotate: 0, y: "0%" }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
            </span>
          </button>
        </Magnetic>
      </motion.header>

      <AnimatePresence>{open && <Menu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
