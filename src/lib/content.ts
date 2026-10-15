/**
 * Site content — transcribed from the original Bold site so nothing is lost in
 * the redesign. Copy, links and numbers are the source of truth; only the
 * presentation changed.
 */

export const NAV_LINKS = [
  { id: "home", label: "Início" },
  { id: "marcas", label: "Nossas Marcas" },
  { id: "historia", label: "Nossa História" },
  { id: "sobre", label: "Sobre Nós" },
  { id: "expansao", label: "Expansão" },
  { id: "contato", label: "Contato" },
] as const;

export type IconName =
  | "steak"
  | "beer"
  | "globe"
  | "celebrate"
  | "pasta"
  | "wine"
  | "chef"
  | "cheese"
  | "burger"
  | "fries"
  | "shake"
  | "bolt";

export interface Brand {
  id: string;
  index: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  features: { icon: IconName; label: string }[];
  href: string;
  hrefLabel: string;
  image: string;
  imageAlt: string;
  mark: string;
  /** White silhouette of the same mark, for the wine/night surfaces. */
  markLight: string;
  markAlt: string;
  /** Panel tint used by the horizontal rail. */
  tint: string;
  decade: string;
}

export const BRANDS: Brand[] = [
  {
    id: "outback",
    index: "01",
    name: "Outback Steakhouse",
    short: "Outback",
    tagline: "Churrasco australiano, hospitalidade brasileira",
    description:
      "O Outback Steakhouse é referência em churrasco australiano no Brasil. Com cortes nobres, temperos exclusivos e aquele atendimento acolhedor que nos tornou famosos, criamos momentos especiais para celebrar a vida.",
    features: [
      { icon: "steak", label: "Cortes Premium Importados" },
      { icon: "beer", label: "Chope e Drinks Exclusivos" },
      { icon: "globe", label: "Sabores Australianos Autênticos" },
      { icon: "celebrate", label: "Ambiente Descontraído e Alegre" },
    ],
    href: "https://www.outback.com.br/",
    hrefLabel: "Visite o site do Outback",
    image: "/media/brand-outback.webp",
    imageAlt: "Outback Steakhouse",
    mark: "/media/mark-outback.webp",
    markLight: "/media/mark-outback-light.webp",
    markAlt: "Outback Steakhouse",
    tint: "var(--wine)",
    decade: "1997",
  },
  {
    id: "abbraccio",
    index: "02",
    name: "Abbraccio Cucina Italiana",
    short: "Abbraccio",
    tagline: "Um abraço caloroso da Itália em cada prato",
    description:
      "O Abbraccio traz a verdadeira culinária italiana com massas frescas, molhos artesanais e receitas tradicionais. Um abraço caloroso da Itália em cada prato, com ingredientes selecionados e muito amor.",
    features: [
      { icon: "pasta", label: "Massas Frescas Diariamente" },
      { icon: "wine", label: "Carta de Vinhos Italiana" },
      { icon: "chef", label: "Receitas Tradicionais Italianas" },
      { icon: "cheese", label: "Queijos e Ingredientes Importados" },
    ],
    href: "https://www.abbraccio.com.br/",
    hrefLabel: "Visite o site do Abbraccio",
    image: "/media/brand-abbraccio.webp",
    imageAlt: "Abbraccio Cucina Italiana",
    mark: "/media/mark-abbraccio.webp",
    markLight: "/media/mark-abbraccio-light.webp",
    markAlt: "Abbraccio",
    tint: "var(--rose)",
    decade: "2013",
  },
  {
    id: "aussie",
    index: "03",
    name: "Aussie Grilled Burgers",
    short: "Aussie",
    tagline: "A qualidade Outback em formato casual",
    description:
      "O Aussie reinventa o hambúrguer gourmet com a qualidade Outback em um formato rápido e casual. Burgers suculentos, batatas crocantes e milk shakes irresistíveis em um ambiente descolado.",
    features: [
      { icon: "burger", label: "Burgers Artesanais Premium" },
      { icon: "fries", label: "Batatas e Acompanhamentos Especiais" },
      { icon: "shake", label: "Milk Shakes e Bebidas Exclusivas" },
      { icon: "bolt", label: "Serviço Rápido e Casual" },
    ],
    href: "https://www.aussiegrillbr.com.br/",
    hrefLabel: "Visite o site do Aussie",
    image: "/media/brand-aussie.webp",
    imageAlt: "Aussie Grilled Burgers",
    mark: "/media/mark-aussie.webp",
    markLight: "/media/mark-aussie-light.webp",
    markAlt: "Aussie",
    tint: "#b8532a",
    decade: "2019",
  },
];

export const STATS = [
  { value: 160, suffix: "+", label: "Unidades no Brasil" },
  { value: 15000, suffix: "+", label: "Colaboradores" },
  { value: 27, suffix: "+", label: "Anos de História" },
  { value: null, word: "Milhões", label: "de Clientes Atendidos" },
] as const;

export const VIDEO = {
  badge: "Nossa História",
  title: "Conheça a Bold",
  subtitle: "Descubra como nos tornamos referência em hospitalidade no Brasil",
  src: "/Fotos/video.mp4",
  poster: "/media/video-poster.webp",
  facts: [
    { icon: "film", strong: "27 Anos", span: "de Tradição" },
    { icon: "star", strong: "3 Marcas", span: "Icônicas" },
    { icon: "heart", strong: "Milhões", span: "de Clientes Felizes" },
  ],
} as const;

