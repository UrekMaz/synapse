import { applyChoreographyData } from "../../../utils/choreography.js";
import { floatFields, hideField, buttonFields, textFields } from "../../../registry/fieldGroups.js";
import { el, heading, subtitle, eyebrow, button, BUTTON_TEMPLATE, sectionColorFields, sectionLayoutFields } from "../shared/defaults.js";

const OBJ = {
  kind: "sphere", imageUrl: "", color1: "#c4b5fd", color2: "#5b21b6", width: 160, height: 160, radius: 24,
  x: 50, y: 50, rotation: 0, depth: 0.5, opacity: 1, glow: 0.3, glowColor: "#8b5cf6", shadow: true,
  floatDir: "vertical", floatAmp: 14, floatSpeed: 8, floatDelay: 0, spin: false, spinSpeed: 20, hidden: false,
};
const obj = (id, label, props, responsive = {}) => el({ id, type: "object", label, props: { ...OBJ, ...props }, responsive: { tablet: {}, mobile: {}, ...responsive } });

/* Choreographies: { elementType: [1st, 2nd, …] }, later entries inherit earlier ones. */
const ORBITAL = {
  background: [{ preset: "fade-in", duration: 1.4, delay: 0 }],
  object: [
    { preset: "orbit-in", rotation: -110, scale: 0.25, duration: 1.7, delay: 0.25, easing: "expo-out" },
    { preset: "zoom-in", scale: 0.3, duration: 1.1, delay: 0.75, easing: "back-out" },
    { delay: 0.9 }, { delay: 1.05 }, { delay: 1.2 }, { delay: 1.35 }, { delay: 1.5 },
  ],
  meta: [{ preset: "fade-in", duration: 0.9, delay: 0.95 }],
  heading: [{ preset: "slide-up", distance: 70, duration: 1.2, delay: 1.05, easing: "expo-out" }],
  text: [{ preset: "fade-in", duration: 1, delay: 1.45 }],
  button: [{ preset: "zoom-in", scale: 0.8, duration: 0.8, delay: 1.75, easing: "back-out" }, { delay: 1.9 }],
};
const choreographies = {
  "orbital-dream": { label: "Orbital Dream", description: "Main object orbits in, satellites follow, type rises.", byType: ORBITAL },
  "cosmic-drift": {
    label: "Cosmic Drift", description: "Objects emerge from soft light, words drift in.",
    byType: {
      ...ORBITAL,
      object: [{ preset: "light-reveal", blur: 30, scale: 0.8, duration: 1.8, delay: 0.2 }, { delay: 0.45 }, { delay: 0.6 }, { delay: 0.75 }, { delay: 0.9 }, { delay: 1.05 }, { delay: 1.2 }],
      heading: [{ preset: "word-stagger", split: "words", stagger: 0.09, duration: 1, delay: 0.9, easing: "expo-out" }],
    },
  },
  "big-bang": {
    label: "Big Bang", description: "Everything bursts outward from the centre.",
    byType: {
      ...ORBITAL,
      object: [{ preset: "zoom-in", scale: 0.05, duration: 1.3, delay: 0.15, easing: "expo-out" }, { delay: 0.22 }, { delay: 0.29 }, { delay: 0.36 }, { delay: 0.43 }, { delay: 0.5 }, { delay: 0.57 }],
      heading: [{ preset: "blur-reveal", blur: 24, duration: 1.2, delay: 0.7 }],
      text: [{ preset: "fade-in", duration: 0.9, delay: 1.1 }],
      button: [{ preset: "zoom-in", scale: 0.8, duration: 0.7, delay: 1.35, easing: "back-out" }, { delay: 1.45 }],
    },
  },
};

