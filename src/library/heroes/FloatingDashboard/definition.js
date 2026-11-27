import { applyChoreographyData } from "../../../utils/choreography.js";
import { floatFields, hideField, buttonFields, textFields } from "../../../registry/fieldGroups.js";
import { el, heading, subtitle, eyebrow, button, BUTTON_TEMPLATE, sectionColorFields, sectionLayoutFields } from "../shared/defaults.js";

const CARD = {
  kind: "metric", title: "", value: "", sub: "", delta: "", bgColor: "#12141f", textColor: "#eef0fa", glass: true,
  width: 220, x: 0, y: 0, rotation: 0, shadow: 0.7, depth: 0.6,
  floatDir: "vertical", floatAmp: 10, floatSpeed: 7, floatDelay: 0, hidden: false,
};
const card = (id, label, props, responsive = {}) => el({ id, type: "card", label, props: { ...CARD, ...props }, responsive: { tablet: {}, mobile: {}, ...responsive } });

/* Placeholder copy per dashboard flavour. Variations swap it only while the user hasn't edited it ($soft). */
const COPY = {
  analytics: [
    { title: "Payment received", sub: "$2,480.00 from Northwind", value: "now" },
    { title: "Active users", value: "24.8k", delta: "+12.4%" },
    { title: "Weekly revenue", value: "$18,240", delta: "+6.1%" },
    { title: "Maya Chen", sub: "Product lead", value: "Online" },
    { title: "Monthly recurring", value: "$84,210", delta: "+8.2% vs last month" },
  ],
  project: [
    { title: "Task completed", sub: "“Launch checklist” by Leo", value: "2m" },
    { title: "Sprint progress", value: "78%", delta: "+14 pts" },
    { title: "Velocity", value: "42 pts", delta: "+9%" },
    { title: "Leo Martins", sub: "Engineering", value: "Reviewing" },
    { title: "Shipped this month", value: "128 tasks", delta: "+22% vs last month" },
  ],
  finance: [
    { title: "Transfer received", sub: "$12,000.00 · Acme Corp", value: "now" },
    { title: "Net balance", value: "$482.9k", delta: "+4.3%" },
    { title: "Cash flow", value: "$35,270", delta: "+11.8%" },
    { title: "Sara Ahmed", sub: "Finance manager", value: "Approved" },
    { title: "Savings rate", value: "38.4%", delta: "+2.1% vs last quarter" },
  ],
  crm: [
    { title: "New lead", sub: "Brightline Labs · Enterprise", value: "1m" },
    { title: "Deals won", value: "86", delta: "+18%" },
    { title: "Pipeline", value: "$1.24M", delta: "+9.4%" },
    { title: "Jordan Lee", sub: "Account executive", value: "In a call" },
    { title: "Win rate", value: "31.2%", delta: "+3.6% vs last quarter" },
  ],
  minimal: [
    { title: "All systems normal", sub: "99.99% uptime this month", value: "live" },
    { title: "Visitors", value: "12.4k", delta: "+5.2%" },
    { title: "Signups", value: "1,284", delta: "+9.0%" },
    { title: "Ava Novak", sub: "Founder", value: "Online" },
    { title: "Revenue", value: "$42,180", delta: "+7.4% vs last month" },
  ],
};
const KINDS_BY_INDEX = ["notification", "metric", "chart", "profile", "revenue"];
const soft = (flavour) => COPY[flavour].map((c) => ({ $soft: c }));
const withCopy = (flavour, styles) => soft(flavour).map((s, i) => ({ ...s, ...(styles[i % styles.length] || {}) }));

