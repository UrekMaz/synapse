// Plain helpers for the spatial heroes (kept apart from the components for fast refresh).

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Deterministic pseudo-random numbers so particles/stars never jump between renders.
export function seeded(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gradientCss({ type = "radial", angle = 160, from, to, base }) {
  if (type === "none") return base;
  if (type === "linear") return `linear-gradient(${angle}deg, ${from}, ${to})`;
  if (type === "conic") return `conic-gradient(from ${angle}deg at 50% 50%, ${from}, ${to}, ${from})`;
  return `radial-gradient(120% 90% at 50% 35%, ${from} 0%, ${to} 70%, ${base} 100%)`;
}

// Content layer that lets clicks fall through to the background except on elements.
export const contentLayer = (extra) => ({ position: "relative", zIndex: 5, pointerEvents: "none", boxSizing: "border-box", ...extra });
