/*
 * How each signature hero adopts the site theme. Heroes keep their own mood by default; Theme Studio can apply:
 *   "accent" — brand accent + theme fonts, the hero keeps its own background palette
 *   "full"   — background, text and accent all follow the theme
 * Returns a variation-style patch { props, byType } (plain data), applied with applyVariation.
 */
const FONTS = {
  "heading-line": { fontFamily: "$heading" }, heading: { fontFamily: "$heading" }, text: { fontFamily: "$body" },
  button: { fontFamily: "$button" },
};

const MAPS = {
  "typography-explosion": (full) => ({ props: full ? { backgroundColor: "$background", headingColor: "$headingText", accentColor: "$primary", textColor: "$text" } : { accentColor: "$primary" } }),
  "floating-universe": (full) => ({ props: full ? { backgroundColor: "$background", gradientFrom: "$backgroundAlt", gradientTo: "$background", headingColor: "$headingText", accentColor: "$primary", textColor: "$muted" } : { accentColor: "$primary" } }),
  "floating-dashboard": (full, t) => ({
    props: full ? { backgroundColor: "$background", headingColor: "$headingText", accentColor: "$primary", textColor: "$muted", glowColor1: "$primary", glowColor2: "$accent" } : { accentColor: "$primary", glowColor1: "$primary" },
    // Cards read their own colours to pick readable text, so they get concrete theme values.
    byType: full ? { dashboard: { theme: t.mode }, card: { bgColor: t.colors.surfaceElevated.startsWith("#") ? t.colors.surfaceElevated : t.colors.background, textColor: t.colors.text } } : {},
  }),
  "cinematic-reveal": (full) => ({ props: full ? { backgroundColor: "$background", headingColor: "$headingText", accentColor: "$primary", textColor: "$muted" } : { accentColor: "$primary" } }),
  "liquid-chrome": (full) => ({
    props: full ? { gradientFrom: "$secondary", gradientTo: "$background", backgroundColor: "$background", headingColor: "$headingText", accentColor: "$primary", textColor: "$muted" } : { accentColor: "$primary" },
    byType: { lighting: { lightColor: "$primary", reflectionColor: "$accent" } },
  }),
};

export function heroThemePatch(type, level, theme) {
  if (!level || level === "none" || !MAPS[type]) return null;
  const map = MAPS[type](level === "full", theme);
  const byType = { ...FONTS };
  Object.entries(map.byType || {}).forEach(([k, v]) => { byType[k] = { ...(byType[k] || {}), ...v }; });
  return { props: map.props, byType };
}
