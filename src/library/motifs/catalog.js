/*
 * Visual motif library (data). Motifs are original, stylised SVG artwork — no logos, album art or brand marks.
 * kind:
 *   object    — one item placed at x / y (%) with a size (px)
 *   particles — many small items scattered over the whole area (count, size range)
 *   band      — a full-width strip anchored at y (trees, skyline, torn paper…)
 *   overlay   — covers the whole area (mist, smoke, grain, rain on glass…)
 * anim = the motif's natural animation (used when a motif's animation is "auto").
 */
export const MOTIF_CATEGORIES = ["Nature", "Objects", "Celestial", "Abstract", "Music & nostalgia"];

const m = (id, label, category, kind, extra = {}) => ({ id, label, category, kind, size: 220, count: 14, color: "$primary", accent: "$accent", anim: "float", ...extra });

export const MOTIF_CATALOG = [
  /* Nature */
  m("leaves", "Autumn leaves", "Nature", "particles", { size: 34, count: 16, color: "#b5462a", accent: "#d98a3a", anim: "fall" }),
  m("petals", "Rose petals", "Nature", "particles", { size: 22, count: 18, color: "#c2416b", accent: "#e8a0b4", anim: "fall" }),
  m("butterflies", "Butterflies", "Nature", "particles", { size: 34, count: 6, color: "#b9a3e3", accent: "#f2a3c7", anim: "flutter" }),
  m("fireflies", "Fireflies", "Nature", "particles", { size: 10, count: 26, color: "#ffe9a3", accent: "#fff7d6", anim: "rise" }),
  m("rain", "Rain", "Nature", "particles", { size: 40, count: 60, color: "#cfd8e6", accent: "#cfd8e6", anim: "rain" }),
  m("clouds", "Clouds", "Nature", "particles", { size: 160, count: 5, color: "#ffffff", accent: "#ffffff", anim: "drift" }),
  m("trees", "Forest silhouette", "Nature", "band", { size: 260, color: "#1f3328", accent: "#2f4a3a", anim: "none", y: 100 }),
  m("wildflowers", "Wildflowers", "Nature", "band", { size: 120, color: "#2f4a3a", accent: "#e8c9a0", anim: "sway", y: 100 }),
  m("mist", "Mist", "Nature", "overlay", { color: "#ffffff", accent: "#ffffff", anim: "drift", opacity: 0.55 }),
  m("seagulls", "Seagulls", "Nature", "particles", { size: 26, count: 5, color: "#1d3557", accent: "#1d3557", anim: "glide" }),

  /* Objects */
  m("scarf", "Flowing scarf", "Objects", "object", { size: 520, color: "#a4161a", accent: "#7a0f14", anim: "flow" }),
  m("car", "Vintage sports car", "Objects", "object", { size: 320, color: "#a4161a", accent: "#f1e3c8", anim: "reveal" }),
  m("polaroid", "Polaroid photo", "Objects", "object", { size: 170, color: "#ffffff", accent: "#c9b8a3", anim: "pop", text: "that autumn" }),
  m("filmstrip", "Film strip", "Objects", "object", { size: 360, color: "#1c1917", accent: "#c9a46b", anim: "drift-slow" }),
  m("postcard", "Vintage postcard", "Objects", "object", { size: 220, color: "#f4ead9", accent: "#a4161a", anim: "pop", text: "Greetings from somewhere" }),
  m("note", "Handwritten note", "Objects", "object", { size: 220, color: "#fdf7e7", accent: "#3a2a24", anim: "pop", text: "remember this?" }),
  m("lipstick", "Lipstick mark", "Objects", "object", { size: 90, color: "#a4161a", accent: "#7a0f14", anim: "pop" }),
  m("snake", "Serpent", "Objects", "object", { size: 560, color: "#c9ccd3", accent: "#5c5f66", anim: "slither" }),
  m("rose", "Black rose", "Objects", "object", { size: 160, color: "#1a1a1d", accent: "#5c0f1b", anim: "sway" }),
  m("chain", "Chain", "Objects", "band", { size: 40, color: "#a7abb3", accent: "#5c5f66", anim: "none", y: 8 }),
  m("newspaper", "Newspaper headline", "Objects", "object", { size: 340, color: "#e9e6df", accent: "#111111", anim: "reveal", text: "A NEW CHAPTER BEGINS" }),
  m("camera", "Vintage camera", "Objects", "object", { size: 140, color: "#1d3557", accent: "#a8dadc", anim: "float" }),
  m("clock", "Vintage clock", "Objects", "object", { size: 150, color: "#c7c9d9", accent: "#2a1f54", anim: "tick" }),
  m("letters", "Love letters", "Objects", "object", { size: 160, color: "#fdf7e7", accent: "#c2416b", anim: "float" }),
  m("book", "Open book", "Objects", "object", { size: 200, color: "#f5f0e6", accent: "#2f4a3a", anim: "float" }),
  m("curtains", "Flowing curtains", "Objects", "overlay", { color: "#7a1f3d", accent: "#4a1426", anim: "sway" }),
  m("lamps", "Warm lamps", "Objects", "particles", { size: 90, count: 7, color: "#ffcf8a", accent: "#ffb357", anim: "pulse" }),
  m("hearts", "Floating hearts", "Objects", "particles", { size: 26, count: 12, color: "#f28dbb", accent: "#ffd1e6", anim: "rise" }),
  m("stickers", "Stickers", "Objects", "particles", { size: 54, count: 7, color: "#ffe066", accent: "#7b5cd6", anim: "pop" }),
  m("tape", "Washi tape", "Objects", "object", { size: 160, color: "#f4b6c8", accent: "#ffffff", anim: "pop" }),
  m("doodles", "Doodles", "Objects", "particles", { size: 60, count: 6, color: "#3d2b6b", accent: "#3d2b6b", anim: "draw" }),

  /* Celestial */
  m("stars", "Stars", "Celestial", "particles", { size: 14, count: 40, color: "#ffffff", accent: "#c7c9d9", anim: "twinkle" }),
  m("moon", "Moon", "Celestial", "object", { size: 180, color: "#f1f0fa", accent: "#b6a7e8", anim: "glow" }),
  m("constellation", "Constellation", "Celestial", "object", { size: 320, color: "#c7c9d9", accent: "#b6a7e8", anim: "draw" }),
  m("particles", "Glowing dust", "Celestial", "particles", { size: 6, count: 40, color: "#b6a7e8", accent: "#ffffff", anim: "rise" }),
  m("shooting-star", "Shooting stars", "Celestial", "particles", { size: 140, count: 3, color: "#ffffff", accent: "#b6a7e8", anim: "shoot" }),

  /* Abstract */
  m("smoke", "Smoke", "Abstract", "overlay", { color: "#9ca3af", accent: "#5c0f1b", anim: "drift", opacity: 0.4 }),
  m("sheen", "Metallic light sweep", "Abstract", "overlay", { color: "#ffffff", accent: "#c9ccd3", anim: "sheen", opacity: 0.5 }),
  m("scales", "Serpent scales", "Abstract", "overlay", { color: "#c9ccd3", accent: "#c9ccd3", anim: "none", opacity: 0.08 }),
  m("grain", "Film grain", "Abstract", "overlay", { color: "#000000", accent: "#000000", anim: "none", opacity: 0.12 }),
  m("light-beams", "Light beams", "Abstract", "overlay", { color: "#ffffff", accent: "#ffcf8a", anim: "sway", opacity: 0.35 }),
  m("bokeh", "Bokeh lights", "Abstract", "particles", { size: 90, count: 12, color: "#ffcf8a", accent: "#f28dbb", anim: "pulse" }),
  m("shapes", "Geometric shapes", "Abstract", "particles", { size: 46, count: 9, color: "#ff2e88", accent: "#b4ff39", anim: "float" }),
  m("bolts", "Electric bolts", "Abstract", "particles", { size: 70, count: 5, color: "#b4ff39", accent: "#ff2e88", anim: "pulse" }),
  m("torn-paper", "Torn paper edge", "Abstract", "band", { size: 60, color: "#ffffff", accent: "#ffffff", anim: "none", y: 100 }),
  m("liquid", "Liquid shape", "Abstract", "object", { size: 320, color: "$primary", accent: "$accent", anim: "morph" }),
  m("rain-window", "Rain on glass", "Abstract", "overlay", { color: "#cfd8e6", accent: "#cfd8e6", anim: "rain", opacity: 0.6 }),
  m("skyline", "City skyline", "Abstract", "band", { size: 220, color: "#13294b", accent: "#ffe7a3", anim: "flicker", y: 100 }),

  /* Music & nostalgia */
  m("vinyl", "Vinyl record", "Music & nostalgia", "object", { size: 220, color: "#111111", accent: "$primary", anim: "spin" }),
  m("cassette", "Cassette tape", "Music & nostalgia", "object", { size: 220, color: "#2b2140", accent: "#ffe066", anim: "float" }),
  m("headphones", "Headphones", "Music & nostalgia", "object", { size: 170, color: "$text", accent: "$primary", anim: "float" }),
  m("waveform", "Audio waveform", "Music & nostalgia", "band", { size: 90, color: "$primary", accent: "$accent", anim: "wave", y: 50 }),
  m("notes", "Music notes", "Music & nostalgia", "particles", { size: 34, count: 8, color: "$primary", accent: "$accent", anim: "rise" }),
  m("speaker", "Vintage speaker", "Music & nostalgia", "object", { size: 180, color: "#3a2a24", accent: "#c9a46b", anim: "pulse" }),
];
export const MOTIF_BY_ID = Object.fromEntries(MOTIF_CATALOG.map((x) => [x.id, x]));
export const CUSTOM_MOTIF = m("custom", "Custom image", "Objects", "object", { size: 220, anim: "float" });

