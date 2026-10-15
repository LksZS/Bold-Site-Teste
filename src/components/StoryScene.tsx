import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "../lib/motion";
import { VIDEO } from "../lib/content";
import { Icon } from "./icons";
import { isLowPower } from "../lib/device";
import { ArchLine } from "./ArchLine";

/**
 * "Nossa História" — a sticky-media scene.
 *
 * Rather than dropping a video into a rounded box, the frame opens from a small
 * window to full width while the section holds, and the film's own timeline is
 * scrubbed by scroll (desktop, motion allowed, only after metadata is known).
 * The moment the visitor presses play the scrub is disabled and the native
 * controls take over, so nothing fights for control of the same element.
 */
export function StoryScene() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef<gsap.core.Tween | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const activateScrub = useCallback(() => {
    const video = videoRef.current;
    if (!video || scrubRef.current || !Number.isFinite(video.duration) || video.duration === 0) return;
    if (video.readyState < 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;
    if (isLowPower()) return; // a 2-minute MP4 scrub is the first thing to drop

    scrubRef.current = gsap.to(video, {
      currentTime: video.duration,
      ease: "none",
      scrollTrigger: {
        trigger: stage.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });
  }, []);

  const stopScrub = useCallback(() => {
    scrubRef.current?.scrollTrigger?.kill();
    scrubRef.current?.kill();
    scrubRef.current = null;
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 1024px)", motionOK: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const { desktop, motionOK } = ctx.conditions as { desktop: boolean; motionOK: boolean };
          if (!desktop || !motionOK) return;

          /* The frame opens and the copy rises while the stage holds. */
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stage.current, start: "top top", end: "bottom bottom", scrub: true },
          });

          // The copy never disappears: it only drifts, so the scene is readable
          // from the first pixel of the pin.
          tl.fromTo(
            frame.current,
            { clipPath: "inset(8% 14% 8% 14% round 32px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.5 },
            0,
          )
            .fromTo(".story-media", { scale: 1.12 }, { scale: 1, duration: 0.5 }, 0)
            .fromTo(".story-copy", { yPercent: 7 }, { yPercent: -4, duration: 0.5 }, 0)
            .fromTo(".story-fact", { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, 0.2);

          return () => tl.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="historia"
      ref={root}
      className="relative isolate bg-cream lg:h-[180svh]"
      aria-labelledby="history-title"
    >
      <div ref={stage} className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:pt-[calc(var(--nav-h)+1.5rem)]">
        <div className="shell grid items-center gap-10 py-[clamp(4rem,9vw,7rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-14 lg:py-24">
          {/* ── copy column ──────────────────────────────────────────── */}
          <div className="story-copy">
            <div className="mb-5 flex items-center gap-4">
              <ArchLine className="h-14 w-8 text-orange-ink" orientation="vertical" />
              <span className="eyebrow">{VIDEO.badge}</span>
            </div>
            <h2 id="history-title" className="text-[clamp(2rem,4.4vw,3.6rem)]">
              {VIDEO.title}
            </h2>
            <p className="lead mt-4">{VIDEO.subtitle}</p>

            <dl className="mt-8 space-y-4 border-t border-[var(--hairline)] pt-6">
              {VIDEO.facts.map((fact) => (
                <div key={fact.strong} className="story-fact flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-wine/8 text-wine">
                    <Icon name={fact.icon as "film" | "star" | "heart"} size={20} />
                  </span>
                  <div>
                    <dt className="text-[1.05rem] font-bold text-wine">{fact.strong}</dt>
                    <dd className="text-[0.85rem] text-[var(--ink-soft)]">{fact.span}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ── media column ────────────────────────────────────────── */}
          <div className="relative">
            <div
              ref={frame}
              className="frame relative aspect-video w-full bg-night"
              style={{ willChange: "clip-path" }}
            >
              <video
                ref={videoRef}
                className="story-media h-full w-full object-cover"
                poster={VIDEO.poster}
                preload="metadata"
                playsInline
                controls={started}
                onLoadedMetadata={activateScrub}
                onPlay={() => {
                  setPlaying(true);
                  setStarted(true);
                  stopScrub(); // hands full control to the visitor
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                aria-label="Vídeo institucional da Bold Hospitality Company"
              >
                <source src={VIDEO.src} type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>

              {!playing && (
                <button
                  type="button"
                  onClick={() => {
                    videoRef.current?.play().catch(() => {});
                  }}
                  className="absolute inset-0 z-[3] grid place-items-center bg-wine-ink/35 transition-colors duration-300 hover:bg-wine-ink/25"
                  aria-label="Reproduzir o vídeo institucional da Bold"
                >
                  <span className="glass grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full text-white transition-transform duration-200 active:scale-95">
                    <Icon name="play" size={26} className="translate-x-[2px]" />
                  </span>
                  <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-left text-white">
                    <span className="text-[0.78rem] uppercase tracking-[0.22em] text-white/80">
                      {started ? "Continuar" : "Assistir · 1 min 55 s"}
                    </span>
                    <span className="hidden text-[0.7rem] uppercase tracking-[0.2em] text-white/55 lg:block">role para percorrer</span>
                  </span>
                </button>
              )}
            </div>

            <p className="mt-4 max-w-[52ch] text-[0.82rem] leading-relaxed text-[var(--ink-soft)]">
              Ao rolar, o filme avança quadro a quadro junto com a página. Pressione play para assistir com som.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { EASE };
