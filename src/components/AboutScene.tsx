import { ABOUT } from "../lib/content";
import { ArchLine } from "./ArchLine";
import { LQIP } from "../lib/lqip";

/**
 * "Quem Somos" — magazine profile layout: a sticky portrait on the left, a lead
 * sentence set large, the body in a single readable column, and the facts as a
 * definition list on a hairline (no emoji bullet lists, no skill bars).
 */
export function AboutScene() {
  return (
    <section id="sobre" className="section relative overflow-clip" aria-labelledby="about-title">
      <div className="shell grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        {/* portrait */}
        <figure className="lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start" data-image-reveal>
          <div
            className="frame frame--zoom relative aspect-[4/5] w-full"
            style={{ backgroundImage: `url(${LQIP["about-team"]})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <img src={ABOUT.image} alt={ABOUT.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-3 flex items-center gap-3 text-[0.78rem] text-[var(--ink-soft)]">
            <span className="h-px w-8 bg-[var(--hairline-strong)]" aria-hidden="true" />
            Escritório Bold · São Paulo, SP
          </figcaption>
        </figure>

        {/* text */}
        <div className="lg:col-span-7 lg:pl-4">
          <div className="mb-6 flex items-center gap-4">
            <ArchLine className="h-12 w-8 text-orange-ink" orientation="vertical" delay={0.1} />
            <p className="eyebrow">{ABOUT.eyebrow}</p>
          </div>

          <h2 id="about-title" data-split className="text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.06]">
            {ABOUT.title}
          </h2>

          <p className="mt-6 text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.45] text-[var(--ink)]">{ABOUT.lead}</p>

          <div className="mt-8 space-y-5" data-reveal>
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="max-w-[62ch] leading-relaxed text-[var(--ink-soft)]">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-[var(--hairline)] pt-8 sm:grid-cols-2" data-reveal>
            {ABOUT.facts.map((fact) => (
              <div key={fact.term}>
                <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-orange-ink">{fact.term}</dt>
                <dd className="mt-1.5 text-[0.95rem] text-[var(--ink)]">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
