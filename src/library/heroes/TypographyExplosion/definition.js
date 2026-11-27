import { applyChoreographyData } from "../../../utils/choreography.js";
import { colorRoleFields, typographyFields, placementFields } from "../../../registry/fieldGroups.js";

const LINE_BASE = {
  text: "", fontFamily: "Anton", fontSize: 250, fontWeight: 400, lineHeight: 0.85, letterSpacing: -0.01,
  textTransform: "uppercase", align: "left", colorRole: "heading", customColor: "#0c0c0c",
  style: "solid", outlineWidth: 2, offsetX: 0, offsetY: 0, rotation: 0, overlap: 0,
  hoverDisplace: true, displaceRadius: 150, displaceStrength: 0.7,
};
const META = {
  fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 500, lineHeight: 1.2, letterSpacing: 0.08,
  textTransform: "uppercase", align: "left", colorRole: "text", customColor: "#0c0c0c",
};

/* Choreographies are data: { elementType: [entry for 1st, 2nd, 3rd…] }, later entries inherit earlier ones */
const BRUTAL = {
  background: [{ preset: "fade-in", duration: 0.9, delay: 0 }],
  decoration: [{ preset: "rotate-in", rotation: -90, duration: 1.1, delay: 0.7, easing: "expo-out" }],
  "heading-line": [
    { preset: "mask-up", duration: 0.9, delay: 0.25, easing: "expo-out" }, { delay: 0.45 }, { delay: 0.65 },
  ],
  text: [{ preset: "fade-in", duration: 0.7, delay: 1.3 }],
  button: [{ preset: "zoom-in", scale: 0.7, duration: 0.6, delay: 1.55, easing: "back-out" }, { delay: 1.7 }],
  meta: [{ preset: "fade-in", duration: 0.6, delay: 1.9 }, { delay: 2.0 }, { delay: 2.1 }, { delay: 2.2 }],
};
const choreographies = {
  "brutal-entrance": { label: "Brutal Entrance", description: "Heavy mask reveals, fast and hard.", byType: BRUTAL },
  "character-reveal": {
    label: "Character Reveal", description: "Letters rise one by one.",
    byType: { ...BRUTAL, "heading-line": [{ preset: "char-reveal", duration: 0.8, delay: 0.2, stagger: 0.03, split: "chars", easing: "expo-out" }, { delay: 0.55 }, { delay: 0.9 }] },
  },
  "blur-drift": {
    label: "Blur Drift", description: "Soft, out-of-focus arrival.",
    byType: { ...BRUTAL, "heading-line": [{ preset: "blur-reveal", duration: 1, delay: 0.2, blur: 18 }, { delay: 0.4 }, { delay: 0.6 }] },
  },
};

const el = (extra) => ({ visible: true, responsive: { tablet: {}, mobile: {} }, animation: null, ...extra });

