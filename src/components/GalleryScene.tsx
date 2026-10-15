import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GALLERY } from "../lib/content";
import { useScrollLock, useReducedMotion } from "../lib/hooks";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { Icon } from "./icons";

/**
 * "Nossos Restaurantes" — an editorial mosaic with a shared-element zoom.
 *
 * The tile is a real button; activating it (click, tap, Enter/Space) promotes
 * that same element into a full-screen viewer. Both the tile and the overlay
 * carry the same Motion `layoutId`, so the photograph visibly travels from the
 * grid into the overlay instead of two unrelated animations. Motion hides the
 * source tile while the overlay owns the id.
 *
 * Escape closes, scroll is locked (Lenis-aware), focus moves into the dialog and
 * returns to the tile afterwards. Reduced motion gets a plain cross-fade.
 */
export function GalleryScene() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { stop, start } = useSmoothScroll();
  const reduced = useReducedMotion();

  const close = useCallback(() => setOpenIndex(null), []);

  useScrollLock(openIndex !== null, stop, start);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => closeButton.current?.focus());
    const previous = lastFocused.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      previous?.focus();
    };
  }, [openIndex, close]);

  const open = (index: number, element: HTMLElement) => {
    lastFocused.current = element;
    setOpenIndex(index);
  };

  const active = openIndex === null ? null : { item: GALLERY[openIndex], index: openIndex };
  // Dismissal must beat the entrance (skill rule: exits run at ~0.6-0.75x).
  // Motion holds the exiting node until the shared-layout spring settles, so a
  // long spring meant the overlay lingered ~1.5s after Escape. This settles in
  // roughly 0.45s.
  const spring = reduced
    ? { duration: 0.18 }
    : ({ type: "spring", stiffness: 340, damping: 36, mass: 0.7 } as const);

  return (
    <section className="section relative" aria-labelledby="gallery-title">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Salões &amp; Cozinhas</p>
            <h2 id="gallery-title" data-split className="text-[clamp(1.9rem,4.2vw,3.2rem)]">
              Nossos Restaurantes
            </h2>
          </div>
          <p className="max-w-[38ch] text-[0.9rem] text-[var(--ink-soft)]">
            Ambientes acolhedores e experiências únicas. Abra uma foto para ampliar.
          </p>
        </div>

        {/* Mosaic: rows have a fixed rhythm and the tiles span across it, so the
            photographs line up instead of stretching to their own aspect ratio. */}
        <ul
          className="grid grid-cols-2 gap-3 auto-rows-[clamp(8.5rem,17vw,13rem)] sm:gap-4 lg:grid-cols-4"
          data-reveal
        >
          {GALLERY.map((item, index) => (
            <li
              key={item.src}
              className={[
                item.span === "wide" ? "col-span-2" : "",
                item.span === "tall" ? "row-span-2" : "",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={(event) => open(index, event.currentTarget)}
                className="h-full w-full text-left"
                aria-label={`Ampliar foto: ${item.caption}`}
              >
                <motion.div
                  layoutId={`gallery-${index}`}
                  className="frame frame--zoom group relative h-full min-h-[8.5rem] w-full"
                  transition={spring}
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="scrim absolute inset-0" aria-hidden="true" style={{ opacity: 0.7 }} />
                  <span className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-4">
                    <span className="text-[0.92rem] font-semibold leading-tight text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
                      {item.caption}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Icon name="expand" size={15} />
                    </span>
                  </span>
                </motion.div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.item.caption}
          >
            <motion.button
              type="button"
              className="absolute inset-0 cursor-zoom-out bg-night/90"
              onClick={close}
              tabIndex={-1}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              layoutId={`gallery-${active.index}`}
              transition={spring}
              className="relative z-[2] flex w-auto max-w-[min(84rem,94vw)] flex-col overflow-hidden rounded-3xl bg-night"
            >
              <img
                src={active.item.src}
                alt={active.item.caption}
                className="max-h-[74svh] w-auto max-w-full flex-1 object-contain"
              />
              <div className="flex items-center justify-between gap-4 p-4">
                <p className="text-[0.95rem] font-semibold text-white">{active.item.caption}</p>
                <button ref={closeButton} type="button" onClick={close} className="btn btn--onDark">
                  <Icon name="close" size={18} />
                  <span className="btn__label">Fechar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
