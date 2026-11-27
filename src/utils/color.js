// Small color helpers for deriving theme tokens (hover states, elevated surfaces, dark previews, contrast).
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
export function parseHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  const n = parseInt(h, 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
export const toHex = ([r, g, b]) => `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
export const isHex = (v) => !!parseHex(v);

// t = 0 → a, t = 1 → b
export function mix(a, b, t) {
  const A = parseHex(a), B = parseHex(b);
  if (!A || !B) return a;
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
}
export const lighten = (c, t) => mix(c, "#ffffff", t);
export const darken = (c, t) => mix(c, "#000000", t);

export function luminance(hex) {
  const c = parseHex(hex);
  if (!c) return 0.5;
  const [r, g, b] = c.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export const isDark = (hex) => luminance(hex) < 0.22;
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
// Readable text color on top of a background.
export const onColor = (bg, light = "#ffffff", dark = "#0b0b10") => (contrast(bg, light) >= contrast(bg, dark) ? light : dark);
// Nudge a hover state in the direction that keeps contrast.
export const hoverOf = (c) => (isDark(c) ? lighten(c, 0.14) : darken(c, 0.12));
