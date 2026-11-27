import { SectionMotifs } from "../../motifs/MotifContext.jsx";
import { useRef } from "react";
import { HeroElement, useHeroRuntime, useMouseVars } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../../components/hero-studio/runtime/HeroButton.jsx";
import { Depth, Float, Glow, Starfield } from "../shared/spatial.jsx";
import { contentLayer, gradientCss } from "../shared/spatial.js";

const mix = (c, pct, other = "transparent") => `color-mix(in srgb, ${c} ${Math.round(pct)}%, ${other})`;

/* ---------- Object materials (pure CSS, no 3D engine) ---------- */
function Sphere({ p, w, L }) {
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: `radial-gradient(circle at 32% 26%, ${mix("#fff", 85 * L + 10)} 0%, ${p.color1} 16%, ${p.color2} 62%, ${mix(p.color2, 45, "#000")} 100%)`,
      boxShadow: [
        `inset ${-w * 0.08}px ${-w * 0.12}px ${w * 0.22}px rgba(0,0,0,.45)`,
        `inset ${w * 0.04}px ${w * 0.05}px ${w * 0.1}px ${mix("#fff", 30 * L)}`,
        p.shadow ? `0 ${w * 0.16}px ${w * 0.32}px ${-w * 0.06}px rgba(0,0,0,.45)` : null,
      ].filter(Boolean).join(","),
    }}>
      <div style={{ position: "absolute", left: "18%", top: "12%", width: "34%", height: "22%", borderRadius: "50%", background: mix("#fff", 55 * L), filter: `blur(${w * 0.03}px)`, transform: "rotate(-30deg)" }} />
    </div>
  );
}

function Glass({ p, w, L }) {
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: `linear-gradient(135deg, ${mix("#fff", 38)}, ${mix("#fff", 4)} 55%, ${mix(p.color2, 30)})`,
      border: `1px solid ${mix("#fff", 45)}`, backdropFilter: "blur(14px) saturate(160%)", WebkitBackdropFilter: "blur(14px) saturate(160%)",
      boxShadow: `inset 0 1px ${w * 0.08}px ${mix("#fff", 45 * L)}, inset 0 ${-w * 0.08}px ${w * 0.16}px ${mix(p.color2, 30)}${p.shadow ? `, 0 ${w * 0.14}px ${w * 0.3}px ${-w * 0.08}px rgba(0,0,0,.35)` : ""}`,
    }}>
      <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", background: `radial-gradient(circle at 30% 25%, ${mix(p.color1, 60 * L)}, transparent 55%)` }} />
    </div>
  );
}

function Ring({ p, w, L, spin, dur }) {
  const t = Math.max(6, w * 0.15);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: w * 4 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(62deg)", transformStyle: "preserve-3d", filter: p.shadow ? `drop-shadow(0 ${w * 0.1}px ${w * 0.08}px rgba(0,0,0,.4))` : undefined }}>
        <div className={spin ? "syn-loop-spin" : undefined} style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `conic-gradient(from 200deg, ${p.color1}, ${p.color2} 22%, ${mix("#fff", 70 * L + 20, p.color1)} 34%, ${p.color2} 50%, ${mix(p.color2, 50, "#000")} 66%, ${p.color1} 84%, ${p.color1})`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${t}px), #000 calc(100% - ${t - 1}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${t}px), #000 calc(100% - ${t - 1}px))`,
          animation: spin ? `syn-spin ${dur}s linear infinite` : undefined,
        }} />
      </div>
    </div>
  );
}

function Cube({ p, w, L, spin, dur }) {
  const h = w / 2;
  const face = (transform, bg) => (
    <div style={{ position: "absolute", inset: 0, transform, background: bg, border: `1px solid ${mix("#fff", 28 * L + 8)}`, boxShadow: `inset 0 0 ${w * 0.25}px ${mix("#000", 22)}`, backfaceVisibility: "hidden" }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0, perspective: w * 6, filter: p.shadow ? `drop-shadow(0 ${w * 0.18}px ${w * 0.18}px rgba(0,0,0,.4))` : undefined }}>
      <div className={spin ? "syn-loop-cube" : undefined} style={{
        position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: "rotateX(-24deg) rotateY(38deg)",
        animation: spin ? `syn-cube ${dur}s linear infinite` : undefined,
      }}>
        {face(`translateZ(${h}px)`, `linear-gradient(135deg, ${p.color1}, ${p.color2})`)}
        {face(`rotateY(180deg) translateZ(${h}px)`, `linear-gradient(135deg, ${p.color2}, ${mix(p.color2, 55, "#000")})`)}
        {face(`rotateY(90deg) translateZ(${h}px)`, `linear-gradient(135deg, ${mix(p.color1, 70, p.color2)}, ${mix(p.color2, 70, "#000")})`)}
        {face(`rotateY(-90deg) translateZ(${h}px)`, `linear-gradient(135deg, ${p.color2}, ${mix(p.color2, 60, "#000")})`)}
        {face(`rotateX(90deg) translateZ(${h}px)`, `linear-gradient(135deg, ${mix("#fff", 55 * L + 20, p.color1)}, ${p.color1})`)}
        {face(`rotateX(-90deg) translateZ(${h}px)`, mix(p.color2, 40, "#000"))}
      </div>
    </div>
  );
}

