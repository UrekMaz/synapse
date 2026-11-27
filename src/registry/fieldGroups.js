export const COLOR_ROLES = [
  { value: "heading", label: "Heading color" }, { value: "accent", label: "Accent color" },
  { value: "text", label: "Supporting text color" }, { value: "background", label: "Background color" },
  { value: "custom", label: "Custom…" },
];
const WEIGHTS = [300, 400, 500, 600, 700, 800, 900].map((w) => ({ value: w, label: String(w) }));

export const colorRoleFields = (group = "Colors") => [
  { key: "colorRole", label: "Color", type: "select", options: COLOR_ROLES, group },
  { key: "customColor", label: "Custom color", type: "color", group, showIf: (p) => p.colorRole === "custom" },
];

export const typographyFields = ({ max = 420 } = {}) => [
  { key: "fontFamily", label: "Font family", type: "font", group: "Typography" },
  { key: "fontSize", label: "Size", type: "range", min: 8, max, step: 1, unit: "px", responsive: true, group: "Typography" },
  { key: "fontWeight", label: "Weight", type: "select", options: WEIGHTS, group: "Typography" },
  { key: "lineHeight", label: "Line height", type: "range", min: 0.6, max: 2, step: 0.01, group: "Typography" },
  { key: "letterSpacing", label: "Letter spacing", type: "range", min: -0.1, max: 0.4, step: 0.005, unit: "em", group: "Typography" },
  { key: "textTransform", label: "Case", type: "segmented", options: [{ value: "none", label: "Aa" }, { value: "uppercase", label: "AA" }, { value: "lowercase", label: "aa" }], group: "Typography" },
  { key: "align", label: "Alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }], group: "Typography" },
];

export const placementFields = (group = "Position") => [
  { key: "offsetX", label: "Offset X", type: "range", min: -900, max: 900, step: 1, unit: "px", responsive: true, group },
  { key: "offsetY", label: "Offset Y", type: "range", min: -400, max: 400, step: 1, unit: "px", responsive: true, group },
  { key: "rotation", label: "Rotation", type: "range", min: -45, max: 45, step: 0.5, unit: "°", responsive: true, group },
  { key: "overlap", label: "Overlap (top margin)", type: "range", min: -300, max: 100, step: 1, unit: "px", responsive: true, group },
];
/* ---------- Shared by the signature heroes ---------- */
export const hideField = (group = "Visibility") => ({ key: "hidden", label: "Hide on this breakpoint", type: "toggle", responsive: true, group });

const VARIANTS = [{ value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }, { value: "glass", label: "Glass" }, { value: "text", label: "Text" }];
const HOVERS = [{ value: "lift", label: "Lift" }, { value: "glow", label: "Glow" }, { value: "scale", label: "Scale" }, { value: "brighten", label: "Brighten" }, { value: "none", label: "None" }];

export const buttonFields = () => [
  { key: "text", label: "Label", type: "text", group: "Content" },
  { key: "href", label: "Link", type: "link", group: "Content" },
  { key: "variant", label: "Style", type: "segmented", options: VARIANTS, group: "Style" },
  { key: "size", label: "Size", type: "segmented", options: [{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }], group: "Style" },
  ...colorRoleFields("Style"),
  { key: "bgColor", label: "Background override", type: "color", group: "Style" },
  { key: "textColor", label: "Text color override", type: "color", group: "Style" },
  { key: "radius", label: "Corner radius", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Shape" },
  { key: "paddingX", label: "Padding X", type: "range", min: 6, max: 60, step: 1, unit: "px", responsive: true, group: "Shape" },
  { key: "paddingY", label: "Padding Y", type: "range", min: 4, max: 30, step: 1, unit: "px", responsive: true, group: "Shape" },
  { key: "fontFamily", label: "Font", type: "font", group: "Typography" },
  { key: "fontSize", label: "Font size", type: "range", min: 10, max: 24, step: 1, unit: "px", responsive: true, group: "Typography" },
  { key: "uppercase", label: "Uppercase", type: "toggle", group: "Typography" },
  { key: "arrow", label: "Show arrow", type: "toggle", group: "Typography" },
  { key: "hover", label: "Hover effect", type: "select", options: HOVERS, group: "Interaction" },
  hideField(),
];

export const textFields = ({ max = 160, multiline = true, glow = false } = {}) => [
  { key: "text", label: "Text", type: multiline ? "textarea" : "text", group: "Content" },
  ...typographyFields({ max }),
  ...colorRoleFields(),
  ...(glow ? [{ key: "glow", label: "Glow", type: "range", min: 0, max: 1, step: 0.05, group: "Colors" }] : []),
  { key: "maxWidth", label: "Max width (0 = auto)", type: "range", min: 0, max: 1400, step: 10, unit: "px", responsive: true, group: "Position" },
  { key: "offsetX", label: "Offset X", type: "range", min: -400, max: 400, step: 1, unit: "px", responsive: true, group: "Position" },
  { key: "offsetY", label: "Offset Y", type: "range", min: -300, max: 300, step: 1, unit: "px", responsive: true, group: "Position" },
  hideField(),
];

export const FLOAT_DIRS = [{ value: "vertical", label: "Vertical" }, { value: "horizontal", label: "Horizontal" }, { value: "diagonal", label: "Diagonal" }, { value: "orbit", label: "Orbit" }, { value: "none", label: "None" }];
export const floatFields = (group = "Motion") => [
  { key: "floatDir", label: "Float direction", type: "select", options: FLOAT_DIRS, group },
  { key: "floatAmp", label: "Float distance", type: "range", min: 0, max: 80, step: 1, unit: "px", group, showIf: (p) => p.floatDir !== "none" },
  { key: "floatSpeed", label: "Float cycle", type: "range", min: 2, max: 30, step: 0.5, unit: "s", group, showIf: (p) => p.floatDir !== "none" },
  { key: "floatDelay", label: "Float offset", type: "range", min: 0, max: 10, step: 0.1, unit: "s", group, showIf: (p) => p.floatDir !== "none" },
];
