// Data building blocks for navbars, body sections and footers. Everything here is serializable defaults
// and inspector field descriptions; the matching renderers live in Shell.jsx.
import { el } from "../../heroes/shared/defaults.js";
import { hideField } from "../../../registry/fieldGroups.js";
import { applyChoreographyData } from "../../../utils/choreography.js";

export { el };

export const ICON_NAMES = [
  "zap", "sparkles", "rocket", "shield", "shield-check", "layers", "gauge", "globe", "lock", "cloud", "cpu", "code", "terminal", "chart",
  "trending", "users", "user", "heart", "star", "search", "bag", "cart", "mail", "phone", "pin", "clock", "palette", "pen", "camera",
  "briefcase", "award", "smile", "target", "lightbulb", "wand", "leaf", "truck", "card", "refresh", "headphones", "chat", "send",
  "building", "compass", "infinity", "puzzle", "workflow", "box", "package", "calendar", "bell", "settings", "eye", "feather", "gem",
  "coffee", "database", "server", "phone2", "monitor", "dollar", "percent", "timer", "check", "quote",
];
export const ICON_OPTIONS = [{ value: "", label: "None" }, ...ICON_NAMES.map((n) => ({ value: n, label: n }))];
export const SOCIALS = ["x", "linkedin", "instagram", "github", "dribbble", "youtube", "facebook", "tiktok"];
export const SOCIAL_OPTIONS = SOCIALS.map((n) => ({ value: n, label: n === "x" ? "X / Twitter" : n[0].toUpperCase() + n.slice(1) }));
export const SOCIAL_LIST = { type: "list", itemLabel: "Social link", titleKey: "network", itemFields: [{ key: "network", label: "Network", type: "select", options: SOCIAL_OPTIONS }, { key: "url", label: "URL", type: "link" }], newItem: { network: "instagram", url: "#" } };
export const IMG = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

/* ---------- Text & button elements linked to the design system ---------- */
const TEXT = {
  meta: { fontFamily: "$body", fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.14, textTransform: "uppercase", color: "$primary", maxWidth: 0 },
  heading: { fontFamily: "$heading", fontSize: "$h2", fontWeight: "$weight-heading", lineHeight: "$lh-heading", letterSpacing: "$track-heading", textTransform: "$heading-case", color: "$headingText", maxWidth: 760 },
  text: { fontFamily: "$body", fontSize: "$body-size", fontWeight: "$weight-body", lineHeight: "$lh-body", letterSpacing: 0, textTransform: "none", color: "$muted", maxWidth: 620 },
};
export const textEl = (id, type, label, props, responsive = {}) => el({
  id, type, label,
  props: { align: "inherit", offsetX: 0, offsetY: 0, rotation: 0, hidden: false, ...TEXT[type], ...props },
  responsive: { tablet: {}, mobile: {}, ...responsive },
});
export const header = ({ eyebrow, heading, subtitle }) => [
  eyebrow != null && textEl("eyebrow", "meta", "Eyebrow", { text: eyebrow }),
  heading != null && textEl("heading", "heading", "Heading", { text: heading }),
  subtitle != null && textEl("subtitle", "text", "Subtitle", { text: subtitle }),
].filter(Boolean);

export const btnEl = (id, label, props = {}) => el({
  id, type: "button", label,
  props: {
    text: "Get started", href: "#", variant: "solid", color: "$text", bgColor: "$primary", textColor: "$buttonText", borderColor: "",
    radius: "$radius", size: "theme", fontFamily: "$button", uppercase: false, arrow: false, hover: "lift", hidden: false, ...props,
  },
});
export const secondaryBtn = (id, label, props = {}) => btnEl(id, label, { variant: "outline", bgColor: "", textColor: "$text", borderColor: "$border", hover: "brighten", ...props });

/* ---------- Inspector field groups ---------- */
const WEIGHTS = [
  { value: "$weight-heading", label: "Global heading weight" }, { value: "$weight-body", label: "Global body weight" },
  ...[300, 400, 500, 600, 700, 800, 900].map((w) => ({ value: w, label: String(w) })),
];
const ALIGN = [{ value: "inherit", label: "Auto" }, { value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }];

