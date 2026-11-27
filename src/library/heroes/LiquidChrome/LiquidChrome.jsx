import { SectionMotifs } from "../../motifs/MotifContext.jsx";
import { useRef } from "react";
import { HeroElement, useHeroRuntime, useMouseVars } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../../components/hero-studio/runtime/HeroButton.jsx";
import { Depth, Float } from "../shared/spatial.jsx";
import { seeded } from "../shared/spatial.js";

const mix = (c, pct, other = "transparent") => `color-mix(in srgb, ${c} ${Math.round(pct)}%, ${other})`;

// Reflection bands of the metal. Lower "metallic" pulls every band toward mid grey (less contrast).
function chromeStops(palette, m, light, refl) {
  const hi = "#ffffff", lo = "#06060a";
  const base = palette === "iridescent"
    ? [hi, "#7dd3fc", lo, "#f0abfc", "#231d38", "#fde68a", hi, "#22d3ee", lo, "#c4b5fd", "#2b2440", hi]
    : palette === "tinted"
      ? [hi, mix(light, 65, "#9a9ab0"), lo, mix(refl, 55, "#dcdce8"), "#262634", hi, mix(light, 55, "#6f6f85"), lo, mix(refl, 45, "#c9c9da"), "#34344a", hi]
      : [hi, "#8a8aa0", lo, "#d8d8e6", "#2a2a36", "#fafaff", "#6f6f85", "#0c0c12", "#c9c9da", "#383846", hi];
  return base.map((c) => (m >= 0.999 ? c : mix(c, 100 * (0.3 + 0.7 * m), "#77778a"))).join(", ");
}

