/**
 * Bold Hospitality Company — video pipeline.
 *
 * The brand video is a 2-minute 1138x640 H.264 file at ~0.9 Mbps — already
 * efficiently encoded, so it is NOT re-encoded (a CRF 26 re-encode measured
 * *larger* than the source). It is remuxed with +faststart instead, which moves
 * the moov atom to the front so the browser can seek and scrub while the file
 * is still arriving, and a poster frame is extracted.
 *
 *   FFMPEG_PATH=/path/to/ffmpeg node scripts/optimize-video.mjs
 */
import { execFile } from "node:child_process";
import { mkdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public", "Fotos", "video.mp4");
const OUT_DIR = path.join(ROOT, "public", "media");
// The film is remuxed in place: the repo keeps exactly one 15 MB copy of it, in
// public/Fotos, with the moov atom at the front so seeking/scrubbing is instant.
// The original is always recoverable from git history.
const OUT = path.join(ROOT, "public", "Fotos", "video.mp4.tmp.mp4");

const POSTER = path.join(OUT_DIR, "video-poster.webp");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  await run(FFMPEG, ["-y", "-i", SRC, "-c", "copy", "-movflags", "+faststart", OUT]);

  // 42 s in: guests and the dining room — a poster that shows the experience,
  // not the logo animation the film opens with.
  await run(FFMPEG, ["-y", "-ss", "42", "-i", SRC, "-frames:v", "1", "-vf", "scale=1600:-2", POSTER]);

  await rename(OUT, SRC);

  const before = (await stat(SRC)).size / 1e6;
  const after = before;
  console.log(`video: ${before.toFixed(1)} MB (remuxed in place, faststart; ${after.toFixed(1)} MB read back)`);
  console.log(`poster: ${path.relative(ROOT, POSTER)}`);
}

main().catch((error) => {
  console.error(error.stderr ?? error.message ?? error);
  process.exitCode = 1;
});