const defaults = {
  props: {
    backgroundColor: "#f1efe7", headingColor: "#0c0c0c", accentColor: "#ff4a1c", textColor: "#0c0c0c",
    minHeight: 780, paddingX: 56, paddingY: 48, headingMaxWidth: 1400,
  },
  responsive: {
    desktop: {},
    tablet: { minHeight: 700, paddingX: 36, headingMaxWidth: 1000 },
    mobile: { minHeight: 660, paddingX: 20, paddingY: 32 },
  },
  elements: [
    el({ id: "background", type: "background", label: "Background", props: { pattern: "grid", patternOpacity: 0.07, patternSize: 56, imageUrl: "", imageOpacity: 1 } }),
    el({ id: "decoration", type: "decoration", label: "Decorative shape",
      props: { shape: "asterisk", size: 190, x: 80, y: 17, rotation: 0, opacity: 1, colorRole: "accent", customColor: "#ff4a1c", spin: true, spinDuration: 20 },
      responsive: { tablet: { size: 140, x: 82, y: 14 }, mobile: { size: 84, x: 80, y: 10 } } }),
    el({ id: "heading-1", type: "heading-line", label: "Heading line 1", props: { ...LINE_BASE, text: "BREAK" },
      responsive: { tablet: { fontSize: 170 }, mobile: { fontSize: 116 } } }),
    el({ id: "heading-2", type: "heading-line", label: "Heading line 2",
      props: { ...LINE_BASE, text: "THE", fontSize: 170, colorRole: "accent", offsetX: 560, rotation: -4, overlap: -52, hoverDisplace: false },
      responsive: { tablet: { fontSize: 116, offsetX: 380, overlap: -36 }, mobile: { fontSize: 72, offsetX: 170, overlap: -22 } } }),
    el({ id: "heading-3", type: "heading-line", label: "Heading line 3",
      props: { ...LINE_BASE, text: "ORDINARY.", fontSize: 300, overlap: -70 },
      responsive: { tablet: { fontSize: 196, overlap: -46 }, mobile: { fontSize: 80, overlap: -18 } } }),
    el({ id: "subtitle", type: "text", label: "Subtitle",
      props: { text: "We create digital experiences that refuse to blend in.", fontFamily: "Space Grotesk", fontSize: 20, fontWeight: 500, lineHeight: 1.35, letterSpacing: 0, textTransform: "none", align: "left", colorRole: "text", customColor: "#0c0c0c", maxWidth: 380 },
      responsive: { tablet: { fontSize: 18 }, mobile: { fontSize: 17, maxWidth: 0 } } }),
    el({ id: "cta-primary", type: "button", label: "Primary button",
      props: { text: "Explore our work", href: "#work", variant: "solid", colorRole: "heading", customColor: "#0c0c0c", radius: 0, size: "lg", fontFamily: "Space Grotesk", uppercase: true, arrow: true } }),
    el({ id: "cta-secondary", type: "button", label: "Secondary button",
      props: { text: "Let's talk", href: "#contact", variant: "outline", colorRole: "heading", customColor: "#0c0c0c", radius: 0, size: "lg", fontFamily: "Space Grotesk", uppercase: true, arrow: false } }),
    el({ id: "meta-tl", type: "meta", label: "Metadata · top left", props: { ...META, text: "© 2026 Studio Noir", corner: "tl" }, responsive: { tablet: {}, mobile: { fontSize: 10 } } }),
    el({ id: "meta-tr", type: "meta", label: "Metadata · top right", props: { ...META, text: "Index (01)", corner: "tr" }, responsive: { tablet: {}, mobile: { fontSize: 10 } } }),
    el({ id: "meta-bl", type: "meta", label: "Metadata · bottom left", props: { ...META, text: "Scroll ↓", corner: "bl" }, responsive: { tablet: {}, mobile: { fontSize: 10 } } }),
    el({ id: "meta-br", type: "meta", label: "Metadata · bottom right", props: { ...META, text: "Mumbai, IN", corner: "br" }, responsive: { tablet: {}, mobile: { fontSize: 10 } } }),
  ],
  animationSettings: { respectReducedMotion: true, choreography: "brutal-entrance" },
};
applyChoreographyData(defaults, choreographies["brutal-entrance"]);

const PATTERNS = [{ value: "none", label: "None" }, { value: "grid", label: "Grid" }, { value: "dots", label: "Dots" }, { value: "lines", label: "Diagonal lines" }];
const SHAPES = [{ value: "asterisk", label: "Asterisk" }, { value: "burst", label: "Burst" }, { value: "circle", label: "Circle" }, { value: "ring", label: "Ring" }, { value: "cross", label: "Cross" }, { value: "none", label: "None" }];

