import { SectionMotifs } from "../../motifs/MotifContext.jsx";
import { useEffect, useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../../components/hero-studio/runtime/HeroButton.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";

const mix = (c, pct, other = "transparent") => `color-mix(in srgb, ${c} ${Math.round(pct)}%, ${other})`;
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Asymmetric placements on a 12 × 6 grid: [col, colSpan, row, rowSpan] (0-based).
const ASYM = {
  4: [[0, 6, 0, 6], [6, 6, 0, 3], [6, 3, 3, 3], [9, 3, 3, 3]],
  6: [[0, 5, 0, 6], [5, 4, 0, 4], [9, 3, 0, 3], [9, 3, 3, 3], [5, 2, 4, 2], [7, 2, 4, 2]],
  9: [[0, 4, 0, 4], [4, 4, 0, 2], [8, 4, 0, 3], [4, 2, 2, 2], [6, 2, 2, 2], [0, 2, 4, 2], [2, 2, 4, 2], [4, 4, 4, 2], [8, 4, 3, 3]],
};
const symCols = (n) => (n <= 2 ? n : n === 4 ? 4 : n <= 6 ? 3 : n <= 8 ? 4 : 3);

// Grid template + per-panel placement for the active arrangement.
function arrangement(layout, n, bp, mobileCount) {
  if (bp === "mobile") {
    const m = Math.min(n, mobileCount);
    return { cols: m === 1 ? 1 : 2, rows: m === 3 ? 2 : 1, place: (i) => (m === 3 && i === 0 ? { col: 0, cs: 2, row: 0, rs: 1 } : null), n: m };
  }
  if (layout === "filmstrip" || layout === "curtain") return { cols: n, rows: 1, place: () => null, n };
  if (layout === "asymmetric" && bp === "desktop" && ASYM[n]) {
    return { cols: 12, rows: 6, place: (i) => { const [col, cs, row, rs] = ASYM[n][i]; return { col, cs, row, rs }; }, n };
  }
  const cols = bp === "tablet" ? Math.min(3, symCols(n)) : symCols(n);
  return { cols, rows: Math.ceil(n / cols), place: () => null, n };
}

function Panel({ id, index, grid, sp, fragment }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  const at = grid.place(index);
  const radius = p.radius >= 0 ? p.radius : sp.radius;
  const custom = p.colSpan > 0 || p.rowSpan > 0;
  const area = custom
    ? { gridColumn: p.colSpan > 0 ? `span ${Math.min(p.colSpan, grid.cols)}` : undefined, gridRow: p.rowSpan > 0 ? `span ${p.rowSpan}` : undefined }
    : at ? { gridColumn: `${at.col + 1} / span ${at.cs}`, gridRow: `${at.row + 1} / span ${at.rs}` } : {};

  // Fragment mode: every panel shows its slice of one shared image so the grid reads as a single picture.
  const img = fragment ? fragment.url : p.imageUrl;
  const pos = fragment
    ? `${grid.cols > 1 ? ((index % grid.cols) / (grid.cols - 1)) * 100 : 50}% ${grid.rows > 1 ? (Math.floor(index / grid.cols) / (grid.rows - 1)) * 100 : 50}%`
    : `${p.focalX}% ${p.focalY}%`;
  const size = fragment ? `${grid.cols * 100}% ${grid.rows * 100}%` : "cover";

  return (
    <HeroElement id={id} wrapperClassName={p.hoverZoom && !fragment ? "syn-panel syn-panel-hover" : "syn-panel"}
      wrapperStyle={{ ...area, position: "relative", minHeight: 0, minWidth: 0, height: "100%", borderRadius: radius, transition: "border-radius 1.2s cubic-bezier(.2,.8,.2,1)" }}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: radius, background: `linear-gradient(160deg, ${p.fallback2}, ${p.fallback1})`, transition: "border-radius 1.2s cubic-bezier(.2,.8,.2,1)" }}>
      <div className="syn-panel-img" style={{
        position: "absolute", inset: 0, "--z": fragment ? 1 : p.zoom || 1, transform: "scale(var(--z))", transformOrigin: `${p.focalX}% ${p.focalY}%`,
        backgroundImage: img ? `url("${img}")` : undefined, backgroundSize: size, backgroundPosition: pos, backgroundRepeat: "no-repeat",
      }} />
      {p.videoUrl && !fragment && (
        <video src={p.videoUrl} autoPlay muted loop playsInline preload="metadata"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${p.focalX}% ${p.focalY}%`, transform: `scale(${p.zoom || 1})` }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: p.overlayColor, opacity: p.overlayOpacity, pointerEvents: "none" }} />
      {p.caption && !fragment && (
        <div style={{ position: "absolute", left: 12, bottom: 10, right: 12, display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.88)", textShadow: "0 1px 8px rgba(0,0,0,.45)" }}>
          <EditableText id={id} k="caption" value={p.caption} />
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
      )}
    </HeroElement>
  );
}

function Background() {
  const { elementsById, resolveEl, sectionProps: sp } = useHeroRuntime();
  const el = elementsById.background;
  if (!el) return null;
  const p = resolveEl(el);
  return (
    <HeroElement id="background" wrapperStyle={{ position: "absolute", inset: 0, zIndex: 0 }} style={{ position: "absolute", inset: 0, overflow: "hidden", background: sp.backgroundColor }}>
      {p.imageUrl && <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${p.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: p.imageOpacity ?? 0.2 }} />}
      {p.vignette > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 100% at 50% 40%, transparent 50%, ${mix("#000", p.vignette * 100)} 100%)` }} />}
    </HeroElement>
  );
}

