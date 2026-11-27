import { useLayoutEffect, useState } from "react";
import { css } from "./tokens.js";

export const BP = { tablet: 1024, mobile: 640 };
export const bpFromWidth = (w) => (w < BP.mobile ? "mobile" : w < BP.tablet ? "tablet" : "desktop");
const ORDER = ["desktop", "tablet", "mobile"];
export const narrowestBp = (a, b) => ORDER[Math.max(ORDER.indexOf(a), ORDER.indexOf(b))];

// Desktop-first cascade: mobile inherits tablet overrides.
export function resolveProps(base = {}, responsive = {}, bp = "desktop") {
  const out = { ...base };
  if (bp === "tablet" || bp === "mobile") Object.assign(out, responsive?.tablet);
  if (bp === "mobile") Object.assign(out, responsive?.mobile);
  return out;
}

// forced = "desktop" | "tablet" | "mobile" (editor/preview simulation), otherwise measure real width.
export function useBreakpoint(ref, forced) {
  const [bp, setBp] = useState(forced || "desktop");
  useLayoutEffect(() => {
    if (forced) return;
    const el = ref.current;
    if (!el) return;
    const update = () => setBp(bpFromWidth(el.getBoundingClientRect().width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [forced, ref]);
  return forced || bp;
}

export const paletteOf = (sp) => ({
  heading: sp.headingColor, accent: sp.accentColor, text: sp.textColor, background: sp.backgroundColor,
});

export function colorOf(p, palette) {
  // Sections built on the design system use a direct (possibly "$token") color.
  if (p.color) return css(p.color);
  if (!p.colorRole || p.colorRole === "custom") return p.customColor || palette.text;
  return palette[p.colorRole] || palette.text;
}