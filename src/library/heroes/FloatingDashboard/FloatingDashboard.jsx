import { SectionMotifs } from "../../motifs/MotifContext.jsx";
import { useRef } from "react";
import { HeroElement, useHeroRuntime, useMouseVars } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../../components/hero-studio/runtime/HeroButton.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { Depth, Float, Glow } from "../shared/spatial.jsx";
import DashboardMock from "./DashboardMock.jsx";

const mix = (c, pct, other = "transparent") => `color-mix(in srgb, ${c} ${Math.round(pct)}%, ${other})`;
const STAGE_PAD = { desktop: 70, tablet: 64, mobile: 44 };

/* ---------- Floating cards ---------- */
const Icon = ({ kind, c }) => {
  const s = { width: 16, height: 16, fill: "none", stroke: c, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "notification") return <svg viewBox="0 0 24 24" style={s}><path d="M20 6 9 17l-5-5" /></svg>;
  if (kind === "activity") return <svg viewBox="0 0 24 24" style={s}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
  return <svg viewBox="0 0 24 24" style={s}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></svg>;
};
const Delta = ({ id, v, light }) => {
  if (!v) return null;
  const down = v.trim().startsWith("-");
  const c = down ? "#ef4444" : light ? "#059669" : "#34d399";
  return <EditableText id={id} k="delta" value={v} style={{ fontSize: 12, fontWeight: 600, color: c, background: mix(c, 14), padding: "2px 8px", borderRadius: 99, display: "inline-block" }} />;
};
const isLight = (hex = "") => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150;
};

function CardBody({ id, p, accent }) {
  const light = isLight(p.bgColor);
  const muted = mix(p.textColor, 60);
  const t = { fontSize: 12.5, color: muted, display: "block" };
  const v = { fontSize: 26, fontWeight: 650, letterSpacing: "-0.03em", lineHeight: 1.1, display: "block" };
  switch (p.kind) {
    case "notification":
    case "activity":
      return (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center", background: mix(p.kind === "notification" ? "#10b981" : accent, 18) }}>
            <Icon kind={p.kind} c={p.kind === "notification" ? "#10b981" : accent} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EditableText id={id} k="title" value={p.title} style={{ fontSize: 13.5, fontWeight: 600, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
            <EditableText id={id} k="sub" value={p.sub} style={{ ...t, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
          </div>
          <EditableText id={id} k="value" value={p.value} style={{ ...t, fontSize: 11, alignSelf: "flex-start" }} />
        </div>
      );
    case "profile": {
      const initials = (p.title || "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      return (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ position: "relative", width: 42, height: 42, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", color: "#fff", fontWeight: 600, fontSize: 14, background: `linear-gradient(135deg, #f9a8d4, ${accent})` }}>
            {initials}
            <i style={{ position: "absolute", right: 0, bottom: 1, width: 11, height: 11, borderRadius: "50%", background: "#10b981", border: `2px solid ${p.bgColor}` }} />
          </span>
          <div style={{ minWidth: 0 }}>
            <EditableText id={id} k="title" value={p.title} style={{ fontSize: 14, fontWeight: 600, display: "block", whiteSpace: "nowrap" }} />
            <EditableText id={id} k="sub" value={p.sub} style={{ ...t, fontSize: 12, whiteSpace: "nowrap" }} />
          </div>
          <EditableText id={id} k="value" value={p.value} style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#10b981", background: mix("#10b981", 14), padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap" }} />
        </div>
      );
    }
    case "chart":
      return (
        <div>
          <EditableText id={id} k="title" value={p.title} style={t} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "4px 0 12px" }}>
            <EditableText id={id} k="value" value={p.value} style={{ ...v, fontSize: 20 }} />
            <Delta id={id} v={p.delta} light={light} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 54 }}>
            {[38, 56, 44, 70, 52, 84, 100].map((h, i) => (
              <i key={i} className="syn-grow-y" style={{ flex: 1, height: `${h}%`, borderRadius: 5, background: i === 6 ? accent : mix(accent, 30 + i * 6), "--d": `${1.2 + i * 0.07}s` }} />
            ))}
          </div>
        </div>
      );
    case "revenue":
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <EditableText id={id} k="title" value={p.title} style={t} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}` }} />
          </div>
          <EditableText id={id} k="value" value={p.value} style={{ ...v, margin: "4px 0 8px" }} />
          <svg viewBox="0 0 200 44" width="100%" height="44" preserveAspectRatio="none" style={{ display: "block", marginBottom: 8 }}>
            <defs><linearGradient id={`rv-${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={accent} stopOpacity=".4" /><stop offset="1" stopColor={accent} stopOpacity="0" /></linearGradient></defs>
            <path d="M0,36 C20,34 30,26 50,28 S80,18 100,20 S140,8 160,12 S190,4 200,2 L200,44 L0,44 Z" fill={`url(#rv-${id})`} />
            <path d="M0,36 C20,34 30,26 50,28 S80,18 100,20 S140,8 160,12 S190,4 200,2" fill="none" stroke={accent} strokeWidth="2.2" className="syn-draw" style={{ "--len": 260, "--d": "1.3s" }} />
          </svg>
          <Delta id={id} v={p.delta} light={light} />
        </div>
      );
    default: // metric
      return (
        <div>
          <EditableText id={id} k="title" value={p.title} style={t} />
          <EditableText id={id} k="value" value={p.value} style={{ ...v, margin: "6px 0 8px" }} />
          <Delta id={id} v={p.delta} light={light} />
        </div>
      );
  }
}

