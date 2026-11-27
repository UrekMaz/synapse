import { applyChoreographyData } from "../../../utils/choreography.js";
import { floatFields, hideField, buttonFields, textFields } from "../../../registry/fieldGroups.js";
import { el, heading, subtitle, eyebrow, button, BUTTON_TEMPLATE, sectionColorFields, sectionLayoutFields } from "../shared/defaults.js";

const ARRIVAL = {
  background: [{ preset: "fade-in", duration: 1.4, delay: 0 }],
  chrome: [{ preset: "orbit-in", rotation: -70, scale: 0.35, duration: 1.9, delay: 0.2, easing: "expo-out" }],
  lighting: [{ preset: "light-reveal", blur: 50, scale: 0.55, duration: 2.2, delay: 0.7, easing: "expo-out" }],
  meta: [{ preset: "fade-in", duration: 0.9, delay: 1.1 }, { delay: 2.1 }],
  heading: [{ preset: "slide-up", distance: 80, duration: 1.3, delay: 1.2, easing: "expo-out" }],
  text: [{ preset: "fade-in", duration: 1, delay: 1.6 }],
  button: [{ preset: "zoom-in", scale: 0.85, duration: 0.7, delay: 1.85, easing: "back-out" }, { delay: 1.95 }],
};
const choreographies = {
  "liquid-arrival": { label: "Liquid Arrival", description: "The sculpture spins into view, light blooms around it, then the type rises.", byType: ARRIVAL },
  "molten-bloom": {
    label: "Molten Bloom", description: "Everything condenses out of a bright haze.",
    byType: { ...ARRIVAL, chrome: [{ preset: "light-reveal", blur: 40, scale: 0.7, duration: 2, delay: 0.1 }], heading: [{ preset: "blur-reveal", blur: 22, duration: 1.3, delay: 1 }] },
  },
  "mirror-drop": {
    label: "Mirror Drop", description: "The object drops in, letters rise one by one.",
    byType: { ...ARRIVAL, chrome: [{ preset: "slide-down", distance: 160, duration: 1.4, delay: 0.2, easing: "back-out" }], heading: [{ preset: "char-reveal", split: "chars", stagger: 0.025, duration: 0.9, delay: 0.9, easing: "expo-out" }] },
  },
};

const defaults = {
  props: {
    backgroundColor: "#050507", gradientFrom: "#140b26", gradientTo: "#050507", gradientAngle: 170, animatedGradient: true,
    headingColor: "#f5f5fa", accentColor: "#b49cff", textColor: "#9d9cb3",
    layout: "bottom", minHeight: 880, paddingX: 56, paddingY: 52,
  },
  responsive: {
    desktop: {},
    tablet: { minHeight: 820, paddingX: 36 },
    mobile: { minHeight: 760, paddingX: 20, paddingY: 36, layout: "center" },
  },
  elements: [
    el({ id: "background", type: "background", label: "Background", props: { imageUrl: "", imageOpacity: 0.25, blur: 0, particles: true, particleCount: 70, beams: true } }),
    el({ id: "lighting", type: "lighting", label: "Lighting & glow",
      props: { ambient: 0.5, lightColor: "#8b5cf6", highlight: 0.85, reflectionColor: "#7dd3fc", glow: 0.75, illumination: 0.55, lightMotion: true, hidden: false } }),
    el({ id: "chrome", type: "chrome", label: "Chrome object",
      props: {
        kind: "blob", imageUrl: "", palette: "tinted", size: 520, scale: 1, x: 62, y: 44, rotation: -12, perspective: 1100,
        metallic: 0.92, reflectivity: 0.85, roughness: 0.08, shadow: 0.7, glow: 0.6, opacity: 1,
        spin: true, spinSpeed: 26, morph: true, mouseResponse: 16, floatDir: "vertical", floatAmp: 14, floatSpeed: 10, floatDelay: 0, hidden: false,
      },
      responsive: { tablet: { size: 420, x: 60, y: 40 }, mobile: { size: 290, x: 50, y: 33, mouseResponse: 0 } } }),
    eyebrow({ text: "Experimental studio — Est. 2026", align: "left", colorRole: "text", letterSpacing: 0.22 }),
    heading({ text: "Design beyond dimensions.", fontSize: 118, lineHeight: 0.92, letterSpacing: -0.055, align: "left", maxWidth: 760 },
      { tablet: { fontSize: 84, maxWidth: 600 }, mobile: { fontSize: 50, maxWidth: 340 } }),
    subtitle({ text: "A new perspective on digital experiences.", fontSize: 18, align: "left", maxWidth: 300 }, { mobile: { fontSize: 16 } }),
    button("cta", "Call to action", { text: "Explore the experience", variant: "glass", colorRole: "heading", radius: 999, hover: "glow", arrow: true, paddingX: 24, paddingY: 14, glowColor: "#b49cff" }),
    { ...eyebrow({ text: "Scroll ↓", align: "right", colorRole: "text", letterSpacing: 0.2 }), id: "scroll", label: "Scroll hint", responsive: { tablet: {}, mobile: { hidden: true } } },
  ],
  animationSettings: { respectReducedMotion: true, choreography: "liquid-arrival" },
};
applyChoreographyData(defaults, choreographies["liquid-arrival"]);

