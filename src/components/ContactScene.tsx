import { CONTACT } from "../lib/content";
import { Icon } from "./icons";
import { SweepButton } from "./SweepButton";

/**
 * Contact + footer, closed by the brand's own wordmark set edge to edge with
 * the baseline cropped — the signature of a page ending on purpose rather than
 * on a stack of columns.
 */
export function ContactScene() {
  return (
    <footer id="contato" className="on-dark grain relative isolate overflow-clip bg-wine-ink pt-[var(--section-y)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70vw] -translate-x-1/2 opacity-40 blur-3xl"
        style={{ background: "radial-gradient(50% 100% at 50% 0%, color-mix(in oklab, var(--orange) 34%, transparent), transparent 70%)" }}
      />

      <div className="shell relative z-[2]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">{CONTACT.eyebrow}</p>
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] text-white">{CONTACT.title}</h2>
            <p className="mt-4 max-w-[36ch] text-[0.95rem] text-white/70">
              Imprensa, parcerias, expansão ou carreiras: escolha o canal e fale com a Bold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SweepButton href={CONTACT.items[0].href ?? "#"}>Enviar e-mail</SweepButton>
              <a href={CONTACT.items[1].href ?? "#"} className="btn btn--onDark">
                <span className="btn__label">Ligar agora</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-7">
            <ul className="space-y-5" data-reveal>
              {CONTACT.items.map((item) => (
                <li key={item.label} className="flex items-start gap-4 border-b border-white/12 pb-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-orange-bright">
                    <Icon name={item.icon} size={19} />
                  </span>
                  <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/50">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-[0.98rem] text-white underline decoration-white/25 underline-offset-4 hover:decoration-orange-bright">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[0.98rem] text-white">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-11">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/50">Siga-nos</p>
            <ul className="mt-4 space-y-3">
              {CONTACT.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-[0.92rem] text-white/85"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-colors duration-200 group-hover:border-orange-bright group-hover:text-orange-bright">
                      <Icon name={social.icon} size={16} />
                    </span>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/12 pt-6 text-[0.8rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <img src="/media/brand-lockup-light.webp" alt="Bold Hospitality Company" className="h-9 w-auto" loading="lazy" />
          <p>{CONTACT.copyright}</p>
          <p className="flex flex-wrap gap-4">
            <a href="#marcas" className="hover:text-white">
              Marcas
            </a>
            <a href="#expansao" className="hover:text-white">
              Carreiras
            </a>
            <a href="/vanilla/index.html" className="hover:text-white">
              Versão anterior
            </a>
          </p>
        </div>
      </div>

      {/* Giant wordmark: the page ends on the brand name, cropped at the baseline */}
      <div className="wordmark relative z-[2] mt-6 px-[var(--gutter)]" aria-hidden="true">
        <span className="wordmark__text text-white/12">BOLD</span>
      </div>
    </footer>
  );
}
