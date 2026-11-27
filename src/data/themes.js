import { buildTheme } from "../utils/tokens.js";
import { MOOD_EXPERIENCES } from "./moods.js";

/*
 * Theme presets. Every preset is a complete design-token set (colors, typography, buttons, cards, forms,
 * navigation, sections, footer, effects) built from a compact spec — missing tokens are derived.
 * The music collection is an original visual-mood interpretation: no artwork, logos, photos or official branding.
 */
export const THEME_FILTERS = ["Minimal", "Luxury", "Modern", "Dark", "Light", "Playful", "Editorial", "Romantic", "Bold", "Creative", "Futuristic", "Music-inspired"];

const pro = (spec) => buildTheme({ collection: "Professional", ...spec });
// Music themes are complete mood packages: palette + typography + the experience layer (motifs, motion, sound).
const music = (artist, spec) => buildTheme({ collection: "Inspired by Music & Eras", artist, ...spec, tags: [...spec.tags, "Music-inspired"], experience: MOOD_EXPERIENCES[spec.id] });

export const THEME_PRESETS = [
  /* ---------- Professional ---------- */
  pro({
    id: "swiss-minimal", name: "Swiss Minimal", description: "Monochrome, a strict grid and precise sans-serif type with a single red accent.",
    tags: ["Minimal", "Light", "Modern"],
    colors: { primary: "#111111", secondary: "#111111", accent: "#e10600", background: "#ffffff", surface: "#f4f4f4", text: "#111111", muted: "#666666", border: "#e2e2e2" },
    typography: { heading: "Inter", body: "Inter", accent: "Inter", headingWeight: 700, headingTracking: -0.045, h1: 72, h2: 48 },
    buttons: { radius: 0, paddingX: 24 }, cards: { radius: 0, shadow: 0, borderWidth: 1 }, forms: { radius: 0 },
    nav: { active: "#e10600", hover: "#e10600" }, sections: { dividers: true },
  }),
  pro({
    id: "modern-saas", name: "Modern SaaS", description: "Confident blue on white, crisp cards and friendly professional typography.",
    tags: ["Modern", "Light", "Minimal"],
    colors: { primary: "#2563eb", secondary: "#0f172a", accent: "#06b6d4", background: "#ffffff", backgroundAlt: "#f5f8ff", surface: "#f5f8ff", text: "#0f172a", muted: "#55607a", border: "#e3e8f4" },
    typography: { heading: "Manrope", body: "Inter", accent: "Manrope", headingWeight: 750 },
    buttons: { radius: 10 }, cards: { radius: 18, shadow: 0.14, borderWidth: 1 }, sections: { alternate: true },
  }),
  pro({
    id: "luxury-gold", name: "Luxury Gold", description: "Black, warm gold and cream with an elegant high-contrast serif.",
    tags: ["Luxury", "Dark", "Editorial"],
    colors: { primary: "#c9a45c", secondary: "#151311", accent: "#e8d8b0", background: "#0d0c0b", surface: "#171513", text: "#f3ede1", muted: "#a89f8f", border: "#2c2823" },
    typography: { heading: "Cormorant Garamond", body: "Manrope", accent: "Cormorant Garamond", headingWeight: 500, headingTracking: -0.01, h1: 76, h2: 52 },
    buttons: { radius: 0, uppercase: true, fontSize: 13, paddingX: 28 }, cards: { radius: 4, borderWidth: 1 }, forms: { radius: 0 }, effects: { grain: 0.05, glow: 0.3 },
  }),
  pro({
    id: "neo-brutalist", name: "Neo Brutalist", description: "Loud colour, chunky type and hard black borders. Unapologetic.",
    tags: ["Bold", "Creative", "Playful", "Light"],
    colors: { primary: "#ff4d2e", secondary: "#111111", accent: "#ffd23f", background: "#fffdf2", backgroundAlt: "#fff3c4", surface: "#ffffff", text: "#111111", muted: "#3c3c3c", border: "#111111" },
    typography: { heading: "Archivo Black", body: "Space Grotesk", accent: "Archivo Black", headingWeight: 400, headingTracking: -0.02, headingCase: "uppercase" },
    buttons: { radius: 0, fontWeight: 700 }, cards: { radius: 0, shadow: 0, borderWidth: 2 }, forms: { radius: 0, inputBorder: "#111111" }, sections: { alternate: true },
  }),
  pro({
    id: "soft-pastel", name: "Soft Pastel", description: "Muted pastels, rounded surfaces and gentle, friendly type.",
    tags: ["Playful", "Light", "Romantic"],
    colors: { primary: "#8b7cf6", secondary: "#2e2a47", accent: "#f9a8d4", background: "#fdfbff", backgroundAlt: "#f6f1ff", surface: "#f5f0ff", text: "#2e2a47", muted: "#6f6a8a", border: "#ebe4fb" },
    typography: { heading: "Nunito", body: "Nunito", accent: "Quicksand", headingWeight: 800 },
    buttons: { radius: 999 }, cards: { radius: 28, shadow: 0.08, borderWidth: 0 }, forms: { radius: 16 }, sections: { alternate: true },
  }),
  pro({
    id: "cyberpunk", name: "Cyberpunk", description: "Near-black, neon cyan and magenta, glowing futuristic type.",
    tags: ["Futuristic", "Dark", "Bold"],
    colors: { primary: "#00f0ff", secondary: "#120029", accent: "#ff2bd6", background: "#07020f", surface: "#110826", text: "#e9f9ff", muted: "#8aa0c2", border: "#2a1650" },
    typography: { heading: "Orbitron", body: "Space Grotesk", accent: "Orbitron", headingWeight: 700, headingTracking: 0.01, headingCase: "uppercase", h1: 58, h2: 40 },
    buttons: { radius: 4, uppercase: true }, cards: { radius: 6, borderWidth: 1 }, effects: { sectionGradient: true, glow: 0.9, gradientFrom: "#00f0ff", gradientTo: "#ff2bd6" },
  }),
  pro({
    id: "organic-earth", name: "Organic Earth", description: "Forest green, beige and terracotta with a warm, natural serif.",
    tags: ["Minimal", "Light", "Editorial"],
    colors: { primary: "#2f5d46", secondary: "#1f2a22", accent: "#c8693c", background: "#f7f2e9", backgroundAlt: "#efe7d8", surface: "#efe7d8", text: "#22281f", muted: "#6d6a5c", border: "#e0d6c3" },
    typography: { heading: "Fraunces", body: "DM Sans", accent: "Fraunces", headingWeight: 600 },
    buttons: { radius: 999 }, cards: { radius: 18, shadow: 0, borderWidth: 1 }, sections: { alternate: true },
  }),
  pro({
    id: "editorial-mono", name: "Editorial Monochrome", description: "Black, white and grey with magazine-style serif headlines.",
    tags: ["Editorial", "Minimal", "Light"],
    colors: { primary: "#111111", secondary: "#111111", accent: "#7a7a7a", background: "#fafafa", surface: "#f0f0f0", text: "#0e0e0e", muted: "#666666", border: "#dddddd" },
    typography: { heading: "Playfair Display", body: "Inter", accent: "Instrument Serif", headingWeight: 500, headingTracking: -0.02, h1: 78 },
    buttons: { radius: 0 }, cards: { radius: 0, shadow: 0, borderWidth: 1 }, forms: { radius: 0 }, sections: { dividers: true },
  }),
  pro({
    id: "glassmorphism", name: "Glassmorphism", description: "Frosted translucent cards floating on soft colour gradients.",
    tags: ["Modern", "Futuristic", "Dark"],
    colors: { primary: "#8fa8ff", secondary: "#141a3d", accent: "#ff8fd8", background: "#0f1530", surface: "rgba(255,255,255,0.07)", surfaceElevated: "rgba(20,26,61,0.85)", text: "#eef1ff", muted: "#a6b0d8", border: "rgba(255,255,255,0.14)" },
    typography: { heading: "Outfit", body: "Outfit", accent: "Outfit", headingWeight: 600 },
    buttons: { radius: 14 }, cards: { radius: 24, shadow: 0.25, borderWidth: 1, blur: 18 },
    effects: { sectionGradient: true, glow: 0.7, gradientFrom: "#8fa8ff", gradientTo: "#ff8fd8" },
  }),
  pro({
    id: "vibrant-creative", name: "Vibrant Creative", description: "Expressive pink, sunny yellow and deep indigo with bold display type.",
    tags: ["Creative", "Playful", "Bold", "Light"],
    colors: { primary: "#ff3d68", secondary: "#1b1446", accent: "#ffc93c", background: "#fff8f1", backgroundAlt: "#ffeede", surface: "#ffeede", text: "#1b1446", muted: "#5c5378", border: "#f3dccb" },
    typography: { heading: "Syne", body: "DM Sans", accent: "Syne", headingWeight: 800, headingTracking: -0.035 },
    buttons: { radius: 999, fontWeight: 700 }, cards: { radius: 24, shadow: 0.12, borderWidth: 0 }, sections: { alternate: true },
  }),

  /* ---------- Inspired by Music & Eras ---------- */
  music("Taylor Swift–inspired", {
    id: "era-red", name: "Red Era", description: "Deep red, burgundy and warm cream — editorial, bold and nostalgic.",
    tags: ["Romantic", "Editorial", "Bold", "Light"],
    colors: { primary: "#a4161a", secondary: "#5c0f1b", accent: "#e9d8b9", background: "#fbf7f0", backgroundAlt: "#f4ead9", surface: "#f4ead9", text: "#2a2425", muted: "#6e5f5c", border: "#e6d8c2" },
    typography: { heading: "Playfair Display", body: "DM Sans", accent: "Caveat", headingWeight: 600, headingTracking: -0.02 },
    buttons: { radius: 2, uppercase: true, fontSize: 13 }, cards: { radius: 6, shadow: 0.06 }, footer: { background: "#5c0f1b" }, effects: { grain: 0.06 },
  }),
  music("Taylor Swift–inspired", {
    id: "era-reputation", name: "Reputation Era", description: "Black, charcoal and metallic silver — dark, dramatic and luxurious.",
    tags: ["Dark", "Luxury", "Bold"],
    colors: { primary: "#c9ccd3", secondary: "#1c1c1e", accent: "#8e939b", background: "#0a0a0a", surface: "#161616", text: "#f5f5f5", muted: "#a3a3a3", border: "#2a2a2a", buttonText: "#0a0a0a" },
    typography: { heading: "Oswald", body: "Inter", accent: "Special Elite", headingWeight: 700, headingTracking: 0.01, headingCase: "uppercase", headingLineHeight: 1 },
    buttons: { radius: 0, uppercase: true }, cards: { radius: 2, borderWidth: 1 }, forms: { radius: 0 }, effects: { grain: 0.09, glow: 0.2 },
  }),
  music("Taylor Swift–inspired", {
    id: "era-1989", name: "1989 Era", description: "Sky blue, soft white and pastel accents — bright, clean and youthful.",
    tags: ["Light", "Modern", "Playful"],
    colors: { primary: "#4aa8e0", secondary: "#13294b", accent: "#a8dadc", background: "#f7fbff", backgroundAlt: "#eaf4fc", surface: "#eaf4fc", text: "#13294b", muted: "#56708f", border: "#d6e6f5", buttonText: "#ffffff" },
    typography: { heading: "Outfit", body: "Manrope", accent: "Outfit", headingWeight: 600 },
    buttons: { radius: 999 }, cards: { radius: 22, shadow: 0.08, borderWidth: 0 }, sections: { alternate: true },
  }),
  music("Taylor Swift–inspired", {
    id: "era-folklore", name: "Folklore Era", description: "Muted greys, forest green and beige with quiet serif type — organic and atmospheric.",
    tags: ["Minimal", "Editorial", "Light"],
    colors: { primary: "#2f4a3a", secondary: "#4d524f", accent: "#cdbb9a", background: "#f5f0e6", backgroundAlt: "#ebe4d6", surface: "#ebe4d6", text: "#2b2b29", muted: "#6e6b64", border: "#ddd4c3" },
    typography: { heading: "Cormorant Garamond", body: "Lora", accent: "Cormorant Garamond", headingWeight: 500, headingTracking: -0.01, bodySize: 17, bodyLineHeight: 1.75 },
    buttons: { radius: 2 }, cards: { radius: 6, shadow: 0, borderWidth: 1 }, effects: { grain: 0.07 }, sections: { dividers: true },
  }),
  music("Taylor Swift–inspired", {
    id: "era-lover", name: "Lover Era", description: "Pastel pink, lavender and soft blue with rounded type — dreamy and romantic.",
    tags: ["Romantic", "Playful", "Light"],
    colors: { primary: "#f28dbb", secondary: "#4a1f42", accent: "#9ccaf2", background: "#fffaf6", backgroundAlt: "#fdeef5", surface: "#fdeef5", text: "#4a1f42", muted: "#80607a", border: "#f5dce8", buttonText: "#3a1634" },
    typography: { heading: "Fredoka", body: "Nunito", accent: "Fredoka", headingWeight: 600 },
    buttons: { radius: 999 }, cards: { radius: 28, shadow: 0.06, borderWidth: 0 }, nav: { active: "#b65a90", hover: "#b65a90" },
    sections: { alternate: true }, effects: { sectionGradient: true, gradientFrom: "#f28dbb", gradientTo: "#b9a3e3" }, footer: { background: "#b9a3e3" },
  }),
  music("Taylor Swift–inspired", {
    id: "era-midnights", name: "Midnights Era", description: "Midnight blue, deep purple and muted lavender — sophisticated after-dark glow.",
    tags: ["Dark", "Futuristic", "Luxury"],
    colors: { primary: "#b6a7e8", secondary: "#2a1f54", accent: "#c7c9d9", background: "#0b1026", surface: "#141a38", text: "#f1f0fa", muted: "#9fa3c4", border: "#262c52" },
    typography: { heading: "Space Grotesk", body: "Inter", accent: "Cormorant Garamond", headingWeight: 500 },
    buttons: { radius: 999 }, cards: { radius: 20, borderWidth: 1 }, effects: { sectionGradient: true, glow: 0.6, gradientFrom: "#2a1f54", gradientTo: "#b6a7e8" },
  }),
  music("Olivia Rodrigo–inspired", {
    id: "sour-inspired", name: "SOUR-inspired", description: "Lavender, muted purple, soft yellow and pastel pink — youthful and a little nostalgic.",
    tags: ["Playful", "Light", "Creative"],
    colors: { primary: "#7b5cd6", secondary: "#3d2b6b", accent: "#ffe066", background: "#f7f2ff", backgroundAlt: "#ffe6f0", surface: "#efe6ff", text: "#2b2140", muted: "#6d6188", border: "#e3d6fb" },
    typography: { heading: "Bricolage Grotesque", body: "DM Sans", accent: "Permanent Marker", headingWeight: 750, headingTracking: -0.035 },
    buttons: { radius: 14, fontWeight: 700 }, cards: { radius: 20, shadow: 0.06, borderWidth: 0 }, sections: { alternate: true },
  }),
  music("Olivia Rodrigo–inspired", {
    id: "guts-inspired", name: "GUTS-inspired", description: "Deep purple, bold pink and an electric lime accent — edgy and loud.",
    tags: ["Bold", "Dark", "Creative"],
    colors: { primary: "#ff2e88", secondary: "#3a0f5c", accent: "#b4ff39", background: "#120a1f", surface: "#1d1030", text: "#fbeaff", muted: "#b49cc8", border: "#3a2152", buttonText: "#120a1f" },
    typography: { heading: "Syne", body: "Space Grotesk", accent: "Syne", headingWeight: 800, headingCase: "uppercase", headingTracking: -0.02 },
    buttons: { radius: 6, uppercase: true, fontWeight: 700 }, cards: { radius: 10, borderWidth: 1 }, effects: { grain: 0.1, glow: 0.8, sectionGradient: true, gradientFrom: "#3a0f5c", gradientTo: "#ff2e88" },
  }),
  music("Arijit Singh–inspired", {
    id: "romantic-soul", name: "Romantic Soul", description: "Deep wine, dusty rose, warm beige and cream with elegant serif type — intimate.",
    tags: ["Romantic", "Editorial", "Light"],
    colors: { primary: "#7a1f3d", secondary: "#4a1426", accent: "#d8a7a7", background: "#fbf5ef", backgroundAlt: "#f1e4d6", surface: "#f1e4d6", text: "#2e1a20", muted: "#7a6266", border: "#e6d3c6" },
    typography: { heading: "Playfair Display", body: "Lora", accent: "Cormorant Garamond", headingWeight: 500, bodyLineHeight: 1.75 },
    buttons: { radius: 999 }, cards: { radius: 16, shadow: 0.06 }, footer: { background: "#4a1426" },
    effects: { sectionGradient: true, gradientFrom: "#d8a7a7", gradientTo: "#f1e4d6" },
  }),
  music("Arijit Singh–inspired", {
    id: "midnight-melodies", name: "Midnight Melodies", description: "Deep navy, muted blue and warm gold — moody and cinematic.",
    tags: ["Dark", "Luxury", "Editorial"],
    colors: { primary: "#d4a94f", secondary: "#1a2238", accent: "#6f86b8", background: "#0c1324", surface: "#152039", text: "#eef1f7", muted: "#9aa6bf", border: "#243150", buttonText: "#0c1324" },
    typography: { heading: "Cormorant Garamond", body: "Inter", accent: "Cormorant Garamond", headingWeight: 600, h1: 74, h2: 50 },
    buttons: { radius: 999 }, cards: { radius: 18, borderWidth: 1 }, effects: { sectionGradient: true, glow: 0.5, gradientFrom: "#1a2238", gradientTo: "#d4a94f" },
  }),
];
