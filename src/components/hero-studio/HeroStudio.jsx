import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { Monitor, Plus, Play, RotateCcw, Smartphone, Tablet, X } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { getHero } from "../../registry/heroRegistry.js";
import { createHeroNode, setElementProp } from "../../utils/heroNode.js";
import { makeHeroApi } from "../../utils/heroApi.js";
import { VIEWPORTS } from "../../data/layoutPresets.js";
import HeroRenderer from "../../renderer/HeroRenderer.jsx";
import HeroInspector from "./HeroInspector.jsx";
import AnimationTimeline from "../animation-studio/AnimationTimeline.jsx";
import { Segmented } from "../ui/primitives.jsx";

// studioKey = "sectionId" or "sectionId::variationId" (library card).
function StudioModal({ studioKey }) {
  const [heroId, variationId = null] = studioKey.split("::");
  const def = getHero(heroId);
  const { closeStudio, placeSection, withSiteCopy } = useEditorStore();
  const [node, setNode] = useState(() => withSiteCopy(createHeroNode(heroId, variationId)));
  const [vp, setVp] = useState("desktop");
  const [playKey, setPlayKey] = useState(0);
  const [selEl, setSelEl] = useState(null);
  const [tab, setTab] = useState("design");
  const [preview, setPreview] = useState(null);

  const stageRef = useRef(null);
  const [stageW, setStageW] = useState(900);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setStageW(e.contentRect.width));
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeStudio();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeStudio]);

  const replay = () => { setPreview(null); setPlayKey((k) => k + 1); };
  const previewEl = (id) => setPreview((p) => ({ elementId: id, n: (p?.n || 0) + 1 }));
  const editProp = useCallback((id, key, v) => setNode((n) => produce(n, (d) => setElementProp(d, id, key, v, "desktop", false))), []);
  const api = useMemo(
    () => makeHeroApi({ def, viewport: vp, edit: (fn) => setNode((n) => produce(n, fn)), select: setSelEl, replay, preview: previewEl }),
    [def, vp]
  );

  const deviceW = VIEWPORTS[vp].width;
  const scale = Math.min(1, (stageW - 48) / deviceW);

  const add = () => { placeSection(node); closeStudio(); };
  const reset = () => { setNode(withSiteCopy(createHeroNode(heroId, variationId))); setSelEl(null); replay(); };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/70 p-4 backdrop-blur-sm" onPointerDown={(e) => e.target === e.currentTarget && closeStudio()}>
      <div className="panel flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-ed-border px-4 py-3">
          <div className="min-w-0">
            <div className="truncate font-semibold">{def.name}</div>
            <div className="truncate text-xs text-ed-muted">{def.description}</div>
          </div>
          <div className="ml-auto w-[210px]">
            <Segmented value={vp} onChange={setVp} options={[{ id: "desktop", label: "", icon: Monitor }, { id: "tablet", label: "", icon: Tablet }, { id: "mobile", label: "", icon: Smartphone }]} />
          </div>
          <button onClick={replay} className="flex h-9 items-center gap-1.5 rounded-xl border border-ed-border bg-ed-raised px-3 text-sm hover:bg-white/10"><Play size={14} /> Play</button>
          <button onClick={reset} title="Reset customizations" className="grid h-9 w-9 place-items-center rounded-xl border border-ed-border bg-ed-raised hover:bg-white/10"><RotateCcw size={14} /></button>
          <button onClick={add} className="flex h-9 items-center gap-1.5 rounded-xl bg-ed-accent px-4 text-sm font-semibold hover:brightness-110"><Plus size={14} /> Add to Page</button>
          <button onClick={closeStudio} className="text-ed-muted hover:text-white"><X size={18} /></button>
        </header>

        <div ref={stageRef} className="min-h-0 flex-1 overflow-auto p-6" onPointerDown={(e) => e.target === e.currentTarget && setSelEl(null)}
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
          <div className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-2xl" style={{ width: deviceW, zoom: scale, ...(def.kind === "nav" ? { minHeight: 640, background: node.props.overlay ? "linear-gradient(135deg,#1f1b3a,#0b0b14 60%,#2b1d1d)" : "linear-gradient(#f4f5f8,#e9ebf1)" } : {}) }}>
            <HeroRenderer node={node} editor viewport={vp} playKey={playKey} preview={preview} selectedElementId={selEl} onSelectElement={setSelEl} onEditProp={editProp} />
          </div>
        </div>

        <div className="h-[210px] shrink-0 border-t border-ed-border">
          <AnimationTimeline node={node} selectedElementId={selEl} api={api} onPlay={replay} />
        </div>
      </div>

      <aside className="panel ml-3 flex w-[320px] shrink-0 flex-col overflow-hidden">
        <HeroInspector node={node} def={def} viewport={vp} selectedElementId={selEl} api={api} tab={tab} onTab={setTab} />
      </aside>
    </div>
  );
}

export default function HeroStudio() {
  const heroId = useEditorStore((s) => s.studioHeroId);
  return heroId ? <StudioModal key={heroId} studioKey={heroId} /> : null;
}