function Sculpture({ p, w, L, spin, dur }) {
  return (
    <div className={spin ? "syn-loop-spin" : undefined} style={{ position: "absolute", inset: 0, animation: spin ? `syn-spin ${dur * 1.6}s linear infinite` : undefined }}>
      <div className="syn-loop-morph" style={{
        position: "absolute", inset: 0, borderRadius: "42% 58% 63% 37% / 41% 44% 56% 59%",
        background: `radial-gradient(circle at 30% 25%, ${mix("#fff", 70 * L + 10)}, transparent 32%), linear-gradient(140deg, ${p.color1}, ${p.color2} 70%)`,
        boxShadow: `inset ${-w * 0.08}px ${-w * 0.1}px ${w * 0.2}px ${mix("#000", 40)}, inset ${w * 0.05}px ${w * 0.05}px ${w * 0.12}px ${mix("#fff", 35 * L)}${p.shadow ? `, 0 ${w * 0.16}px ${w * 0.3}px ${-w * 0.06}px rgba(0,0,0,.4)` : ""}`,
        animation: "syn-morph 12s ease-in-out infinite",
      }} />
    </div>
  );
}

function ImageObject({ p, w }) {
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: p.radius, overflow: "hidden", background: mix(p.color2, 40, "#111"),
      border: "1px solid rgba(255,255,255,.18)", boxShadow: p.shadow ? `0 ${w * 0.12}px ${w * 0.3}px ${-w * 0.05}px rgba(0,0,0,.5)` : undefined,
    }}>
      {p.imageUrl
        ? <img src={p.imageUrl} alt="" loading="lazy" decoding="async" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 11, color: "rgba(255,255,255,.6)", fontFamily: "Inter, sans-serif" }}>Upload image</div>}
    </div>
  );
}

const SHAPES = { sphere: Sphere, glass: Glass, ring: Ring, cube: Cube, sculpture: Sculpture, image: ImageObject };

function SpaceObject({ id }) {
  const { elementsById, resolveEl, sectionProps: sp } = useHeroRuntime();
  const el = elementsById[id];
  const p = resolveEl(el);
  const free = p.kind === "image" || p.kind === "sculpture";
  const w = p.width;
  const h = free ? p.height : p.width;
  const L = sp.lighting ?? 0.7;
  const blur = sp.depthBlur && p.depth < 0.3 ? +((0.3 - p.depth) * 9).toFixed(1) : 0;
  const Shape = SHAPES[p.kind] || Sphere;
  const dur = Math.max(2, (p.spinSpeed || 20) / (sp.rotationSpeed || 1));

  return (
    <HeroElement id={id}
      wrapperStyle={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, zIndex: 1 + Math.round(p.depth * 8), opacity: p.opacity, filter: blur ? `blur(${blur}px)` : undefined }}
      style={{ width: "100%", height: "100%" }}>
      <Depth depth={p.depth} strength={sp.sensitivity} on={sp.parallax}>
        <Float p={{ ...p, floatAmp: (p.floatAmp ?? 0) * (sp.floatIntensity ?? 1) }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transform: `rotate(${p.rotation || 0}deg)` }}>
            {p.glow > 0 && (
              <div aria-hidden style={{ position: "absolute", inset: -Math.max(w, h) * 0.45, borderRadius: "50%", background: `radial-gradient(circle, ${mix(p.glowColor, 75 * p.glow)} 0%, transparent 62%)`, filter: `blur(${Math.max(w, h) * 0.06}px)`, opacity: 0.4 + 0.6 * L, pointerEvents: "none" }} />
            )}
            <Shape p={p} w={Math.min(w, h)} L={L} spin={p.spin} dur={dur} />
          </div>
        </Float>
      </Depth>
    </HeroElement>
  );
}

