# Bold Hospitality Company — site institucional

Redesign do site da Bold (holding de **Outback Steakhouse**, **Abbraccio** e **Aussie**)
sobre uma arquitetura de componentes moderna, com um sistema de movimento próprio.

> A identidade visual original foi preservada: vinho `#6e2828`, laranja `#f09100`,
> Poppins + Caveat, o logo BOLD, o lockup com as três marcas e todo o conteúdo
> institucional. O que mudou foi a execução — composição, tipografia, movimento e
> desempenho.

---

## Stack

| Camada | Escolha | Por quê |
| --- | --- | --- |
| UI | **React 19 + TypeScript + Vite** | Componentes reutilizáveis, tipagem das interações, build rápido. |
| Estilo | **Tailwind v4** + um design system em CSS (`src/styles/index.css`) | Tokens de marca, tipografia fluida, superfícies e o sistema de reveal em um lugar só. |
| Scroll | **GSAP 3.15 + ScrollTrigger** | Coreografia ligada ao scroll (rail horizontal, cenas sticky, contadores, desenho de path). |
| Scroll suave | **Lenis** dirigido pelo `gsap.ticker` | Um único rAF loop; o ScrollTrigger lê a posição suavizada no mesmo frame. Nunca é criado com `prefers-reduced-motion`. |
| Interação | **Motion for React** (`motion/react`) | Transições de layout e microinterações de UI — pílula ativa da navegação, zoom com elemento compartilhado da galeria. |
| Fontes | **@fontsource** (Poppins + Caveat Variable) | Auto-hospedadas: sem requisição a terceiros, sem CLS de `font-display`. |

Não há dois sistemas de animação disputando os mesmos elementos: **GSAP** cuida de tudo que é
ligado ao scroll; **Motion** cuida de mudanças de estado de UI.

## Estrutura

```
index.html              # shell (SEO, OG, preload do LCP, fallback <noscript>)
src/
  App.tsx               # composição das cenas, ordem da página
  main.tsx              # boot, camada de JS, tier de desempenho
  components/
    Nav.tsx             # navegação flutuante em vidro + menu mobile em tela cheia
    Hero.tsx            # chegada: timeline do headline, cortina do clip-path, ticker
    BrandsRail.tsx      # ASSINATURA: galeria horizontal das três marcas em scroll
    StatsBand.tsx       # números do grupo com contadores acessíveis
    StoryScene.tsx      # cena sticky com o filme institucional (scrub + play manual)
    AboutScene.tsx      # perfil editorial "Quem Somos"
    ValuesIndex.tsx     # valores como índice tipográfico
    ExpansionScene.tsx  # "Seja um Bolder" com o arco desenhado por scroll
    GalleryScene.tsx    # mosaico + lightbox com shared element (Motion layoutId)
    ContactScene.tsx    # contato e rodapé com wordmark gigante
    ArchLine.tsx        # line-work da marca (arco, horizonte, faísca) com DrawSVG
    Marquee.tsx         # ticker CSS puro, com pausa em hover/focus
    SweepButton.tsx     # CTA com preenchimento que entra pela borda do ponteiro (WAAPI)
    icons.tsx           # família única de ícones (substitui os emojis do projeto antigo)
  lib/
    motion.ts           # tokens de movimento + registro dos plugins (fonte única)
    reveal.ts           # sistema de reveal (blocos, títulos por linha, mídia)
    smooth-scroll.tsx   # Lenis + contexto de scroll (stop/start/scrollTo)
    device.ts           # tier de desempenho (hardwareConcurrency, deviceMemory, saveData)
    content.ts          # todo o conteúdo institucional, transcrito do site original
    lqip.ts             # placeholders gerados (20px) para o primeiro paint
scripts/
  optimize-assets.mjs   # deriva as imagens de exibição + LQIP a partir de public/Fotos
  optimize-video.mjs    # remux com faststart + poster do filme
vanilla/                # versão anterior (HTML/CSS/JS originais), publicada em /vanilla/
```

## Movimento

Direção: **editorial cinematográfico / "luxury slow"** — revelações lentas de imagem grande,
feedback de interface preciso e rápido. Um único momento assinatura por página.

| Sistema | Onde | Regra |
| --- | --- | --- |
| Reveal de blocos | `[data-reveal]` | `ScrollTrigger.batch`, 24–28 px, `expo.out`, 1,05 s, 90 ms de stagger, **uma vez** |
| Títulos por linha | `[data-split]` | `SplitText` com máscaras, `yPercent: 112`, `autoSplit` (re-split em fontes/resize) |
| Mídia | `[data-image-reveal]` | clip-path que abre de `inset(14% 8%)` + escala interna 1,14 → 1 |
| **Assinatura** | `BrandsRail` | trilho horizontal preso por `position: sticky` + transform com scrub; fundo muda de tom com a marca |
| Números | `StatsBand` | contagem única, valor final em `sr-only` para leitores de tela |
| Filme | `StoryScene` | a moldura abre enquanto a seção prende; o `currentTime` é scrubado pelo scroll até o visitante dar play |
| Galeria | `GalleryScene` | `layoutId` do Motion: a foto viaja da grade para o overlay; Esc fecha, foco volta ao tile |
| Line-work | `ArchLine` / `ExpansionScene` | `DrawSVG` do arco — a geometria da própria marca |

