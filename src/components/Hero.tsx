import { useRef } from "react";
import { gsap, useGSAP, EASE } from "../lib/motion";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { TICKER, BRANDS } from "../lib/content";
import { isLowPower } from "../lib/device";
import { LQIP } from "../lib/lqip";
import { ArchLine } from "./ArchLine";
import { SweepButton } from "./SweepButton";
import { Marquee } from "./Marquee";
import { Icon } from "./icons";

/**
 * Arrival.
 *
 * One timeline: the arch line-work draws itself, the headline rises out of its
 * line mask, supporting copy follows, the framed office photograph uncovers
 * from a clip-path curtain and the ticker slides in. Under 1.6s, and skipped
 * entirely for reduced motion. The scroll relationship afterwards is gentle on
 * purpose: copy lifts away, the photograph keeps drifting a few percent inside
 * its frame (parallax) so the hero is still alive while the brands scene takes
 * over the screen.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: EASE.out }, delay: 0.1 });
        intro
          .from(".hero-arch path", { drawSVG: "0%", duration: 1.3, stagger: 0.09 }, 0)
          .from(".hero-kicker", { autoAlpha: 0, y: 16, duration: 0.7 }, 0.15)
          .from(".hero-line", { yPercent: 115, duration: 1.15, stagger: 0.09 }, 0.2)
          .from(".hero-copy > *", { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.09 }, 0.55)
          .fromTo(
            ".hero-media",
            { clipPath: "inset(16% 12% 16% 12% round 40px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.4, ease: EASE.inOut },
            0.3,
          )
          .from(".hero-media img", { scale: 1.16, duration: 1.6, ease: EASE.out }, 0.3)
          .from(".hero-chip", { autoAlpha: 0, y: 14, duration: 0.7 }, 1)
          .from(".hero-ticker", { autoAlpha: 0, duration: 0.9 }, 1.05)
          .from(".hero-cue", { autoAlpha: 0, duration: 0.7 }, 1.15);

        /* Scroll: copy recedes, photograph drifts inside its frame ---------- */
        gsap.to(".hero-copy", {
          yPercent: -14,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 35%", scrub: 0.6 },
        });

        // Optional extra: dropped on low-power devices, where the receding copy
        // already carries the transition into the brands scene.
        if (!isLowPower()) {
          gsap.fromTo(
            ".hero-media img",
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: ".hero-media", start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        }

        return () => intro.kill();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".hero-media", ".hero-chip", ".hero-copy > *", ".hero-kicker", ".hero-ticker", ".hero-cue"], {
          clearProps: "all",
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="on-dark grain relative isolate overflow-clip bg-wine-ink pb-10 pt-[calc(var(--nav-h)+2.5rem)]">
      {/* warm light source, echoing a dining room at night */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18%] -top-[22%] h-[70vw] w-[70vw] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--orange) 42%, transparent) 0%, transparent 62%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12%] bottom-[-18%] h-[46vw] w-[46vw] rounded-full opacity-45 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--rose) 55%, transparent) 0%, transparent 65%)" }}
      />

      <div className="shell relative z-[2]">
        <div className="grid items-end gap-10 pb-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14">
          {/* ── copy ───────────────────────────────────────────────────── */}
          <div className="max-w-[40rem]">
            <div className="hero-kicker mb-6 flex items-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/60">
              <ArchLine className="h-14 w-8 text-orange-bright hero-arch" orientation="vertical" delay={0.1} />
              <span>Hospitality Company · desde 1997</span>
            </div>

            <h1 className="text-[clamp(2.3rem,4.9vw,4.4rem)] font-black leading-[1.0] tracking-[-0.035em] text-white">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block">Experiências</span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block text-orange-bright">Gastronômicas</span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block">Inesquecíveis</span>
              </span>
            </h1>

            <div className="hero-copy mt-7 space-y-5">
              <p className="hand text-[clamp(1.5rem,3vw,2.1rem)] leading-tight text-orange-bright">
                Líder em hospitalidade casual dining no Brasil
              </p>
              <p className="max-w-[46ch] text-[0.98rem] leading-relaxed text-white/78">
                A Bold é a holding responsável por marcas icônicas como Outback Steakhouse, Abbraccio e Aussie. Criamos
                experiências memoráveis através de qualidade excepcional, atendimento caloroso e ambientes acolhedores.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <SweepButton onClick={() => scrollTo("#marcas", { offset: -8 })}>
                  Conheça Nossas Marcas
                </SweepButton>
                <button
                  type="button"
                  className="btn btn--onDark"
                  onClick={() => scrollTo("#expansao", { offset: -8 })}
                >
                  <span className="btn__label">Oportunidades</span>
                  <Icon name="arrowDown" size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ── photograph ─────────────────────────────────────────────── */}
          <figure className="relative">
            <div
              className="hero-media frame frame--arch relative aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]"
              style={{
                backgroundImage: `url(${LQIP["hero-office"]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "clip-path",
              }}
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet="/media/hero-office-960.avif 960w, /media/hero-office.avif 1920w"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
                <source
                  type="image/webp"
                  srcSet="/media/hero-office-960.webp 960w, /media/hero-office.webp 1920w"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
                <img
                  src="/media/hero-office.webp"
                  width={1920}
                  height={1280}
                  alt="Equipe da Bold comemorando no escritório de São Paulo, em frente à parede com as marcas do grupo"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
              <div className="scrim absolute inset-0" aria-hidden="true" style={{ opacity: 0.55 }} />
            </div>

            <figcaption className="hero-chip glass absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-white sm:right-auto sm:max-w-[19rem]">
              <img src="/media/bold-mark.png" alt="" className="h-8 w-8 shrink-0 rounded-full bg-white/90 object-contain p-0.5" />
              <span className="text-[0.78rem] leading-snug text-white/85">
                <strong className="block font-semibold text-white">Bold Hospitality Company</strong>
                São Paulo · 15 mil pessoas em 160+ unidades
              </span>
            </figcaption>
          </figure>
        </div>

        {/* ── brand marks row (leads into the brands scene) ───────────── */}
        <ul className="hero-cue flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-white/60">
          {BRANDS.map((brand) => (
            <li key={brand.id} className="flex items-center gap-3">
              <img src={brand.mark} alt={brand.markAlt} className="h-5 w-auto opacity-70" loading="lazy" />
            </li>
          ))}
          <li className="ml-auto flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em]">
            <span className="h-6 w-px bg-white/30" aria-hidden="true" />
            Role para descobrir
          </li>
        </ul>
      </div>

      {/* ── ticker ───────────────────────────────────────────────────── */}
      <div className="hero-ticker relative z-[2] mt-8 border-y border-white/12 py-3">
        <Marquee seconds={64} label="Marcas e princípios da Bold">
          {TICKER.map((item) => (
            <li key={item} className="flex items-center gap-6 whitespace-nowrap text-[0.82rem] uppercase tracking-[0.22em] text-white/55">
              {item}
              <span className="h-1 w-1 rounded-full bg-orange-bright/70" aria-hidden="true" />
            </li>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
