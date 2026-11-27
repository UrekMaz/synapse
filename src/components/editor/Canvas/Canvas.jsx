import { useEffect, useMemo, useRef } from "react";
import { Crosshair, X } from "lucide-react";
import { useEditorStore } from "../../../store/editorStore.js";
import { describeGrid, getGridForViewport } from "../../../utils/layoutUtils.js";
import PageContainer from "./PageContainer.jsx";
import { ScrollContainerContext } from "../../../animations/engine/ScrollContainerContext.js";
import { LinkContext, scrollToAnchor } from "../../hero-studio/runtime/links.js";
import { siteSummary } from "../../../utils/links.js";
import { getHero } from "../../../registry/heroRegistry.js";

export default function Canvas() {
  const { page, pages, viewport, zoom, setZoom, mode, showGrid, showBounds, select, linkPicker, setView, switchPage, linkSettings } = useEditorStore();
  const ref = useRef(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const isEdit = mode === "edit";
  const g = getGridForViewport(page, viewport);

  // Ctrl/Cmd + wheel zoom (needs a non-passive native listener)
  useEffect(() => {
    const el = ref.current;
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom(zoomRef.current * (e.deltaY < 0 ? 1.08 : 0.92));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setZoom]);

  // Escape leaves "choose section on canvas" mode.
  useEffect(() => {
    if (!linkPicker) return;
    const onKey = (e) => e.key === "Escape" && setView("linkPicker", null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [linkPicker, setView]);

  // Links behave for real in Preview mode: section links scroll the canvas, page links switch pages.
  const linkCtx = useMemo(() => ({
    site: siteSummary(page, pages, (s) => getHero(s.type)?.name || s.type),
    currentPageId: page.id, editor: isEdit, inCanvas: true, containerRef: ref, scroll: linkSettings,
    navigate: (pageId, anchor) => {
      switchPage(pageId);
      if (anchor) setTimeout(() => scrollToAnchor(anchor, { container: ref.current, behavior: "instant", offset: linkSettings.offset }), 120);
      else ref.current?.scrollTo({ top: 0 });
    },
  }), [page, pages, isEdit, linkSettings, switchPage]);

  const deselect = (e) => { if (e.target === e.currentTarget && !linkPicker) select(null); };

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-auto"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
      onPointerDown={deselect}
    >
      <div className="flex min-h-full min-w-max flex-col items-center"
           style={{ padding: isEdit ? "64px 324px 120px 284px" : "64px 40px 120px" }}
           onPointerDown={deselect}>
        {linkPicker ? (
          <span className="sticky top-3 z-[70] mb-3 flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100 shadow-lg backdrop-blur">
            <Crosshair size={13} /> Click the section this link should go to
            <button onClick={() => setView("linkPicker", null)} className="ml-1 text-emerald-200 hover:text-white" title="Cancel (Esc)"><X size={13} /></button>
          </span>
        ) : isEdit && (
          <span className="mb-3 rounded-full border border-ed-border bg-ed-raised px-3 py-1 text-xs text-ed-muted">
            {describeGrid(g)}
          </span>
        )}
        <div style={{ zoom }} data-picking={linkPicker ? "" : undefined}>
          {/* Scroll-driven animations and navbar scroll behaviour read the canvas scroller, not the window. */}
          <ScrollContainerContext.Provider value={ref}>
            <LinkContext.Provider value={linkCtx}>
              <PageContainer page={page} viewport={viewport} editor={isEdit} showGrid={showGrid} showBounds={showBounds} />
            </LinkContext.Provider>
          </ScrollContainerContext.Provider>
        </div>
      </div>
    </div>
  );
}
