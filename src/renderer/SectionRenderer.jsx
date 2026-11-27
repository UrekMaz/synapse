import { useMemo, useRef } from "react";
import HeroRenderer from "./HeroRenderer.jsx";
import MotifLayer from "../library/motifs/Motifs.jsx";
import { useExperience, SectionMotifContext, motifMotion } from "../library/motifs/MotifContext.jsx";
import { motifsForSection, resolveExperience } from "../library/motifs/experience.js";
import { getHero } from "../registry/heroRegistry.js";
import { anchorOf } from "../utils/links.js";
import { themeCssVars } from "../utils/tokens.js";

// Escapes the page container's side margins so sections run edge to edge. Only used on full-width pages,
// where the container spans the whole page, so cancelling --page-margin is exact.
const BLEED = { width: "calc(100% + 2 * var(--page-margin, 0px))", marginInline: "calc(-1 * var(--page-margin, 0px))", position: "relative" };
const CONTAINED = { width: "100%", position: "relative" };

/*
 * Navbars need their positioning on the wrapper itself: sticky/fixed only work on a direct child of the region,
 * and "transparent over hero" collapses the wrapper to zero height so the next section slides underneath.
 * In the editor, "fixed" previews as sticky (a fixed bar would escape the zoomed canvas).
 */
function navWrap(section, editor, base) {
  const p = section.props;
  const pos = p.position === "fixed" && !editor ? "fixed" : p.position === "static" ? "relative" : "sticky";
  const wrap = { ...base, position: pos, top: 0, zIndex: 60 };
  if (pos === "fixed") Object.assign(wrap, { left: 0, right: 0, width: "100%", marginInline: 0 });
  if (p.overlay) wrap.height = 0;
  return { wrap, spacer: pos === "fixed" && !p.overlay ? p.height : 0 };
}

/*
 * Editor: drag the bar under a selected section to change its height (navbar: bar height, others: minimum height).
 * Double-click resets to the design's own height.
 */
function SectionResizeHandle({ wrapRef, section, onResize }) {
  const key = section.kind === "nav" ? "height" : "minHeight";
  const start = (e) => {
    e.preventDefault(); e.stopPropagation();
    const host = wrapRef.current?.querySelector(".hero-host");
    if (!host) return;
    const k = host.getBoundingClientRect().width / host.offsetWidth || 1;
    const h0 = host.offsetHeight, y0 = e.clientY, handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    let raf = 0, last = null;
    const move = (ev) => {
      last = Math.max(section.kind === "nav" ? 40 : 80, Math.round(h0 + (ev.clientY - y0) / k));
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; onResize({ [key]: last }); });
    };
    const up = () => {
      cancelAnimationFrame(raf);
      if (last != null) onResize({ [key]: last });
      handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); handle.removeEventListener("pointercancel", up);
      document.body.classList.remove("syn-resizing");
    };
    handle.addEventListener("pointermove", move); handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
    document.body.classList.add("syn-resizing");
  };
  return (
    <div className="syn-sec-resize" title="Drag to change the section height · double-click to reset" onPointerDown={start}
      onDoubleClick={(e) => { e.stopPropagation(); onResize({ [key]: null }); }} onClick={(e) => e.stopPropagation()}>
      <span />
    </div>
  );
}

/* navClear: height of a transparent navbar directly above; exposed as --nav-clear so top content can clear it. */
export default function SectionRenderer({ section, navClear = 0, alt = false, editor = false, viewport = null, bleed = true, layoutWidth = null, selected = false, selectedElementId = null, playKey = 0, preview = null, onSelect, onSelectElement, onEditProp, onResizeElement, onResizeSection, toolbar = null }) {
  const xp = useExperience();
  const wrapRef = useRef(null);
  const motifs = useMemo(() => {
    // A section with its own theme snapshot decorates with that theme's motifs.
    const exp = section.themeLock ? resolveExperience(section.themeLock.experience) : xp?.exp;
    const out = motifsForSection(exp, section, xp ? xp.order.indexOf(section.id) : -1);
    const k = exp?.motion.intensity ?? 1;
    if (k !== 1) for (const key of ["back", "front", "seam"]) out[key] = out[key].map((m) => ({ ...m, speed: (m.speed || 1) * k }));
    return { ...out, motion: motifMotion(xp && exp ? { ...xp, exp } : xp) };
  }, [xp, section]);
  const bp = viewport || (typeof window === "undefined" ? "desktop" : window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
  const hovers = motifs.motion && [...motifs.back, ...motifs.front].some((m) => m.hover && m.hover !== "none");
  // Cursor position (-0.5 … 0.5) as CSS variables for parallax / follow / tilt motifs.
  const onPointerMove = hovers ? (e) => {
    const el = wrapRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  } : undefined;
  if (!getHero(section.type)) return null;
  const base = bleed ? BLEED : CONTAINED;
  const nav = section.kind === "nav" ? navWrap(section, editor, base) : null;
  return (
    <>
      {nav?.spacer > 0 && <div aria-hidden style={{ height: nav.spacer }} />}
      {motifs.seam.length > 0 && (
        <div className="syn-motif-seam" aria-hidden>
          <MotifLayer motifs={motifs.seam} motion={motifs.motion} bp={bp} style={{ inset: "auto", left: 0, right: 0, top: -130, height: 260, zIndex: 5 }} />
        </div>
      )}
      <div ref={wrapRef} onPointerMove={onPointerMove} className="section-wrap" id={anchorOf(section)} data-section={section.id} data-name={section.name || getHero(section.type)?.name} data-kind={section.kind} data-overlay={nav && section.props.overlay ? "" : undefined}
        data-alt={alt || undefined} data-locked={section.themeLock ? "" : undefined} data-selected={selected || undefined}
        // A section that opted out of the global theme carries its own snapshot of theme variables.
        style={{ ...(section.themeLock ? themeCssVars(section.themeLock) : {}), ...(nav ? nav.wrap : base), "--nav-clear": navClear ? `${navClear}px` : undefined }} onPointerDown={onSelect}>
        {toolbar}
        <SectionMotifContext.Provider value={motifs}>
          <HeroRenderer node={section} editor={editor} viewport={viewport} layoutWidth={layoutWidth} playKey={playKey} preview={preview}
            selectedElementId={selectedElementId} onSelectElement={onSelectElement} onEditProp={onEditProp} onResizeElement={onResizeElement} />
        </SectionMotifContext.Provider>
        {motifs.front.length > 0 && <MotifLayer motifs={motifs.front} motion={motifs.motion} bp={bp} front />}
        {editor && selected && onResizeSection && <SectionResizeHandle wrapRef={wrapRef} section={section} onResize={onResizeSection} />}
      </div>
    </>
  );
}
