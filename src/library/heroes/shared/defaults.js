// Element factories shared by the signature heroes. Everything here is plain serializable data.
export const el = (extra) => ({ visible: true, responsive: { tablet: {}, mobile: {} }, animation: null, ...extra });

const TEXT_BASE = { offsetX: 0, offsetY: 0, rotation: 0, textTransform: "none", colorRole: "heading", customColor: "#ffffff", glow: 0, hidden: false };

export const heading = (props, responsive) => el({
  id: "heading", type: "heading", label: "Heading",
  props: { ...TEXT_BASE, fontFamily: "Inter", fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: -0.045, align: "center", maxWidth: 980, ...props },
  responsive: { tablet: {}, mobile: {}, ...responsive },
});

export const subtitle = (props, responsive) => el({
  id: "subtitle", type: "text", label: "Subtitle",
  props: { ...TEXT_BASE, fontFamily: "Inter", fontSize: 20, fontWeight: 400, lineHeight: 1.5, letterSpacing: -0.005, align: "center", colorRole: "text", maxWidth: 540, ...props },
  responsive: { tablet: {}, mobile: {}, ...responsive },
});

export const eyebrow = (props, responsive) => el({
  id: "eyebrow", type: "meta", label: "Eyebrow",
  props: { ...TEXT_BASE, fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 500, lineHeight: 1.3, letterSpacing: 0.2, textTransform: "uppercase", align: "center", colorRole: "accent", maxWidth: 0, ...props },
  responsive: { tablet: {}, mobile: { fontSize: 10 }, ...responsive },
});

export const button = (id, label, props, responsive) => el({
  id, type: "button", label,
  props: {
    text: "Learn more", href: "#", variant: "solid", colorRole: "heading", customColor: "#ffffff", bgColor: "", textColor: "",
    radius: 999, size: "lg", fontFamily: "Inter", fontSize: 15, uppercase: false, arrow: true, hover: "glow", hidden: false, ...props,
  },
  responsive: { tablet: {}, mobile: {}, ...responsive },
});

export const BUTTON_TEMPLATE = {
  label: "Button",
  element: button("tmp", "Button", { text: "New button", variant: "outline", arrow: false }),
};

// Section-level colour + layout fields shared by every signature hero.
export const sectionColorFields = () => [
  { key: "backgroundColor", label: "Background", type: "color", group: "Colors" },
  { key: "headingColor", label: "Heading color", type: "color", group: "Colors" },
  { key: "accentColor", label: "Accent color", type: "color", group: "Colors" },
  { key: "textColor", label: "Supporting text color", type: "color", group: "Colors" },
];
export const sectionLayoutFields = () => [
  { key: "minHeight", label: "Hero height", type: "range", min: 420, max: 1300, step: 10, unit: "px", responsive: true, group: "Layout" },
  { key: "paddingX", label: "Side padding", type: "range", min: 0, max: 160, step: 2, unit: "px", responsive: true, group: "Layout" },
  { key: "paddingY", label: "Vertical padding", type: "range", min: 0, max: 200, step: 2, unit: "px", responsive: true, group: "Layout" },
];
