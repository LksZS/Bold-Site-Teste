import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect on the client, useEffect on the server (SSR-safe). */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Subscribes to a media query with live updates. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

export const usePointerFine = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** Locks page scrolling (Lenis-aware) while a dialog or menu is open. */
export function useScrollLock(locked: boolean, stop?: () => void, start?: () => void) {
  useEffect(() => {
    if (!locked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stop?.();
    return () => {
      document.body.style.overflow = previousOverflow;
      start?.();
    };
  }, [locked, stop, start]);
}

/** Trailing debounce that always calls the latest closure. */
export function useDebouncedCallback<T extends (...args: never[]) => void>(fn: T, wait = 200) {
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return useCallback(
    (...args: Parameters<T>) => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => latest.current(...args), wait);
    },
    [wait],
  );
}