function ChromeSurface({ p, L, S }) {
  const rough = p.roughness || 0;
  const stops = chromeStops(p.palette, p.metallic ?? 0.9, L.lightColor, L.reflectionColor);
  const moving = L.lightMotion !== false;
  const hl = (L.highlight ?? 0.8) * (p.reflectivity ?? 0.8);
  const m = p.metallic ?? 0.9;
  const g = (c) => (m >= 0.999 ? c : mix(c, 100 * (0.3 + 0.7 * m), "#77778a"));
  const sky = p.palette === "iridescent" ? mix("#7dd3fc", 60, "#fff") : p.palette === "tinted" ? mix(L.reflectionColor, 35, "#fff") : "#ffffff";
  const ground = p.palette === "iridescent" ? "#2b1d3f" : p.palette === "tinted" ? mix(L.lightColor, 30, "#0a0a12") : "#0b0b11";
  const swirlDur = Math.max(6, (p.spinSpeed || 26) * 0.8);
  return (
    <>
      {/* Environment reflection: bright sky, a hard dark horizon, lit ground — the classic chrome read. */}
      <div className={moving ? "syn-loop-rot" : undefined} style={{
        position: "absolute", inset: -S * 0.1,
        background: `linear-gradient(calc(172deg + ${p.rotation || 0}deg + var(--syn-rot) * 0.12 + var(--mx, 0) * 10deg),
          ${g(sky)} 0%, ${g(mix(sky, 70, "#9898ac"))} 26%, ${g("#d9d9e6")} 38%, ${g(ground)} 47%, ${g("#050508")} 52%, ${g(mix(L.lightColor, 30, "#3a3a4c"))} 64%, ${g("#b8b8ca")} 84%, ${g(sky)} 100%)`,
        filter: rough ? `blur(${rough * 10}px) saturate(${1 - rough * 0.4})` : undefined,
        animation: moving ? `syn-rot ${swirlDur}s linear infinite` : undefined,
      }} />
      {/* Liquid swirl, blurred so it reads as distortion rather than a pinwheel. */}
      <div className={moving ? "syn-loop-rot" : undefined} style={{
        position: "absolute", inset: -S * 0.15, opacity: 0.55, mixBlendMode: "overlay",
        background: `conic-gradient(from var(--syn-rot) at 32% 68%, ${stops})`, filter: `blur(${S * 0.05 + rough * 12}px)`,
        animation: moving ? `syn-rot ${swirlDur * 1.4}s linear infinite reverse` : undefined,
      }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 120%, rgba(0,0,0,.55), transparent 55%)" }} />
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: p.reflectivity ?? 0.8,
        background: `linear-gradient(calc(118deg + var(--mx, 0) * 40deg), transparent 28%, ${mix(L.reflectionColor, 60)} 48%, transparent 66%)`, filter: rough ? `blur(${rough * 14}px)` : undefined }} />
      <div style={{ position: "absolute", inset: 0,
        background: `radial-gradient(34% 26% at calc(34% + var(--mx, 0) * 16%) calc(26% + var(--my, 0) * 16%), rgba(255,255,255,${0.95 * hl}), transparent 70%)`, filter: `blur(${2 + rough * 12}px)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit",
        boxShadow: `inset 0 0 ${S * 0.07}px ${mix(L.lightColor, 70)}, inset ${-S * 0.08}px ${-S * 0.1}px ${S * 0.22}px rgba(0,0,0,.62), inset ${S * 0.05}px ${S * 0.045}px ${S * 0.1}px rgba(255,255,255,${0.35 + 0.3 * hl})` }} />
    </>
  );
}

function Chrome({ L }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const el = elementsById.chrome;
  if (!el) return null;
  const p = resolveEl(el);
  const S = Math.round((p.size || 520) * (p.scale || 1));
  const R = p.mouseResponse || 0;
  const capsule = p.kind === "capsule";
  const shapeBox = capsule ? { left: 0, right: 0, top: "29%", height: "42%", borderRadius: 999 } : { inset: 0, borderRadius: "50%" };
  const glowC = mix(L.lightColor, 70 * (p.glow ?? 0.6));

  let shape;
  if (p.kind === "image") {
    shape = p.imageUrl
      ? <img src={p.imageUrl} alt="" draggable={false} decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: `drop-shadow(0 0 ${S * 0.06}px ${glowC}) contrast(${1 + (p.metallic ?? 0.9) * 0.15})` }} />
      : <div style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: "1px dashed rgba(255,255,255,.3)", display: "grid", placeItems: "center", color: "rgba(255,255,255,.6)", fontSize: 14, fontFamily: "Inter, sans-serif" }}>Upload an object image</div>;
  } else if (p.kind === "torus") {
    const t = S * 0.17;
    const ring = `radial-gradient(farthest-side, transparent calc(100% - ${t * 2}px), #000 calc(100% - ${t * 2 - 1}px))`;
    shape = (
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(58deg)", transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", WebkitMask: ring, mask: ring, boxShadow: `0 0 ${S * 0.12}px ${glowC}` }}>
          <ChromeSurface p={p} L={L} S={S} />
        </div>
      </div>
    );
  } else {
    shape = (
      <div className={p.kind === "blob" && p.morph ? "syn-loop-morph" : undefined} style={{
        position: "absolute", ...shapeBox, overflow: "hidden",
        borderRadius: p.kind === "blob" ? "42% 58% 63% 37% / 41% 44% 56% 59%" : shapeBox.borderRadius,
        animation: p.kind === "blob" && p.morph ? "syn-morph 14s ease-in-out infinite" : undefined,
        boxShadow: `0 0 ${S * 0.16}px ${S * 0.01}px ${glowC}`,
      }}>
        <ChromeSurface p={p} L={L} S={S} />
      </div>
    );
  }

  return (
    <HeroElement id="chrome"
      wrapperStyle={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: S, height: S, marginLeft: -S / 2, marginTop: -S / 2, zIndex: 3, opacity: p.opacity }}
      style={{ width: "100%", height: "100%" }}>
      {p.shadow > 0 && (
        <div aria-hidden style={{ position: "absolute", left: "15%", right: "15%", bottom: -S * 0.1, height: S * 0.14, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(0,0,0,${0.8 * p.shadow}), transparent)`, filter: `blur(${S * 0.03}px)` }} />
      )}
      <Depth depth={0.5} strength={R * 1.4} on={R > 0}>
        <Float p={p}>
          <div style={{ width: "100%", height: "100%", perspective: p.perspective }}>
            <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateX(calc(var(--my, 0) * ${-R}deg)) rotateY(calc(var(--mx, 0) * ${R}deg))` }}>
              <div className={p.spin ? "syn-loop-spin" : undefined} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: p.spin ? undefined : `rotate(${p.rotation || 0}deg)`, animation: p.spin ? `syn-spin ${p.spinSpeed || 26}s linear infinite` : undefined }}>
                {shape}
              </div>
            </div>
          </div>
        </Float>
      </Depth>
    </HeroElement>
  );
}