const variations = {
  silver: {
    label: "Silver Chrome", swatch: ["#060608", "#d4d4dc", "#94a3b8", "#ffffff"],
    props: { backgroundColor: "#060608", gradientFrom: "#16161d", gradientTo: "#060608", headingColor: "#f8f8fb", accentColor: "#e2e8f0", textColor: "#a1a1b0" },
    byType: { lighting: { lightColor: "#94a3b8", reflectionColor: "#e0e7ff", glow: 0.45, illumination: 0.45 }, chrome: { palette: "silver", metallic: 0.95 }, background: { particles: true }, button: { glowColor: "#e2e8f0" } },
  },
  purple: {
    label: "Liquid Purple", swatch: ["#07040f", "#1a0b2e", "#8b5cf6", "#c084fc"],
    props: { backgroundColor: "#07040f", gradientFrom: "#1d0b36", gradientTo: "#07040f", headingColor: "#f6f2ff", accentColor: "#c4b5fd", textColor: "#a59bc4" },
    byType: { lighting: { lightColor: "#8b5cf6", reflectionColor: "#e879f9", glow: 0.8, illumination: 0.6 }, chrome: { palette: "tinted", metallic: 0.9 }, background: { particles: true }, button: { glowColor: "#a78bfa" } },
  },
  iridescent: {
    label: "Iridescent Metal", swatch: ["#05060a", "#22d3ee", "#f0abfc", "#fde68a"],
    props: { backgroundColor: "#05060a", gradientFrom: "#0b1626", gradientTo: "#05060a", headingColor: "#f5fbff", accentColor: "#f0abfc", textColor: "#9fb0c3" },
    byType: { lighting: { lightColor: "#22d3ee", reflectionColor: "#f0abfc", glow: 0.7, illumination: 0.5 }, chrome: { palette: "iridescent", metallic: 0.85 }, background: { particles: true }, button: { glowColor: "#f0abfc" } },
  },
  monochrome: {
    label: "Dark Monochrome", swatch: ["#000000", "#0a0a0a", "#737373", "#fafafa"],
    props: { backgroundColor: "#000000", gradientFrom: "#0d0d0d", gradientTo: "#000000", headingColor: "#fafafa", accentColor: "#d4d4d4", textColor: "#8a8a8a" },
    byType: { lighting: { lightColor: "#a3a3a3", reflectionColor: "#e5e5e5", glow: 0.25, illumination: 0.3 }, chrome: { palette: "silver", metallic: 1 }, background: { particles: false }, button: { glowColor: "#ffffff" } },
  },
  neon: {
    label: "Neon Reflection", swatch: ["#030014", "#ff2bd6", "#00f0ff", "#ffffff"],
    props: { backgroundColor: "#030014", gradientFrom: "#14002e", gradientTo: "#030014", headingColor: "#ffffff", accentColor: "#00f0ff", textColor: "#9aa6d6" },
    byType: { lighting: { lightColor: "#ff2bd6", reflectionColor: "#00f0ff", glow: 1, illumination: 0.7 }, chrome: { palette: "tinted", metallic: 0.88 }, background: { particles: true }, button: { glowColor: "#00f0ff" } },
  },
};

const KINDS = [{ value: "blob", label: "Liquid blob" }, { value: "torus", label: "Torus" }, { value: "sphere", label: "Sphere" }, { value: "capsule", label: "Capsule" }, { value: "image", label: "Custom image / asset" }];
const PALETTES = [{ value: "silver", label: "Pure silver" }, { value: "tinted", label: "Tinted by lighting" }, { value: "iridescent", label: "Iridescent" }];