export const typography = ({ max = 120 } = {}) => [
  { key: "fontFamily", label: "Font family", type: "font", tokens: true, group: "Typography" },
  { key: "fontSize", label: "Size", type: "range", min: 8, max, step: 1, unit: "px", token: "size", responsive: true, group: "Typography" },
  { key: "fontWeight", label: "Weight", type: "select", options: WEIGHTS, group: "Typography" },
  { key: "lineHeight", label: "Line height", type: "range", min: 0.8, max: 2.4, step: 0.01, token: "lh", group: "Typography" },
  { key: "letterSpacing", label: "Letter spacing", type: "range", min: -0.1, max: 0.4, step: 0.005, unit: "em", token: "tracking", group: "Typography" },
  { key: "textTransform", label: "Case", type: "segmented", options: [{ value: "none", label: "Aa" }, { value: "uppercase", label: "AA" }, { value: "lowercase", label: "aa" }], group: "Typography" },
  { key: "align", label: "Alignment", type: "segmented", options: ALIGN, responsive: true, group: "Typography" },
];
export const textFields = ({ max, multiline = true } = {}) => [
  { key: "text", label: "Text", type: multiline ? "textarea" : "text", group: "Content" },
  ...typography({ max }),
  { key: "color", label: "Color", type: "color", tokens: true, group: "Colors" },
  { key: "maxWidth", label: "Max width (0 = auto)", type: "range", min: 0, max: 1400, step: 10, unit: "px", responsive: true, group: "Layout" },
  hideField(),
];

const VARIANTS = [{ value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }, { value: "text", label: "Text" }];
const HOVERS = [{ value: "lift", label: "Lift" }, { value: "glow", label: "Glow" }, { value: "scale", label: "Scale" }, { value: "brighten", label: "Brighten" }, { value: "none", label: "None" }];
export const buttonFields = () => [
  { key: "text", label: "Label", type: "text", group: "Content" },
  { key: "href", label: "Link", type: "link", group: "Content" },
  { key: "variant", label: "Style", type: "segmented", options: VARIANTS, group: "Style" },
  { key: "bgColor", label: "Background", type: "color", tokens: true, group: "Style", showIf: (p) => p.variant === "solid" },
  { key: "textColor", label: "Text color", type: "color", tokens: true, group: "Style" },
  { key: "borderColor", label: "Border color", type: "color", tokens: true, group: "Style", showIf: (p) => p.variant === "outline" },
  { key: "radius", label: "Corner radius", type: "range", min: 0, max: 40, step: 1, unit: "px", token: "radius", group: "Style" },
  { key: "paddingX", label: "Padding X (empty = global)", type: "range", min: 6, max: 60, step: 1, unit: "px", group: "Style" },
  { key: "paddingY", label: "Padding Y (empty = global)", type: "range", min: 4, max: 30, step: 1, unit: "px", group: "Style" },
  { key: "hover", label: "Hover effect", type: "select", options: HOVERS, group: "Style" },
  { key: "arrow", label: "Arrow", type: "toggle", group: "Style" },
  { key: "fontFamily", label: "Font", type: "font", tokens: true, group: "Typography" },
  { key: "uppercase", label: "Uppercase", type: "toggle", group: "Typography" },
  hideField(),
];

