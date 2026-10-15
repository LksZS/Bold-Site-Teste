/**
 * The one reveal system for the whole page.
 *
 * Three patterns only, each used consistently (motion budget rule):
 *   1. [data-reveal]        → block fade + short rise, batched per row
 *   2. [data-split]         → display headings revealed line by line from a mask
 *   3. [data-image-reveal]  → framed media unveiled with a clip-path curtain
 *
 * Everything runs once, is transform/opacity (or a single clipped layer), and is
 * torn down by gsap.matchMedia when the visitor prefers reduced motion or the
 * breakpoint changes.
 */
import { type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE, DUR, DISTANCE } from "./motion";
import { useIsomorphicLayoutEffect } from "./hooks";

type Scope = RefObject<HTMLElement | null>;

declare global {
  interface Window {
    __boldMotion?: { reveals: boolean };
  }
}

export function useRevealSystem(scope: Scope) {
  useIsomorphicLayoutEffect(() => {
    // Marks the animation layer as booted: only then are reveal targets allowed
    // to start hidden (see the failsafe rules in styles/index.css).
    window.__boldMotion = { ...(window.__boldMotion ?? {}), reveals: true };
    document.documentElement.classList.add("motion-ready");
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOK: "(prefers-reduced-motion: no-preference)",
          small: "(max-width: 767px)",
        },
        (ctx) => {
          const { motionOK, small } = ctx.conditions as { motionOK: boolean; small: boolean };

          if (!motionOK) {
            // Tier 1 removed, Tier 3 kept: content is simply visible.
            gsap.set("[data-reveal]", { autoAlpha: 1, clearProps: "transform" });
            gsap.set("[data-image-reveal]", { clipPath: "none" });
            gsap.set("[data-image-reveal] img", { clearProps: "transform" });
            return;
          }

          /* 1 — blocks ---------------------------------------------------- */
          const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
          if (blocks.length) {
            gsap.set(blocks, { y: small ? DISTANCE * 0.55 : DISTANCE });
            ScrollTrigger.batch(blocks, {
              start: "top 88%",
              once: true,
              interval: 0.12,
              batchMax: 6,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: DUR.reveal,
                  ease: EASE.out,
                  stagger: 0.09,
                  overwrite: true,
                  // Drop the transform once settled: no lingering composited layers.
                  onComplete: () => gsap.set(batch, { clearProps: "transform,will-change" }),
                }),
            });
          }

          /* 2 — display headings, line by line ---------------------------- */
          const headings = gsap.utils.toArray<HTMLElement>("[data-split]");
          headings.forEach((el) => {
            gsap.set(el, { autoAlpha: 1 });
            // SplitText re-splits on font load and resize and restores progress.
            import("gsap/SplitText").then(({ SplitText }) => {
              gsap.registerPlugin(SplitText);
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                linesClass: "line",
                autoSplit: true,
                aria: "auto",
                onSplit(self) {
                  return gsap.from(self.lines, {
                    yPercent: 112,
                    duration: DUR.slow,
                    ease: EASE.out,
                    stagger: small ? 0.06 : 0.095,
                    scrollTrigger: { trigger: el, start: "top 88%", once: true },
                  });
                },
              });
            });
          });

          /* 3 — framed media unveiled by a curtain ----------------------- */
          const frames = gsap.utils.toArray<HTMLElement>("[data-image-reveal]");
          frames.forEach((frame) => {
            const media = frame.querySelector<HTMLElement>("img, video");
            const tl = gsap.timeline({
              defaults: { duration: 1.35, ease: EASE.inOut },
              scrollTrigger: { trigger: frame, start: "top 84%", once: true },
            });
            tl.fromTo(frame, { clipPath: "inset(14% 8% 14% 8% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, 0);
            if (media) tl.fromTo(media, { scale: 1.14 }, { scale: 1, ease: EASE.out }, 0);
          });
        },
      );

      return () => mm.revert();
    },
    { scope },
  );
}

/**
 * Curtain time: on first paint the page is hidden behind a wine panel that
 * lifts once the hero is ready. It never gates content for long (max 1.4s) and
 * is skipped entirely when reduced motion is requested.
 */
export function useIntroCurtain(root: RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || el.dataset.done === "true") return;

    const remove = () => {
      if (!el.isConnected) return;
      el.dataset.done = "true";
      el.remove();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      remove();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.inOut } });
    tl.to(el, { yPercent: -100, duration: 1, delay: 0.12, onComplete: remove });

    // Failsafe: an error anywhere else must never leave the page behind a curtain.
    const bail = window.setTimeout(remove, 2600);

    return () => {
      window.clearTimeout(bail);
      tl.kill();
    };
  }, [root]);
}