export const PLACEMENTS = [
  { value: "hero", label: "Hero sections" }, { value: "sections", label: "Body sections" }, { value: "between", label: "Between sections" },
  { value: "footer", label: "Footer" }, { value: "all", label: "Every section" }, { value: "section", label: "One specific section" },
];
export const MOTIF_ANIMS = ["auto", "none", "float", "sway", "spin", "drift", "drift-slow", "fall", "rise", "twinkle", "pulse", "pop", "reveal", "flow", "slither", "draw", "flutter", "glide", "shoot", "rain", "sheen", "wave", "tick", "flicker", "morph", "glow"];
export const MOTIF_HOVERS = [{ value: "none", label: "None" }, { value: "parallax", label: "Parallax with cursor" }, { value: "follow", label: "Follow cursor" }, { value: "tilt", label: "Tilt toward cursor" }];

let n = 0;
// A new motif instance (serializable) — every editable property lives here.
export function motifInstance(asset, patch = {}) {
  const c = MOTIF_BY_ID[asset] || CUSTOM_MOTIF;
  n += 1;
  return {
    id: `motif-${Date.now().toString(36)}-${n}`, asset, placement: "hero", sectionId: "", layer: "back",
    x: 50, y: c.y ?? 50, size: c.size, rotation: 0, opacity: c.opacity ?? 1, color: c.color, accent: c.accent, count: c.count,
    z: 1, animation: "auto", speed: 1, delay: 0, hover: "none", depth: 0.4, text: c.text || "", imageUrl: "", flip: false,
    desktop: true, tablet: true, mobile: true, tabletScale: 0.8, mobileScale: 0.55,
    ...patch,
  };
}