// Film grain sits above the images (purely decorative, never intercepts clicks).
function Grain() {
  const { elementsById, resolveEl } = useHeroRuntime();
  const el = elementsById.background;
  const g = el ? resolveEl(el).grain : 0;
  if (!g) return null;
  return <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none", backgroundImage: GRAIN, opacity: g, mixBlendMode: "overlay" }} />;
}

export default function CinematicReveal() {
  const { elements, resolveEl, sectionProps: sp, bp, motion, playKey } = useHeroRuntime();
  const mobile = bp === "mobile";
  const all = elements.filter((e) => e.type === "panel" && e.visible !== false && !resolveEl(e).hidden);
  const count = sp.panelCount === "all" ? all.length : Math.min(all.length, Number(sp.panelCount) || all.length);
  const grid = arrangement(sp.layout, count, bp, sp.mobilePanels || 3);
  const panels = all.slice(0, grid.n);
  const metas = elements.filter((e) => e.type === "meta");
  const [kicker, ...indexes] = metas;
  const headings = elements.filter((e) => e.type === "heading");
  const texts = elements.filter((e) => e.type === "text");
  const buttons = elements.filter((e) => e.type === "button");

  const expansion = sp.layout === "expansion" && !mobile;
  const firstImg = panels[0] ? resolveEl(panels[0]).imageUrl : "";
  const placement = sp.textPlacement === "auto"
    ? (sp.layout === "curtain" || sp.layout === "expansion") && !mobile ? "overlay" : "above"
    : mobile && sp.textPlacement === "overlay" ? "above" : sp.textPlacement;
  const overlay = placement === "overlay";

  // Expansion: fragments start apart, then the gaps close and corners square off into one image.
  const [assembledAt, setAssembledAt] = useState(null);
  const assembled = !expansion || !motion || assembledAt === playKey;
  useEffect(() => {
    if (!expansion || !motion) return;
    const t = setTimeout(() => setAssembledAt(playKey), (sp.assembleDelay ?? 1.6) * 1000);
    return () => clearTimeout(t);
  }, [expansion, motion, playKey, sp.assembleDelay]);

  const gx = expansion && assembled ? 0 : sp.gapX;
  const gy = expansion && assembled ? 0 : sp.gapY;
  const filmH = sp.layout === "filmstrip" ? Math.round(sp.gridHeight * 0.78) : sp.gridHeight;
  const curtainH = sp.layout === "curtain" && !mobile ? Math.max(sp.gridHeight, 680) : filmH;
  const gridH = mobile ? (grid.rows === 2 ? 440 : 300) : curtainH;
  const panelSp = expansion && assembled ? { ...sp, radius: 0 } : sp;

  const text = (
    <div style={{
      position: overlay ? "absolute" : "relative", zIndex: 10, pointerEvents: "none",
      ...(overlay ? { left: mobile ? 18 : 48, right: mobile ? 18 : 48, bottom: mobile ? 28 : 52 } : {}),
      display: "flex", flexDirection: mobile || overlay ? "column" : "row", alignItems: mobile || overlay ? "flex-start" : "flex-end", justifyContent: "space-between", gap: mobile ? 18 : 40,
      margin: overlay ? 0 : placement === "below" ? `${mobile ? 28 : 44}px 0 0` : `0 0 ${mobile ? 28 : 44}px`,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
        {kicker && <HeroText id={kicker.id} wrapper={{ marginBottom: mobile ? 14 : 22 }} />}
        {headings.map((h) => <HeroText key={h.id} id={h.id} as="h1" />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: mobile ? 18 : 22, flexShrink: 0, paddingBottom: overlay || mobile ? 0 : 10 }}>
        {texts.map((t) => <HeroText key={t.id} id={t.id} as="p" />)}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{buttons.map((b) => <HeroButton key={b.id} id={b.id} />)}</div>
      </div>
    </div>
  );

  return (
    <section style={{ position: "relative", minHeight: sp.minHeight || undefined, overflow: "hidden", isolation: "isolate", background: sp.backgroundColor, color: sp.textColor }}>
      <Background />
      <SectionMotifs bp={bp} />
      <div style={{ position: "relative", zIndex: 2, boxSizing: "border-box", padding: `calc(${sp.paddingY}px + var(--nav-clear, 0px)) ${sp.paddingX}px ${sp.paddingY}px`, maxWidth: sp.contained ? sp.maxWidth : undefined, marginInline: "auto", pointerEvents: "none" }}>
        {indexes.length > 0 && !overlay && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: mobile ? 12 : 18 }}>
            {indexes.map((m) => <HeroText key={m.id} id={m.id} />)}
          </div>
        )}
        {placement === "above" && text}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`, gridAutoFlow: "dense",
            columnGap: gx, rowGap: gy, height: gridH, alignContent: sp.gridAlign, pointerEvents: "auto",
            transition: "column-gap 1.2s cubic-bezier(.2,.8,.2,1), row-gap 1.2s cubic-bezier(.2,.8,.2,1)",
          }}>
            {panels.map((pn, i) => <Panel key={pn.id} id={pn.id} index={i} grid={grid} sp={panelSp} fragment={expansion ? { url: firstImg } : null} />)}
          </div>
          {overlay && (
            <>
              <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none", borderRadius: panelSp.radius, background: `linear-gradient(to top, ${mix(sp.backgroundColor, 82)} 0%, ${mix(sp.backgroundColor, 30)} 45%, transparent 75%)` }} />
              {indexes.length > 0 && (
                <div style={{ position: "absolute", top: mobile ? 16 : 28, right: mobile ? 18 : 40, zIndex: 10, pointerEvents: "none" }}>
                  {indexes.map((m) => <HeroText key={m.id} id={m.id} />)}
                </div>
              )}
              {text}
            </>
          )}
        </div>
        {placement === "below" && text}
      </div>
      <Grain />
    </section>
  );
}
