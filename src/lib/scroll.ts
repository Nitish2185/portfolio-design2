import type Lenis from "lenis";

/**
 * One shared Lenis instance for the whole app.
 * Components call these helpers from event handlers and effects.
 */
let lenis: Lenis | null = null;
let locked = false;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locked) lenis.stop();
}

export function getLenis() {
  return lenis;
}

export function lockScroll() {
  locked = true;
  lenis?.stop();
  document.documentElement.classList.add("is-loading");
}

export function unlockScroll() {
  locked = false;
  lenis?.start();
  document.documentElement.classList.remove("is-loading");
}

type ScrollOptions = { immediate?: boolean; offset?: number; duration?: number };

export function scrollToTarget(target: string | number | HTMLElement, options: ScrollOptions = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      immediate: options.immediate,
      offset: options.offset ?? 0,
      duration: options.duration ?? 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      force: true,
    });
    return;
  }
  // Fallback before Lenis starts
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: options.immediate ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: options.immediate ? "auto" : "smooth" });
}
