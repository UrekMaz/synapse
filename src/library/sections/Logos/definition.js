import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, variantField, defineSection, responsive, ICON_OPTIONS } from "../shared/kit.js";

const BRANDS = [
  ["Northwind", "compass", "Inter", 700], ["Globex", "globe", "Outfit", 600], ["Initech", "cpu", "Space Grotesk", 600], ["Umbrella", "shield", "Manrope", 800],
  ["Hooli", "infinity", "DM Sans", 700], ["Vandelay", "building", "Fraunces", 600], ["Stark", "zap", "Archivo Black", 400], ["Pied Piper", "feather", "Playfair Display", 700],
];
const logo = (n, [name, glyph, font, weight]) => el({
  id: `logo-${n}`, type: "logo", label: `Logo · ${name}`,
  props: { name, imageUrl: "", href: "", width: 0, glyph, font, weight, hidden: false },
});

export default defineSection({
  id: "logos", name: "Logo Cloud", library: "Logos",
  description: "Show who trusts you — a quiet row, a bordered grid or an endless marquee.",
  tags: ["logos", "clients", "trusted by", "brands", "marquee", "social proof"],
  choreoTypes: ["logo"],
  defaults: {
    props: shellDefaults({ variant: "row", logoHeight: 28, gap: 56, columns: 4, grayscale: true, opacity: 0.6, colorOnHover: true, marqueeSpeed: 32, loop: true, pauseOnHover: true, fadeEdges: true, paddingY: 80 }),
    responsive: responsive({ columns: 3, gap: 40 }, { columns: 2, logoHeight: 22, gap: 28, paddingY: 56 }),
    elements: [
      ...header({ eyebrow: null, heading: "Trusted by 12,000+ fast-moving teams", subtitle: null }).map((e) => ({ ...e, props: { ...e.props, fontSize: "$h3", color: "$muted", fontWeight: 500 } })),
      ...BRANDS.map((b, i) => logo(i + 1, b)),
    ],
  },
  variations: {
    row: { label: "Horizontal logo row", props: { variant: "row", gap: 56 } },
    grid: { label: "Multi-row logo grid", description: "Bordered cells, four or five across.", props: { variant: "grid", columns: 4 } },
    marquee: { label: "Animated logo marquee", description: "An endless, smooth scrolling strip.", props: { variant: "marquee", gap: 72, loop: true } },
  },
  elementTemplates: { logo: { label: "Logo", element: logo("tmp", ["Your brand", "sparkles", "Inter", 700]) } },
  editableProperties: [
    variantField([{ value: "row", label: "Row" }, { value: "grid", label: "Grid" }, { value: "marquee", label: "Marquee" }]),
    { key: "logoHeight", label: "Logo height", type: "range", min: 12, max: 80, step: 1, unit: "px", responsive: true, group: "Logos" },
    { key: "gap", label: "Spacing", type: "range", min: 8, max: 140, step: 2, unit: "px", responsive: true, group: "Logos" },
    { key: "columns", label: "Columns", type: "range", min: 2, max: 8, step: 1, responsive: true, group: "Logos", showIf: (p) => p.variant === "grid" },
    { key: "grayscale", label: "Grayscale", type: "toggle", group: "Logos" },
    { key: "opacity", label: "Opacity", type: "range", min: 0.2, max: 1, step: 0.05, group: "Logos" },
    { key: "colorOnHover", label: "Full color on hover", type: "toggle", group: "Logos" },
    { key: "marqueeSpeed", label: "Marquee loop duration", type: "range", min: 6, max: 120, step: 1, unit: "s", group: "Marquee", showIf: (p) => p.variant === "marquee" },
    { key: "loop", label: "Loop forever", type: "toggle", group: "Marquee", showIf: (p) => p.variant === "marquee" },
    { key: "pauseOnHover", label: "Pause on hover", type: "toggle", group: "Marquee", showIf: (p) => p.variant === "marquee" },
    { key: "fadeEdges", label: "Fade edges", type: "toggle", group: "Marquee", showIf: (p) => p.variant === "marquee" },
    ...shellFields(),
  ],
  elementSchemas: {
    logo: [
      { key: "imageUrl", label: "Logo image (SVG/PNG)", type: "image", group: "Logo" },
      { key: "name", label: "Name (wordmark if no image)", type: "text", group: "Logo" },
      { key: "glyph", label: "Wordmark icon", type: "select", options: ICON_OPTIONS, group: "Logo", showIf: (p) => !p.imageUrl },
      { key: "width", label: "Width (0 = auto)", type: "range", min: 0, max: 320, step: 1, unit: "px", group: "Logo", showIf: (p) => !!p.imageUrl },
      { key: "href", label: "Link (optional)", type: "link", group: "Logo" },
      hideField(),
    ],
    heading: textFields({ max: 80 }), meta: textFields({ max: 30, multiline: false }), text: textFields({ max: 30 }),
  },
});
