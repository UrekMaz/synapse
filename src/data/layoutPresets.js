export const NARROW_MAX = 720;

export const VIEWPORTS = {
  desktop: { label: "Desktop", width: 1440 },
  tablet: { label: "Tablet", width: 820 },
  mobile: { label: "Mobile", width: 390 },
};

export const LAYOUT_PRESETS = [
  { id: "full", name: "Full Width", description: "Edge-to-edge content for modern websites.", width: "full", composition: "standard", recommended: true },
  { id: "boxed", name: "Boxed / Centered", description: "Content within a max-width container.", width: "boxed", composition: "standard" },
  { id: "narrow", name: "Narrow / Reading", description: "Focused content for blogs and articles.", width: "narrow", composition: "editorial" },
  { id: "split", name: "Split Layout", description: "Two-column structure with content and media.", width: "full", composition: "split" },
  { id: "sidebar", name: "Sidebar Layout", description: "Navigation with a main content area.", width: "full", composition: "sidebar" },
  { id: "bento", name: "Grid / Bento", description: "Modular grid-based layout for creative sites.", width: "boxed", composition: "bento" },
];

export const DEFAULT_DRAFT = {
  // What the project is: "portfolio" (default — starts from a ready-made portfolio) or "website" (blank page).
  siteType: "portfolio",
  ownerName: "",
  ownerRole: "",
  presetId: "full",
  name: "Untitled Page",
  width: "full",
  composition: "standard",
  maxWidth: 1280,
  columns: 12,
  columnGap: 24,
  sideMargin: 32,
  tabletColumns: 8,
  tabletMargin: 24,
  mobileColumns: 4,
  mobileMargin: 16,
};

export const WIDTH_OPTIONS = [
  { value: "full", label: "Full Width" },
  { value: "boxed", label: "Boxed" },
  { value: "narrow", label: "Narrow" },
];
export const COMPOSITION_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "split", label: "Split" },
  { value: "sidebar", label: "Sidebar" },
  { value: "editorial", label: "Editorial" },
  { value: "bento", label: "Bento" },
];
export const MAX_WIDTH_OPTIONS = [1200, 1280, 1440];
export const COLUMN_OPTIONS = [4, 8, 12];
export const GAP_OPTIONS = [16, 24, 32];
export const MARGIN_OPTIONS = [16, 32, 64];