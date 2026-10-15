import { VALUES } from "../lib/content";
import { Icon } from "./icons";

/**
 * "Nossos Valores" as a typographic index instead of four identical cards:
 * numbered rows on hairlines that light up on hover/focus, the icon sitting in
 * the number's slot. The whole grid is one reveal group.
 */
export function ValuesIndex() {
  return (
    <section className="section relative bg-sand/60" aria-labelledby="values-title">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Cultura</p>
            <h2 id="values-title" className="text-[clamp(1.8rem,3.6vw,2.8rem)]">
              Nossos Valores
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.9rem] text-[var(--ink-soft)]">
            Princípios e crenças que atravessam as três marcas e todas as nossas cozinhas.
          </p>
        </div>

        <ol className="row-index" data-reveal>
          {VALUES.map((value) => (
            <li key={value.name} className="row-index__item">
              <div className="row-index__link grid-cols-[2.5ch_minmax(0,1fr)] sm:grid-cols-[3.5ch_minmax(0,1fr)_minmax(0,1.4fr)] sm:items-baseline">
                <span className="text-[0.8rem] font-semibold tracking-[0.2em] text-orange-ink">{value.n}</span>
                <span className="flex items-center gap-3">
                  <Icon name={value.icon} size={22} className="text-wine/70" />
                  <span className="text-[clamp(1.35rem,3.2vw,2.3rem)] font-extrabold tracking-tight text-wine">
                    {value.name}
                  </span>
                </span>
                <span className="col-start-2 text-[0.9rem] leading-relaxed text-[var(--ink-soft)] sm:col-start-auto sm:text-right">
                  {value.detail}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
