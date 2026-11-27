export const FONTS = [
  { name: "Anton", axis: null, fallback: "Impact, 'Arial Narrow', sans-serif" },
  { name: "Bebas Neue", axis: null, fallback: "Impact, sans-serif" },
  { name: "Oswald", axis: "200..700", fallback: "'Arial Narrow', sans-serif" },
  { name: "Archivo Black", axis: null, fallback: "'Arial Black', sans-serif" },
  { name: "Inter", axis: "100..900", fallback: "system-ui, sans-serif" },
  { name: "Space Grotesk", axis: "300..700", fallback: "system-ui, sans-serif" },
  { name: "Playfair Display", axis: "400..900", fallback: "Georgia, serif" },
  { name: "DM Serif Display", axis: null, fallback: "Georgia, serif" },
  { name: "JetBrains Mono", axis: "100..800", fallback: "ui-monospace, monospace" },
  { name: "Manrope", axis: "200..800", fallback: "system-ui, sans-serif" },
  { name: "Outfit", axis: "100..900", fallback: "system-ui, sans-serif" },
  { name: "DM Sans", axis: "100..1000", fallback: "system-ui, sans-serif" },
  { name: "Fraunces", axis: "100..900", fallback: "Georgia, serif" },
  { name: "Cormorant Garamond", axis: "300..700", fallback: "Georgia, serif" },
  { name: "Lora", axis: "400..700", fallback: "Georgia, serif" },
  { name: "Instrument Serif", axis: null, fallback: "Georgia, serif" },
  { name: "Nunito", axis: "200..1000", fallback: "system-ui, sans-serif" },
  { name: "Quicksand", axis: "300..700", fallback: "system-ui, sans-serif" },
  { name: "Fredoka", axis: "300..700", fallback: "system-ui, sans-serif" },
  { name: "Syne", axis: "400..800", fallback: "system-ui, sans-serif" },
  { name: "Sora", axis: "100..800", fallback: "system-ui, sans-serif" },
  { name: "Archivo", axis: "100..900", fallback: "system-ui, sans-serif" },
  { name: "Bricolage Grotesque", axis: "200..800", fallback: "system-ui, sans-serif" },
  { name: "Orbitron", axis: "400..900", fallback: "system-ui, sans-serif" },
  { name: "Caveat", axis: "400..700", fallback: "'Comic Sans MS', cursive" },
  { name: "Homemade Apple", axis: null, fallback: "cursive" },
  { name: "Special Elite", axis: null, fallback: "'Courier New', monospace" },
  { name: "Permanent Marker", axis: null, fallback: "'Comic Sans MS', cursive" },
];

const loaded = new Set();
// Idempotent. Static fonts (axis: null) must not request a weight range or Google returns 400.
export function loadFont(name) {
  if (typeof document === "undefined" || typeof name !== "string" || name.startsWith("$") || loaded.has(name)) return;
  const f = FONTS.find((x) => x.name === name);
  if (!f) return;
  loaded.add(name);
  const family = name.replace(/ /g, "+") + (f.axis ? `:wght@${f.axis}` : "");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  document.head.appendChild(link);
}

export const fontStack = (name) => {
  // "$heading" / "$body" link to the global design system
  const TOK = { $heading: "heading", $body: "body", $accentFont: "accent", $nav: "nav", $button: "button" };
  if (TOK[name]) return `var(--syn-font-${TOK[name]})`;
  if (typeof name === "string" && name.startsWith("var(")) return name;
  const f = FONTS.find((x) => x.name === name);
  return f ? `'${f.name}', ${f.fallback}` : name || "inherit";
};
export const FONT_OPTIONS = FONTS.map((f) => ({ value: f.name, label: f.name }));