export const ABOUT = {
  eyebrow: "Quem Somos",
  title: "Hospitalidade e ousadia estão no nosso nome",
  lead: "Somos a Bold Hospitality Company, holding responsável por algumas das marcas de restaurantes mais amadas do Brasil e do mundo.",
  paragraphs: [
    "Somos a Bold Hospitality Company, holding responsável por algumas das marcas de restaurantes mais amadas do Brasil e do mundo: Outback Steakhouse, Abbraccio e Aussie Grill.",
    "Há 27 anos, criamos experiências memoráveis para nossos(as) clientes e fazemos do mundo um lugar mais saboroso. Ao mesmo tempo, cuidamos de nossas Pessoas, vibrando com uma cultura forte que traz muita coragem e alegria no dia a dia.",
    "Nossa paixão por servir é Bold. Nossa hospitalidade é Bold. Nossas pessoas são Bold. São mais de 15 mil Outbackers, Amici e Aussies que vivem diariamente nossos Princípios e Crenças: hospitalidade, qualidade, compartilhar, diversão, ponderação, coragem e orgulho.",
  ],
  facts: [
    { term: "Fundação", detail: "1997" },
    { term: "Marcas", detail: "Outback · Abbraccio · Aussie" },
    { term: "Pessoas", detail: "15.000+ Outbackers, Amici e Aussies" },
    { term: "Princípios", detail: "Hospitalidade, qualidade, compartilhar" },
  ],
  image: "/media/about-team.webp",
  imageAlt: "Equipe Bold reunida no escritório de São Paulo",
} as const;

export const VALUES = [
  {
    n: "01",
    name: "Excelência",
    detail: "Compromisso com a qualidade em tudo que fazemos",
    icon: "target" as const,
  },
  {
    n: "02",
    name: "Respeito",
    detail: "Valorização das pessoas e diversidade",
    icon: "handshake" as const,
  },
  {
    n: "03",
    name: "Inovação",
    detail: "Busca constante por melhorias e novidades",
    icon: "bulb" as const,
  },
  {
    n: "04",
    name: "Paixão",
    detail: "Amor genuíno pelo que fazemos",
    icon: "heart" as const,
  },
] as const;

export const EXPANSION = {
  eyebrow: "Expansão & Carreiras",
  title: "Seja um Bolder",
  subtitle: "Faça parte do sucesso de marcas consolidadas no mercado brasileiro.",
  benefits: [
    { icon: "chart" as const, label: "Marca consolidada e reconhecida" },
    { icon: "cap" as const, label: "Treinamento completo da equipe" },
    { icon: "growth" as const, label: "Plano de carreira" },
    { icon: "trophy" as const, label: "Crescimento e desenvolvimento profissional" },
  ],
  cta: { label: "Quero Ser Bolder", href: "https://boldhospitality.pandape.infojobs.com.br/SendCV" },
} as const;

export const GALLERY = [
  { src: "/media/gallery-ambiente.webp", caption: "Ambiente Acolhedor", span: "wide" },
  { src: "/media/gallery-gastronomia.webp", caption: "Gastronomia de Qualidade", span: "tall" },
  { src: "/media/gallery-experiencia.webp", caption: "Experiência Completa", span: "normal" },
  { src: "/media/gallery-equipe.webp", caption: "Equipe Dedicada", span: "normal" },
  { src: "/media/gallery-drinks.webp", caption: "Drinks Especiais", span: "tall" },
  { src: "/media/gallery-celebracao.webp", caption: "Momentos de Celebração", span: "wide" },
] as const;

export const CONTACT = {
  eyebrow: "Contato",
  title: "Estamos prontos para ouvir você",
  items: [
    { icon: "mail" as const, label: "Email", value: "contato@boldhospitality.com.br", href: "mailto:contato@boldhospitality.com.br" },
    { icon: "phone" as const, label: "Telefone", value: "+55 11 4063-4000", href: "tel:+551140634000" },
    { icon: "pin" as const, label: "Endereço", value: "São Paulo, SP — Brasil", href: null },
  ],
  socials: [
    { icon: "instagram" as const, label: "Instagram", href: "https://www.instagram.com/vidanabold/" },
    { icon: "linkedin" as const, label: "LinkedIn", href: "https://www.linkedin.com/company/boldhospitalitycompany/?originalSubdomain=br" },
    { icon: "facebook" as const, label: "Facebook", href: "https://www.facebook.com/vidanabold/" },
  ],
  copyright: "© 2026 Bold Hospitality Company. Todos os direitos reservados.",
} as const;

/** Bottom-of-hero ticker: the holding's own vocabulary, no invented claims. */
export const TICKER = [
  "Outback Steakhouse",
  "Abbraccio",
  "Aussie Grill",
  "160+ unidades",
  "15 mil Outbackers",
  "27 anos de história",
  "Hospitalidade",
  "Qualidade",
  "Compartilhar",
  "Diversão",
  "Coragem",
  "Orgulho",
] as const;
