// Shared data for the six navbar designs: defaults, element factories and the inspector schema.
import { el, btnEl, secondaryBtn, buttonFields, ICON_OPTIONS } from "../sections/shared/kit.js";
import { hideField } from "../../registry/fieldGroups.js";
import { applyChoreographyData } from "../../utils/choreography.js";

export const NAV_PROPS = {
  arrangement: "inline", linksAlign: "right",
  background: "$background", bgOpacity: 1, gradient: false, gradientFrom: "$background", gradientTo: "$surface", blur: 0,
  height: 76, paddingX: 32, fullWidth: false, maxWidth: "$container",
  borderBottom: true, borderColor: "$border", shadow: 0,
  linkFont: "$nav", linkSize: 15, linkWeight: 500, linkColor: "$navLink", linkHover: "$navHover", linkGap: 30, linkTransform: "none", linkTracking: 0,
  activeStyle: "underline", activeColor: "$navActive",
  ddBg: "$navDropdown", ddText: "$navDropdownText", ddWidth: 300, ddRadius: 16, ddShadow: 0.22, ddBorder: "$border", ddTrigger: "hover", ddAnimation: "slide",
  position: "sticky", overlay: false, hideOnScroll: false, showOnScrollUp: true, revealOnScroll: false,
  changeOnScroll: true, scrolledBg: "$background", scrolledOpacity: 0.86, scrolledBlur: 16, scrolledShadow: 0.12, scrolledText: "",
  collapseAt: "tablet", menuStyle: "drawer", menuAnimation: "slide", menuBg: "$background", menuText: "$text",
};
export const NAV_RESPONSIVE = { desktop: {}, tablet: { paddingX: 24 }, mobile: { height: 64, paddingX: 18 } };

export const logo = (props, responsive = {}) => el({
  id: "logo", type: "logo", label: "Logo",
  props: {
    kind: "text", text: "Northwind", imageUrl: "", width: 132, height: 32, href: "/", fontFamily: "$heading", fontSize: 21, fontWeight: 700,
    color: "", letterSpacing: -0.02, textTransform: "none", mark: "dot", markColor: "$primary", hidden: false, ...props,
  },
  responsive: { tablet: {}, mobile: { fontSize: 19, width: 112 }, ...responsive },
});

export const link = (n, label, props = {}) => el({
  id: `link-${n}`, type: "link", label: `Link · ${label}`,
  props: { label, href: `#${label.toLowerCase().replace(/\s+/g, "-")}`, active: false, dropdown: "none", items: [], columns: [], megaWidth: 760,
    promoTitle: "", promoText: "", promoImage: "", promoHref: "#", promoCta: "Learn more", hidden: false, ...props },
});
export const navIcon = (n, icon, label, props = {}) => el({
  id: `icon-${n}`, type: "navicon", label: `Icon · ${label}`,
  props: { icon, label, href: `/${label.toLowerCase()}`, badge: "", showLabel: false, hidden: false, ...props },
});
export const search = (props = {}) => el({
  id: "search", type: "search", label: "Search bar",
  props: { placeholder: "Search products, brands and more…", action: "/search", width: 420, hidden: false, ...props },
  responsive: { tablet: {}, mobile: { hidden: true } },
});
export const navBtn = (id, label, props) => btnEl(id, label, { size: "theme", hover: "lift", ...props });
export const ghostBtn = (id, label, props) => secondaryBtn(id, label, { borderColor: "transparent", hover: "brighten", ...props });