**Nada** é preso sem motivo: as duas cenas sticky mostram informação em qualquer posição de
scroll, e o pin em si é feito com `position: sticky` (medido com 0 de CLS, contra até 1,0 por
seção com `pin: true` do GSAP).

## Acessibilidade

- `prefers-reduced-motion`: nenhuma instância de Lenis, nenhum pin, nenhum scrub, nenhum
  parallax; o conteúdo continua visível e as transições viram fades curtos (`0.01ms` como
  backstop, nunca `0s`).
- `prefers-reduced-transparency` / `prefers-contrast: more`: o vidro vira superfície sólida.
- Conteúdo essencial existe sem JavaScript (fallback `<noscript>` + classes de reveal só
  ligadas depois que a camada de animação confirma o boot).
- Navegação por teclado: tablist de âncoras, menu mobile com focus trap manual + Esc,
  lightbox com foco gerenciado, `:focus-visible` sempre visível, foco devolvido ao elemento
  de origem.
- Ticker com pausa em hover/focus (WCAG 2.2.2); reduced motion troca por scroll nativo.
- Contraste revisado: o laranja da marca é usado como texto apenas sobre vinho
  (4,4:1) ou em tons escurecidos sobre claro (`--orange-ink` 6,1:1).

## Tiers de desempenho

`src/lib/device.ts` marca `html[data-power]`. Em aparelhos de baixo consumo
(≤4 núcleos, `deviceMemory` ≤4 GB ou `saveData`) a coreografia continua, mas os extras
opcionais são desligados: parallax do hero, drift das imagens no rail e scrub do vídeo.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview    # serve o dist em :4173

npm run assets:optimize                       # regenera public/media + src/lib/lqip.ts
FFMPEG_PATH=/caminho/ffmpeg npm run assets:video   # remux + poster do filme
```

Os originais ficam intactos em `public/Fotos/`; `public/media/` é derivado e pode ser
regenerado a qualquer momento.

## QA executado

Auditoria com `motion-audit.mjs` (script da skill `frontend-atlas`), no build de produção
(`vite preview`), em 1440×900 e 390×844, com e sem `prefers-reduced-motion`, 14 passos de
scroll cada execução:

| Execução | p95 de frame | CLS | Overflow horizontal | Erros de console | Reveals presos |
| --- | --- | --- | --- | --- | --- |
| motion @1440 | 33,3 ms | 0,000 | 0 px | 0 | 0 |
| motion @390 | 16,7 ms | 0,000 | 0 px | 0 | 0 |
| reduced @1440 | 16,7 ms | 0,009 | 0 px | 0 | 0 |
| reduced @390 | 16,8 ms | 0,001 | 0 px | 0 | 0 |

Verificação manual adicional: tabulação completa (skip link visível ao focar, ordem de foco
lógica, `:focus-visible` sempre com outline), menu mobile (abre com `aria-expanded`, fecha com
Esc e devolve o foco ao botão), lightbox (abre por Enter, Esc fecha em ~0,85 s, foco volta ao
tile, scroll da página travado), navegação por âncora a partir da nav, e a galeria horizontal
no mobile (snap + deslize nativo).

## Limitações conhecidas

- **p95 de 33 ms em 1440 px no headless.** O número vem de um navegador headless com
  rasterização por software: as seções com fotografia em tela cheia (hero, rail das marcas,
  galeria) custam ~28–33 ms por frame naquele ambiente. O mesmo teste em 390 px, em
  `prefers-reduced-motion` e sem a camada de fotos fica em 16,7 ms. Em GPU real os mesmos
  quadros são compósitos; a mitigação já embutida é o tier de desempenho
  (`src/lib/device.ts`), que desliga parallax, drift das imagens e scrub do vídeo em aparelhos
  fracos, e o ticker/`grain` sem `mix-blend-mode`.
- **Vídeo.** O filme original é um H.264 de 1138×640 a ~0,9 Mbps; recodificá-lo gerava um
  arquivo **maior** (21,9 MB contra 15,3 MB), então ele é apenas remuxado com `+faststart`
  (por isso `npm run assets:video` escreve de volta em `public/Fotos/video.mp4`).
- **Autoplay/áudio.** O filme nunca toca sozinho; o scrub por scroll só existe no desktop, com
  movimento permitido e fora do tier baixo. Ao dar play, o controle é do visitante.
- **`prefers-reduced-transparency`** é reportado no Chromium 119+; em navegadores que não
  implementam a media query, o vidro permanece com blur (mas há fallback para `@supports` sem
  `backdrop-filter`).
- **Sem CMS.** Todo o conteúdo está em `src/lib/content.ts`, transcrito do site original.