function FloatCard({ id, strength }) {
  const { elementsById, resolveEl, sectionProps: sp } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  return (
    <HeroElement id={id} wrapperStyle={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.width, zIndex: 10 + Math.round((p.depth || 0) * 5) }} style={{ width: "100%" }}>
      <Depth depth={p.depth} strength={strength} on={strength > 0} style={{ height: "auto" }}>
        <Float p={p} style={{ height: "auto" }}>
          <div style={{
            transform: `rotate(${p.rotation || 0}deg)`, boxSizing: "border-box", padding: "14px 16px", borderRadius: 16,
            color: p.textColor, fontFamily: "Inter, system-ui, sans-serif",
            background: p.glass ? mix(p.bgColor, 78) : p.bgColor, backdropFilter: p.glass ? "blur(18px) saturate(150%)" : undefined, WebkitBackdropFilter: p.glass ? "blur(18px) saturate(150%)" : undefined,
            border: `1px solid ${isLight(p.bgColor) ? "rgba(15,23,42,.08)" : "rgba(255,255,255,.1)"}`,
            boxShadow: `0 24px 50px -18px rgba(2,6,23,${0.7 * p.shadow}), 0 8px 18px -10px rgba(2,6,23,${0.4 * p.shadow}), inset 0 1px 0 rgba(255,255,255,${isLight(p.bgColor) ? 0.6 : 0.06})`,
          }}>
            <CardBody id={id} p={p} accent={sp.accentColor} />
          </div>
        </Float>
      </Depth>
    </HeroElement>
  );
}

/* ---------- Main dashboard ---------- */
function Dashboard({ stacked }) {
  const { elementsById, resolveEl, sectionProps: sp, motion, playKey } = useHeroRuntime();
  const el = elementsById.dashboard;
  if (!el) return null;
  const p = resolveEl(el);
  const tilt = sp.tilt ? sp.tiltStrength || 0 : 0;
  const light = p.theme === "light";
  return (
    <HeroElement id="dashboard"
      wrapperStyle={{ position: "absolute", width: p.width, height: p.height, zIndex: 5, opacity: p.opacity,
        left: stacked ? `calc(50% - ${p.width / 2}px + ${p.x}px)` : p.x, top: `calc(50% - ${p.height / 2}px + ${p.y}px)` }}
      style={{ width: "100%", height: "100%" }}>
      <Float p={p}>
        <div style={{
          width: "100%", height: "100%",
          transform: `perspective(${p.perspective}px) rotateX(calc(${p.rotateX}deg - var(--my, 0) * ${tilt}deg)) rotateY(calc(${p.rotateY}deg + var(--mx, 0) * ${tilt}deg)) rotateZ(${p.rotateZ}deg)`,
          transformOrigin: "50% 50%",
        }}>
          <div style={{
            position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: p.radius,
            border: `1px solid ${mix(p.borderColor, (p.borderOpacity ?? 0.12) * 100)}`,
            boxShadow: `0 70px 120px -40px rgba(2,6,23,${0.8 * p.shadow}), 0 30px 80px -30px ${mix(sp.accentColor, 55 * p.shadow)}, 0 0 0 6px ${mix(light ? "#0f172a" : "#ffffff", 3)}`,
          }}>
            {p.imageUrl
              ? <img src={p.imageUrl} alt="Product dashboard" loading="lazy" decoding="async" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left", display: "block" }} />
              : <DashboardMock key={playKey} kind={p.kind} dark={!light} accent={sp.accentColor} width={p.width} height={p.height} animated={motion} />}
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(115deg, rgba(255,255,255,${light ? 0.35 : 0.07}) 0%, transparent 38%)` }} />
          </div>
        </div>
      </Float>
    </HeroElement>
  );
}

function Background() {
  const { elementsById, resolveEl, sectionProps: sp } = useHeroRuntime();
  const el = elementsById.background;
  if (!el) return null;
  const p = resolveEl(el);
  const I = sp.glowIntensity ?? 0.7;
  const line = mix(sp.headingColor, (sp.gridOpacity ?? 0.06) * 100);
  return (
    <HeroElement id="background" wrapperStyle={{ position: "absolute", inset: 0, zIndex: 0 }} style={{ position: "absolute", inset: 0, overflow: "hidden", background: sp.backgroundColor }}>
      {p.imageUrl && <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${p.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: p.imageOpacity ?? 0.3 }} />}
      <Glow x={80} y={10} size={980} color={sp.glowColor1} opacity={0.55 * I} blur={70} />
      <Glow x={10} y={95} size={760} color={sp.glowColor2} opacity={0.32 * I} blur={90} />
      <Glow x={68} y={58} size={700} color={sp.accentColor} opacity={0.22 * I} blur={80} />
      {sp.gridPattern && (
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`, backgroundSize: "56px 56px",
          WebkitMaskImage: "radial-gradient(70% 70% at 65% 45%, #000 20%, transparent 75%)", maskImage: "radial-gradient(70% 70% at 65% 45%, #000 20%, transparent 75%)" }} />
      )}
      {sp.shapes && (
        <>
          <div style={{ position: "absolute", right: "-6%", top: "-18%", width: 620, height: 620, borderRadius: "50%", border: `1px solid ${mix(sp.headingColor, 8)}` }} />
          <div style={{ position: "absolute", right: "4%", top: "-6%", width: 420, height: 420, borderRadius: "50%", border: `1px dashed ${mix(sp.headingColor, 7)}` }} />
          <div style={{ position: "absolute", left: "3%", bottom: "8%", width: 140, height: 100, backgroundImage: `radial-gradient(${mix(sp.headingColor, 22)} 1.4px, transparent 1.6px)`, backgroundSize: "14px 14px" }} />
        </>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 160, background: `linear-gradient(to bottom, transparent, ${mix(sp.backgroundColor, 85)})` }} />
    </HeroElement>
  );
}