/* Navbar choreographies (data). "Slide Down" etc. are applied to the logo / links / actions. */
const stag = (base, n = 10, step = 0.06) => Array.from({ length: n }, (_, i) => (i === 0 ? base : { delay: +(base.delay + step * i).toFixed(2) }));
export const NAV_CHOREOS = {
  "slide-down": {
    label: "Slide Down", description: "The bar's content drops in from above.",
    byType: { logo: [{ preset: "slide-down", distance: 24, duration: 0.7, delay: 0.05, easing: "expo-out" }], link: stag({ preset: "slide-down", distance: 18, duration: 0.6, delay: 0.15, easing: "expo-out" }), navicon: stag({ preset: "slide-down", distance: 18, duration: 0.6, delay: 0.35 }, 5), search: [{ preset: "slide-down", distance: 18, duration: 0.6, delay: 0.2 }], button: stag({ preset: "slide-down", distance: 18, duration: 0.6, delay: 0.4 }, 3) },
  },
  "staggered-links": {
    label: "Staggered Link Entrance", description: "Links rise one after another.",
    byType: { logo: [{ preset: "fade-in", duration: 0.6, delay: 0 }], link: stag({ preset: "slide-up", distance: 14, duration: 0.6, delay: 0.1, easing: "expo-out" }, 10, 0.08), navicon: stag({ preset: "fade-in", duration: 0.5, delay: 0.5 }, 5), search: [{ preset: "fade-in", duration: 0.6, delay: 0.3 }], button: stag({ preset: "zoom-in", scale: 0.9, duration: 0.5, delay: 0.55, easing: "back-out" }, 3) },
  },
  "reveal-links": {
    label: "Reveal Navigation Links", description: "Each link slides up out of a mask.",
    byType: { logo: [{ preset: "clip-reveal", direction: "right", duration: 0.8, delay: 0 }], link: stag({ preset: "mask-up", duration: 0.7, delay: 0.15, easing: "expo-out" }, 10, 0.06), navicon: stag({ preset: "fade-in", duration: 0.5, delay: 0.45 }, 5), search: [{ preset: "fade-in", duration: 0.6, delay: 0.3 }], button: stag({ preset: "fade-in", duration: 0.6, delay: 0.5 }, 3) },
  },
  "fade-in": {
    label: "Fade In", description: "A quiet fade for the whole bar.",
    byType: { logo: [{ preset: "fade-in", duration: 0.8, delay: 0 }], link: [{ preset: "fade-in", duration: 0.8, delay: 0.1 }], navicon: [{ preset: "fade-in", duration: 0.8, delay: 0.1 }], search: [{ preset: "fade-in", duration: 0.8, delay: 0.1 }], button: [{ preset: "fade-in", duration: 0.8, delay: 0.15 }] },
  },
};

