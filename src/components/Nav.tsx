import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/motion";
import { useSmoothScroll } from "../lib/smooth-scroll";
import { useIsDesktop, useScrollLock } from "../lib/hooks";
import { NAV_LINKS } from "../lib/content";
import { Icon } from "./icons";

/**
 * Floating glass navigation.
 * - single pill, scales with the viewport (never taller than the safe area)
 * - active section underlined by a pill that travels between links (Motion layout)
 * - reading progress drawn along the bottom edge of the pill (ScrollTrigger)
 * - mobile: full-screen wine overlay with staggered links, focus + Esc handling
 */
export function Nav() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const { stop, start, scrollTo } = useSmoothScroll();

  useScrollLock(open, stop, start);

  useEffect(() => {
    if (isDesktop && open) setOpen(false);
  }, [isDesktop, open]);

  /* Reading progress + active section ------------------------------------- */
  useGSAP(() => {
    const bar = progressRef.current;
    if (bar) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
      });
    }

    NAV_LINKS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(id),
      });
    });
  }, []);

  /* Mobile overlay: staggered entrance, Escape to close -------------------- */
  useGSAP(
    () => {
      if (!open) return;
      const links = gsap.utils.toArray<HTMLElement>(".menu-link", overlayRef.current);
      gsap.fromTo(
        links,
        { yPercent: 120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.055, ease: "expo.out", delay: 0.12 },
      );
    },
    { dependencies: [open], scope: overlayRef },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => document.getElementById("nav-toggle")?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => overlayRef.current?.querySelector<HTMLElement>("a")?.focus());
  }, [open]);

  const go = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      setOpen(false);
      // The overlay closes first so the scroll target is measured without it.
      requestAnimationFrame(() => scrollTo(`#${id}`, { offset: -8 }));
      history.pushState(null, "", `#${id}`);
    },
    [scrollTo],
  );

  return (
    <>
      <header ref={rootRef} className="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex justify-center px-3 sm:px-5">
        <div
          ref={pillRef}
          className="glass relative flex w-full max-w-[76rem] items-center gap-3 rounded-full py-2 pl-3 pr-2 sm:gap-4 sm:pl-5 sm:pr-3"
        >
          <a
            href="#home"
            onClick={(event) => go(event, "home")}
            className="flex shrink-0 items-center gap-2"
            aria-label="Bold Hospitality Company — início"
          >
            <img src="/media/bold-mark.png" alt="" className="h-8 w-8 rounded-full bg-white/90 object-contain p-0.5 sm:h-9 sm:w-9" />
            <span className="hidden text-[0.78rem] font-semibold uppercase leading-[1.05] tracking-[0.18em] text-white/90 sm:block">
              Bold
              <span className="block text-[0.6rem] font-medium tracking-[0.22em] text-white/60">Hospitality</span>
            </span>
          </a>

          <nav aria-label="Navegação principal" className="hidden flex-1 lg:block">
            <ul className="flex items-center justify-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id} className="relative">
                    <a
                      href={`#${link.id}`}
                      onClick={(event) => go(event, link.id)}
                      aria-current={isActive ? "location" : undefined}
                      className="relative block rounded-full px-3.5 py-2 text-[0.82rem] font-medium text-white/78 transition-colors duration-200 hover:text-white"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-white/14"
                          transition={{ type: "spring", duration: 0.42, bounce: 0.12 }}
                        />
                      )}
                      <span className={`relative ${isActive ? "text-white" : ""}`}>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="#expansao"
              onClick={(event) => go(event, "expansao")}
              className="hidden rounded-full bg-white px-4 py-2 text-[0.78rem] font-semibold text-wine transition-transform duration-150 active:scale-[0.97] sm:inline-flex"
            >
              Seja um Bolder
            </a>

            <button
              id="nav-toggle"
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
            >
              <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>

          {/* reading progress */}
          <span className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/10">
            <span
              ref={progressRef}
              className="block h-full origin-left scale-x-0 rounded-full bg-orange-bright"
              style={{ willChange: "transform" }}
            />
          </span>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.3 }}
            className="on-dark grain fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-wine-ink px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-28 lg:hidden"
          >
            <nav aria-label="Navegação principal (mobile)">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.id} className="overflow-hidden">
                    <a
                      href={`#${link.id}`}
                      onClick={(event) => go(event, link.id)}
                      className="menu-link flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 pt-3 text-[1.9rem] font-extrabold tracking-tight text-white"
                    >
                      {link.label}
                      <span className="text-[0.7rem] font-medium tracking-[0.2em] text-white/40">
                        {String(NAV_LINKS.indexOf(link) + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-4 text-sm text-white/70">
              <a
                href="https://boldhospitality.pandape.infojobs.com.br/SendCV"
                className="btn btn--onDark w-full justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="btn__label">Quero Ser Bolder</span>
                <Icon name="arrowUpRight" size={18} />
              </a>
              <p>
                <a href="mailto:contato@boldhospitality.com.br" className="underline decoration-white/30">
                  contato@boldhospitality.com.br
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
