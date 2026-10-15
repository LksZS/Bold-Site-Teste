/**
 * Smooth scrolling — one Lenis instance for the whole page, driven by the GSAP
 * ticker (single rAF loop) so ScrollTrigger always reads the smoothed position
 * in the same frame. Never created when the visitor prefers reduced motion.
 */
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./motion";
import { useReducedMotion } from "./hooks";

interface SmoothScrollApi {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi>({
  lenis: null,
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const instance = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const scroller = new Lenis({
      // autoRaf: false — the GSAP ticker is the only render loop on the page.
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // Native momentum on phones: smoothed touch feels laggy and breaks iOS < 16.
      syncTouch: false,
      anchors: { offset: -80 },
    });

    instance.current = scroller;
    setLenis(scroller);

    const onScroll = () => ScrollTrigger.update();
    scroller.on("scroll", onScroll);

    const tick = (time: number) => scroller.raf(time * 1000); // ticker time is seconds
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    // Web fonts change line breaks; images change document height.
    document.fonts?.ready.then(refresh).catch(() => {});
    const lateRefresh = window.setTimeout(refresh, 900);

    return () => {
      window.clearTimeout(lateRefresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      scroller.off("scroll", onScroll);
      scroller.destroy();
      instance.current = null;
      setLenis(null);
    };
  }, [reduced]);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      lenis,
      stop: () => instance.current?.stop(),
      start: () => instance.current?.start(),
      scrollTo: (target, opts) => {
        if (instance.current) {
          instance.current.scrollTo(target as never, { offset: opts?.offset ?? 0, immediate: opts?.immediate });
          return;
        }
        // Reduced motion / no Lenis: jump with the native API.
        const el =
          typeof target === "string" ? document.querySelector<HTMLElement>(target) : target instanceof HTMLElement ? target : null;
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (opts?.offset ?? 0), behavior: "auto" });
        else if (typeof target === "number") window.scrollTo({ top: target, behavior: "auto" });
      },
    }),
    [lenis],
  );

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}
