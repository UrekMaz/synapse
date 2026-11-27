import { motifInstance } from "../library/motifs/catalog.js";

/*
 * Mood & Experience packages for the "Inspired by Music & Eras" themes. These are original visual
 * interpretations of a mood — no album artwork, logos, photographs, lyrics or recordings. Sounds are
 * the in-browser synthesized soundscapes from src/audio/soundscapes.js.
 */
const mi = (id, asset, patch) => motifInstance(asset, { id, ...patch });

const exp = (e) => ({
  decorations: true,
  materials: { card: "none", ...e.materials },
  styles: { nav: "default", headline: "default", image: "none", cta: "default", ...e.styles },
  motion: { enabled: true, intensity: 1, transition: "none", cardHover: "default", imageHover: "none", choreography: "", ...e.motion },
  sound: { enabled: true, track: e.sound.recommended[0], uploadUrl: "", uploadName: "", volume: 0.5, loop: true, fadeIn: 2.5, fadeOut: 1.5, sfx: false, ...e.sound },
  mood: e.mood, title: e.title, tagline: e.tagline, signature: e.signature || "",
  motifs: e.motifs,
});

export const MOOD_EXPERIENCES = {
  /* ---------- Reputation Rising ---------- */
  "era-reputation": exp({
    title: "Reputation Rising", tagline: "Rebirth in black and silver — dark, sharp and unapologetic.",
    mood: ["Dark", "Dramatic", "Powerful", "Mysterious", "Luxurious"], signature: "rep-serpent",
    motifs: [
      mi("rep-serpent", "snake", { placement: "hero", layer: "front", x: 84, y: 40, size: 520, rotation: -16, glow: 0.15, opacity: 0.92, color: "#c9ccd3", accent: "#3f4249", hover: "parallax", depth: 0.35, z: 3 }),
      mi("rep-serpent-2", "snake", { placement: "footer", x: 30, y: 82, size: 380, rotation: 172, opacity: 0.22, color: "#8e939b", accent: "#2a2c31", flip: true, mobile: false }),
      mi("rep-smoke", "smoke", { placement: "hero", opacity: 0.32, color: "#6b7280", accent: "#1f1f22", z: 1 }),
      mi("rep-headline", "newspaper", { placement: "hero", x: 16, y: 80, size: 300, rotation: -7, opacity: 0.14, z: 2, tablet: false, mobile: false }),
      mi("rep-roses-l", "rose", { placement: "between", x: 6, y: 50, size: 120, rotation: -20, opacity: 0.95, color: "#2a2a2f", accent: "#6b0f1f" }),
      mi("rep-roses-r", "rose", { placement: "between", x: 95, y: 46, size: 96, rotation: 16, opacity: 0.85, color: "#2a2a2f", accent: "#6b0f1f", delay: 0.4, mobile: false }),
      mi("rep-scales", "scales", { placement: "sections", opacity: 0.05, color: "#c9ccd3" }),
      mi("rep-chain", "chain", { placement: "footer", y: 0, size: 30, opacity: 0.55, color: "#a7abb3", accent: "#4b4f57" }),
      mi("rep-sheen", "sheen", { placement: "hero", layer: "front", opacity: 0.18, color: "#ffffff" }),
    ],
    materials: { card: "scales" },
    styles: { nav: "ink", headline: "newspaper", image: "mono", cta: "glow" },
    motion: { transition: "blur", cardHover: "sheen", imageHover: "color", choreography: "blur" },
    sound: { recommended: ["dark-noir", "cinematic-rise", "electronic-pulse"] },
  }),

  /* ---------- Red Memories ---------- */
  "era-red": exp({
    title: "Red Memories", tagline: "Autumn light, a red scarf in the wind and memories kept on film.",
    mood: ["Nostalgic", "Romantic", "Bittersweet", "Cinematic", "Warm"], signature: "red-scarf",
    motifs: [
      mi("red-scarf", "scarf", { placement: "hero", layer: "front", x: 88, y: 44, size: 500, rotation: -30, opacity: 0.95, color: "#a4161a", accent: "#6e0d12", hover: "parallax", depth: 0.3, z: 3 }),
      mi("red-car", "car", { placement: "hero", layer: "front", x: 15, y: 93, size: 300, opacity: 0.95, color: "#a4161a", accent: "#f1e3c8", hover: "parallax", depth: 0.12, delay: 0.5, z: 2, mobile: false }),
      mi("red-leaves", "leaves", { placement: "all", count: 9, opacity: 0.75, color: "#b5462a", accent: "#d98a3a", speed: 0.8 }),
      mi("red-polaroid", "polaroid", { placement: "between", x: 9, y: 50, size: 140, rotation: -9, text: "that autumn" }),
      mi("red-note", "note", { placement: "between", x: 91, y: 44, size: 180, rotation: 7, text: "remember this?", delay: 0.3, mobile: false }),
      mi("red-lips", "lipstick", { placement: "sections", x: 95, y: 9, size: 64, rotation: 12, opacity: 0.3 }),
      mi("red-film", "filmstrip", { placement: "footer", x: 82, y: 32, size: 300, rotation: -5, opacity: 0.3, mobile: false }),
      mi("red-postcard", "postcard", { placement: "footer", x: 12, y: 64, size: 170, rotation: 6, opacity: 0.22, text: "Greetings from somewhere", tablet: false, mobile: false }),
    ],
    materials: { card: "paper" },
    styles: { headline: "default", image: "vintage", cta: "stamp" },
    motion: { transition: "rise", cardHover: "tilt", imageHover: "zoom", choreography: "fade" },
    sound: { recommended: ["nostalgic-tape", "acoustic-pluck", "nature-rain"] },
  }),

  /* ---------- New York Dreams ---------- */
  "era-1989": exp({
    title: "New York Dreams", tagline: "Bright city mornings, seagulls over the skyline and instant photos.",
    mood: ["Bright", "Youthful", "Optimistic", "Urban", "Free"],
    motifs: [
      mi("ny-skyline", "skyline", { placement: "hero", y: 100, size: 190, opacity: 0.85, color: "#bcd8ef", accent: "#ffffff" }),
      mi("ny-clouds", "clouds", { placement: "hero", count: 5, opacity: 0.9, speed: 0.7, color: "#cfe6f8" }),
      mi("ny-hero-polaroid", "polaroid", { placement: "hero", layer: "front", x: 88, y: 30, size: 150, rotation: 9, text: "first day here", accent: "#4aa8e0", hover: "tilt", depth: 0.3, mobile: false }),
      mi("ny-gulls", "seagulls", { placement: "hero", count: 5, size: 34, opacity: 0.6, color: "#4aa8e0" }),
      mi("ny-polaroid", "polaroid", { placement: "between", x: 92, y: 50, size: 140, rotation: 8, text: "the city, at last", accent: "#4aa8e0" }),
      mi("ny-camera", "camera", { placement: "between", x: 7, y: 50, size: 110, rotation: -10, mobile: false }),
    ],
    materials: { card: "polaroid" },
    styles: { nav: "glass", image: "dreamy", cta: "pill" },
    motion: { transition: "rise", cardHover: "lift", imageHover: "zoom", choreography: "rise" },
    sound: { recommended: ["electronic-pulse", "dreamy-shimmer", "indie-strum"] },
  }),

  /* ---------- Woodland Reverie ---------- */
  "era-folklore": exp({
    title: "Woodland Reverie", tagline: "Misty forests, fireflies at dusk and stories written by hand.",
    mood: ["Quiet", "Organic", "Introspective", "Atmospheric", "Poetic"],
    motifs: [
      mi("wood-trees", "trees", { placement: "hero", y: 100, size: 240, opacity: 0.45, color: "#2f4a3a", accent: "#6e7b70" }),
      mi("wood-mist", "mist", { placement: "all", opacity: 0.5, color: "#d7ddd2" }),
      mi("wood-leaves", "leaves", { placement: "hero", count: 7, opacity: 0.7, color: "#6e7b56", accent: "#b59a6a", speed: 0.6 }),
      mi("wood-beams", "light-beams", { placement: "hero", opacity: 0.3, color: "#fff4d6", accent: "#e9dcbc" }),
      mi("wood-fireflies", "fireflies", { placement: "hero", count: 18, opacity: 0.9, color: "#d9b44a", accent: "#fff7d6" }),
      mi("wood-book", "book", { placement: "between", x: 90, y: 50, size: 150, rotation: 8, color: "#f5f0e6", accent: "#2f4a3a" }),
      mi("wood-flowers", "wildflowers", { placement: "footer", y: 0, size: 70, opacity: 0.5, color: "#cdbb9a", accent: "#f5f0e6" }),
    ],
    materials: { card: "paper" },
    styles: { nav: "ink", image: "vintage" },
    motion: { transition: "fade", cardHover: "lift", imageHover: "color", choreography: "fade", intensity: 0.8 },
    sound: { recommended: ["nature-forest", "acoustic-pluck", "ambient-drift"] },
  }),

  /* ---------- Daydream ---------- */
  "era-lover": exp({
    title: "Daydream", tagline: "Cotton-candy skies, butterflies and love letters.",
    mood: ["Dreamy", "Romantic", "Playful", "Sweet", "Hopeful"],
    motifs: [
      mi("day-clouds", "clouds", { placement: "hero", count: 5, opacity: 0.9, color: "#fbd3e6" }),
      mi("day-butterflies", "butterflies", { placement: "hero", count: 5, opacity: 0.9, hover: "parallax", depth: 0.25 }),
      mi("day-hearts", "hearts", { placement: "all", count: 7, opacity: 0.55, speed: 0.7 }),
      mi("day-bokeh", "bokeh", { placement: "sections", count: 7, opacity: 0.35, color: "#f9c5dd", accent: "#cbe2f7" }),
      mi("day-letters", "letters", { placement: "between", x: 8, y: 50, size: 120, rotation: -10, accent: "#f28dbb" }),
    ],
    materials: { card: "glass" },
    styles: { headline: "underline", image: "dreamy", cta: "pill", nav: "glass" },
    motion: { transition: "rise", cardHover: "glow", imageHover: "zoom", choreography: "zoom" },
    sound: { recommended: ["dreamy-shimmer", "romantic-strings", "indie-strum"] },
  }),

  /* ---------- Midnight Glow ---------- */
  "era-midnights": exp({
    title: "Midnight Glow", tagline: "3 a.m. thoughts under a lavender moon and slow-turning clock hands.",
    mood: ["Reflective", "Mysterious", "Sophisticated", "Dreamy", "Nocturnal"],
    motifs: [
      mi("mid-stars", "stars", { placement: "all", count: 34, opacity: 0.8 }),
      mi("mid-moon", "moon", { placement: "hero", x: 84, y: 24, size: 170, hover: "parallax", depth: 0.2 }),
      mi("mid-const", "constellation", { placement: "hero", x: 30, y: 18, size: 300, opacity: 0.6, mobile: false }),
      mi("mid-shoot", "shooting-star", { placement: "hero", count: 2, opacity: 0.8 }),
      mi("mid-clock", "clock", { placement: "between", x: 92, y: 50, size: 110, opacity: 0.9 }),
      mi("mid-dust", "particles", { placement: "sections", count: 22, opacity: 0.6 }),
    ],
    materials: { card: "glass" },
    styles: { nav: "glass", headline: "glow", image: "night", cta: "glow" },
    motion: { transition: "blur", cardHover: "glow", imageHover: "color", choreography: "blur" },
    sound: { recommended: ["ambient-drift", "electronic-pulse", "dreamy-shimmer"] },
  }),

  /* ---------- Dear Diary ---------- */
  "sour-inspired": exp({
    title: "Dear Diary", tagline: "Doodles in the margins, stickers and pages torn out of a diary.",
    mood: ["Youthful", "Honest", "Playful", "Bittersweet", "Nostalgic"],
    motifs: [
      mi("diary-doodles", "doodles", { placement: "hero", count: 6, size: 70, opacity: 0.8, color: "#7b5cd6" }),
      mi("diary-hero-note", "note", { placement: "hero", layer: "front", x: 88, y: 28, size: 170, rotation: 8, text: "dear diary,", accent: "#3d2b6b", hover: "tilt", depth: 0.3, mobile: false }),
      mi("diary-stickers", "stickers", { placement: "hero", count: 6, opacity: 0.95 }),
      mi("diary-note", "note", { placement: "between", x: 90, y: 46, size: 170, rotation: 6, text: "dear diary,", accent: "#3d2b6b" }),
      mi("diary-tape", "tape", { placement: "between", x: 10, y: 50, size: 140, rotation: -14, color: "#ffe066", accent: "#ffffff" }),
      mi("diary-torn", "torn-paper", { placement: "footer", y: 0, size: 40, color: "#f7f2ff", flip: true }),
    ],
    materials: { card: "paper" },
    styles: { headline: "handwritten", image: "vintage", cta: "stamp" },
    motion: { transition: "rise", cardHover: "tilt", imageHover: "zoom", choreography: "zoom" },
    sound: { recommended: ["indie-strum", "nostalgic-tape", "dreamy-shimmer"] },
  }),

  /* ---------- Teenage Chaos ---------- */
  "guts-inspired": exp({
    title: "Teenage Chaos", tagline: "Loud colour, sharp shapes and a little bit of mess — with no strobing.",
    mood: ["Bold", "Rebellious", "Energetic", "Edgy", "Raw"],
    motifs: [
      mi("chaos-shapes", "shapes", { placement: "hero", count: 9, opacity: 0.8, hover: "parallax", depth: 0.3 }),
      mi("chaos-bolts", "bolts", { placement: "hero", count: 4, opacity: 0.8 }),
      mi("chaos-cassette", "cassette", { placement: "between", x: 91, y: 50, size: 140, rotation: 12, color: "#2b0f45", accent: "#b4ff39" }),
      mi("chaos-torn", "torn-paper", { placement: "between", y: 50, size: 34, color: "#ff2e88", opacity: 0.9 }),
      mi("chaos-grain", "grain", { placement: "all", opacity: 0.1 }),
    ],
    materials: { card: "none" },
    styles: { image: "mono", cta: "stamp", headline: "default" },
    motion: { transition: "rise", cardHover: "tilt", imageHover: "color", choreography: "zoom" },
    sound: { recommended: ["electronic-pulse", "indie-strum", "dark-noir"] },
  }),

  /* ---------- Ishq ---------- */
  "romantic-soul": exp({
    title: "Ishq", tagline: "Candle-warm rooms, drifting rose petals and letters never sent.",
    mood: ["Romantic", "Soulful", "Intimate", "Elegant", "Tender"],
    motifs: [
      mi("ishq-curtains", "curtains", { placement: "hero", opacity: 0.45, color: "#7a1f3d", accent: "#4a1426", tablet: false, mobile: false }),
      mi("ishq-petals", "petals", { placement: "all", count: 12, opacity: 0.8, color: "#a3324f", accent: "#e3a9b4", speed: 0.7 }),
      mi("ishq-lamps", "lamps", { placement: "hero", count: 6, opacity: 0.75 }),
      mi("ishq-beams", "light-beams", { placement: "hero", opacity: 0.25, color: "#ffe2b8", accent: "#ffcf8a" }),
      mi("ishq-letters", "letters", { placement: "between", x: 92, y: 50, size: 120, rotation: 9, accent: "#7a1f3d" }),
      mi("ishq-rose", "rose", { placement: "footer", x: 90, y: 50, size: 110, rotation: 14, opacity: 0.6, color: "#7a1f3d", accent: "#d8a7a7" }),
    ],
    materials: { card: "paper" },
    styles: { image: "vintage", cta: "glow" },
    motion: { transition: "fade", cardHover: "glow", imageHover: "zoom", choreography: "fade", intensity: 0.85 },
    sound: { recommended: ["romantic-strings", "midnight-piano", "acoustic-pluck"] },
  }),

  /* ---------- Raat ---------- */
  "midnight-melodies": exp({
    title: "Raat", tagline: "Rain on the window, city lights in gold and a record turning slowly.",
    mood: ["Moody", "Cinematic", "Melancholic", "Warm", "Late-night"],
    motifs: [
      mi("raat-rain", "rain-window", { placement: "hero", opacity: 0.55, color: "#9fb2d8" }),
      mi("raat-moon", "moon", { placement: "hero", x: 86, y: 22, size: 150, color: "#f4e6c4", accent: "#d4a94f" }),
      mi("raat-bokeh", "bokeh", { placement: "sections", count: 8, opacity: 0.25, color: "#d4a94f", accent: "#6f86b8" }),
      mi("raat-vinyl", "vinyl", { placement: "between", x: 8, y: 50, size: 140, accent: "#d4a94f" }),
      mi("raat-notes", "notes", { placement: "footer", count: 6, opacity: 0.5, color: "#d4a94f", accent: "#6f86b8" }),
    ],
    materials: { card: "glass" },
    styles: { nav: "glass", headline: "glow", image: "night", cta: "glow" },
    motion: { transition: "blur", cardHover: "glow", imageHover: "color", choreography: "blur" },
    sound: { recommended: ["midnight-piano", "nature-rain", "cinematic-rise"] },
  }),
};