function Background() {
  const { elementsById, resolveEl, sectionProps: sp } = useHeroRuntime();
  const el = elementsById.background;
  if (!el) return null;
  const p = resolveEl(el);
  const L = sp.lighting ?? 0.7;
  const fx = p.effect || "none";
  return (
    <HeroElement id="background" wrapperStyle={{ position: "absolute", inset: 0, zIndex: 0 }}
      style={{ position: "absolute", inset: 0, overflow: "hidden", background: gradientCss({ type: sp.gradientType, angle: sp.gradientAngle, from: sp.gradientFrom, to: sp.gradientTo, base: sp.backgroundColor }) }}>
      {p.imageUrl && <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${p.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: p.imageOpacity ?? 0.4 }} />}
      {(fx === "nebula" || fx === "stars-nebula") && (
        <>
          <Glow x={28} y={30} size={900} color={sp.gradientFrom} opacity={0.75 * L} blur={60} />
          <Glow x={78} y={72} size={760} color={sp.accentColor} opacity={0.3 * L} blur={90} />
          <Glow x={60} y={18} size={520} color={mix(sp.accentColor, 60, "#fff")} opacity={0.14 * L} blur={70} />
        </>
      )}
      {(fx === "stars" || fx === "stars-nebula") && <Starfield count={p.starDensity ?? 140} color={sp.headingColor} />}
      {fx === "grid" && (
        <div style={{ position: "absolute", left: "-30%", right: "-30%", bottom: "-8%", height: "62%", transform: "perspective(520px) rotateX(64deg)", transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(${mix(sp.accentColor, 45 * L + 10)} 1px, transparent 1px), linear-gradient(90deg, ${mix(sp.accentColor, 45 * L + 10)} 1px, transparent 1px)`,
          backgroundSize: "64px 64px", WebkitMaskImage: "linear-gradient(to top, #000 10%, transparent 85%)", maskImage: "linear-gradient(to top, #000 10%, transparent 85%)" }} />
      )}
      {/* light cone from above */}
      <div style={{ position: "absolute", left: "50%", top: "-30%", width: "90%", height: "110%", transform: "translateX(-50%)", background: `conic-gradient(from 160deg at 50% 0%, transparent, ${mix(sp.accentColor, 10 * L)} 20deg, transparent 40deg)`, filter: "blur(30px)", opacity: L }} />
      {p.vignette > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 50% 45%, transparent 45%, ${mix(sp.backgroundColor, 100 * p.vignette)} 100%)` }} />}
    </HeroElement>
  );
}

export default function FloatingUniverse() {
  const { elements, sectionProps: sp, bp, motion } = useHeroRuntime();
  const ref = useRef(null);
  useMouseVars(ref, motion && sp.parallax && bp !== "mobile");
  const objects = elements.filter((e) => e.type === "object");
  const metas = elements.filter((e) => e.type === "meta");
  const headings = elements.filter((e) => e.type === "heading");
  const texts = elements.filter((e) => e.type === "text");
  const buttons = elements.filter((e) => e.type === "button");
  const left = sp.contentAlign === "left";
  const mobile = bp === "mobile";

  return (
    <section ref={ref} data-still={sp.continuous === false || undefined}
      style={{ position: "relative", minHeight: sp.minHeight, overflow: "hidden", isolation: "isolate", background: sp.backgroundColor, color: sp.textColor }}>
      <Background />
      <SectionMotifs bp={bp} />
      {objects.map((o) => <SpaceObject key={o.id} id={o.id} />)}

      <div style={contentLayer({ position: "absolute", left: sp.paddingX, right: sp.paddingX, top: `${sp.contentY ?? 50}%`, transform: "translateY(-50%)", zIndex: 20 })}>
        <Depth depth={0.12} strength={sp.sensitivity} on={sp.parallax} invert style={{ height: "auto", display: "flex", flexDirection: "column", alignItems: left ? "flex-start" : "center" }}>
          {metas.map((m) => <HeroText key={m.id} id={m.id} wrapper={{ marginBottom: mobile ? 16 : 26 }} />)}
          {headings.map((h) => <HeroText key={h.id} id={h.id} as="h1" />)}
          {texts.map((t) => <HeroText key={t.id} id={t.id} as="p" wrapper={{ marginTop: mobile ? 18 : 26 }} />)}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: left ? "flex-start" : "center", gap: 12, marginTop: mobile ? 28 : 40 }}>
            {buttons.map((b) => <HeroButton key={b.id} id={b.id} />)}
          </div>
        </Depth>
      </div>
    </section>
  );
}
