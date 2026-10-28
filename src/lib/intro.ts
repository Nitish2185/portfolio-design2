import { useSyncExternalStore } from "react";

/**
 * Tiny store that tells the page when the preloader has finished,
 * so the hero can start its entrance animation at the right moment.
 */
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

export function isIntroDone() {
  return done;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
