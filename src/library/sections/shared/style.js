// Plain helpers shared by section renderers (kept out of Shell.jsx so fast refresh stays clean).
import { useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import { css, isToken, px } from "../../../utils/tokens.js";

export const mixc = (c, pct, other = "transparent") => `color-mix(in srgb, ${css(c)} ${Math.round(pct)}%, ${other})`;

export function backgroundCss(sp) {
  if (sp.gradient === "linear") return `linear-gradient(${sp.gradientAngle ?? 180}deg, ${css(sp.gradientFrom)}, ${css(sp.gradientTo)})`;
  if (sp.gradient === "radial") return `radial-gradient(120% 100% at 50% 0%, ${css(sp.gradientFrom)}, ${css(sp.gradientTo)})`;
  // The theme can alternate / tint section backgrounds through --syn-section-bg (only when linked to $background).
  if (sp.background === "$background" || !sp.background) return "var(--syn-section-bg, var(--syn-background))";
  return css(sp.background, "var(--syn-background)");
}

// Visible elements of the given type(s), in order.
export const useItems = (...types) => {
  const { elements, resolveEl } = useHeroRuntime();
  return elements.filter((e) => types.includes(e.type) && e.visible !== false && !resolveEl(e).hidden);
};

/* Card styling shared by feature / service / plan / testimonial … cards. Hover lives on the wrapper so it never
   fights the entrance animation's transform. */
export const cardClass = (sp, extra = "") => `syn-card${sp.cardHover && sp.cardHover !== "none" ? ` syn-hover-${sp.cardHover}` : ""}${extra ? ` ${extra}` : ""}`;
export function cardStyle(sp, extra) {
  const s = sp.cardShadow || 0;
  const shadow = isToken(s) ? css(s) : s ? `0 ${Math.round(30 * s)}px ${Math.round(60 * s)}px -${Math.round(24 * s)}px rgba(15,23,42,${0.18 + 0.2 * s})` : "none";
  return {
    boxSizing: "border-box", height: "100%", background: css(sp.cardBg), borderRadius: px(sp.cardRadius),
    border: sp.cardBorderWidth ? `${px(sp.cardBorderWidth)} solid ${css(sp.cardBorder)}` : "none",
    padding: px(sp.cardPadding), "--card-shadow": shadow, backdropFilter: "var(--syn-card-blur)", WebkitBackdropFilter: "var(--syn-card-blur)",
    boxShadow: "var(--card-shadow)", transition: "box-shadow .4s ease, border-color .4s ease, background-color .4s ease",
    ...extra,
  };
}

// Resolved section columns, never more than items.
export const colsFor = (sp, count) => Math.max(1, Math.min(sp.columns || 3, count || 1));

// Item typography linked to the design system (cards, list rows, stats…). Section props can recolour them.
export const T = {
  title: (sp) => ({ margin: 0, display: "block", fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: "var(--syn-h3)", lineHeight: 1.25, letterSpacing: "-0.01em", color: css(sp?.cardTitle, "var(--syn-text)") }),
  body: (sp) => ({ margin: 0, display: "block", fontSize: "var(--syn-body-size)", lineHeight: "var(--syn-lh-body)", color: css(sp?.cardText, "var(--syn-muted)") }),
  small: (sp) => ({ margin: 0, display: "block", fontSize: "var(--syn-small)", lineHeight: 1.5, color: css(sp?.cardText, "var(--syn-muted)") }),
  label: { fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" },
};
