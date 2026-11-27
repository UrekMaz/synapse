import { SectionMotifs } from "../../motifs/MotifContext.jsx";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../../components/hero-studio/runtime/HeroButton.jsx";
import { colorOf } from "../../../utils/heroResolve.js";

function Shape({ shape, color }) {
  const common = { viewBox: "0 0 100 100", width: "100%", height: "100%", "aria-hidden": true };
  if (shape === "circle") return <svg {...common}><circle cx="50" cy="50" r="48" fill={color} /></svg>;
  if (shape === "ring") return <svg {...common}><circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="12" /></svg>;
  if (shape === "cross") return <svg {...common}><g stroke={color} strokeWidth="16"><line x1="50" y1="6" x2="50" y2="94" /><line x1="6" y1="50" x2="94" y2="50" /></g></svg>;
  if (shape === "burst") {
    const pts = Array.from({ length: 24 }, (_, i) => {
      const a = (i * Math.PI) / 12 - Math.PI / 2;
      const r = i % 2 ? 30 : 49;
      return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
    }).join(" ");
    return <svg {...common}><polygon points={pts} fill={color} /></svg>;
  }
  return (
    <svg {...common}>
      <g stroke={color} strokeWidth="14">
        <line x1="50" y1="5" x2="50" y2="95" />
        <line x1="50" y1="5" x2="50" y2="95" transform="rotate(60 50 50)" />
        <line x1="50" y1="5" x2="50" y2="95" transform="rotate(120 50 50)" />
      </g>
    </svg>
  );
}

function Background() {
  const { elementsById, resolveEl, sectionProps: sp, palette } = useHeroRuntime();
  const el = elementsById.background;
  if (!el) return null;
  const p = resolveEl(el);
  const c = `color-mix(in srgb, ${palette.heading} ${Math.round((p.patternOpacity || 0) * 100)}%, transparent)`;
  const S = p.patternSize || 48;
  const pattern = {
    grid: { backgroundImage: `linear-gradient(to right, ${c} 1px, transparent 1px), linear-gradient(to bottom, ${c} 1px, transparent 1px)`, backgroundSize: `${S}px ${S}px` },
    dots: { backgroundImage: `radial-gradient(${c} 1.4px, transparent 1.6px)`, backgroundSize: `${S}px ${S}px` },
    lines: { backgroundImage: `repeating-linear-gradient(45deg, ${c} 0 1px, transparent 1px ${S}px)` },
  }[p.pattern] || {};
  return (
    <HeroElement id="background" wrapperStyle={{ position: "absolute", inset: 0, zIndex: 0 }} style={{ position: "absolute", inset: 0, background: sp.backgroundColor }}>
      {p.imageUrl && <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${p.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: p.imageOpacity ?? 1 }} />}
      <div style={{ position: "absolute", inset: 0, ...pattern }} />
    </HeroElement>
  );
}

function Decoration() {
  const { elementsById, resolveEl, palette } = useHeroRuntime();
  const el = elementsById.decoration;
  if (!el) return null;
  const p = resolveEl(el);
  if (p.shape === "none") return null;
  return (
    <HeroElement
      id="decoration"
      wrapperStyle={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2, zIndex: 1, opacity: p.opacity, transform: `rotate(${p.rotation || 0}deg)` }}
      style={{ width: "100%", height: "100%" }}
    >
      <div className={p.spin ? "te-spin" : undefined} style={{ width: "100%", height: "100%", animationDuration: `${p.spinDuration || 18}s` }}>
        <Shape shape={p.shape} color={colorOf(p, palette)} />
      </div>
    </HeroElement>
  );
}

export default function TypographyExplosion() {
  const { elements, sectionProps: sp, bp, resolveEl } = useHeroRuntime();
  const lines = elements.filter((e) => e.type === "heading-line");
  const subtitle = elements.find((e) => e.type === "text");
  const buttons = elements.filter((e) => e.type === "button");
  const metas = elements.filter((e) => e.type === "meta");
  const mobile = bp === "mobile";
  const px = sp.paddingX;
  const corner = { tl: { top: "calc(18px + var(--nav-clear, 0px))", left: px }, tr: { top: "calc(18px + var(--nav-clear, 0px))", right: px }, bl: { bottom: 16, left: px }, br: { bottom: 16, right: px } };

  return (
    <section style={{ position: "relative", minHeight: sp.minHeight, overflow: "hidden", isolation: "isolate", color: sp.textColor }}>
      <Background />
      <SectionMotifs bp={bp} />
      <Decoration />

      <div style={{ position: "relative", zIndex: 2, boxSizing: "border-box", minHeight: sp.minHeight, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32, padding: `${sp.paddingY + 28}px ${px}px ${sp.paddingY}px`, pointerEvents: "none" }}>
        <div role="heading" aria-level={1} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", maxWidth: sp.headingMaxWidth }}>
          {lines.map((l) => <HeroText key={l.id} id={l.id} as="span" />)}
        </div>

        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "flex-end", gap: 24 }}>
          {subtitle && <HeroText id={subtitle.id} as="p" />}
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", flexWrap: "wrap", gap: 12 }}>
            {buttons.map((b) => <HeroButton key={b.id} id={b.id} fullWidth={mobile} />)}
          </div>
        </div>
      </div>

      {metas.map((m) => (
        <HeroText key={m.id} id={m.id} as="span" wrapper={{ position: "absolute", zIndex: 3, transform: "none", ...corner[resolveEl(m).corner] }} />
      ))}
    </section>
  );
}