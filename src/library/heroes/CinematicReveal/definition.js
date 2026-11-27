import { applyChoreographyData } from "../../../utils/choreography.js";
import { hideField, buttonFields, textFields } from "../../../registry/fieldGroups.js";
import { el, heading, subtitle, eyebrow, button, BUTTON_TEMPLATE, sectionColorFields, sectionLayoutFields } from "../shared/defaults.js";

const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;
const PHOTOS = [
  ["1524504388940-b1c1722653e1", "#3b2f2a", "#a58b74", "Look 01"],
  ["1506905925346-21bda4d32df4", "#1f2a36", "#7b8ea3", "Altitude"],
  ["1490481651871-ab68de25d43d", "#2f2723", "#c9b39c", "Look 02"],
  ["1470071459604-3b5ec3a7fe05", "#1d2420", "#7f8f86", "Morning fog"],
  ["1509631179647-0177331693ae", "#2b1f1c", "#b98d7a", "Look 03"],
  ["1519681393784-d120267933ba", "#0f1626", "#55658c", "Night run"],
  ["1507525428034-b723cf961d3e", "#1a2f3a", "#8fc1cf", "Coastline"],
  ["1441974231531-c6227db76b6e", "#1c2a1a", "#7a9b62", "Forest"],
  ["1517841905240-472988babdf9", "#2c2422", "#b39484", "Look 04"],
];

const PANEL = {
  imageUrl: "", videoUrl: "", focalX: 50, focalY: 50, zoom: 1, overlayColor: "#0b0a09", overlayOpacity: 0.12,
  radius: -1, colSpan: 0, rowSpan: 0, caption: "", hoverZoom: true, fallback1: "#2b2420", fallback2: "#8c7a6b", hidden: false,
};
const panel = (i) => el({
  id: `panel-${i + 1}`, type: "panel", label: `Panel ${i + 1}`,
  props: { ...PANEL, imageUrl: IMG(PHOTOS[i][0]), fallback1: PHOTOS[i][1], fallback2: PHOTOS[i][2], caption: PHOTOS[i][3] },
});

const STAGGER = (first, step, n = 9) => Array.from({ length: n }, (_, i) => (i === 0 ? first : { delay: +(first.delay + step * i).toFixed(2) }));
const OPENING = {
  background: [{ preset: "fade-in", duration: 0.8, delay: 0 }],
  panel: STAGGER({ preset: "wipe-vertical", direction: "up", duration: 1.25, delay: 0.15, easing: "expo-out" }, 0.11),
  meta: [{ preset: "fade-in", duration: 0.8, delay: 0.95 }, { delay: 1.05 }],
  heading: [{ preset: "slide-up", distance: 60, duration: 1.2, delay: 0.9, easing: "expo-out" }],
  text: [{ preset: "fade-in", duration: 0.9, delay: 1.3 }],
  button: [{ preset: "fade-in", duration: 0.8, delay: 1.55 }, { delay: 1.65 }],
};
const choreographies = {
  "cinematic-opening": { label: "Cinematic Opening", description: "Frames wipe up one after another, then the title rises.", byType: OPENING },
  "curtain-call": { label: "Curtain Reveal", description: "Each frame opens from its centre like a curtain.", byType: { ...OPENING, panel: STAGGER({ preset: "curtain", duration: 1.3, delay: 0.15, easing: "expo-out" }, 0.1) } },
  "horizontal-wipe": { label: "Horizontal Wipe", description: "A left-to-right sweep across the grid.", byType: { ...OPENING, panel: STAGGER({ preset: "wipe-horizontal", direction: "right", duration: 1.1, delay: 0.1, easing: "expo-out" }, 0.09) } },
  "image-zoom": { label: "Image Zoom", description: "Frames fade in while settling from a slow zoom.", byType: { ...OPENING, panel: STAGGER({ preset: "image-zoom", scale: 1.25, duration: 1.6, delay: 0.1, easing: "expo-out" }, 0.12) } },
  "fragment-expansion": {
    label: "Fragment Expansion", description: "Fragments appear, expand and lock together (best with Full-Image Expansion).",
    byType: { ...OPENING, panel: STAGGER({ preset: "expand-reveal", scale: 0.8, duration: 1.1, delay: 0.1, easing: "expo-out" }, 0.07) },
  },
  crossfade: { label: "Crossfade", description: "Soft, quiet dissolve for every frame.", byType: { ...OPENING, panel: STAGGER({ preset: "crossfade", blur: 12, duration: 1.4, delay: 0.1 }, 0.14) } },
};

