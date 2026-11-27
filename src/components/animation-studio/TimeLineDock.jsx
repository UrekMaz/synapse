import { X } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { getHero } from "../../registry/heroRegistry.js";
import { makeHeroApi } from "../../utils/heroApi.js";
import AnimationTimeline from "./AnimationTimeline.jsx";

export default function TimelineDock() {
  const s = useEditorStore();
  const section = s.page.sections.find((x) => x.id === s.selectedId);
  if (!s.timelineOpen || !section || s.mode !== "edit") return null;
  const def = getHero(section.type);
  const api = makeHeroApi({
    def, viewport: s.viewport,
    edit: (fn, key) => s.editSection(section.id, fn, key),
    select: (id) => s.selectElement(section.id, id),
    replay: () => s.replaySection(section.id),
    preview: (id) => s.previewElement(section.id, id),
  });
  return (
    <div className="panel absolute bottom-[76px] left-[284px] right-[324px] z-20 flex h-[230px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-ed-border px-3 py-1.5">
        <span className="label">Animation timeline · {def.name}</span>
        <button onClick={s.toggleTimeline} className="text-ed-muted hover:text-white"><X size={14} /></button>
      </div>
      <div className="min-h-0 flex-1">
        <AnimationTimeline node={section} selectedElementId={s.selectedElementId} api={api} onPlay={api.replay} />
      </div>
    </div>
  );
}