// Glow + light beams around the object. Selectable as its own element ("Lighting & glow").
function Lighting({ chrome }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const el = elementsById.lighting;
  if (!el) return null;
  const L = resolveEl(el);
  const S = Math.round((chrome.size || 520) * (chrome.scale || 1)) * 1.9;
  return (
    <HeroElement id="lighting"
      wrapperStyle={{ position: "absolute", left: `${chrome.x}%`, top: `${chrome.y}%`, width: S, height: S, marginLeft: -S / 2, marginTop: -S / 2, zIndex: 2, borderRadius: "50%" }}
      style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${mix(L.lightColor, 70 * L.glow)} 0%, ${mix(L.reflectionColor, 18 * L.glow)} 38%, transparent 66%)`, filter: "blur(30px)" }} />
      {L.lightMotion && (
        <div className="syn-loop-spin" style={{ position: "absolute", inset: "8%", borderRadius: "50%", animation: "syn-spin 40s linear infinite",
          background: `conic-gradient(from 0deg, transparent 0deg, ${mix(L.lightColor, 30 * L.glow)} 30deg, transparent 70deg, transparent 180deg, ${mix(L.reflectionColor, 24 * L.glow)} 215deg, transparent 260deg)`, filter: "blur(24px)" }} />
      )}
    </HeroElement>
  );
}

function Particles({ count, color }) {
  const r = seeded(42);
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const s = 1 + r() * 2.2;
        return (
          <span key={i} className="syn-loop-p" style={{
            position: "absolute", left: `${r() * 100}%`, top: `${r() * 100}%`, width: s, height: s, borderRadius: "50%", background: color, opacity: 0.2 + r() * 0.6,
            boxShadow: s > 2.4 ? `0 0 6px ${color}` : undefined, "--dx": `${(r() - 0.5) * 60}px`, "--dy": `${(r() - 0.5) * 80}px`,
            animation: `syn-drift ${10 + r() * 14}s ease-in-out ${-r() * 10}s infinite alternate, syn-twinkle ${4 + r() * 5}s ease-in-out ${-r() * 5}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

function Background({ L, chrome }) {
  const { elementsById, resolveEl, sectionProps: sp, bp } = useHeroRuntime();
  const el = elementsById.background;
  if (!el) return null;
  const p = resolveEl(el);
  const pan = sp.animatedGradient;
  return (
    <HeroElement id="background" wrapperStyle={{ position: "absolute", inset: 0, zIndex: 0 }} style={{ position: "absolute", inset: 0, overflow: "hidden", background: sp.backgroundColor }}>
      <div className={pan ? "syn-loop-pan" : undefined} style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(${sp.gradientAngle}deg, ${sp.gradientFrom}, ${mix(L.lightColor, 18, sp.gradientTo)}, ${sp.gradientTo}, ${sp.gradientFrom})`,
        backgroundSize: pan ? "300% 300%" : undefined, animation: pan ? "syn-pan 22s ease-in-out infinite" : undefined,
      }} />
      {p.imageUrl && <div style={{ position: "absolute", inset: -40, backgroundImage: `url("${p.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: p.imageOpacity ?? 0.25, filter: p.blur ? `blur(${p.blur}px)` : undefined }} />}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(48% 52% at ${chrome.x}% ${chrome.y}%, ${mix(L.lightColor, 45 * (L.illumination ?? 0.5))}, transparent 72%)` }} />
      <div style={{ position: "absolute", inset: 0, background: mix(L.lightColor, 8 * (L.ambient ?? 0.5)) }} />
      {p.beams && (
        <>
          <div style={{ position: "absolute", left: "-10%", right: "-10%", top: `${chrome.y}%`, height: 1, background: `linear-gradient(90deg, transparent, ${mix(L.reflectionColor, 45)}, transparent)`, opacity: 0.6 }} />
          <div style={{ position: "absolute", left: `${chrome.x}%`, top: "-20%", width: 2, height: "70%", transform: "rotate(18deg)", transformOrigin: "top", background: `linear-gradient(${mix(L.lightColor, 50)}, transparent)`, filter: "blur(1px)", opacity: 0.5 }} />
          <div style={{ position: "absolute", left: "50%", top: "-40%", width: "80%", height: "90%", transform: "translateX(-50%)", background: `conic-gradient(from 165deg at 50% 0%, transparent, ${mix(L.lightColor, 10)} 15deg, transparent 30deg)`, filter: "blur(20px)" }} />
        </>
      )}
      {p.particles && <Particles count={bp === "mobile" ? Math.round((p.particleCount ?? 70) / 2) : p.particleCount ?? 70} color={sp.headingColor} />}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 100% at 50% 40%, transparent 55%, ${mix("#000", 70)} 100%)` }} />
    </HeroElement>
  );
}

export default function LiquidChrome() {
  const { elements, elementsById, resolveEl, sectionProps: sp, bp, motion } = useHeroRuntime();
  const ref = useRef(null);
  useMouseVars(ref, motion && bp !== "mobile");
  const L = elementsById.lighting ? resolveEl(elementsById.lighting) : { lightColor: sp.accentColor, reflectionColor: sp.accentColor, glow: 0.5, highlight: 0.8, lightMotion: true };
  const chrome = elementsById.chrome ? resolveEl(elementsById.chrome) : { x: 50, y: 45, size: 480, scale: 1 };
  const metas = elements.filter((e) => e.type === "meta");
  const [kicker, ...corners] = metas;
  const headings = elements.filter((e) => e.type === "heading");
  const texts = elements.filter((e) => e.type === "text");
  const buttons = elements.filter((e) => e.type === "button");
  const mobile = bp === "mobile";
  const layout = sp.layout || "bottom";
  const px = sp.paddingX, py = sp.paddingY;

  const titleBlock = headings.map((h) => <HeroText key={h.id} id={h.id} as="h1" />);
  const side = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: layout === "center" && !mobile ? "center" : "flex-start", gap: mobile ? 18 : 24, flexShrink: 0 }}>
      {texts.map((t) => <HeroText key={t.id} id={t.id} as="p" />)}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{buttons.map((b) => <HeroButton key={b.id} id={b.id} />)}</div>
    </div>
  );

  let content;
  if (layout === "split" && !mobile) {
    content = (
      <div style={{ position: "absolute", left: px, top: "50%", transform: "translateY(-50%)", width: "46%", display: "flex", flexDirection: "column", gap: 28 }}>
        {titleBlock}{side}
      </div>
    );
  } else if (layout === "center" || mobile) {
    content = (
      <div style={{ position: "absolute", left: px, right: px, bottom: py, display: "flex", flexDirection: "column", alignItems: mobile ? "flex-start" : "center", textAlign: mobile ? "left" : "center", gap: mobile ? 18 : 26 }}>
        {titleBlock}{side}
      </div>
    );
  } else {
    content = (
      <div style={{ position: "absolute", left: px, right: px, bottom: py, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: bp === "tablet" ? "wrap" : "nowrap" }}>
        <div style={{ minWidth: 0 }}>{titleBlock}</div>
        <div style={{ paddingBottom: 10 }}>{side}</div>
      </div>
    );
  }

  return (
    <section ref={ref} style={{ position: "relative", minHeight: sp.minHeight, overflow: "hidden", isolation: "isolate", background: sp.backgroundColor, color: sp.textColor }}>
      <Background L={L} chrome={chrome} />
      <SectionMotifs bp={bp} />
      <Lighting chrome={chrome} />
      <Chrome L={L} />
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: px, right: px, top: `calc(${py}px + var(--nav-clear, 0px))`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          {kicker ? <HeroText id={kicker.id} /> : <span />}
          {corners.map((m) => <HeroText key={m.id} id={m.id} />)}
        </div>
        {content}
      </div>
    </section>
  );
}
