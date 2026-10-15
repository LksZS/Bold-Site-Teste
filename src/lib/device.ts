/**
 * Motion tiers.
 *
 * The skill's rule: adapt rendering cost on constrained hardware instead of
 * disabling the experience. A page whose identity *is* motion keeps its scroll
 * choreography everywhere, but the optional extras (image drift inside panels,
 * scrubbing the brand film, the hero parallax) are dropped on low-power devices
 * and when the visitor asked for reduced data usage.
 *
 * Results are exposed as `document.documentElement.dataset.power` = "low" | "high"
 * so CSS can react too.
 */
export type PowerTier = "low" | "high";

export function detectPowerTier(): PowerTier {
  if (typeof navigator === "undefined") return "high";

  const cores = navigator.hardwareConcurrency ?? 8;
  // `deviceMemory` is Chromium-only; absent means "unknown", not "low".
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

  if (saveData) return "low";
  if (cores <= 4) return "low";
  if (typeof memory === "number" && memory <= 4) return "low";
  return "high";
}

export function isLowPower(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.power === "low";
}
