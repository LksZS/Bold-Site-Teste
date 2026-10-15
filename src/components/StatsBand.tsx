import { useRef } from "react";
import { gsap, useGSAP } from "../lib/motion";
import { STATS } from "../lib/content";
import { useReducedMotion } from "../lib/hooks";

/**
 * The holding's numbers, read as a narrow band of large type.
 * Counters animate once on entry (power3.out, so the digits decelerate into
 * their final value) and the value is exposed to assistive tech through an
 * sr-only copy so a screen reader never hears a number mid-count.
 */
function CountUp({ value, suffix, locale = "pt-BR" }: { value: number; suffix?: string; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const format = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(n));
  const final = `${format(value)}${suffix ?? ""}`;

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || reduced) return;
      const counter = { v: 0 };
      node.textContent = `${format(0)}${suffix ?? ""}`;
      gsap.to(counter, {
        v: value,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
        onUpdate: () => {
          node.textContent = `${format(counter.v)}${suffix ?? ""}`;
        },
      });
    },
    { scope: ref, dependencies: [value, reduced] },
  );

  return (
    <span className="tabular-nums">
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
    </span>
  );
}

export function StatsBand() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-wine-deep py-[clamp(3.5rem,7vw,6rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-50 blur-3xl"
        style={{ background: "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--orange) 32%, transparent), transparent 70%)" }}
      />
      <div className="shell relative z-[2]">
        <div className="flex flex-col gap-3 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="eyebrow">A Bold em números</p>
          <p className="max-w-[42ch] text-[0.9rem] text-white/65">
            Mais de 15 mil pessoas servindo milhões de clientes em 160 unidades espalhadas pelo Brasil.
          </p>
        </div>

        <dl className="grid gap-y-8 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="relative border-b border-white/12 pb-6 sm:border-0 sm:pb-0 lg:pl-6" data-reveal>
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1 hidden h-[70%] w-px bg-white/15 lg:block ${index === 0 ? "lg:hidden" : ""}`}
              />
              <dd className="text-[clamp(2.6rem,5.4vw,4.4rem)] font-black leading-[0.95] tracking-[-0.03em] text-orange-bright">
                {"value" in stat && stat.value !== null ? (
                  <CountUp value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>{"word" in stat ? stat.word : ""}</span>
                )}
              </dd>
              <dt className="mt-3 text-[0.82rem] font-medium uppercase tracking-[0.16em] text-white/60">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
