"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';

/**
 * Custom cursor made of three layers:
 * a dot, a lagging ring (both invert what's beneath them),
 * and a coloured badge that appears with a label over elements
 * marked with data-cursor="View" (or any text).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const badge = badgeRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !badge || !label) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([dot, ring, badge], { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(badge, { scale: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const badgeX = gsap.quickTo(badge, "x", { duration: 0.35, ease: "power3" });
    const badgeY = gsap.quickTo(badge, "y", { duration: 0.35, ease: "power3" });

    let visible = false;
    let state = "";
    const ringScale = (s: string) => (s === "hover" ? 1.9 : s === "default" ? 1 : 0);

    const setState = (next: string, text = "") => {
      if (next === state && (next !== "label" || label.textContent === text)) return;
      state = next;
      if (next === "label") label.textContent = text;

      gsap.to(dot, { scale: next === "default" ? 1 : 0, duration: 0.3 });
      gsap.to(ring, {
        scale: ringScale(next),
        backgroundColor: next === "hover" ? "#ecebe6" : "rgba(236,235,230,0)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(badge, {
        scale: next === "label" ? 1 : 0,
        duration: 0.5,
        ease: next === "label" ? "back.out(1.8)" : "power3.out",
      });
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set([dot, ring, badge], { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring, badge], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      badgeX(e.clientX);
      badgeY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const marked = target?.closest<HTMLElement>("[data-cursor]");
      if (marked) {
        const text = marked.dataset.cursor ?? "";
        setState(text === "hide" ? "hidden" : "label", text);
        return;
      }
      setState(target?.closest(INTERACTIVE) ? "hover" : "default");
    };

    const onDown = () => gsap.to(ring, { scale: ringScale(state) * 0.75, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: ringScale(state), duration: 0.3 });
    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring, badge], { opacity: 0, duration: 0.3 });
    };

    setState("default");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200] hidden [.has-cursor_&]:block">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 size-9 rounded-full border border-bone mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 size-1.5 rounded-full bg-bone mix-blend-difference"
      />
      <div
        ref={badgeRef}
        className="fixed top-0 left-0 flex size-24 items-center justify-center rounded-full bg-acid text-ink"
      >
        <span ref={labelRef} className="text-xs font-semibold tracking-[0.2em] uppercase" />
      </div>
    </div>
  );
}
