/**
 * Motion tokens and the single GSAP entry point for the whole site.
 *
 * Mirrors the CSS custom properties in src/styles/index.css (section 6).
 * Personality: "Luxury slow" editorial — slow, large-image reveals with a
 * precise Swiss layer for interface feedback. Every animation reads its timing
 * from here so the motion language stays coherent.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

export const EASE = {
  out: "expo.out",
  outSoft: "power3.out",
  inOut: "power3.inOut",
  scrub: "none",
} as const;

export const DUR = {
  ui: 0.16,
  hover: 0.22,
  base: 0.8,
  reveal: 1.05,
  slow: 1.35,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.09,
  loose: 0.14,
} as const;

/** Reveal distance in px; call sites scale it down on small screens. */
export const DISTANCE = 28;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip, useGSAP);
  gsap.defaults({ ease: EASE.out, duration: DUR.base });
  // Phones: the address bar resize must not re-measure every trigger.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, useGSAP };
