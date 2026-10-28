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
  return () => {
    listeners.delete(listener);
  };
}

/** Runs `callback` once the intro is finished (right away if it already is). Returns an unsubscribe function. */
export function onIntroDone(callback: () => void) {
  if (done) {
    callback();
    return () => {};
  }
  const listener = () => {
    listeners.delete(listener);
    callback();
  };
  return subscribe(listener);
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
