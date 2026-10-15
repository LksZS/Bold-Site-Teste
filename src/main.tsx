import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from "./App";
import { detectPowerTier } from "./lib/device";

// Enables the "hidden until revealed" pre-state for JS-capable clients only.
// The reveal system adds .motion-ready once it has actually booted, so a failed
// bundle or a no-motion client never sees an empty page.
document.documentElement.classList.add("js");
document.documentElement.dataset.power = detectPowerTier();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
