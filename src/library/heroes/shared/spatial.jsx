// Lightweight building blocks for the "spatial" heroes. Everything is CSS: transforms read the
// --mx / --my pointer vars written by useMouseVars, loops are CSS keyframes from styles/index.css.
import { seeded } from "./spatial.js";

// Continuous floating layer. p = { floatDir, floatAmp, floatSpeed, floatDelay }.
export function Float({ p, intensity = 1, on = true, style, children }) {
  const dir = p.floatDir || "vertical";
  const active = on && dir !== "none" && (p.floatAmp ?? 0) > 0;
  const speed = Math.max(1, p.floatSpeed || 6);
  return (
    <div
      className={active ? "syn-loop-float" : undefined}
      style={{
        width: "100%", height: "100%",
        "--amp": `${(p.floatAmp ?? 14) * intensity}px`,
        animation: active ? `syn-float-${dir} ${speed}s ${dir === "orbit" ? "linear" : "ease-in-out"} ${-(p.floatDelay || 0)}s infinite` : undefined,
        willChange: active ? "transform" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Parallax layer: moves with the pointer, further for nearer (higher depth) objects.
export function Depth({ depth = 0.5, strength = 30, on = true, invert = false, style, children }) {
  const d = on ? depth * strength * (invert ? -1 : 1) : 0;
  return (
    <div style={{ width: "100%", height: "100%", transform: d ? `translate3d(calc(var(--mx, 0) * ${d}px), calc(var(--my, 0) * ${d}px), 0)` : undefined, ...style }}>
      {children}
    </div>
  );
}

// One element, many stars (box-shadows). `count` stays modest for performance.
export function Starfield({ count = 120, seed = 7, color = "#fff", twinkle = true, size = 1.4 }) {
  const layers = [0, 1].map((layer) => {
    const r = seeded(seed + layer * 101);
    const n = Math.round(count / 2);
    const shadows = Array.from({ length: n }, () => {
      const a = (0.25 + r() * 0.75).toFixed(2);
      return `${(r() * 100).toFixed(2)}cqw ${(r() * 100).toFixed(2)}cqh 0 ${r() < 0.12 ? 0.6 : 0}px color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`;
    }).join(",");
    return (
      <div key={layer} className={twinkle ? "syn-loop-twinkle" : undefined}
        style={{
          position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: "50%", boxShadow: shadows,
          animation: twinkle ? `syn-twinkle ${5 + layer * 3}s ease-in-out ${-layer * 2}s infinite` : undefined,
        }} />
    );
  });
  return <div aria-hidden style={{ position: "absolute", inset: 0, containerType: "size", pointerEvents: "none" }}>{layers}</div>;
}

// Soft blurred colour blob used for nebulae, glows and ambient light.
export function Glow({ x, y, size, color, opacity = 0.6, blur = 80, style, className }) {
  return (
    <div aria-hidden className={className} style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
      borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 68%)`, opacity, filter: `blur(${blur}px)`, pointerEvents: "none", ...style,
    }} />
  );
}