const defaults = {
  props: {
    backgroundColor: "#0b0a09", headingColor: "#f5f0e8", accentColor: "#d6b98c", textColor: "#b8afa3",
    layout: "asymmetric", panelCount: "6", textPlacement: "auto", contained: false, maxWidth: 1360,
    gridHeight: 620, gapX: 12, gapY: 12, radius: 4, gridAlign: "center", mobilePanels: 3, assembleDelay: 1.6,
    minHeight: 0, paddingX: 48, paddingY: 56,
  },
  responsive: {
    desktop: {},
    tablet: { gridHeight: 520, paddingX: 32, paddingY: 48 },
    mobile: { paddingX: 18, paddingY: 40, gapX: 8, gapY: 8 },
  },
  elements: [
    el({ id: "background", type: "background", label: "Background", props: { grain: 0.08, vignette: 0.35, imageUrl: "", imageOpacity: 0.2 } }),
    eyebrow({ text: "Vol. 07 — Autumn / Winter", align: "left", colorRole: "accent", letterSpacing: 0.22 }),
    { ...eyebrow({ text: "Index — 06 frames", align: "right", colorRole: "text", letterSpacing: 0.18 }), id: "index", label: "Index label" },
    heading({ text: "Stories worth experiencing.", fontFamily: "Playfair Display", fontWeight: 400, fontSize: 104, lineHeight: 0.98, letterSpacing: -0.035, align: "left", maxWidth: 820, italic: false },
      { tablet: { fontSize: 76 }, mobile: { fontSize: 46 } }),
    subtitle({ text: "Every frame tells a different story.", fontSize: 18, align: "left", maxWidth: 340 }, { mobile: { fontSize: 16 } }),
    button("cta", "Call to action", { text: "Explore collection", variant: "solid", colorRole: "heading", radius: 999, hover: "lift", arrow: true, paddingX: 26, paddingY: 14 }),
    ...PHOTOS.map((_, i) => panel(i)),
  ],
  animationSettings: { respectReducedMotion: true, choreography: "cinematic-opening" },
};
applyChoreographyData(defaults, choreographies["cinematic-opening"]);

const variations = {
  symmetric: {
    label: "Symmetrical Grid", swatch: ["#f2eee7", "#141210", "#9a7b54", "#d8d0c4"],
    props: { layout: "symmetric", textPlacement: "auto", backgroundColor: "#f2eee7", headingColor: "#141210", accentColor: "#9a7b54", textColor: "#5e574e", radius: 2, gapX: 10, gapY: 10 },
    byType: { panel: { overlayColor: "#141210", overlayOpacity: 0.04 }, background: { grain: 0.06, vignette: 0 } },
  },
  asymmetric: {
    label: "Asymmetric Editorial", swatch: ["#0b0a09", "#f5f0e8", "#d6b98c", "#3b2f2a"],
    props: { layout: "asymmetric", textPlacement: "auto", backgroundColor: "#0b0a09", headingColor: "#f5f0e8", accentColor: "#d6b98c", textColor: "#b8afa3", radius: 4, gapX: 12, gapY: 12 },
    byType: { panel: { overlayColor: "#0b0a09", overlayOpacity: 0.12 }, background: { grain: 0.08, vignette: 0.35 } },
  },
  filmstrip: {
    label: "Horizontal Filmstrip", swatch: ["#111014", "#efe9ff", "#ff8a5b", "#2a2833"],
    props: { layout: "filmstrip", textPlacement: "auto", backgroundColor: "#111014", headingColor: "#f4f1ff", accentColor: "#ff8a5b", textColor: "#a9a5b8", radius: 14, gapX: 14, gapY: 14 },
    byType: { panel: { overlayColor: "#111014", overlayOpacity: 0.1 }, background: { grain: 0.06, vignette: 0.3 } },
  },
  curtain: {
    label: "Vertical Curtain", swatch: ["#000000", "#ffffff", "#e5c07b", "#222222"],
    props: { layout: "curtain", textPlacement: "overlay", backgroundColor: "#000000", headingColor: "#ffffff", accentColor: "#e5c07b", textColor: "#d6d6d6", radius: 0, gapX: 4, gapY: 0 },
    byType: { panel: { overlayColor: "#000000", overlayOpacity: 0.35 }, background: { grain: 0.1, vignette: 0.5 } },
  },
  expansion: {
    label: "Full-Image Expansion", swatch: ["#070707", "#fafafa", "#9ad1ff", "#1f2a36"],
    props: { layout: "expansion", textPlacement: "overlay", backgroundColor: "#070707", headingColor: "#fafafa", accentColor: "#9ad1ff", textColor: "#d4d4d4", radius: 10, gapX: 14, gapY: 14 },
    byType: { panel: { overlayColor: "#000000", overlayOpacity: 0.22 }, background: { grain: 0.08, vignette: 0.4 } },
  },
};

const LAYOUTS = [
  { value: "symmetric", label: "Symmetrical grid" }, { value: "asymmetric", label: "Asymmetric editorial" }, { value: "filmstrip", label: "Horizontal filmstrip" },
  { value: "curtain", label: "Vertical curtain" }, { value: "expansion", label: "Full-image expansion" },
];
const COUNTS = [{ value: "4", label: "4" }, { value: "6", label: "6" }, { value: "9", label: "9" }, { value: "all", label: "All" }];