export default {
  id: "typography-explosion",
  name: "Typography Explosion",
  category: "Experimental",
  categories: ["Experimental", "Creative"],
  description: "Brutalist oversized type with controlled overlap, mask reveals and letter displacement.",
  tags: ["brutalist", "typography", "bold", "agency"],
  thumbnail: "live",
  defaults,
  choreographies,
  supportedAnimations: ["entrance", "emphasis", "exit", "hover", "scroll"],
  responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },

  elementTemplates: {
    "heading-line": {
      label: "Heading line",
      element: { type: "heading-line", visible: true, animation: null, props: { ...LINE_BASE, text: "NEW LINE", fontSize: 180 }, responsive: { tablet: { fontSize: 120 }, mobile: { fontSize: 70 } } },
    },
  },

  editableProperties: [
    { key: "backgroundColor", label: "Background", type: "color", group: "Colors" },
    { key: "headingColor", label: "Heading color", type: "color", group: "Colors" },
    { key: "accentColor", label: "Accent color", type: "color", group: "Colors" },
    { key: "textColor", label: "Supporting text color", type: "color", group: "Colors" },
    { key: "minHeight", label: "Hero height", type: "range", min: 360, max: 1200, step: 10, unit: "px", responsive: true, group: "Layout" },
    { key: "paddingX", label: "Side padding", type: "range", min: 0, max: 160, step: 2, unit: "px", responsive: true, group: "Layout" },
    { key: "paddingY", label: "Vertical padding", type: "range", min: 0, max: 160, step: 2, unit: "px", responsive: true, group: "Layout" },
    { key: "headingMaxWidth", label: "Heading max width", type: "range", min: 400, max: 2000, step: 10, unit: "px", responsive: true, group: "Layout" },
  ],

  elementSchemas: {
    background: [
      { key: "backgroundColor", scope: "section", label: "Fill color", type: "color", group: "Fill" },
      { key: "pattern", label: "Pattern", type: "select", options: PATTERNS, group: "Pattern" },
      { key: "patternOpacity", label: "Pattern opacity", type: "range", min: 0, max: 0.4, step: 0.01, group: "Pattern" },
      { key: "patternSize", label: "Pattern size", type: "range", min: 16, max: 140, step: 2, unit: "px", group: "Pattern" },
      { key: "imageUrl", label: "Image URL", type: "text", group: "Image" },
      { key: "imageOpacity", label: "Image opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Image" },
    ],
    decoration: [
      { key: "shape", label: "Shape", type: "select", options: SHAPES, group: "Shape" },
      { key: "size", label: "Size", type: "range", min: 20, max: 500, step: 2, unit: "px", responsive: true, group: "Shape" },
      { key: "x", label: "X position", type: "range", min: -10, max: 110, step: 0.5, unit: "%", responsive: true, group: "Position" },
      { key: "y", label: "Y position", type: "range", min: -10, max: 110, step: 0.5, unit: "%", responsive: true, group: "Position" },
      { key: "rotation", label: "Rotation", type: "range", min: -180, max: 180, step: 1, unit: "°", group: "Position" },
      { key: "opacity", label: "Opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Position" },
      ...colorRoleFields("Style"),
      { key: "spin", label: "Continuous spin", type: "toggle", group: "Style" },
      { key: "spinDuration", label: "Spin duration", type: "range", min: 2, max: 60, step: 1, unit: "s", group: "Style", showIf: (p) => p.spin },
    ],
    "heading-line": [
      { key: "text", label: "Text", type: "text", group: "Content" },
      ...typographyFields(),
      { key: "style", label: "Fill", type: "segmented", options: [{ value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }], group: "Style" },
      { key: "outlineWidth", label: "Outline width", type: "range", min: 1, max: 8, step: 0.5, unit: "px", group: "Style", showIf: (p) => p.style === "outline" },
      ...colorRoleFields("Style"),
      ...placementFields(),
      { key: "hoverDisplace", label: "Hover letter displacement", type: "toggle", group: "Interaction" },
      { key: "displaceRadius", label: "Displace radius", type: "range", min: 40, max: 400, step: 5, unit: "px", group: "Interaction", showIf: (p) => p.hoverDisplace },
      { key: "displaceStrength", label: "Displace strength", type: "range", min: 0.1, max: 2, step: 0.05, group: "Interaction", showIf: (p) => p.hoverDisplace },
    ],
    text: [
      { key: "text", label: "Text", type: "textarea", group: "Content" },
      ...typographyFields({ max: 80 }),
      { key: "maxWidth", label: "Max width (0 = auto)", type: "range", min: 0, max: 900, step: 10, unit: "px", responsive: true, group: "Layout" },
      ...colorRoleFields(),
    ],
    button: [
      { key: "text", label: "Label", type: "text", group: "Content" },
      { key: "href", label: "Link", type: "link", group: "Content" },
      { key: "variant", label: "Style", type: "segmented", options: [{ value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }, { value: "text", label: "Text" }], group: "Style" },
      { key: "size", label: "Size", type: "segmented", options: [{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }], group: "Style" },
      { key: "radius", label: "Corner radius", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Style" },
      { key: "fontFamily", label: "Font", type: "font", group: "Style" },
      { key: "uppercase", label: "Uppercase", type: "toggle", group: "Style" },
      { key: "arrow", label: "Show arrow", type: "toggle", group: "Style" },
      ...colorRoleFields(),
    ],
    meta: [
      { key: "text", label: "Text", type: "text", group: "Content" },
      { key: "corner", label: "Corner", type: "select", options: [{ value: "tl", label: "Top left" }, { value: "tr", label: "Top right" }, { value: "bl", label: "Bottom left" }, { value: "br", label: "Bottom right" }], group: "Content" },
      { key: "fontFamily", label: "Font", type: "font", group: "Typography" },
      { key: "fontSize", label: "Size", type: "range", min: 8, max: 28, step: 1, unit: "px", responsive: true, group: "Typography" },
      { key: "letterSpacing", label: "Letter spacing", type: "range", min: 0, max: 0.4, step: 0.005, unit: "em", group: "Typography" },
      { key: "textTransform", label: "Case", type: "segmented", options: [{ value: "none", label: "Aa" }, { value: "uppercase", label: "AA" }], group: "Typography" },
      ...colorRoleFields(),
    ],
  },
};