export default function FloatingDashboard() {
  const { elements, elementsById, resolveEl, sectionProps: sp, bp, motion } = useHeroRuntime();
  const ref = useRef(null);
  useMouseVars(ref, motion && sp.tilt && bp === "desktop");
  const stacked = bp !== "desktop";
  const mobile = bp === "mobile";
  const metas = elements.filter((e) => e.type === "meta");
  const [badge, ...notes] = metas;
  const headings = elements.filter((e) => e.type === "heading");
  const texts = elements.filter((e) => e.type === "text");
  const buttons = elements.filter((e) => e.type === "button");
  const cards = elements.filter((e) => e.type === "card");
  const dash = elementsById.dashboard ? resolveEl(elementsById.dashboard) : { height: 480 };
  const pad = STAGE_PAD[bp];
  const align = bp === "tablet" ? "center" : "flex-start";

  return (
    <section ref={ref} style={{ position: "relative", minHeight: sp.minHeight || undefined, overflow: "hidden", isolation: "isolate", background: sp.backgroundColor, color: sp.textColor }}>
      <Background />
      <SectionMotifs bp={bp} />
      <div style={{
        position: "relative", zIndex: 2, boxSizing: "border-box", minHeight: sp.minHeight || undefined, padding: `calc(${sp.paddingY}px + var(--nav-clear, 0px)) ${sp.paddingX}px ${sp.paddingY}px`, pointerEvents: "none",
        display: stacked ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: `${sp.textWidth}% minmax(0, 1fr)`, gap: stacked ? (mobile ? 32 : 48) : sp.gap, alignItems: stacked ? "stretch" : "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: align, textAlign: bp === "tablet" ? "center" : "left", position: "relative", zIndex: 20 }}>
          {badge && <HeroText id={badge.id} wrapper={{ marginBottom: mobile ? 18 : 26 }} />}
          {headings.map((h) => <HeroText key={h.id} id={h.id} as="h1" />)}
          {texts.map((t) => <HeroText key={t.id} id={t.id} as="p" wrapper={{ marginTop: mobile ? 16 : 22 }} />)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: mobile ? 26 : 36, justifyContent: align, width: mobile ? "100%" : undefined, flexDirection: mobile ? "column" : "row" }}>
            {buttons.map((b) => <HeroButton key={b.id} id={b.id} fullWidth={mobile} />)}
          </div>
          {notes.map((m) => <HeroText key={m.id} id={m.id} wrapper={{ marginTop: mobile ? 20 : 30 }} />)}
        </div>

        <div style={{ position: "relative", height: dash.height + pad * 2, width: "100%" }}>
          <Dashboard stacked={stacked} />
          {cards.map((c) => <FloatCard key={c.id} id={c.id} strength={sp.tilt && !mobile ? 26 : 0} />)}
        </div>
      </div>
    </section>
  );
}
