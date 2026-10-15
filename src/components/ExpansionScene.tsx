import { useRef } from "react";
import { gsap, useGSAP } from "../lib/motion";
import { EXPANSION } from "../lib/content";
import { Icon } from "./icons";
import { SweepButton } from "./SweepButton";

/**
 * "Seja um Bolder" — the conversion section. Composition is carried by the
 * brand's own geometry: a large arch line-work drawing itself behind the copy
 * (scrubbed, one layer), the benefits on translucent tiles, and a single
 * primary action. This is the only place on the page where the CTA gets the
 * sweep treatment.
 */
export function ExpansionScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom 45%", scrub: true },
        });
        tl.fromTo(".expansion-arch path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".expansion-arch path", { drawSVG: "100%" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="expansao"
      ref={root}
      className="on-dark grain relative isolate overflow-clip bg-wine py-[clamp(4.5rem,10vw,8rem)]"
      aria-labelledby="expansion-title"
    >
      {/* arch motif, drawn by scroll, sitting behind the copy */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 620"
        className="expansion-arch pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 text-white/12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M250 620V300a150 150 0 0 1 300 0v320" />
        <path d="M520 620V240a190 190 0 0 1 380 0v380" />
        <path d="M150 620V400a110 110 0 0 1 220 0v220" />
        <path d="M60 620h1080" />
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-60 blur-3xl"
        style={{ background: "radial-gradient(50% 100% at 50% 100%, color-mix(in oklab, var(--orange) 40%, transparent), transparent 70%)" }}
      />

      <div className="shell relative z-[2] grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4">{EXPANSION.eyebrow}</p>
          <h2 id="expansion-title" className="text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] text-white">
            {EXPANSION.title}
          </h2>
          <p className="hand mt-4 text-[clamp(1.5rem,3vw,2.2rem)] text-orange-bright">{EXPANSION.subtitle}</p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <SweepButton href={EXPANSION.cta.href} target="_blank" rel="noopener noreferrer" className="btn--onDark">
              {EXPANSION.cta.label}
            </SweepButton>
            <a href="#marcas" className="link-arrow">
              Conhecer as marcas
            </a>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-6" data-reveal>
          {EXPANSION.benefits.map((benefit) => (
            <li
              key={benefit.label}
              className="flex items-start gap-4 rounded-3xl border border-white/15 bg-white/[0.08] p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/12 text-orange-bright">
                <Icon name={benefit.icon} size={21} />
              </span>
              <span className="text-[0.92rem] leading-snug text-white/90">{benefit.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
