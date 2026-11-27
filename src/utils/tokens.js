import { FONTS } from "./fonts.js";
import { contrast, darken, hoverOf, isDark, lighten, mix, onColor } from "./color.js";

/*
 * Global design system (site-wide, stored on every page as page.theme and exposed as --syn-* CSS variables).
 * Element props link to it with "$token" strings — color: "$primary", fontFamily: "$heading", fontSize: "$h2",
 * cardRadius: "$card-radius"… A linked prop follows the theme; writing a concrete value is an override that
 * survives later theme changes until the user resets it.
 */

// Builds a complete theme from a compact spec, deriving every token that isn't given.
export function buildTheme(spec = {}) {
  const c = { ...spec.colors };
  const bg = c.background || "#ffffff";
  const dark = spec.mode ? spec.mode === "dark" : isDark(bg);
  const text = c.text || (dark ? "#eef0f6" : "#1b1d26");
  const primary = c.primary || "#5b5bf0";
  const colors = {
    primary,
    primaryHover: c.primaryHover || hoverOf(primary),
    secondary: c.secondary || (dark ? lighten(bg, 0.1) : "#0f172a"),
    accent: c.accent || primary,
    background: bg,
    backgroundAlt: c.backgroundAlt || (dark ? lighten(bg, 0.04) : darken(bg, 0.025)),
    surface: c.surface || (dark ? lighten(bg, 0.06) : darken(bg, 0.03)),
    surfaceElevated: c.surfaceElevated || (dark ? lighten(bg, 0.1) : "#ffffff"),
    headingText: c.headingText || text,
    text,
    muted: c.muted || mix(text, bg, 0.38),
    border: c.border || mix(text, bg, dark ? 0.84 : 0.88),
    divider: c.divider || mix(text, bg, dark ? 0.88 : 0.92),
    success: c.success || "#16a34a", warning: c.warning || "#d97706", error: c.error || "#dc2626",
    buttonText: c.buttonText || onColor(primary),
  };
  const ty = spec.typography || {};
  const typography = {
    heading: "Inter", body: "Inter", accent: ty.heading || "Inter", nav: ty.body || "Inter", button: ty.body || "Inter",
    headingWeight: 650, bodyWeight: 400, h1: 64, h2: 44, h3: 22, h4: 18, bodyLarge: 19, bodySize: 17, bodySmall: 15, caption: 13,
    headingLineHeight: 1.08, bodyLineHeight: 1.6, headingTracking: -0.03, bodyTracking: 0, headingCase: "none",
    ...ty,
  };
  const footerBg = spec.footer?.background || (dark ? darken(bg, 0.35) : colors.secondary);
  const footerText = onColor(footerBg, "#f4f5f8", "#14151b");
  return {
    id: spec.id || "custom", name: spec.name || "Custom theme", mode: dark ? "dark" : "light",
    description: spec.description || "", tags: spec.tags || [], collection: spec.collection || "Custom", artist: spec.artist || "",
    colors, typography,
    buttons: { radius: 12, paddingX: 22, paddingY: 13, fontSize: 15, fontWeight: 600, hover: "lift", uppercase: false, secondaryStyle: "outline", ...spec.buttons },
    cards: { radius: 20, shadow: dark ? 0 : 0.1, borderWidth: 1, padding: 28, hover: "lift", blur: 0, ...spec.cards },
    forms: { inputBg: dark ? lighten(bg, 0.05) : "#ffffff", inputText: text, inputBorder: colors.border, placeholder: colors.muted, focus: primary, radius: 12, ...spec.forms },
    nav: { link: text, hover: primary, active: primary, dropdownBg: colors.surfaceElevated, dropdownText: text, ...spec.nav },
    sections: { section: 112, container: 1200, gap: 28, padding: 32, alternate: false, dividers: false, ...spec.sections },
    footer: { background: footerBg, text: footerText, muted: mix(footerText, footerBg, 0.38), line: mix(footerText, footerBg, 0.86), ...spec.footer },
    effects: { gradientFrom: primary, gradientTo: colors.accent, sectionGradient: false, glow: 0.4, grain: 0, pattern: "none", ...spec.effects },
    ...(spec.experience ? { experience: spec.experience } : {}),
  };
}

export const DEFAULT_THEME = buildTheme({
  id: "synapse-default", name: "Synapse Default", description: "Clean indigo on white.",
  colors: { primary: "#5b5bf0", secondary: "#0f172a", accent: "#f59e0b", background: "#ffffff", surface: "#f6f7fb", text: "#0b1020", muted: "#5b6478", border: "#e4e7ef", buttonText: "#ffffff" },
});