const defaults = {
  props: {
    backgroundColor: "#05040f", gradientType: "radial", gradientAngle: 160, gradientFrom: "#2a1b5e", gradientTo: "#0a0820",
    headingColor: "#f5f3ff", accentColor: "#a78bfa", textColor: "#c4c0dd",
    minHeight: 840, paddingX: 56, paddingY: 72, contentAlign: "center", contentY: 50,
    lighting: 0.75, parallax: true, sensitivity: 42, floatIntensity: 1, rotationSpeed: 1, continuous: true, depthBlur: true,
  },
  responsive: {
    desktop: {},
    tablet: { minHeight: 760, paddingX: 36 },
    mobile: { minHeight: 720, paddingX: 22, paddingY: 56, sensitivity: 0 },
  },
  elements: [
    el({ id: "background", type: "background", label: "Background", props: { effect: "stars-nebula", starDensity: 140, imageUrl: "", imageOpacity: 0.35, vignette: 0.6 } }),
    obj("object-main", "Main object", { kind: "sphere", x: 77, y: 31, width: 300, height: 300, color1: "#ddd6fe", color2: "#6d28d9", depth: 0.75, glow: 0.55, floatAmp: 18, floatSpeed: 9 },
      { tablet: { width: 220, height: 220, x: 80, y: 22 }, mobile: { width: 150, height: 150, x: 78, y: 13 } }),
    obj("object-ring", "Ring", { kind: "ring", x: 17, y: 30, width: 250, height: 250, color1: "#f5d0fe", color2: "#7c3aed", rotation: -18, depth: 0.45, glow: 0.35, glowColor: "#d946ef", floatDir: "diagonal", floatAmp: 14, floatSpeed: 11, floatDelay: 1.5, spin: true, spinSpeed: 26 },
      { tablet: { width: 170, height: 170, x: 14, y: 24 }, mobile: { width: 110, height: 110, x: 16, y: 12 } }),
    obj("object-cube", "Cube", { kind: "cube", x: 23, y: 77, width: 116, height: 116, color1: "#bfdbfe", color2: "#4338ca", depth: 0.85, glow: 0.3, glowColor: "#6366f1", floatAmp: 20, floatSpeed: 7, floatDelay: 0.8, spin: true, spinSpeed: 18 },
      { tablet: { width: 90, height: 90, x: 14, y: 82 }, mobile: { width: 64, height: 64, x: 14, y: 88 } }),
    obj("object-glass", "Glass disc", { kind: "glass", x: 85, y: 76, width: 160, height: 160, color1: "#ffffff", color2: "#a78bfa", depth: 0.92, glow: 0.15, floatDir: "orbit", floatAmp: 12, floatSpeed: 16 },
      { tablet: { width: 120, height: 120, x: 86, y: 82 }, mobile: { hidden: true } }),
    obj("object-sculpture", "Sculpture", { kind: "sculpture", x: 63, y: 86, width: 112, height: 112, color1: "#fda4af", color2: "#9333ea", rotation: 20, depth: 0.35, glow: 0.35, glowColor: "#f472b6", floatDir: "horizontal", floatAmp: 16, floatSpeed: 10, floatDelay: 2 },
      { tablet: { width: 90, height: 90, x: 70, y: 90 }, mobile: { width: 70, height: 70, x: 84, y: 90 } }),
    obj("object-sun", "Small sphere", { kind: "sphere", x: 8, y: 66, width: 56, height: 56, color1: "#fef3c7", color2: "#ea580c", depth: 0.25, glow: 0.5, glowColor: "#fb923c", floatAmp: 10, floatSpeed: 6, floatDelay: 0.4 },
      { mobile: { hidden: true } }),
    obj("object-moon", "Tiny sphere", { kind: "sphere", x: 46, y: 13, width: 32, height: 32, color1: "#cffafe", color2: "#0e7490", depth: 0.15, glow: 0.4, glowColor: "#22d3ee", floatAmp: 8, floatSpeed: 5, floatDelay: 1.1 },
      { mobile: { x: 50, y: 6 } }),
    eyebrow({ text: "◦  Spatial studio — Vol. 03", letterSpacing: 0.24 }),
    heading({ text: "A universe of possibilities.", fontSize: 104, glow: 0.25, maxWidth: 960 }, { tablet: { fontSize: 76, maxWidth: 680 }, mobile: { fontSize: 46, maxWidth: 340 } }),
    subtitle({ text: "Ideas, technology and imagination come together.", fontSize: 20 }, { mobile: { fontSize: 17, maxWidth: 300 } }),
    button("cta", "Call to action", { text: "Discover more", variant: "solid", colorRole: "heading", paddingX: 30, paddingY: 16, hover: "glow" }),
  ],
  animationSettings: { respectReducedMotion: true, choreography: "orbital-dream" },
};
applyChoreographyData(defaults, choreographies["orbital-dream"]);

