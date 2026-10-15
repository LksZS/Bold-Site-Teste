/**
 * Bold Hospitality Company — asset pipeline.
 *
 * The repo shipped 25 MB of unoptimized photography. This script derives the
 * display sizes the redesign actually renders (plus a 20 px LQIP for the
 * above-the-fold hero) and writes them to public/media.
 *
 * Source originals in public/Fotos stay untouched so the brand assets remain
 * available at full resolution.
 *
 *   node scripts/optimize-assets.mjs
 */
import { mkdir, readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public", "Fotos");
const OUT = path.join(ROOT, "public", "media");
const LIB = path.join(ROOT, "src", "lib");

/** [sourceFile, outputName, widths[]] */
const PLAN = [
  // Hero + story photography
  ["Foto-0512.jpg", "hero-office", [1920, 960]],
  ["Foto-0591.jpg", "story-team", [1600, 800]],
  // Brand visuals (keep brand colours accurate: quality 78, no colour profile tweaks)
  ["Outback-Steakhouse.png", "brand-outback", [1400, 700]],
  ["abraccio.png", "brand-abbraccio", [1400, 700]],
  ["aussie-grill-imagem.webp", "brand-aussie", [1400, 700]],
  // Gallery
  ["Projeto-1.jpg", "gallery-ambiente", [1400, 700]],
  ["abb.jpg", "gallery-gastronomia", [1400, 700]],
  ["Outback.Ambientes-28.jpg", "gallery-experiencia", [1400, 700]],
  ["equipe.jpg", "gallery-equipe", [1400, 700]],
  ["outback-promo-chopp-gkpb-banner.jpg", "gallery-drinks", [1400, 700]],
  ["out.jpg", "gallery-celebracao", [1400, 700]],
  ["outback_fachada.jpg", "gallery-fachada", [1400, 700]],
  ["Post-quadrado-Pat-4.webp", "gallery-salao", [1400, 700]],
  ["OIP.webp", "gallery-prato", [1400, 700]],
  // Team / about
  ["equipe.jpg", "about-team", [1200, 600]],
];

/**
 * Brand marks keep their alpha. Each one is written twice:
 *   mark-*.webp        – original colours, for light surfaces
 *   mark-*-light.webp  – white silhouette, for the wine/night surfaces
 */
const MARKS = [
  { file: "logo.png", name: "brand-lockup", width: 1200, white: true },
  { file: "BoldLogo.PNG", name: "bold-mark", width: 720, white: false },
  { file: "outback-logo.png", name: "mark-outback", width: 480, white: true },
  { file: "abbraccio-logo.png", name: "mark-abbraccio", width: 480, white: true },
  { file: "aussie-logo.png", name: "mark-aussie", width: 480, white: true },
];

const lqip = {};

async function ensureDirs() {
  await mkdir(OUT, { recursive: true });
  await mkdir(LIB, { recursive: true });
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function optimizePhoto([file, name, widths]) {
  const input = path.join(SRC, file);
  if (!(await fileExists(input))) {
    console.warn(`  ! missing ${file}`);
    return;
  }
  const meta = await sharp(input).metadata();
  for (const width of widths) {
    const w = Math.min(width, meta.width ?? width);
    const suffix = width === widths[0] ? "" : `-${width}`;
    const base = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    await base.clone().webp({ quality: 76, effort: 5 }).toFile(path.join(OUT, `${name}${suffix}.webp`));
    await base.clone().avif({ quality: 58, effort: 4 }).toFile(path.join(OUT, `${name}${suffix}.avif`));
  }
  // LQIP (20px wide, heavily blurred by the consumer via CSS background-size: cover)
  const tiny = await sharp(input).rotate().resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  lqip[name] = `data:image/webp;base64,${tiny.toString("base64")}`;
  console.log(`  ✓ ${name} @ ${widths.join("/")}`);
}

/**
 * Builds a flat version of a transparent logo. "white" forces every visible
 * pixel to white (dark marks such as the Outback wordmark); "original" keeps
 * the brand colours (the Bold logo is already cream on wine).
 */
async function flattenMark(input, width, white) {
  const meta = await sharp(input).metadata();
  const w = Math.min(width, meta.width ?? width);
  const resized = await sharp(input).resize({ width: w, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = resized;

  if (white) {
    for (let i = 0; i < data.length; i += info.channels) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png();
}

async function optimizeMark({ file, name, width, white }) {
  const input = path.join(SRC, file);
  if (!(await fileExists(input))) {
    console.warn(`  ! missing ${file}`);
    return;
  }

  const original = await flattenMark(input, width, false);
  await original.clone().webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(OUT, `${name}.webp`));
  await original.clone().png({ compressionLevel: 9 }).toFile(path.join(OUT, `${name}.png`));

  if (white) {
    const light = await flattenMark(input, width, true);
    await light.clone().webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(OUT, `${name}-light.webp`));
    await light.clone().png({ compressionLevel: 9 }).toFile(path.join(OUT, `${name}-light.png`));
  }

  console.log(`  ✓ ${name} (mark${white ? " + white version" : ""})`);
}

async function main() {
  await ensureDirs();
  console.log("Optimizing photography →", path.relative(ROOT, OUT));
  for (const entry of PLAN) await optimizePhoto(entry);
  console.log("Optimizing brand marks");
  for (const entry of MARKS) await optimizeMark(entry);

  const ts = `// AUTO-GENERATED by scripts/optimize-assets.mjs — do not edit by hand.\n
/** 20px WebP placeholders, inlined to avoid a request during first paint. */\nexport const LQIP: Record<string, string> = ${JSON.stringify(lqip, null, 2)};\n`;
  await writeFile(path.join(LIB, "lqip.ts"), ts, "utf8");

  const files = await readdir(OUT);
  const sizes = await Promise.all(files.map(async (f) => (await stat(path.join(OUT, f))).size));
  const totalMB = (sizes.reduce((a, b) => a + b, 0) / 1e6).toFixed(2);
  console.log(`\nDone. ${files.length} files in public/media (${totalMB} MB)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