// Older saved themes (colors/typography/buttons/spacing only) are filled in and kept compatible.
export function resolveTheme(t) {
  if (!t) return DEFAULT_THEME;
  if (t.cards && t.forms && t.nav && t.footer && t.effects && t.sections) return t;
  const base = buildTheme({ ...t, sections: { ...t.spacing, ...t.sections } });
  return {
    ...base, ...t,
    colors: { ...base.colors, ...t.colors }, typography: { ...base.typography, ...t.typography }, buttons: { ...base.buttons, ...t.buttons },
    sections: { ...base.sections, ...t.spacing, ...t.sections }, cards: base.cards, forms: base.forms, nav: base.nav, footer: base.footer, effects: base.effects,
  };
}

// Same identity, night palette — used by the Theme Studio's dark preview / "use dark variant".
export function darkVariant(theme) {
  const t = resolveTheme(theme);
  if (t.mode === "dark") return t;
  const bg = mix(t.colors.secondary, "#05060a", 0.55);
  return buildTheme({
    ...t, id: `${t.id}-dark`, name: `${t.name} · Dark`, mode: "dark",
    colors: { primary: contrast(t.colors.primary, bg) < 3 ? lighten(t.colors.primary, 0.3) : t.colors.primary, accent: t.colors.accent, background: bg, secondary: lighten(bg, 0.08) },
    typography: t.typography, buttons: t.buttons, cards: { ...t.cards, shadow: 0 }, sections: t.sections, effects: t.effects, forms: undefined, nav: undefined, footer: undefined,
  });
}

const fontStackOf = (n) => {
  const f = FONTS.find((x) => x.name === n);
  return f ? `'${f.name}', ${f.fallback}` : n;
};
const fluid = (size, minRatio) => `clamp(${Math.round(size * minRatio)}px, ${(size / 14.4).toFixed(3)}cqw, ${size}px)`;
const shadowOf = (s) => (s ? `0 ${Math.round(30 * s)}px ${Math.round(60 * s)}px -${Math.round(24 * s)}px rgba(15,23,42,${(0.12 + 0.22 * s).toFixed(2)})` : "none");

export function themeCssVars(theme) {
  const t = resolveTheme(theme);
  const ty = t.typography;
  return {
    ...Object.fromEntries(Object.entries(t.colors).map(([k, v]) => [`--syn-${k}`, v])),
    "--syn-font-heading": fontStackOf(ty.heading), "--syn-font-body": fontStackOf(ty.body), "--syn-font-accent": fontStackOf(ty.accent),
    "--syn-font-nav": fontStackOf(ty.nav), "--syn-font-button": fontStackOf(ty.button),
    "--syn-weight-heading": ty.headingWeight, "--syn-weight-body": ty.bodyWeight,
    // Headings scale with the section width (hero-host is a size container), never above the chosen size.
    "--syn-h1": fluid(ty.h1, 0.56), "--syn-h2": fluid(ty.h2, 0.64), "--syn-h3": fluid(ty.h3, 0.82), "--syn-h4": `${ty.h4}px`,
    "--syn-body-lg": `${ty.bodyLarge}px`, "--syn-body-size": `${ty.bodySize}px`, "--syn-body-sm": `${ty.bodySmall}px`, "--syn-small": `${ty.bodySmall}px`, "--syn-caption": `${ty.caption}px`,
    "--syn-lh-heading": ty.headingLineHeight, "--syn-lh-body": ty.bodyLineHeight,
    "--syn-track-heading": `${ty.headingTracking}em`, "--syn-track-body": `${ty.bodyTracking}em`, "--syn-heading-case": ty.headingCase,
    "--syn-btn-radius": `${t.buttons.radius}px`, "--syn-btn-px": `${t.buttons.paddingX}px`, "--syn-btn-py": `${t.buttons.paddingY}px`,
    "--syn-btn-size": `${t.buttons.fontSize}px`, "--syn-btn-weight": t.buttons.fontWeight, "--syn-btn-case": t.buttons.uppercase ? "uppercase" : "none",
    "--syn-card-radius": `${t.cards.radius}px`, "--syn-card-shadow": shadowOf(t.cards.shadow), "--syn-card-border": `${t.cards.borderWidth}px`,
    "--syn-card-pad": `${t.cards.padding}px`, "--syn-card-blur": t.cards.blur ? `blur(${t.cards.blur}px) saturate(150%)` : "none",
    "--syn-input-bg": t.forms.inputBg, "--syn-input-text": t.forms.inputText, "--syn-input-border": t.forms.inputBorder,
    "--syn-input-placeholder": t.forms.placeholder, "--syn-input-focus": t.forms.focus, "--syn-input-radius": `${t.forms.radius}px`,
    "--syn-navLink": t.nav.link, "--syn-navHover": t.nav.hover, "--syn-navActive": t.nav.active, "--syn-navDropdown": t.nav.dropdownBg, "--syn-navDropdownText": t.nav.dropdownText,
    "--syn-footerBg": t.footer.background, "--syn-footerText": t.footer.text, "--syn-footerMuted": t.footer.muted, "--syn-footerLine": t.footer.line,
    "--syn-section": `${t.sections.section}px`, "--syn-container": `${t.sections.container}px`, "--syn-gap": `${t.sections.gap}px`, "--syn-pad": `${t.sections.padding}px`,
    "--syn-gradient": `linear-gradient(135deg, ${t.effects.gradientFrom}, ${t.effects.gradientTo})`,
    "--syn-glow": `color-mix(in srgb, ${t.colors.primary} ${Math.round(t.effects.glow * 60)}%, transparent)`, "--syn-grain": t.effects.grain,
  };
}