/* Variations restyle colours / materials only. Collage swaps objects to images without overwriting uploads. */
const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;
const variations = {
  cosmic: {
    label: "Cosmic Objects", swatch: ["#05040f", "#2a1b5e", "#a78bfa", "#f5d0fe"],
    props: { backgroundColor: "#05040f", gradientType: "radial", gradientFrom: "#2a1b5e", gradientTo: "#0a0820", headingColor: "#f5f3ff", accentColor: "#a78bfa", textColor: "#c4c0dd", lighting: 0.75 },
    byType: {
      background: { effect: "stars-nebula" },
      object: [
        { kind: "sphere", color1: "#ddd6fe", color2: "#6d28d9", glowColor: "#8b5cf6", glow: 0.55 }, { kind: "ring", color1: "#f5d0fe", color2: "#7c3aed", glowColor: "#d946ef", glow: 0.35 },
        { kind: "cube", color1: "#bfdbfe", color2: "#4338ca", glowColor: "#6366f1", glow: 0.3 }, { kind: "glass", color1: "#ffffff", color2: "#a78bfa", glow: 0.15 },
        { kind: "sculpture", color1: "#fda4af", color2: "#9333ea", glowColor: "#f472b6", glow: 0.35 }, { kind: "sphere", color1: "#fef3c7", color2: "#ea580c", glowColor: "#fb923c", glow: 0.5 },
        { kind: "sphere", color1: "#cffafe", color2: "#0e7490", glowColor: "#22d3ee", glow: 0.4 },
      ],
      button: { variant: "solid", colorRole: "heading", bgColor: "", textColor: "" },
    },
  },
  pastel: {
    label: "Pastel Universe", swatch: ["#fbf7ff", "#ffd6e8", "#c7d2fe", "#1e1b4b"],
    props: { backgroundColor: "#fbf7ff", gradientType: "radial", gradientFrom: "#ffe4f1", gradientTo: "#e0e7ff", headingColor: "#1e1b4b", accentColor: "#8b5cf6", textColor: "#55527a", lighting: 0.9 },
    byType: {
      background: { effect: "nebula" },
      object: [
        { kind: "sphere", color1: "#fff1f7", color2: "#f9a8d4", glowColor: "#f9a8d4", glow: 0.35 }, { kind: "ring", color1: "#e0e7ff", color2: "#a5b4fc", glowColor: "#a5b4fc", glow: 0.2 },
        { kind: "cube", color1: "#fef9c3", color2: "#fcd34d", glowColor: "#fde68a", glow: 0.2 }, { kind: "glass", color1: "#ffffff", color2: "#f0abfc", glow: 0.1 },
        { kind: "sculpture", color1: "#ccfbf1", color2: "#5eead4", glowColor: "#99f6e4", glow: 0.2 }, { kind: "sphere", color1: "#ede9fe", color2: "#c4b5fd", glowColor: "#c4b5fd", glow: 0.3 },
        { kind: "sphere", color1: "#ffe4e6", color2: "#fda4af", glowColor: "#fda4af", glow: 0.3 },
      ],
      button: { variant: "solid", colorRole: "heading", bgColor: "", textColor: "" },
    },
  },
  sculpture: {
    label: "Abstract Sculpture", swatch: ["#0c0a09", "#3b2a1f", "#f59e0b", "#e7e5e4"],
    props: { backgroundColor: "#0c0a09", gradientType: "radial", gradientFrom: "#3b2a1f", gradientTo: "#110d0b", headingColor: "#fafaf9", accentColor: "#f59e0b", textColor: "#d6d3d1", lighting: 0.6 },
    byType: {
      background: { effect: "nebula" },
      object: [
        { kind: "sculpture", color1: "#fde68a", color2: "#92400e", glowColor: "#f59e0b", glow: 0.35 }, { kind: "ring", color1: "#e7e5e4", color2: "#57534e", glowColor: "#a8a29e", glow: 0.15 },
        { kind: "sculpture", color1: "#fed7aa", color2: "#7c2d12", glowColor: "#ea580c", glow: 0.25 }, { kind: "sphere", color1: "#f5f5f4", color2: "#44403c", glow: 0.1 },
        { kind: "cube", color1: "#d6d3d1", color2: "#292524", glow: 0.1 }, { kind: "sphere", color1: "#fde68a", color2: "#b45309", glowColor: "#f59e0b", glow: 0.4 },
        { kind: "sculpture", color1: "#e7e5e4", color2: "#78716c", glow: 0.1 },
      ],
      button: { variant: "solid", colorRole: "accent", bgColor: "", textColor: "#0c0a09" },
    },
  },
  collage: {
    label: "Floating Image Collage", swatch: ["#0b0b10", "#1f1d2b", "#e879f9", "#fafafa"],
    props: { backgroundColor: "#0b0b10", gradientType: "radial", gradientFrom: "#1f1d2b", gradientTo: "#0b0b10", headingColor: "#fafafa", accentColor: "#e879f9", textColor: "#cfcfe0", lighting: 0.5 },
    byType: {
      background: { effect: "stars" },
      object: [
        { kind: "image", radius: 28, glow: 0.15, glowColor: "#e879f9", $ifEmpty: { imageUrl: IMG("1524504388940-b1c1722653e1") } },
        { kind: "image", radius: 20, glow: 0.1, $ifEmpty: { imageUrl: IMG("1506905925346-21bda4d32df4") } },
        { kind: "image", radius: 16, glow: 0.1, $ifEmpty: { imageUrl: IMG("1490481651871-ab68de25d43d") } },
        { kind: "image", radius: 22, glow: 0.1, $ifEmpty: { imageUrl: IMG("1470071459604-3b5ec3a7fe05") } },
        { kind: "image", radius: 18, glow: 0.1, $ifEmpty: { imageUrl: IMG("1509631179647-0177331693ae") } },
        { kind: "image", radius: 14, glow: 0.1, $ifEmpty: { imageUrl: IMG("1519681393784-d120267933ba") } },
        { kind: "image", radius: 12, glow: 0.1, $ifEmpty: { imageUrl: IMG("1507525428034-b723cf961d3e") } },
      ],
      button: { variant: "solid", colorRole: "heading", bgColor: "", textColor: "" },
    },
  },
  neon: {
    label: "Neon Space", swatch: ["#020617", "#0f172a", "#22d3ee", "#f0abfc"],
    props: { backgroundColor: "#020617", gradientType: "radial", gradientFrom: "#0c1a3a", gradientTo: "#020617", headingColor: "#ecfeff", accentColor: "#22d3ee", textColor: "#a5c8d8", lighting: 1 },
    byType: {
      background: { effect: "grid" },
      object: [
        { kind: "sphere", color1: "#a5f3fc", color2: "#0891b2", glowColor: "#22d3ee", glow: 0.9 }, { kind: "ring", color1: "#f0abfc", color2: "#c026d3", glowColor: "#e879f9", glow: 0.9 },
        { kind: "cube", color1: "#bef264", color2: "#4d7c0f", glowColor: "#a3e635", glow: 0.8 }, { kind: "glass", color1: "#ffffff", color2: "#22d3ee", glow: 0.5 },
        { kind: "sculpture", color1: "#f9a8d4", color2: "#be185d", glowColor: "#f472b6", glow: 0.8 }, { kind: "sphere", color1: "#fde047", color2: "#ca8a04", glowColor: "#facc15", glow: 0.8 },
        { kind: "sphere", color1: "#c4b5fd", color2: "#6d28d9", glowColor: "#a78bfa", glow: 0.8 },
      ],
      button: { variant: "outline", colorRole: "accent", bgColor: "", textColor: "" },
    },
  },
};