const PRODUCT = {
  background: [{ preset: "fade-in", duration: 1, delay: 0 }],
  dashboard: [{ preset: "perspective-in", rotation: 26, distance: 110, duration: 1.4, delay: 0.2, easing: "expo-out" }],
  card: [{ preset: "zoom-in", scale: 0.82, duration: 0.7, delay: 0.75, easing: "back-out" }, { delay: 0.88 }, { delay: 1.01 }, { delay: 1.14 }, { delay: 1.27 }, { delay: 1.4 }],
  meta: [{ preset: "fade-in", duration: 0.8, delay: 0.55 }, { delay: 1.75 }],
  heading: [{ preset: "slide-up", distance: 44, duration: 1.1, delay: 0.85, easing: "expo-out" }],
  text: [{ preset: "fade-in", duration: 0.9, delay: 1.15 }],
  button: [{ preset: "zoom-in", scale: 0.85, duration: 0.6, delay: 1.4, easing: "back-out" }, { delay: 1.52 }],
};
const choreographies = {
  "product-reveal": { label: "Product Reveal", description: "Dashboard tilts up into place, cards pop in around it.", byType: PRODUCT },
  "stack-slide": {
    label: "Stack Slide", description: "Dashboard slides in from the right, cards rise in sequence.",
    byType: {
      ...PRODUCT,
      dashboard: [{ preset: "slide-left", distance: 160, duration: 1.2, delay: 0.25, easing: "expo-out" }],
      card: [{ preset: "slide-up", distance: 40, duration: 0.8, delay: 0.8, easing: "expo-out" }, { delay: 0.92 }, { delay: 1.04 }, { delay: 1.16 }, { delay: 1.28 }, { delay: 1.4 }],
    },
  },
  "soft-focus": {
    label: "Soft Focus", description: "Everything resolves from a gentle blur.",
    byType: {
      ...PRODUCT,
      dashboard: [{ preset: "blur-reveal", blur: 20, duration: 1.4, delay: 0.2 }],
      card: [{ preset: "crossfade", blur: 12, duration: 1, delay: 0.7 }, { delay: 0.85 }, { delay: 1 }, { delay: 1.15 }, { delay: 1.3 }, { delay: 1.45 }],
      heading: [{ preset: "word-stagger", split: "words", stagger: 0.07, duration: 0.9, delay: 0.6 }],
    },
  },
};

const defaults = {
  props: {
    backgroundColor: "#07080f", headingColor: "#f5f7ff", accentColor: "#7c5cff", textColor: "#a2a8c3",
    glowColor1: "#4f46e5", glowColor2: "#06b6d4", glowIntensity: 0.7, gridPattern: true, gridOpacity: 0.06, shapes: true,
    minHeight: 880, paddingX: 64, paddingY: 88, textWidth: 40, gap: 40, tilt: true, tiltStrength: 5,
  },
  responsive: {
    desktop: {},
    tablet: { minHeight: 0, paddingX: 40, paddingY: 72, tiltStrength: 3 },
    mobile: { minHeight: 0, paddingX: 20, paddingY: 56, tilt: false },
  },
  elements: [
    el({ id: "background", type: "background", label: "Background", props: { imageUrl: "", imageOpacity: 0.3 } }),
    eyebrow({ text: "✦  New — AI forecasting is here", align: "left", pill: true, letterSpacing: 0.04, textTransform: "none", fontFamily: "Inter", fontSize: 13, colorRole: "accent" }),
    heading({ text: "Your entire workflow. One workspace.", fontSize: 66, lineHeight: 1.02, align: "left", maxWidth: 560 }, { tablet: { fontSize: 54, align: "center", maxWidth: 640 }, mobile: { fontSize: 38, align: "left" } }),
    subtitle({ text: "Manage, analyze and grow your business from one powerful platform.", fontSize: 19, align: "left", maxWidth: 470 }, { tablet: { align: "center" }, mobile: { fontSize: 16, align: "left" } }),
    button("cta-primary", "Primary button", { text: "Start building", variant: "solid", colorRole: "accent", textColor: "#ffffff", radius: 12, hover: "lift", arrow: true }),
    button("cta-secondary", "Secondary button", { text: "View demo", variant: "glass", colorRole: "heading", radius: 12, hover: "brighten", arrow: false }),
    { ...eyebrow({ text: "Trusted by 12,000+ teams in 80 countries", align: "left", fontFamily: "Inter", fontSize: 13, letterSpacing: 0, textTransform: "none", colorRole: "text", opacity: 0.8 }), id: "trust", label: "Trust line" },
    el({ id: "dashboard", type: "dashboard", label: "Main dashboard",
      props: { kind: "analytics", theme: "dark", imageUrl: "", width: 800, height: 520, x: 0, y: 0, perspective: 2000, rotateX: 9, rotateY: -16, rotateZ: 2, radius: 16, borderColor: "#ffffff", borderOpacity: 0.12, shadow: 0.85, opacity: 1, floatDir: "vertical", floatAmp: 8, floatSpeed: 9, floatDelay: 0, hidden: false },
      responsive: { tablet: { width: 680, height: 442, rotateX: 6, rotateY: -6, rotateZ: 0 }, mobile: { width: 340, height: 230, rotateX: 4, rotateY: 0, rotateZ: 0, floatAmp: 4 } } }),
    card("card-notify", "Notification card", { kind: "notification", ...COPY.analytics[0], width: 262, x: -9, y: 6, rotation: -2, depth: 0.9, floatDelay: 0.6 },
      { tablet: { x: -3, y: 2 }, mobile: { width: 220, x: 0, y: -4, depth: 0.3 } }),
    card("card-metric", "Metric card", { kind: "metric", ...COPY.analytics[1], width: 190, x: 80, y: -3, rotation: 2, depth: 0.7, floatSpeed: 6, floatDelay: 1.2 },
      { tablet: { x: 76, y: -2 }, mobile: { width: 150, x: 56, y: 72, depth: 0.3 } }),
    card("card-chart", "Chart card", { kind: "chart", ...COPY.analytics[2], width: 214, x: 86, y: 56, rotation: -1.5, depth: 1, floatSpeed: 8, floatDelay: 2 },
      { tablet: { x: 78, y: 62 }, mobile: { hidden: true } }),
    card("card-profile", "Profile card", { kind: "profile", ...COPY.analytics[3], width: 258, x: -12, y: 72, rotation: 1.5, depth: 0.8, floatDir: "diagonal", floatAmp: 8, floatSpeed: 10, floatDelay: 0.3 },
      { tablet: { x: -4, y: 74 }, mobile: { hidden: true } }),
    card("card-revenue", "Revenue card", { kind: "revenue", ...COPY.analytics[4], width: 240, x: 42, y: 90, rotation: 0, depth: 0.5, floatSpeed: 7.5, floatDelay: 1.6 },
      { tablet: { x: 40, y: 92 }, mobile: { hidden: true } }),
  ],
  animationSettings: { respectReducedMotion: true, choreography: "product-reveal" },
};
applyChoreographyData(defaults, choreographies["product-reveal"]);

