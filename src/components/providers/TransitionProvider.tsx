"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnimate } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/scroll";

type Navigate = (href: string, label?: string) => void;

const TransitionContext = createContext<Navigate>(() => {});

/** Returns navigate(href, label): plays the curtain, changes page, reveals it. */
export function usePageTransition() {
  return useContext(TransitionContext);
}

const EASE = [0.76, 0, 0.24, 1] as const;

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Reads the pathname in its own Suspense boundary so the layout stays static. */
function RouteListener({ onChange }: { onChange: (pathname: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange(pathname);
  }, [pathname, onChange]);
  return null;
}

function labelFor(pathname: string) {
  if (pathname === "/") return "Home";
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/-/g, " ");
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const waitingForRoute = useRef<(() => void) | null>(null);
  const firstRoute = useRef(true);

  const onRouteChange = useCallback(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    if (waitingForRoute.current) {
      waitingForRoute.current();
      waitingForRoute.current = null;
      return;
    }
    // Back/forward buttons: just re-measure scroll animations
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const navigate = useCallback<Navigate>(
    async (href, label) => {
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;

      if (samePage) {
        scrollToTarget(url.hash || 0);
        return;
      }
      if (busy.current) return;
      busy.current = true;

      if (labelRef.current) labelRef.current.textContent = label ?? labelFor(url.pathname);
      getLenis()?.stop();

      // 1. Cover the screen
      await Promise.all([
        animate(".pt-acid", { y: ["140vh", "0vh"] }, { duration: 0.8, ease: EASE }),
        animate(".pt-ink", { y: ["140vh", "0vh"] }, { duration: 0.8, delay: 0.1, ease: EASE }),
        animate(".pt-label", { y: ["120%", "0%"] }, { duration: 0.6, delay: 0.45, ease: EASE }),
      ]);

      // 2. Change the page and wait for it to render
      const routeChanged = new Promise<void>((resolve) => {
        waitingForRoute.current = resolve;
        window.setTimeout(resolve, 4000);
      });
      router.push(url.pathname + url.search, { scroll: false });
      await routeChanged;
      await nextFrame();
      await nextFrame();

      scrollToTarget(url.hash || 0, { immediate: true });
      ScrollTrigger.refresh();
      getLenis()?.start();

      // 3. Reveal the new page
      await Promise.all([
        animate(".pt-label", { y: ["0%", "-120%"] }, { duration: 0.5, ease: EASE }),
        animate(".pt-ink", { y: ["0vh", "-140vh"] }, { duration: 0.9, delay: 0.15, ease: EASE }),
        animate(".pt-acid", { y: ["0vh", "-140vh"] }, { duration: 0.9, delay: 0.25, ease: EASE }),
      ]);

      busy.current = false;
    },
    [animate, router],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      <Suspense fallback={null}>
        <RouteListener onChange={onRouteChange} />
      </Suspense>
      {children}

      <div ref={scope} aria-hidden className="pointer-events-none fixed inset-0 z-[250]">
        {/* Each layer is 140vh tall with curved ends, so it enters and leaves as a wave */}
        <div
          className="pt-acid absolute inset-x-0 -top-[20vh] h-[140vh] bg-acid"
          style={{ transform: "translateY(140vh)", borderRadius: "50% / 20vh" }}
        />
        <div
          className="pt-ink absolute inset-x-0 -top-[20vh] flex h-[140vh] items-center justify-center bg-ink"
          style={{ transform: "translateY(140vh)", borderRadius: "50% / 20vh" }}
        >
          <span className="overflow-hidden py-2">
            <span
              ref={labelRef}
              className="pt-label block font-display text-[9vw] leading-none font-black text-bone uppercase md:text-[6vw]"
              style={{ transform: "translateY(120%)" }}
            />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