const GRADIENTS = [{ value: "none", label: "Solid" }, { value: "linear", label: "Linear" }, { value: "radial", label: "Radial" }];
// Section background, spacing and header alignment — shared by every body section and footer.
export const shellFields = ({ header = true } = {}) => [
  { key: "background", label: "Background", type: "color", tokens: true, group: "Background" },
  { key: "gradient", label: "Gradient", type: "segmented", options: GRADIENTS, group: "Background" },
  { key: "gradientFrom", label: "Gradient from", type: "color", tokens: true, group: "Background", showIf: (p) => p.gradient !== "none" },
  { key: "gradientTo", label: "Gradient to", type: "color", tokens: true, group: "Background", showIf: (p) => p.gradient !== "none" },
  { key: "gradientAngle", label: "Gradient angle", type: "range", min: 0, max: 360, step: 1, unit: "°", group: "Background", showIf: (p) => p.gradient === "linear" },
  { key: "backgroundImage", label: "Background image", type: "image", group: "Background" },
  { key: "imageOverlay", label: "Image overlay", type: "range", min: 0, max: 1, step: 0.05, group: "Background", showIf: (p) => !!p.backgroundImage },
  { key: "paddingY", label: "Vertical padding", type: "range", min: 0, max: 260, step: 2, unit: "px", token: "spacing", responsive: true, group: "Spacing" },
  { key: "paddingX", label: "Side padding", type: "range", min: 0, max: 120, step: 2, unit: "px", token: "spacing", responsive: true, group: "Spacing" },
  { key: "container", label: "Container width", type: "range", min: 480, max: 1800, step: 10, unit: "px", token: "container", group: "Spacing" },
  ...(header ? [{ key: "headerAlign", label: "Header alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }], responsive: true, group: "Spacing" }] : []),
  { key: "borderTop", label: "Top border", type: "toggle", group: "Spacing" },
];
export const shellDefaults = (extra) => ({
  background: "$background", gradient: "none", gradientFrom: "$surface", gradientTo: "$background", gradientAngle: 180,
  backgroundImage: "", imageOverlay: 0.5, paddingY: "$section", paddingX: "$pad", container: "$container", headerAlign: "center", borderTop: false,
  ...extra,
});
export const SHELL_RESPONSIVE = { desktop: {}, tablet: { paddingY: 88 }, mobile: { paddingY: 64, paddingX: 20 } };
export const responsive = (tablet = {}, mobile = {}) => ({ desktop: {}, tablet: { ...SHELL_RESPONSIVE.tablet, ...tablet }, mobile: { ...SHELL_RESPONSIVE.mobile, ...mobile } });

/* Image element (rendered by <Media>) */
export const mediaEl = (id, label, props = {}, resp = {}) => el({ id, type: "media", label, props: { imageUrl: "", alt: "", ratio: "4/3", radius: 24, focalX: 50, focalY: 50, shadow: 0, hoverZoom: false, hidden: false, ...props }, responsive: { tablet: {}, mobile: {}, ...resp } });
const RATIOS = ["1/1", "4/3", "3/2", "16/9", "4/5", "3/4", "2/3", "21/9", "auto"].map((r) => ({ value: r, label: r === "auto" ? "Fill" : r.replace("/", ":") }));
export const mediaFields = () => [
  { key: "imageUrl", label: "Image", type: "image", group: "Image" },
  { key: "alt", label: "Alt text", type: "text", group: "Image" },
  { key: "ratio", label: "Crop ratio", type: "select", options: RATIOS, responsive: true, group: "Crop" },
  { key: "focalX", label: "Focal point X", type: "range", min: 0, max: 100, step: 1, unit: "%", group: "Crop" },
  { key: "focalY", label: "Focal point Y", type: "range", min: 0, max: 100, step: 1, unit: "%", group: "Crop" },
  { key: "radius", label: "Corner radius", type: "range", min: 0, max: 80, step: 1, unit: "px", group: "Style" },
  { key: "shadow", label: "Shadow", type: "range", min: 0, max: 1, step: 0.05, group: "Style" },
  { key: "hoverZoom", label: "Zoom on hover", type: "toggle", group: "Style" },
  { key: "link", label: "Click action (optional)", type: "link", group: "Link" },
  hideField(),
];

export const gridFields = (max = 6) => [
  { key: "columns", label: "Columns", type: "range", min: 1, max, step: 1, responsive: true, group: "Grid" },
  { key: "gap", label: "Gap", type: "range", min: 0, max: 96, step: 2, unit: "px", token: "spacing", responsive: true, group: "Grid" },
];
const CARD_HOVERS = [{ value: "lift", label: "Lift" }, { value: "glow", label: "Glow" }, { value: "scale", label: "Scale" }, { value: "border", label: "Border" }, { value: "none", label: "None" }];
export const cardFields = () => [
  { key: "cardTitle", label: "Title color", type: "color", tokens: true, group: "Cards" },
  { key: "cardText", label: "Text color", type: "color", tokens: true, group: "Cards" },
  { key: "cardBg", label: "Card background", type: "color", tokens: true, group: "Cards" },
  { key: "cardBorder", label: "Card border", type: "color", tokens: true, group: "Cards" },
  { key: "cardBorderWidth", label: "Border width", type: "range", min: 0, max: 4, step: 1, unit: "px", token: [{ value: "$card-border", label: "Card border" }], group: "Cards" },
  { key: "cardRadius", label: "Corner radius", type: "range", min: 0, max: 48, step: 1, unit: "px", token: [{ value: "$card-radius", label: "Card radius" }], group: "Cards" },
  { key: "cardShadow", label: "Shadow", type: "range", min: 0, max: 1, step: 0.05, token: [{ value: "$card-shadow", label: "Card shadow" }], group: "Cards" },
  { key: "cardPadding", label: "Padding", type: "range", min: 0, max: 64, step: 1, unit: "px", responsive: true, token: [{ value: "$card-pad", label: "Card padding" }], group: "Cards" },
  { key: "cardHover", label: "Hover", type: "select", options: CARD_HOVERS, group: "Cards" },
];
// Cards follow the theme's card tokens (radius, shadow, padding, border) unless a section overrides them.
export const cardDefaults = (extra) => ({ cardTitle: "$headingText", cardText: "$muted", cardBg: "$surface", cardBorder: "$border", cardBorderWidth: "$card-border", cardRadius: "$card-radius", cardShadow: "$card-shadow", cardPadding: "$card-pad", cardHover: "lift", ...extra });

export const variantField = (options) => ({ key: "variant", label: "Layout", type: "select", options, group: "Layout" });

/* ---------- Choreographies (data) ---------- */
const stagger = (base, n = 16, step = 0.08) => Array.from({ length: n }, (_, i) => (i === 0 ? base : { delay: +(base.delay + step * i).toFixed(2) }));
const V = { trigger: "viewport" };
export function bodyChoreos(itemTypes = []) {
  const head = {
    meta: [{ preset: "fade-in", duration: 0.6, delay: 0, ...V }],
    heading: [{ preset: "slide-up", distance: 28, duration: 0.8, delay: 0.05, easing: "expo-out", ...V }],
    text: [{ preset: "fade-in", duration: 0.8, delay: 0.18, ...V }],
    button: stagger({ preset: "fade-in", duration: 0.6, delay: 0.3, ...V }, 4, 0.08),
  };
  const items = (preset) => Object.fromEntries(itemTypes.map((t) => [t, stagger({ ...preset, ...V })]));
  return {
    rise: { label: "Rise In", description: "Header and items slide up in sequence as the section scrolls into view.", byType: { ...head, ...items({ preset: "slide-up", distance: 36, duration: 0.8, delay: 0.25, easing: "expo-out" }) } },
    fade: { label: "Soft Fade", description: "A calm, simple fade for every element.", byType: { ...head, heading: [{ preset: "fade-in", duration: 0.9, delay: 0.05, ...V }], ...items({ preset: "fade-in", duration: 0.9, delay: 0.25 }) } },
    zoom: { label: "Zoom Stagger", description: "Items pop in one after another.", byType: { ...head, ...items({ preset: "zoom-in", scale: 0.9, duration: 0.7, delay: 0.25, easing: "back-out" }) } },
    blur: { label: "Blur Reveal", description: "Everything resolves from soft focus.", byType: { ...head, heading: [{ preset: "blur-reveal", blur: 14, duration: 0.9, delay: 0.05, ...V }], ...items({ preset: "blur-reveal", blur: 12, duration: 0.9, delay: 0.25 }) } },
  };
}

/*
 * One definition per category. `variations` are the library's design variations (each sets `variant` plus any style),
 * so a category is one configurable component rather than several near-duplicates.
 */
export function defineSection({ kind = "body", library, choreoTypes, defaults, choreographies: custom, ...rest }) {
  const choreographies = custom || bodyChoreos(choreoTypes);
  const first = Object.keys(choreographies)[0];
  const full = { animationSettings: { respectReducedMotion: true, choreography: first }, responsive: SHELL_RESPONSIVE, ...defaults };
  applyChoreographyData(full, choreographies[first]);
  return {
    kind, library, categories: [library], thumbnail: "live",
    supportedAnimations: ["entrance", "emphasis", "exit", "hover", "scroll"],
    responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },
    choreographies,
    defaults: full,
    ...rest,
  };
}