export default {
  id: "cinematic-reveal",
  name: "Cinematic Reveal",
  category: "Minimal / Editorial",
  categories: ["Minimal / Editorial", "Creative", "Premium"],
  description: "Editorial image grid whose frames wipe, zoom and assemble into one cinematic composition.",
  tags: ["editorial", "fashion", "photography", "portfolio", "gallery", "video"],
  thumbnail: "live",
  defaults,
  choreographies,
  variations,
  supportedAnimations: ["entrance", "emphasis", "exit", "hover", "scroll"],
  responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },

  elementTemplates: {
    panel: { label: "Panel", element: { ...panel(8), id: "tmp", props: { ...panel(8).props, caption: "New frame" } } },
    button: BUTTON_TEMPLATE,
  },

  editableProperties: [
    ...sectionColorFields(),
    { key: "layout", label: "Arrangement", type: "select", options: LAYOUTS, group: "Grid" },
    { key: "panelCount", label: "Number of panels", type: "segmented", options: COUNTS, group: "Grid" },
    { key: "gridHeight", label: "Grid height", type: "range", min: 240, max: 1100, step: 10, unit: "px", responsive: true, group: "Grid" },
    { key: "gapX", label: "Horizontal gap", type: "range", min: 0, max: 60, step: 1, unit: "px", responsive: true, group: "Grid" },
    { key: "gapY", label: "Vertical gap", type: "range", min: 0, max: 60, step: 1, unit: "px", responsive: true, group: "Grid" },
    { key: "radius", label: "Panel corner radius", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Grid" },
    { key: "gridAlign", label: "Grid alignment", type: "segmented", options: [{ value: "start", label: "Start" }, { value: "center", label: "Center" }, { value: "end", label: "End" }], group: "Grid" },
    { key: "assembleDelay", label: "Assemble after", type: "range", min: 0, max: 5, step: 0.1, unit: "s", group: "Grid", showIf: (p) => p.layout === "expansion" },
    { key: "mobilePanels", label: "Panels on mobile", type: "segmented", options: [{ value: 1, label: "1" }, { value: 2, label: "2" }, { value: 3, label: "3" }], group: "Grid" },
    { key: "textPlacement", label: "Text placement", type: "select", options: [{ value: "auto", label: "Automatic" }, { value: "above", label: "Above the grid" }, { value: "overlay", label: "Over the images" }, { value: "below", label: "Below the grid" }], responsive: true, group: "Layout" },
    { key: "contained", label: "Contained (not full-bleed)", type: "toggle", group: "Layout" },
    { key: "maxWidth", label: "Max width", type: "range", min: 720, max: 1800, step: 10, unit: "px", group: "Layout", showIf: (p) => p.contained },
    ...sectionLayoutFields(),
  ],

  elementSchemas: {
    background: [
      { key: "backgroundColor", scope: "section", label: "Color", type: "color", group: "Fill" },
      { key: "grain", label: "Film grain", type: "range", min: 0, max: 0.4, step: 0.01, group: "Fill" },
      { key: "vignette", label: "Vignette", type: "range", min: 0, max: 1, step: 0.05, group: "Fill" },
      { key: "imageUrl", label: "Background image", type: "image", group: "Image" },
      { key: "imageOpacity", label: "Image opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Image" },
    ],
    panel: [
      { key: "imageUrl", label: "Image", type: "image", group: "Media" },
      { key: "videoUrl", label: "Video URL (mp4/webm, optional)", type: "image", accept: "video/*", group: "Media" },
      { key: "caption", label: "Caption", type: "text", group: "Media" },
      { key: "focalX", label: "Focal point X", type: "range", min: 0, max: 100, step: 1, unit: "%", group: "Crop" },
      { key: "focalY", label: "Focal point Y", type: "range", min: 0, max: 100, step: 1, unit: "%", group: "Crop" },
      { key: "zoom", label: "Crop zoom", type: "range", min: 1, max: 3, step: 0.01, group: "Crop" },
      { key: "overlayColor", label: "Overlay color", type: "color", group: "Overlay" },
      { key: "overlayOpacity", label: "Overlay opacity", type: "range", min: 0, max: 1, step: 0.01, group: "Overlay" },
      { key: "radius", label: "Corner radius (-1 = grid default)", type: "range", min: -1, max: 60, step: 1, unit: "px", group: "Shape" },
      { key: "colSpan", label: "Custom width (columns, 0 = auto)", type: "range", min: 0, max: 12, step: 1, group: "Shape" },
      { key: "rowSpan", label: "Custom height (rows, 0 = auto)", type: "range", min: 0, max: 6, step: 1, group: "Shape" },
      { key: "hoverZoom", label: "Zoom on hover", type: "toggle", group: "Interaction" },
      { key: "fallback1", label: "Fallback tone 1", type: "color", group: "Fallback" },
      { key: "fallback2", label: "Fallback tone 2", type: "color", group: "Fallback" },
      hideField(),
    ],
    meta: [...textFields({ max: 28, multiline: false })],
    heading: [...textFields({ max: 220 }), { key: "italic", label: "Italic", type: "toggle", group: "Typography" }],
    text: [...textFields({ max: 40 })],
    button: buttonFields(),
  },
};
