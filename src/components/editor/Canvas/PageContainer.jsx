import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import GridOverlay from "./GridOverlay.jsx";
import SectionRenderer from "../../../renderer/SectionRenderer.jsx";
import { altFor, getCompositionRegions, getGridForViewport, getPageCssVars, navClearFor, regionBleeds, regionOf, regionWidth } from "../../../utils/layoutUtils.js";
import { resolveTheme, themeCssVars } from "../../../utils/tokens.js";
import { loadFont } from "../../../utils/fonts.js";
import SoundControl from "../../../audio/SoundControl.jsx";
import { ExperienceContext } from "../../../library/motifs/MotifContext.jsx";
import { experienceAttrs, resolveExperience } from "../../../library/motifs/experience.js";

// Published pages: sections below the fold fade/rise in once as they scroll into view.
function useSectionReveal(ref, transition) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !transition || typeof IntersectionObserver === "undefined") return;
    // Each section animates in once, the first time it enters the viewport.
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.dataset.reveal = "in"; io.unobserve(e.target); }
      else if (!e.target.dataset.reveal) e.target.dataset.reveal = "pending";
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    root.querySelectorAll('.section-wrap[data-kind="body"], .section-wrap[data-kind="footer"]').forEach((el) => io.observe(el));
    return () => { io.disconnect(); root.querySelectorAll("[data-reveal]").forEach((el) => delete el.dataset.reveal); };
  }, [ref, transition]);
}

// Editor-only chrome is code-split so published pages never load it.
const EditorRegion = lazy(() => import("./EditorSections.jsx"));

const place = (r) => ({ gridColumn: `${r.colStart} / span ${r.colSpan}`, gridRow: `${r.rowStart} / span ${r.rowSpan}` });

// Published pages: the browser picks columns per breakpoint, so region placement needs media queries too.
function liveRegionCss(page) {
  const { type } = page.layout;
  const rule = (regions) => regions.map((r) => `.page-root [data-region="${r.id}"]{grid-column:${r.colStart} / span ${r.colSpan};grid-row:${r.rowStart} / span ${r.rowSpan}}`).join("");
  return `${rule(getCompositionRegions(type, page.responsive.desktop.columns))}
@media (max-width:1023px){${rule(getCompositionRegions(type, page.responsive.tablet.columns))}}
@media (max-width:639px){${rule(getCompositionRegions(type, page.responsive.mobile.columns, true))}}`;
}

export default function PageContainer({ page, viewport, editor = false, showGrid = true, showBounds = true }) {
  const g = getGridForViewport(page, viewport || "desktop");
  const vars = getPageCssVars(page, viewport);
  const regions = getCompositionRegions(page.layout.type, g.columns, viewport === "mobile");
  const has = page.sections.length > 0;
  const minHeight = editor ? (has ? 0 : 880) : "100vh";
  const boxed = page.layout.width !== "full";

  const surface = viewport ? { width: g.surfaceWidth } : { width: "100%" };
  const theme = resolveTheme(page.theme);
  loadFont(theme.typography.heading);
  loadFont(theme.typography.body);
  loadFont(theme.typography.accent);
  const rootRef = useRef(null);
  const exp = useMemo(() => resolveExperience(theme.experience), [theme.experience]);
  const order = page.sections.filter((s) => s.kind !== "nav").map((s) => s.id).join(",");
  const xp = useMemo(() => (exp ? { exp, order: order.split(","), editor } : null), [exp, order, editor]);
  const transition = !editor && exp?.motion.enabled && exp.motion.transition !== "none" ? exp.motion.transition : null;
  useSectionReveal(rootRef, transition);
  const byRegion = Object.fromEntries(regions.map((r) => [r.id, []]));
  page.sections.forEach((s) => byRegion[regionOf(s, regions)].push(s));

  return (
    <ExperienceContext.Provider value={xp}>
    <div
      ref={rootRef}
      {...experienceAttrs(exp, editor)}
      className="page-root relative text-neutral-900 transition-[width] duration-300"
      data-live={viewport ? undefined : ""}
      data-boxed={boxed || undefined}
      data-alternate={theme.sections.alternate || undefined} data-section-gradient={theme.effects.sectionGradient || undefined}
      data-dividers={theme.sections.dividers || undefined} data-grain={theme.effects.grain > 0 || undefined}
      style={{ ...surface, ...vars, ...themeCssVars(page.theme), minHeight, boxShadow: editor && showBounds ? "0 0 0 1px rgba(139,108,255,.9), 0 0 32px rgba(139,108,255,.2)" : "0 1px 3px rgba(0,0,0,.15)" }}
    >
      {!viewport && <style>{liveRegionCss(page)}</style>}
      {!viewport && !editor && exp?.sound.enabled && <SoundControl sound={exp.sound} rootRef={rootRef} />}
      <div className="page-container" style={{ minHeight, paddingBlock: has ? 0 : 48 }}>
        {editor && (showGrid || showBounds) && <GridOverlay columns={g.columns} showGrid={showGrid} showBounds={showBounds} />}

        <div className="layout-grid" style={{ rowGap: has && regions.length === 1 ? 0 : undefined }}>
          {regions.map((r) => {
            const sections = byRegion[r.id];
            const bleed = regionBleeds(page, r, g.columns);
            const width = bleed ? g.surfaceWidth : regionWidth(g, r);
            if (editor) {
              return (
                <Suspense key={r.id} fallback={null}>
                  <EditorRegion region={r} sections={sections} page={page} viewport={viewport} bleed={bleed} width={width} empty={!has} style={place(r)} />
                </Suspense>
              );
            }
            if (!sections.length && !(r.primary && !has)) return <div key={r.id} data-region={r.id} style={viewport ? place(r) : undefined} />;
            return (
              <div key={r.id} className="layout-region" data-region={r.id} style={viewport ? place(r) : undefined}>
                {!has ? <p className="py-24 text-center text-sm text-neutral-400">This page has no sections yet.</p>
                  : sections.map((s, i) => <SectionRenderer key={s.id} section={s} alt={altFor(sections, i)} navClear={navClearFor(sections, i, viewport || "desktop")} viewport={viewport} bleed={bleed} layoutWidth={viewport ? width : null} />)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </ExperienceContext.Provider>
  );
}
