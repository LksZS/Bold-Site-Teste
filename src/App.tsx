import { useRef } from "react";
import { SmoothScrollProvider } from "./lib/smooth-scroll";
import { useRevealSystem, useIntroCurtain } from "./lib/reveal";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { BrandsRail } from "./components/BrandsRail";
import { StatsBand } from "./components/StatsBand";
import { StoryScene } from "./components/StoryScene";
import { AboutScene } from "./components/AboutScene";
import { ValuesIndex } from "./components/ValuesIndex";
import { ExpansionScene } from "./components/ExpansionScene";
import { GalleryScene } from "./components/GalleryScene";
import { ContactScene } from "./components/ContactScene";

export function App() {
  const root = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useRevealSystem(root);
  useIntroCurtain(curtain);

  return (
    <SmoothScrollProvider>
      {/* Intro curtain: lifts once the hero is ready, removed if JS fails or motion is reduced */}
      <div ref={curtain} className="grain fixed inset-0 z-[100] bg-wine-ink" aria-hidden="true" />

      <a href="#main" className="skip-link btn">
        <span className="btn__label">Pular para o conteúdo</span>
      </a>

      <Nav />

      <div ref={root}>
        <main id="main">
          <Hero />
          <BrandsRail />
          <StatsBand />
          <StoryScene />
          <AboutScene />
          <ValuesIndex />
          <ExpansionScene />
          <GalleryScene />
        </main>
        <ContactScene />
      </div>
    </SmoothScrollProvider>
  );
}