/* ---------- Inspector ---------- */
const DD_ITEM = [
  { key: "label", label: "Label", type: "text" }, { key: "href", label: "URL", type: "link" },
  { key: "description", label: "Description", type: "text" }, { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
];
export const NAV_SCHEMAS = {
  logo: [
    { key: "kind", label: "Logo type", type: "segmented", options: [{ value: "text", label: "Text" }, { value: "image", label: "Image" }], group: "Logo" },
    { key: "text", label: "Text", type: "text", group: "Logo", showIf: (p) => p.kind === "text" },
    { key: "imageUrl", label: "Logo image", type: "image", group: "Logo", showIf: (p) => p.kind === "image" },
    { key: "href", label: "Logo link", type: "link", group: "Logo" },
    { key: "width", label: "Width", type: "range", min: 24, max: 320, step: 1, unit: "px", responsive: true, group: "Size", showIf: (p) => p.kind === "image" },
    { key: "height", label: "Height", type: "range", min: 12, max: 120, step: 1, unit: "px", responsive: true, group: "Size", showIf: (p) => p.kind === "image" },
    { key: "fontFamily", label: "Font", type: "font", tokens: true, group: "Size", showIf: (p) => p.kind === "text" },
    { key: "fontSize", label: "Font size", type: "range", min: 10, max: 64, step: 1, unit: "px", responsive: true, group: "Size", showIf: (p) => p.kind === "text" },
    { key: "fontWeight", label: "Weight", type: "select", options: [300, 400, 500, 600, 700, 800, 900].map((w) => ({ value: w, label: String(w) })), group: "Size", showIf: (p) => p.kind === "text" },
    { key: "letterSpacing", label: "Letter spacing", type: "range", min: -0.1, max: 0.6, step: 0.005, unit: "em", group: "Size", showIf: (p) => p.kind === "text" },
    { key: "textTransform", label: "Case", type: "segmented", options: [{ value: "none", label: "Aa" }, { value: "uppercase", label: "AA" }], group: "Size", showIf: (p) => p.kind === "text" },
    { key: "color", label: "Color (empty = bar text color)", type: "color", tokens: true, group: "Style" },
    { key: "mark", label: "Brand mark", type: "select", options: [{ value: "none", label: "None" }, { value: "dot", label: "Dot" }, { value: "square", label: "Square" }, { value: "spark", label: "Spark" }], group: "Style", showIf: (p) => p.kind === "text" },
    { key: "markColor", label: "Mark color", type: "color", tokens: true, group: "Style", showIf: (p) => p.kind === "text" && p.mark !== "none" },
    { key: "offsetX", label: "Offset X", type: "range", min: -200, max: 200, step: 1, unit: "px", responsive: true, group: "Style" },
    hideField(),
  ],
  link: [
    { key: "label", label: "Label", type: "text", group: "Link" },
    { key: "href", label: "URL", type: "link", group: "Link" },
    { key: "active", label: "Active (current page)", type: "toggle", group: "Link" },
    { key: "dropdown", label: "Menu", type: "segmented", options: [{ value: "none", label: "None" }, { value: "list", label: "Dropdown" }, { value: "mega", label: "Mega menu" }], group: "Menu" },
    { key: "items", label: "Dropdown items", type: "list", itemLabel: "Item", itemFields: DD_ITEM, newItem: { label: "New item", href: "#", description: "", icon: "" }, group: "Menu", showIf: (p) => p.dropdown === "list" },
    { key: "columns", label: "Mega menu columns", type: "list", itemLabel: "Column", titleKey: "heading", group: "Menu", showIf: (p) => p.dropdown === "mega",
      itemFields: [{ key: "heading", label: "Column heading", type: "text" }, { key: "links", label: "Links", type: "list", itemLabel: "Link", itemFields: DD_ITEM, newItem: { label: "New link", href: "#", description: "", icon: "" } }],
      newItem: { heading: "New column", links: [] } },
    { key: "megaWidth", label: "Mega menu width", type: "range", min: 420, max: 1200, step: 10, unit: "px", group: "Menu", showIf: (p) => p.dropdown === "mega" },
    { key: "promoTitle", label: "Promo card title (empty = none)", type: "text", group: "Promo card", showIf: (p) => p.dropdown === "mega" },
    { key: "promoText", label: "Promo text", type: "textarea", group: "Promo card", showIf: (p) => p.dropdown === "mega" && p.promoTitle },
    { key: "promoImage", label: "Promo image", type: "image", group: "Promo card", showIf: (p) => p.dropdown === "mega" && p.promoTitle },
    { key: "promoCta", label: "Promo link label", type: "text", group: "Promo card", showIf: (p) => p.dropdown === "mega" && p.promoTitle },
    { key: "promoHref", label: "Promo URL", type: "link", group: "Promo card", showIf: (p) => p.dropdown === "mega" && p.promoTitle },
    hideField(),
  ],
  navicon: [
    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, group: "Icon" },
    { key: "label", label: "Label", type: "text", group: "Icon" },
    { key: "href", label: "URL", type: "link", group: "Icon" },
    { key: "badge", label: "Badge (e.g. cart count)", type: "text", group: "Icon" },
    { key: "showLabel", label: "Show label", type: "toggle", group: "Icon" },
    hideField(),
  ],
  search: [
    { key: "placeholder", label: "Placeholder", type: "text", group: "Search" },
    { key: "action", label: "Results page URL (?q=…)", type: "text", group: "Search" },
    { key: "width", label: "Width", type: "range", min: 160, max: 720, step: 10, unit: "px", responsive: true, group: "Search" },
    hideField(),
  ],
  button: [...buttonFields()],
};

