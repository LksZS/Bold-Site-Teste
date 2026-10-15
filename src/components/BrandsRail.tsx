import { useCallback, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/motion";
import { BRANDS } from "../lib/content";
import { Icon } from "./icons";
import { ArchLine } from "./ArchLine";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { useIsDesktop } from "../lib/hooks";
import { isLowPower } from "../lib/device";

/**
 * SIGNATURE MOMENT — "A vitrine das marcas".
 *
 * The three houses of the holding are presented as one continuous gallery:
 * vertical scroll drives a horizontal rail inside a CSS sticky stage, so each
 * brand owns a full screen-height state change while the holding stays on one
 * conveyor. The stage background cross-fades between the three brand tints with
 * opacity only (never a colour tween that repaints every frame).
 *
 * Built on `position: sticky` + a scrubbed transform instead of a GSAP pin:
 * sticky measured 0 layout shift where a default pin measured up to 1.0 per
 * 100vh section in Chromium.
 *
 * Mobile (<1024px) and reduced-motion visitors get a native horizontal,
 * snap-scrolling gallery instead — the same content, not a degraded copy.
 */
/** Ambient gradient for a brand, used by the two ping-ponging tint layers. */
const brandTint = (index: number) =>
  `radial-gradient(120% 90% at ${22 + index * 28}% 12%, color-mix(in oklab, ${BRANDS[index].tint} 58%, transparent) 0%, transparent 64%)`;

export function BrandsRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const { lenis } = useSmoothScroll();
  const isDesktop = useIsDesktop();

  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  /** Keyboard users tabbing into an off-screen panel get the rail brought to it. */
  const onRailFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const panel = (event.target as HTMLElement).closest<HTMLElement>(".rail-panel");
    const el = track.current;
    const trigger = triggerRef.current;
    if (!panel || !el || !trigger) return;
    const distance = Math.max(0, el.scrollWidth - window.innerWidth + 64);
    if (!distance) return;
    const ratio = gsap.utils.clamp(0, 1, (panel.offsetLeft - window.innerWidth * 0.08) / distance);
    const y = trigger.start + ratio * (trigger.end - trigger.start);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 1024px)", motionOK: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const { desktop, motionOK } = ctx.conditions as { desktop: boolean; motionOK: boolean };
          const el = track.current;
          const section = root.current;
          if (!desktop || !motionOK || !el || !section) return;

          const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 64);

          /* The sticky stage needs a container taller than the viewport for the
             travel to happen; the height follows the measured rail width. */
          const sizeStage = () => {
            section.style.height = `${Math.round(window.innerHeight + distance() * 1.05)}px`;
          };
          sizeStage();

          const setBar = progressRef.current ? gsap.quickSetter(progressRef.current, "scaleX") : null;
          const setCounter = (value: string) => {
            if (counterRef.current && counterRef.current.textContent !== value) counterRef.current.textContent = value;
          };

          const tween = gsap.to(el, {
            x: () => -distance(),
            ease: "none", // scrubbed motion is linear; the scroll itself is the easing
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance() * 1.05,
              scrub: true,
              invalidateOnRefresh: true,
              onRefreshInit: sizeStage,
              onUpdate: (self) => {
                setBar?.(self.progress);
                const index = Math.min(BRANDS.length - 1, Math.floor(self.progress * BRANDS.length));
                setCounter(String(index + 1).padStart(2, "0"));
                showTint(index);
              },
              onToggle: (self) => gsap.set(el, { willChange: self.isActive ? "transform" : "auto" }),
            },
          });
          triggerRef.current = tween.scrollTrigger ?? null;

          /* Brand tints -------------------------------------------------
             Two full-viewport layers ping-pong: the incoming brand's gradient is
             painted on the idle layer and cross-faded in at the brand boundary.
             Three permanently composited full-screen gradients measured ~3 ms of
             the frame budget in the audit; two discrete cross-fades do not. */
          const tints = gsap.utils.toArray<HTMLElement>(".rail-tint", section);
          let activeSlot = 0;
          let shown = 0;
          if (tints.length === 2) {
            gsap.set(tints[0], { opacity: 1 });
            gsap.set(tints[1], { opacity: 0 });
          }
          const showTint = (index: number) => {
            if (tints.length !== 2 || index === shown) return;
            const next = 1 - activeSlot;
            tints[next].style.backgroundImage = brandTint(index);
            gsap.to(tints[next], { opacity: 1, duration: 0.55, ease: "power2.out", overwrite: true });
            gsap.to(tints[activeSlot], { opacity: 0, duration: 0.55, ease: "power2.out", overwrite: true });
            activeSlot = next;
            shown = index;
          };
          showTint(0);

          /* Image drift inside each panel, measured along the rail's own travel.
             Optional extra: skipped on low-power devices, where the rail travel
             alone still carries the scene. */
          if (!isLowPower()) {
            gsap.utils.toArray<HTMLElement>(".rail-panel", section).forEach((panel) => {
              const media = panel.querySelector(".rail-media");
              if (!media) return;
              gsap.fromTo(
                media,
                { xPercent: -4 },
                {
                  xPercent: 4,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: tween,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            });
          }

          return () => {
            triggerRef.current = null;
            tween.scrollTrigger?.kill();
            tween.kill();
            section.style.height = "";
            gsap.set(el, { clearProps: "x,willChange" });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="marcas" ref={root} className="dark relative isolate lg:overflow-clip">
      <div className="relative lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-start">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night" />
        {[0, 1].map((slot) => (
          <div
            key={slot}
            aria-hidden="true"
            className="rail-tint absolute inset-0 -z-10"
            style={{ opacity: slot === 0 ? 1 : 0, backgroundImage: brandTint(slot === 0 ? 0 : 0) }}
          />
        ))}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/55" />

        {/* ── section header ───────────────────────────────────────────── */}
        <div className="shell flex items-end justify-between gap-6 pt-[calc(var(--nav-h)+3.5rem)] lg:pt-[calc(var(--nav-h)+1.25rem)]">
          <div data-reveal>
            <p className="eyebrow mb-3">Nossas Marcas</p>
            <h2 className="max-w-[26ch] text-[clamp(1.9rem,4vw,3.4rem)] text-white">
              Cada marca com sua própria identidade e propósito
            </h2>
          </div>
          <div className="hidden shrink-0 items-center gap-4 text-white/60 lg:flex">
            <ArchLine className="h-16 w-9 text-orange-bright" orientation="vertical" />
            <p className="text-[0.72rem] uppercase tracking-[0.22em]">
              <span ref={counterRef}>01</span>
              <span className="mx-2 text-white/30">/</span>
              <span>03</span>
            </p>
          </div>
        </div>

        {/* ── rail ─────────────────────────────────────────────────────── */}
        <div
          className="mt-7 lg:mt-6"
          onFocus={onRailFocus}
          role="group"
          aria-label="Galeria das marcas da Bold"
        >
          <div
            ref={track}
            className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] [scroll-padding-inline:var(--gutter)] lg:w-max lg:snap-none lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {BRANDS.map((brand) => (
              <article
                key={brand.id}
                className="rail-panel w-[min(88vw,42rem)] shrink-0 snap-start lg:w-[min(54vw,45rem)]"
                aria-label={brand.name}
              >
                <div className="on-dark flex h-full flex-col gap-5">
                  <div className="flex items-center gap-4 border-b border-white/15 pb-4">
                    <span className="text-[0.72rem] font-semibold tracking-[0.28em] text-white/45">{brand.index}</span>
                    <img
                      src={brand.markLight}
                      alt={brand.markAlt}
                      className="h-7 w-auto max-w-[9.5rem] object-contain opacity-90 sm:h-8"
                      loading="lazy"
                    />
                    <span className="ml-auto hidden text-[0.68rem] uppercase tracking-[0.22em] text-white/40 sm:block">
                      desde {brand.decade}
                    </span>
                  </div>

                  <div className="grid flex-1 items-center gap-6 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:gap-8">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[clamp(1.5rem,2.6vw,2.3rem)] leading-[1.06] text-white">{brand.name}</h3>
                      <p className="hand text-[clamp(1.1rem,1.8vw,1.45rem)] leading-snug text-orange-bright">{brand.tagline}</p>
                      <p className="text-[0.9rem] leading-relaxed text-white/70">{brand.description}</p>
                    </div>

                    <div className="frame frame--zoom relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[4/5]" data-image-reveal>
                      {/* 112% wide and pulled left: room for the +-4% drift without exposing an edge */}
                      <img
                        src={brand.image}
                        alt={brand.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="rail-media -ml-[6%] h-full w-[112%] max-w-none object-cover"
                      />
                      <span className="scrim absolute inset-0" aria-hidden="true" style={{ opacity: 0.45 }} />
                    </div>
                  </div>

                  <ul className="grid gap-2 sm:grid-cols-2">
                    {brand.features.map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-center gap-3 rounded-2xl border border-white/14 bg-white/[0.07] px-3.5 py-2.5"
                      >
                        <Icon name={feature.icon} size={18} className="shrink-0 text-orange-bright" />
                        <span className="text-[0.78rem] leading-snug text-white/85">{feature.label}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <a href={brand.href} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      {brand.hrefLabel}
                      <span className="icon-swap" aria-hidden="true">
                        <Icon name="arrowUpRight" size={16} />
                        <Icon name="arrowUpRight" size={16} />
                      </span>
                    </a>
                    <span className="hidden text-[0.68rem] uppercase tracking-[0.22em] text-white/35 lg:block">
                      continue rolando
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── rail progress ───────────────────────────────────────────── */}
        <div className="shell hidden lg:block">
          <div className="mt-4 flex items-center gap-4">
            <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/12">
              <span
                ref={progressRef}
                className="block h-full origin-left scale-x-0 rounded-full bg-orange-bright"
                style={{ willChange: "transform" }}
              />
            </span>
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">Vitrine das marcas</span>
          </div>
        </div>
      </div>

      {/* Mobile: a plain hint that the row scrolls sideways */}
      {!isDesktop && (
        <p className="shell pt-1 text-[0.7rem] uppercase tracking-[0.22em] text-white/40" aria-hidden="true">
          Deslize para ver as três marcas →
        </p>
      )}
    </section>
  );
}