const darkCards = (bg, fg) => KINDS_BY_INDEX.map(() => ({ bgColor: bg, textColor: fg, glass: true }));
const variations = {
  analytics: {
    label: "Analytics Dashboard", swatch: ["#07080f", "#4f46e5", "#7c5cff", "#06b6d4"],
    props: { backgroundColor: "#07080f", headingColor: "#f5f7ff", accentColor: "#7c5cff", textColor: "#a2a8c3", glowColor1: "#4f46e5", glowColor2: "#06b6d4", glowIntensity: 0.7, gridPattern: true, shapes: true },
    byType: { dashboard: { kind: "analytics", theme: "dark", borderColor: "#ffffff" }, card: withCopy("analytics", darkCards("#12141f", "#eef0fa")), button: [{ colorRole: "accent", textColor: "#ffffff", variant: "solid" }, { variant: "glass", colorRole: "heading" }] },
  },
  project: {
    label: "Project Management", swatch: ["#f6f4ef", "#ffffff", "#f97316", "#1c1917"],
    props: { backgroundColor: "#f6f4ef", headingColor: "#1c1917", accentColor: "#f97316", textColor: "#57534e", glowColor1: "#fdba74", glowColor2: "#fde68a", glowIntensity: 0.55, gridPattern: true, shapes: true },
    byType: { dashboard: { kind: "project", theme: "light", borderColor: "#1c1917" }, card: withCopy("project", darkCards("#ffffff", "#1c1917")), button: [{ colorRole: "heading", textColor: "#ffffff", variant: "solid" }, { variant: "outline", colorRole: "heading" }] },
  },
  finance: {
    label: "Finance Dashboard", swatch: ["#04110d", "#064e3b", "#10b981", "#d1fae5"],
    props: { backgroundColor: "#04110d", headingColor: "#ecfdf5", accentColor: "#10b981", textColor: "#9fc4b6", glowColor1: "#047857", glowColor2: "#14b8a6", glowIntensity: 0.65, gridPattern: true, shapes: true },
    byType: { dashboard: { kind: "finance", theme: "dark", borderColor: "#ffffff" }, card: withCopy("finance", darkCards("#0b1a15", "#ecfdf5")), button: [{ colorRole: "accent", textColor: "#022c22", variant: "solid" }, { variant: "glass", colorRole: "heading" }] },
  },
  crm: {
    label: "CRM Interface", swatch: ["#060b1a", "#1d4ed8", "#3b82f6", "#ffffff"],
    props: { backgroundColor: "#060b1a", headingColor: "#f1f5ff", accentColor: "#3b82f6", textColor: "#9fb0d0", glowColor1: "#1d4ed8", glowColor2: "#8b5cf6", glowIntensity: 0.7, gridPattern: false, shapes: true },
    byType: { dashboard: { kind: "crm", theme: "light", borderColor: "#ffffff" }, card: withCopy("crm", darkCards("#ffffff", "#0f172a")), button: [{ colorRole: "accent", textColor: "#ffffff", variant: "solid" }, { variant: "glass", colorRole: "heading" }] },
  },
  minimal: {
    label: "Minimal Product Preview", swatch: ["#fafafa", "#ffffff", "#111827", "#e5e7eb"],
    props: { backgroundColor: "#fafafa", headingColor: "#0a0a0a", accentColor: "#111827", textColor: "#6b7280", glowColor1: "#e5e7eb", glowColor2: "#f3f4f6", glowIntensity: 0.4, gridPattern: true, shapes: false },
    byType: { dashboard: { kind: "minimal", theme: "light", borderColor: "#0a0a0a" }, card: withCopy("minimal", darkCards("#ffffff", "#0a0a0a")), button: [{ colorRole: "heading", textColor: "#ffffff", variant: "solid" }, { variant: "outline", colorRole: "heading" }] },
  },
};