const POS = [{ value: "static", label: "Static" }, { value: "sticky", label: "Sticky" }, { value: "fixed", label: "Fixed" }];
export const NAV_FIELDS = [
  { key: "arrangement", label: "Arrangement", type: "select", options: [{ value: "inline", label: "Logo · links · actions" }, { value: "centered", label: "Centered logo" }, { value: "two-row", label: "Two rows (store)" }], group: "Layout" },
  { key: "linksAlign", label: "Links alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }], group: "Layout", showIf: (p) => p.arrangement === "inline" },
  { key: "height", label: "Height", type: "range", min: 44, max: 140, step: 1, unit: "px", responsive: true, group: "Layout" },
  { key: "paddingX", label: "Side padding", type: "range", min: 0, max: 120, step: 1, unit: "px", responsive: true, group: "Layout" },
  { key: "fullWidth", label: "Full-width content", type: "toggle", group: "Layout" },
  { key: "background", label: "Background", type: "color", tokens: true, group: "Appearance" },
  { key: "bgOpacity", label: "Opacity (0 = transparent)", type: "range", min: 0, max: 1, step: 0.01, group: "Appearance" },
  { key: "gradient", label: "Gradient", type: "toggle", group: "Appearance" },
  { key: "gradientFrom", label: "Gradient from", type: "color", tokens: true, group: "Appearance", showIf: (p) => p.gradient },
  { key: "gradientTo", label: "Gradient to", type: "color", tokens: true, group: "Appearance", showIf: (p) => p.gradient },
  { key: "blur", label: "Backdrop blur", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Appearance" },
  { key: "borderBottom", label: "Bottom border", type: "toggle", group: "Appearance" },
  { key: "borderColor", label: "Border color", type: "color", tokens: true, group: "Appearance", showIf: (p) => p.borderBottom },
  { key: "shadow", label: "Shadow", type: "range", min: 0, max: 1, step: 0.05, group: "Appearance" },
  { key: "linkFont", label: "Link font", type: "font", tokens: true, group: "Links" },
  { key: "linkSize", label: "Link size", type: "range", min: 10, max: 22, step: 1, unit: "px", group: "Links" },
  { key: "linkWeight", label: "Link weight", type: "select", options: [300, 400, 500, 600, 700].map((w) => ({ value: w, label: String(w) })), group: "Links" },
  { key: "linkTransform", label: "Case", type: "segmented", options: [{ value: "none", label: "Aa" }, { value: "uppercase", label: "AA" }], group: "Links" },
  { key: "linkTracking", label: "Letter spacing", type: "range", min: 0, max: 0.4, step: 0.01, unit: "em", group: "Links" },
  { key: "linkGap", label: "Link spacing", type: "range", min: 4, max: 80, step: 1, unit: "px", group: "Links" },
  { key: "linkColor", label: "Link color", type: "color", tokens: true, group: "Links" },
  { key: "linkHover", label: "Hover color", type: "color", tokens: true, group: "Links" },
  { key: "activeStyle", label: "Active style", type: "segmented", options: [{ value: "underline", label: "Line" }, { value: "pill", label: "Pill" }, { value: "dot", label: "Dot" }, { value: "color", label: "Color" }], group: "Links" },
  { key: "activeColor", label: "Active color", type: "color", tokens: true, group: "Links" },
  { key: "ddTrigger", label: "Open dropdowns on", type: "segmented", options: [{ value: "hover", label: "Hover" }, { value: "click", label: "Click" }], group: "Dropdowns" },
  { key: "ddAnimation", label: "Dropdown reveal", type: "segmented", options: [{ value: "slide", label: "Slide" }, { value: "fade", label: "Fade" }, { value: "scale", label: "Scale" }], group: "Dropdowns" },
  { key: "ddWidth", label: "Dropdown width", type: "range", min: 180, max: 480, step: 10, unit: "px", group: "Dropdowns" },
  { key: "ddBg", label: "Dropdown background", type: "color", tokens: true, group: "Dropdowns" },
  { key: "ddText", label: "Dropdown text", type: "color", tokens: true, group: "Dropdowns" },
  { key: "ddBorder", label: "Dropdown border", type: "color", tokens: true, group: "Dropdowns" },
  { key: "ddRadius", label: "Dropdown radius", type: "range", min: 0, max: 32, step: 1, unit: "px", group: "Dropdowns" },
  { key: "ddShadow", label: "Dropdown shadow", type: "range", min: 0, max: 1, step: 0.05, group: "Dropdowns" },
  { key: "position", label: "Position", type: "segmented", options: POS, group: "Behaviour" },
  { key: "overlay", label: "Transparent over hero", type: "toggle", group: "Behaviour" },
  { key: "hideOnScroll", label: "Hide when scrolling down", type: "toggle", group: "Behaviour", showIf: (p) => p.position !== "static" },
  { key: "showOnScrollUp", label: "Show again when scrolling up", type: "toggle", group: "Behaviour", showIf: (p) => p.position !== "static" && p.hideOnScroll },
  { key: "revealOnScroll", label: "Only appear after scrolling", type: "toggle", group: "Behaviour", showIf: (p) => p.position !== "static" },
  { key: "changeOnScroll", label: "Change background on scroll", type: "toggle", group: "Behaviour" },
  { key: "scrolledBg", label: "Scrolled background", type: "color", tokens: true, group: "Behaviour", showIf: (p) => p.changeOnScroll },
  { key: "scrolledOpacity", label: "Scrolled opacity", type: "range", min: 0, max: 1, step: 0.01, group: "Behaviour", showIf: (p) => p.changeOnScroll },
  { key: "scrolledBlur", label: "Scrolled blur", type: "range", min: 0, max: 40, step: 1, unit: "px", group: "Behaviour", showIf: (p) => p.changeOnScroll },
  { key: "scrolledText", label: "Scrolled text color (empty = same)", type: "color", tokens: true, group: "Behaviour", showIf: (p) => p.changeOnScroll },
  { key: "collapseAt", label: "Collapse into menu on", type: "segmented", options: [{ value: "tablet", label: "Tablet & mobile" }, { value: "mobile", label: "Mobile only" }], group: "Mobile menu" },
  { key: "menuStyle", label: "Menu style", type: "segmented", options: [{ value: "drawer", label: "Drawer" }, { value: "fullscreen", label: "Full screen" }, { value: "dropdown", label: "Dropdown" }], group: "Mobile menu" },
  { key: "menuAnimation", label: "Menu animation", type: "segmented", options: [{ value: "slide", label: "Slide" }, { value: "fade", label: "Fade" }, { value: "scale", label: "Scale" }], group: "Mobile menu" },
  { key: "menuBg", label: "Menu background", type: "color", tokens: true, group: "Mobile menu" },
  { key: "menuText", label: "Menu text", type: "color", tokens: true, group: "Mobile menu" },
];

// Turns a design spec into a registry definition.
export function defineNavbar({ id, name, description, tags, props, responsive, elements, choreography = "slide-down", component }) {
  const defaults = {
    props: { ...NAV_PROPS, ...props },
    responsive: { ...NAV_RESPONSIVE, ...responsive },
    elements,
    animationSettings: { respectReducedMotion: true, choreography },
  };
  applyChoreographyData(defaults, NAV_CHOREOS[choreography]);
  return {
    id, name, description, tags, kind: "nav", library: "Navigation", categories: ["Navigation"], thumbnail: "live",
    defaults, choreographies: NAV_CHOREOS, component,
    supportedAnimations: ["entrance", "emphasis", "hover"],
    responsiveSettings: { breakpoints: { tablet: 1024, mobile: 640 } },
    elementTemplates: {
      link: { label: "Navigation link", element: link("tmp", "New link") },
      button: { label: "Button", element: navBtn("tmp", "Button", { text: "Contact" }) },
      navicon: { label: "Icon", element: navIcon("tmp", "heart", "Wishlist") },
    },
    editableProperties: NAV_FIELDS,
    elementSchemas: NAV_SCHEMAS,
  };
}
