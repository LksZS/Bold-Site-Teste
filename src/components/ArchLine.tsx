import { useRef } from "react";
import { gsap, useGSAP } from "../lib/motion";


/**
 * The brand's own geometry, drawn as a line-work motif: a doorway arch (the
 * shape of a Bold interior), a horizon rule and a spark. Used as a section
 * marker and as the connective tissue between the three brands. Paths draw
 * themselves on entry — the only "drawing" animation on the page.
 */
export function ArchLine({
  className = "",
  orientation = "vertical",
  delay = 0,
  scrub = false,
}: {
  className?: string;
  orientation?: "vertical" | "horizontal";
  delay?: number;
  scrub?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const paths = gsap.utils.toArray<SVGPathElement>(".arch-path", ref.current);
        gsap.fromTo(
          paths,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: scrub ? 1 : 1.6,
            ease: scrub ? "none" : "power2.inOut",
            stagger: scrub ? 0 : 0.14,
            delay: scrub ? 0 : delay,
            ...(scrub
              ? { scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom 40%", scrub: true } }
              : {}),
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".arch-path", { drawSVG: "100%" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const vertical = orientation === "vertical";

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={vertical ? "0 0 120 220" : "0 0 220 120"}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      {vertical ? (
        <>
          <path className="arch-path" d="M8 214V86a52 52 0 0 1 104 0v128" strokeWidth="1.4" opacity="0.55" />
          <path className="arch-path" d="M30 214V96a30 30 0 0 1 60 0v118" strokeWidth="1.4" opacity="0.35" />
          <path className="arch-path" d="M8 214h104" strokeWidth="1.4" />
          <path className="arch-path" d="M60 8v26" strokeWidth="1.4" />
          <path className="arch-path" d="M48 20h24" strokeWidth="1.4" />
        </>
      ) : (
        <>
          <path className="arch-path" d="M6 60h84" strokeWidth="1.4" />
          <path className="arch-path" d="M90 60a26 26 0 0 1 26 26v28" strokeWidth="1.4" opacity="0.55" />
          <path className="arch-path" d="M150 60h64" strokeWidth="1.4" />
          <path className="arch-path" d="M214 46v28" strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}