const DASH_KINDS = [{ value: "analytics", label: "Analytics" }, { value: "project", label: "Project management" }, { value: "finance", label: "Finance" }, { value: "crm", label: "CRM" }, { value: "minimal", label: "Minimal" }];
const CARD_KINDS = [{ value: "notification", label: "Notification" }, { value: "metric", label: "Metric" }, { value: "chart", label: "Small chart" }, { value: "profile", label: "Profile" }, { value: "activity", label: "Activity" }, { value: "revenue", label: "Revenue indicator" }];

export default {
  id: "floating-dashboard",
  name: "Floating Dashboard",
  category: "SaaS / Product",
  categories: ["SaaS / Product", "Premium"],
  description: "Product hero with a perspective dashboard, floating UI cards and mouse-reactive tilt.",
  tags: ["saas", "dashboard", "product", "startup", "app"],
  thumbnail: "live",
  defaults,
  choreographies,
  variations,
  supportedAnimations: ["entrance", "emphasis", "exit", "hover", "scroll"],
  responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },

  elementTemplates: {
    card: { label: "Floating card", element: card("tmp", "Floating card", { kind: "activity", title: "Deploy succeeded", sub: "main · production", value: "2m", width: 230, x: 30, y: 40 }) },
    button: BUTTON_TEMPLATE,
  },

  editableProperties: [
    ...sectionColorFields(),
    { key: "glowColor1", label: "Glow color 1", type: "color", group: "Background" },
    { key: "glowColor2", label: "Glow color 2", type: "color", group: "Background" },
    { key: "glowIntensity", label: "Glow intensity", type: "range", min: 0, max: 1, step: 0.05, group: "Background" },
    { key: "gridPattern", label: "Grid pattern", type: "toggle", group: "Background" },
    { key: "gridOpacity", label: "Grid opacity", type: "range", min: 0, max: 0.3, step: 0.01, group: "Background", showIf: (p) => p.gridPattern },
    { key: "shapes", label: "Decorative shapes", type: "toggle", group: "Background" },
    { key: "tilt", label: "Tilt with mouse", type: "toggle", responsive: true, group: "Interaction" },
    { key: "tiltStrength", label: "Tilt strength", type: "range", min: 0, max: 20, step: 0.5, unit: "°", responsive: true, group: "Interaction", showIf: (p) => p.tilt },
    { key: "textWidth", label: "Text column width", type: "range", min: 25, max: 60, step: 1, unit: "%", group: "Layout" },
    { key: "gap", label: "Column gap", type: "range", min: 0, max: 160, step: 2, unit: "px", responsive: true, group: "Layout" },
    ...sectionLayoutFields(),
  ],

  elementSchemas: {
    background: [
      { key: "backgroundColor", scope: "section", label: "Base color", type: "color", group: "Fill" },
      { key: "glowColor1", scope: "section", label: "Glow color 1", type: "color", group: "Fill" },
      { key: "glowColor2", scope: "section", label: "Glow color 2", type: "color", group: "Fill" },
      { key: "glowIntensity", scope: "section", label: "Glow intensity", type: "range", min: 0, max: 1, step: 0.05, group: "Fill" },
      { key: "gridPattern", scope: "section", label: "Grid pattern", type: "toggle", group: "Pattern" },
      { key: "shapes", scope: "section", label: "Decorative shapes", type: "toggle", group: "Pattern" },
      { key: "imageUrl", label: "Background image", type: "image", group: "Image" },
      { key: "imageOpacity", label: "Image opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Image" },
    ],
    dashboard: [
      { key: "kind", label: "Dashboard type", type: "select", options: DASH_KINDS, group: "Content" },
      { key: "theme", label: "Theme", type: "segmented", options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }], group: "Content" },
      { key: "imageUrl", label: "Screenshot (replaces mock)", type: "image", group: "Content" },
      { key: "width", label: "Width", type: "range", min: 240, max: 1400, step: 2, unit: "px", responsive: true, group: "Size & position" },
      { key: "height", label: "Height", type: "range", min: 160, max: 1000, step: 2, unit: "px", responsive: true, group: "Size & position" },
      { key: "x", label: "Offset X", type: "range", min: -400, max: 400, step: 1, unit: "px", responsive: true, group: "Size & position" },
      { key: "y", label: "Offset Y", type: "range", min: -300, max: 300, step: 1, unit: "px", responsive: true, group: "Size & position" },
      { key: "perspective", label: "Perspective", type: "range", min: 400, max: 4000, step: 50, unit: "px", responsive: true, group: "3D" },
      { key: "rotateX", label: "Rotate X", type: "range", min: -45, max: 45, step: 0.5, unit: "°", responsive: true, group: "3D" },
      { key: "rotateY", label: "Rotate Y", type: "range", min: -45, max: 45, step: 0.5, unit: "°", responsive: true, group: "3D" },
      { key: "rotateZ", label: "Rotate Z", type: "range", min: -20, max: 20, step: 0.5, unit: "°", responsive: true, group: "3D" },
      { key: "radius", label: "Corner radius", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Frame" },
      { key: "borderColor", label: "Border color", type: "color", group: "Frame" },
      { key: "borderOpacity", label: "Border opacity", type: "range", min: 0, max: 1, step: 0.01, group: "Frame" },
      { key: "shadow", label: "Shadow", type: "range", min: 0, max: 1, step: 0.05, group: "Frame" },
      { key: "opacity", label: "Opacity", type: "range", min: 0, max: 1, step: 0.05, group: "Frame" },
      ...floatFields(),
      hideField(),
    ],
    card: [
      { key: "kind", label: "Card type", type: "select", options: CARD_KINDS, group: "Content" },
      { key: "title", label: "Title", type: "text", group: "Content" },
      { key: "value", label: "Value", type: "text", group: "Content" },
      { key: "sub", label: "Subtitle", type: "text", group: "Content", showIf: (p) => ["notification", "profile", "activity"].includes(p.kind) },
      { key: "delta", label: "Change (e.g. +12%)", type: "text", group: "Content", showIf: (p) => ["metric", "chart", "revenue"].includes(p.kind) },
      { key: "bgColor", label: "Background", type: "color", group: "Style" },
      { key: "textColor", label: "Text color", type: "color", group: "Style" },
      { key: "glass", label: "Frosted glass", type: "toggle", group: "Style" },
      { key: "shadow", label: "Shadow", type: "range", min: 0, max: 1, step: 0.05, group: "Style" },
      { key: "width", label: "Width", type: "range", min: 120, max: 420, step: 2, unit: "px", responsive: true, group: "Size & position" },
      { key: "x", label: "X position", type: "range", min: -30, max: 110, step: 0.5, unit: "%", responsive: true, group: "Size & position" },
      { key: "y", label: "Y position", type: "range", min: -30, max: 110, step: 0.5, unit: "%", responsive: true, group: "Size & position" },
      { key: "rotation", label: "Rotation", type: "range", min: -20, max: 20, step: 0.5, unit: "°", responsive: true, group: "Size & position" },
      { key: "depth", label: "Parallax depth", type: "range", min: 0, max: 1, step: 0.05, group: "Size & position" },
      ...floatFields(),
      hideField(),
    ],
    meta: [...textFields({ max: 28, multiline: false }), { key: "pill", label: "Badge style", type: "toggle", group: "Colors" }],
    heading: [...textFields({ max: 140, glow: true })],
    text: [...textFields({ max: 40 })],
    button: buttonFields(),
  },
};