export const isToken = (v) => typeof v === "string" && v.startsWith("$");

// Token → CSS value. Concrete values pass through untouched.
const VAR = {
  heading: "var(--syn-font-heading)", body: "var(--syn-font-body)", accentFont: "var(--syn-font-accent)", nav: "var(--syn-font-nav)", button: "var(--syn-font-button)",
  h1: "var(--syn-h1)", h2: "var(--syn-h2)", h3: "var(--syn-h3)", h4: "var(--syn-h4)", "body-lg": "var(--syn-body-lg)", "body-size": "var(--syn-body-size)",
  "body-sm": "var(--syn-body-sm)", small: "var(--syn-small)", caption: "var(--syn-caption)",
  section: "var(--syn-section)", container: "var(--syn-container)", gap: "var(--syn-gap)", pad: "var(--syn-pad)", radius: "var(--syn-btn-radius)",
};
export function css(v, fallback) {
  if (v == null || v === "") return fallback;
  if (!isToken(v)) return v;
  const k = v.slice(1);
  return VAR[k] || `var(--syn-${k})`;
}
export const px = (v, fallback) => (typeof v === "number" ? `${v}px` : css(v, fallback));

// The concrete theme value behind a token (used when the user "customizes" a linked prop).
export function tokenValue(v, theme) {
  if (!isToken(v)) return v;
  const t = resolveTheme(theme);
  const k = v.slice(1);
  const ty = t.typography;
  if (k in t.colors) return t.colors[k];
  const MAP = {
    heading: ty.heading, body: ty.body, accentFont: ty.accent, nav: ty.nav, button: ty.button,
    h1: ty.h1, h2: ty.h2, h3: ty.h3, h4: ty.h4, "body-lg": ty.bodyLarge, "body-size": ty.bodySize, "body-sm": ty.bodySmall, small: ty.bodySmall, caption: ty.caption,
    "weight-heading": ty.headingWeight, "weight-body": ty.bodyWeight, "lh-heading": ty.headingLineHeight, "lh-body": ty.bodyLineHeight,
    "track-heading": ty.headingTracking, "track-body": ty.bodyTracking, "heading-case": ty.headingCase,
    section: t.sections.section, container: t.sections.container, gap: t.sections.gap, pad: t.sections.padding, radius: t.buttons.radius,
    "card-radius": t.cards.radius, "card-border": t.cards.borderWidth, "card-shadow": t.cards.shadow, "card-pad": t.cards.padding, "input-radius": t.forms.radius,
    navLink: t.nav.link, navHover: t.nav.hover, navActive: t.nav.active, navDropdown: t.nav.dropdownBg, navDropdownText: t.nav.dropdownText,
    footerBg: t.footer.background, footerText: t.footer.text, footerMuted: t.footer.muted, footerLine: t.footer.line,
  };
  return k in MAP ? MAP[k] : v;
}

const COLOR_TOKENS = ["primary", "primaryHover", "secondary", "accent", "background", "backgroundAlt", "surface", "surfaceElevated", "headingText", "text", "muted", "border", "divider", "success", "warning", "error", "buttonText",
  "navLink", "navHover", "navActive", "navDropdown", "navDropdownText", "footerBg", "footerText", "footerMuted", "footerLine"];
const LABEL = { headingText: "heading text", text: "body text", buttonText: "text on primary", backgroundAlt: "background 2", surfaceElevated: "elevated surface", primaryHover: "primary hover" };
export const THEME_TOKENS = { color: COLOR_TOKENS, font: ["heading", "body", "accentFont", "nav", "button"], size: ["h1", "h2", "h3", "h4", "body-lg", "body-size", "body-sm", "caption"] };

// Token options offered by the inspector per control type.
export const TOKEN_OPTIONS = {
  color: COLOR_TOKENS.map((k) => ({ value: `$${k}`, label: LABEL[k] || k.replace(/([A-Z])/g, " $1").toLowerCase() })),
  font: [{ value: "$heading", label: "Heading font" }, { value: "$body", label: "Body font" }, { value: "$accentFont", label: "Accent font" }, { value: "$nav", label: "Navigation font" }, { value: "$button", label: "Button font" }],
  size: [{ value: "$h1", label: "H1" }, { value: "$h2", label: "H2" }, { value: "$h3", label: "H3" }, { value: "$h4", label: "H4" }, { value: "$body-lg", label: "Body large" }, { value: "$body-size", label: "Body" }, { value: "$body-sm", label: "Body small" }, { value: "$caption", label: "Caption" }],
};
