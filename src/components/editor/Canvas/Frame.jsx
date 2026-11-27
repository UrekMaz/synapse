import { Copy, Trash2, Maximize2 } from "lucide-react";
import { useEditorStore } from "../../../store/editorStore.js";

export default function Frame({ frame }) {
  const { selectedId, select, viewport } = useEditorStore();
  const selected = selectedId === frame.id;
  const width = viewport === "mobile" ? 375 : viewport === "tablet" ? 768 : frame.w;

  return (
    <div
      className="absolute pointer-events-auto"
      style={{ left: frame.x, top: frame.y, width }}
      onPointerDown={(e) => { e.stopPropagation(); select(frame.id); }}
    >
      {/* name chip */}
      <div className="absolute -top-8 left-0 flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border
          ${selected ? "bg-ed-accent text-white border-ed-accent" : "bg-ed-raised text-ed-muted border-ed-border"}`}>
          {frame.name}
        </span>
        {selected && (
          <span className="flex gap-1 p-1 rounded-full bg-ed-raised border border-ed-border">
            <Copy size={13} className="m-1 text-ed-muted" />
            <Maximize2 size={13} className="m-1 text-ed-muted" />
            <Trash2 size={13} className="m-1 text-ed-muted" />
          </span>
        )}
      </div>

      {/* light website canvas (your renderer goes here later) */}
      <div
        className={`rounded-lg overflow-hidden bg-white text-neutral-900 transition-shadow ${selected ? "shadow-glow" : "ring-1 ring-ed-border"}`}
        style={{ height: frame.h }}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold">{frame.name}</h2>
          <p className="text-sm text-neutral-500 mt-2">Renderer output will appear here.</p>
        </div>
      </div>
    </div>
  );
}