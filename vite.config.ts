import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Bold Hospitality Company — build config.
// The dev server binds 0.0.0.0 and accepts proxied preview hosts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // The sandbox preview is served through a proxy host; Vite must accept it.
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: "es2022",
    cssTarget: "safari16",
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap", "gsap/ScrollTrigger", "@gsap/react"],
          motion: ["motion/react"],
        },
      },
    },
  },
});