const KINDS = [
  { value: "sphere", label: "Sphere" }, { value: "glass", label: "Glass disc" }, { value: "ring", label: "Ring" },
  { value: "cube", label: "Cube" }, { value: "sculpture", label: "Abstract sculpture" }, { value: "image", label: "Custom image" },
];
const GRADIENTS = [{ value: "radial", label: "Radial" }, { value: "linear", label: "Linear" }, { value: "conic", label: "Conic" }, { value: "none", label: "Solid" }];
const EFFECTS = [{ value: "stars-nebula", label: "Stars + nebula" }, { value: "stars", label: "Stars" }, { value: "nebula", label: "Nebula glow" }, { value: "grid", label: "Perspective grid" }, { value: "none", label: "None" }];

export default {
  id: "floating-universe",
  name: "Floating Universe",
  category: "Creative",
  categories: ["Creative", "Interactive", "Premium"],
  description: "Spatial composition of floating spheres, rings and sculptures with depth-based mouse parallax.",
  tags: ["3d", "space", "parallax", "objects", "immersive"],
  thumbnail: "live",
  defaults,
  choreographies,
  variations,
  supportedAnimations: ["entrance", "emphasis", "exit", "hover", "scroll"],
  responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },

  elementTemplates: {
    object: { label: "Floating object", element: obj("tmp", "Floating object", { kind: "sphere", x: 50, y: 20, width: 90, height: 90, depth: 0.5, color1: "#e9d5ff", color2: "#7e22ce" }) },
    button: BUTTON_TEMPLATE,
  },

  editableProperties: [
    ...sectionColorFields(),
    { key: "gradientType", label: "Gradient", type: "select", options: GRADIENTS, group: "Background" },
    { key: "gradientFrom", label: "Gradient color 1", type: "color", group: "Background", showIf: (p) => p.gradientType !== "none" },
    { key: "gradientTo", label: "Gradient color 2", type: "color", group: "Background", showIf: (p) => p.gradientType !== "none" },
    { key: "gradientAngle", label: "Gradient angle", type: "range", min: 0, max: 360, step: 1, unit: "°", group: "Background", showIf: (p) => p.gradientType === "linear" || p.gradientType === "conic" },
    { key: "lighting", label: "Lighting intensity", type: "range", min: 0, max: 1, step: 0.05, group: "Background" },
    { key: "parallax", label: "Mouse parallax", type: "toggle", group: "Interaction" },
    { key: "sensitivity", label: "Mouse sensitivity", type: "range", min: 0, max: 120, step: 1, unit: "px", responsive: true, group: "Interaction", showIf: (p) => p.parallax },
    { key: "continuous", label: "Continuous movement", type: "toggle", group: "Interaction" },
    { key: "floatIntensity", label: "Floating intensity", type: "range", min: 0, max: 3, step: 0.05, group: "Interaction" },
    { key: "rotationSpeed", label: "Rotation speed", type: "range", min: 0.1, max: 4, step: 0.05, group: "Interaction" },
    { key: "depthBlur", label: "Depth of field (blur far objects)", type: "toggle", group: "Interaction" },
    { key: "contentAlign", label: "Text alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }], responsive: true, group: "Layout" },
    { key: "contentY", label: "Text vertical position", type: "range", min: 10, max: 90, step: 1, unit: "%", responsive: true, group: "Layout" },
    ...sectionLayoutFields(),
  ],

  elementSchemas: {
    background: [
      { key: "backgroundColor", scope: "section", label: "Base color", type: "color", group: "Fill" },
      { key: "gradientFrom", scope: "section", label: "Gradient color 1", type: "color", group: "Fill" },
      { key: "gradientTo", scope: "section", label: "Gradient color 2", type: "color", group: "Fill" },
      { key: "lighting", scope: "section", label: "Lighting intensity", type: "range", min: 0, max: 1, step: 0.05, group: "Fill" },
      { key: "effect", label: "Background effect", type: "select", options: EFFECTS, group: "Effects" },
      { key: "starDensity", label: "Star density", type: "range", min: 0, max: 400, step: 10, group: "Effects", showIf: (p) => p.effect?.includes("stars") },
      { key: "vignette", label: "Vignette", type: "range", min: 0, max: 1, step: 0.05, group: "Effects" },
      { key: "imageUrl", label: "Background image", type: "image", group: "Image" },
      { key: "imageOpacity", label: "Image opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Image" },
    ],
    object: [
      { key: "kind", label: "Object type", type: "select", options: KINDS, group: "Object" },
      { key: "imageUrl", label: "Image", type: "image", group: "Object", showIf: (p) => p.kind === "image" },
      { key: "radius", label: "Corner radius", type: "range", min: 0, max: 200, step: 1, unit: "px", group: "Object", showIf: (p) => p.kind === "image" },
      { key: "color1", label: "Highlight color", type: "color", group: "Object", showIf: (p) => p.kind !== "image" },
      { key: "color2", label: "Body color", type: "color", group: "Object", showIf: (p) => p.kind !== "image" },
      { key: "width", label: "Width", type: "range", min: 16, max: 700, step: 1, unit: "px", responsive: true, group: "Size & position" },
      { key: "height", label: "Height", type: "range", min: 16, max: 700, step: 1, unit: "px", responsive: true, group: "Size & position", showIf: (p) => p.kind === "image" || p.kind === "sculpture" },
      { key: "x", label: "X position", type: "range", min: -10, max: 110, step: 0.5, unit: "%", responsive: true, group: "Size & position" },
      { key: "y", label: "Y position", type: "range", min: -10, max: 110, step: 0.5, unit: "%", responsive: true, group: "Size & position" },
      { key: "rotation", label: "Rotation", type: "range", min: -180, max: 180, step: 1, unit: "°", responsive: true, group: "Size & position" },
      { key: "depth", label: "Depth (0 far · 1 near)", type: "range", min: 0, max: 1, step: 0.01, group: "Size & position" },
      { key: "opacity", label: "Opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Look" },
      { key: "glow", label: "Glow", type: "range", min: 0, max: 1, step: 0.05, group: "Look" },
      { key: "glowColor", label: "Glow color", type: "color", group: "Look", showIf: (p) => p.glow > 0 },
      { key: "shadow", label: "Shadow", type: "toggle", group: "Look" },
      ...floatFields(),
      { key: "spin", label: "Continuous rotation", type: "toggle", group: "Motion" },
      { key: "spinSpeed", label: "Rotation cycle", type: "range", min: 3, max: 90, step: 1, unit: "s", group: "Motion", showIf: (p) => p.spin },
      hideField(),
    ],
    meta: [...textFields({ max: 28, multiline: false })],
    heading: [...textFields({ max: 200, glow: true })],
    text: [...textFields({ max: 48 })],
    button: buttonFields(),
  },
};

