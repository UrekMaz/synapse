import { useState } from "react";
import { useEditorStore } from "../../../store/editorStore.js";
import { getHero } from "../../../registry/heroRegistry.js";
import { makeHeroApi } from "../../../utils/heroApi.js";
import HeroInspector from "../../hero-studio/HeroInspector.jsx";
import { Switch } from "../../ui/primitives.jsx";

export default function StoreHeroInspector({ section }) {
  const s = useEditorStore();
  const [tab, setTab] = useState("design");
  const def = getHero(section.type);
  if (!def) return <p className="p-4 text-sm text-ed-muted">Unknown section type.</p>;

  const api = makeHeroApi({
    def, viewport: s.viewport,
    edit: (fn, key) => s.editSection(section.id, fn, key),
    select: (id) => s.selectElement(section.id, id),
    replay: () => s.replaySection(section.id),
    preview: (id) => s.previewElement(section.id, id),
    extra: { toggleTimeline: s.toggleTimeline },
  });

  // Section identity: the name shown in link pickers and the URL anchor (#about). The stable id never changes.
  const identity = (
    <div className="space-y-2 border-b border-ed-border p-4">
      <label className="block text-xs text-ed-muted">Section name (shown in link menus)
        <input className="field mt-1" value={section.name ?? def.name} onChange={(e) => s.renameSection(section.id, e.target.value)} />
      </label>
      <label className="block text-xs text-ed-muted">Anchor (URL)
        <div className="mt-1 flex items-center gap-1"><span className="text-sm">#</span><input className="field" value={section.anchor ?? section.id} onChange={(e) => s.setSectionAnchor(section.id, e.target.value)} /></div>
      </label>
      <div className="flex items-center justify-between text-xs text-ed-muted">
        <span>Follow site theme{section.themeLock ? <span className="ml-1 text-amber-300">(locked to its own snapshot)</span> : null}</span>
        <Switch checked={!section.themeLock} onChange={(follow) => s.lockSectionTheme(section.id, !follow)} />
      </div>
      {(() => { const n = s.linkRefs(section.id).length; return <p className="text-[11px] text-ed-muted">{n ? `${n} link${n > 1 ? "s" : ""} point here.` : "No links point here yet."}</p>; })()}
    </div>
  );

  return <HeroInspector node={section} def={def} viewport={s.viewport} selectedElementId={s.selectedElementId} api={api} tab={tab} onTab={setTab} identity={identity} />;
}