export default {
  id: "liquid-chrome",
  name: "Liquid Chrome",
  category: "Premium",
  categories: ["Premium", "Experimental", "Interactive"],
  description: "A morphing liquid-metal sculpture whose reflections and orientation follow the cursor.",
  tags: ["chrome", "metal", "3d", "futuristic", "minimal", "dark"],
  thumbnail: "live",
  defaults,
  choreographies,
  variations,
  supportedAnimations: ["entrance", "emphasis", "exit", "hover", "scroll"],
  responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },

  elementTemplates: { button: BUTTON_TEMPLATE },

  editableProperties: [
    ...sectionColorFields(),
    { key: "gradientFrom", label: "Gradient color 1", type: "color", group: "Background" },
    { key: "gradientTo", label: "Gradient color 2", type: "color", group: "Background" },
    { key: "gradientAngle", label: "Gradient direction", type: "range", min: 0, max: 360, step: 1, unit: "°", group: "Background" },
    { key: "animatedGradient", label: "Animated gradient", type: "toggle", group: "Background" },
    { key: "layout", label: "Text layout", type: "segmented", options: [{ value: "bottom", label: "Editorial" }, { value: "center", label: "Centered" }, { value: "split", label: "Split" }], responsive: true, group: "Layout" },
    ...sectionLayoutFields(),
  ],

  elementSchemas: {
    background: [
      { key: "backgroundColor", scope: "section", label: "Base color", type: "color", group: "Fill" },
      { key: "gradientFrom", scope: "section", label: "Gradient color 1", type: "color", group: "Fill" },
      { key: "gradientTo", scope: "section", label: "Gradient color 2", type: "color", group: "Fill" },
      { key: "gradientAngle", scope: "section", label: "Gradient direction", type: "range", min: 0, max: 360, step: 1, unit: "°", group: "Fill" },
      { key: "animatedGradient", scope: "section", label: "Animated gradient", type: "toggle", group: "Fill" },
      { key: "particles", label: "Particles", type: "toggle", group: "Effects" },
      { key: "particleCount", label: "Particle count", type: "range", min: 0, max: 200, step: 5, responsive: true, group: "Effects", showIf: (p) => p.particles },
      { key: "beams", label: "Decorative light beams", type: "toggle", group: "Effects" },
      { key: "imageUrl", label: "Background image", type: "image", group: "Image" },
      { key: "imageOpacity", label: "Image opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Image" },
      { key: "blur", label: "Image blur", type: "range", min: 0, max: 60, step: 1, unit: "px", group: "Image" },
    ],
    lighting: [
      { key: "ambient", label: "Ambient light", type: "range", min: 0, max: 1, step: 0.05, group: "Lighting" },
      { key: "lightColor", label: "Light color", type: "color", group: "Lighting" },
      { key: "highlight", label: "Highlight intensity", type: "range", min: 0, max: 1, step: 0.05, group: "Lighting" },
      { key: "reflectionColor", label: "Reflection color", type: "color", group: "Lighting" },
      { key: "glow", label: "Glow intensity", type: "range", min: 0, max: 1, step: 0.05, group: "Lighting" },
      { key: "illumination", label: "Background illumination", type: "range", min: 0, max: 1, step: 0.05, group: "Lighting" },
      { key: "lightMotion", label: "Moving reflections", type: "toggle", group: "Lighting" },
      hideField(),
    ],
    chrome: [
      { key: "kind", label: "Object", type: "select", options: KINDS, group: "Object" },
      { key: "imageUrl", label: "Object image (PNG with transparency works best)", type: "image", group: "Object", showIf: (p) => p.kind === "image" },
      { key: "palette", label: "Reflections", type: "select", options: PALETTES, group: "Object", showIf: (p) => p.kind !== "image" },
      { key: "size", label: "Base size", type: "range", min: 120, max: 1000, step: 2, unit: "px", responsive: true, group: "Transform" },
      { key: "scale", label: "Scale", type: "range", min: 0.2, max: 2.5, step: 0.01, responsive: true, group: "Transform" },
      { key: "x", label: "X position", type: "range", min: 0, max: 100, step: 0.5, unit: "%", responsive: true, group: "Transform" },
      { key: "y", label: "Y position", type: "range", min: 0, max: 100, step: 0.5, unit: "%", responsive: true, group: "Transform" },
      { key: "rotation", label: "Rotation", type: "range", min: -180, max: 180, step: 1, unit: "°", group: "Transform" },
      { key: "perspective", label: "Perspective", type: "range", min: 300, max: 3000, step: 50, unit: "px", group: "Transform" },
      { key: "metallic", label: "Metallic intensity", type: "range", min: 0, max: 1, step: 0.01, group: "Material" },
      { key: "reflectivity", label: "Reflectivity", type: "range", min: 0, max: 1, step: 0.01, group: "Material" },
      { key: "roughness", label: "Roughness", type: "range", min: 0, max: 1, step: 0.01, group: "Material" },
      { key: "shadow", label: "Shadow", type: "range", min: 0, max: 1, step: 0.05, group: "Material" },
      { key: "glow", label: "Glow", type: "range", min: 0, max: 1, step: 0.05, group: "Material" },
      { key: "opacity", label: "Opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Material" },
      { key: "spin", label: "Slow rotation", type: "toggle", group: "Motion" },
      { key: "spinSpeed", label: "Rotation cycle", type: "range", min: 4, max: 120, step: 1, unit: "s", group: "Motion", showIf: (p) => p.spin },
      { key: "morph", label: "Liquid morphing", type: "toggle", group: "Motion", showIf: (p) => p.kind === "blob" },
      { key: "mouseResponse", label: "Cursor response", type: "range", min: 0, max: 45, step: 1, unit: "°", responsive: true, group: "Motion" },
      ...floatFields(),
      hideField(),
    ],
    meta: [...textFields({ max: 28, multiline: false })],
    heading: [...textFields({ max: 220, glow: true })],
    text: [...textFields({ max: 40 })],
    button: buttonFields(),
  },
};
