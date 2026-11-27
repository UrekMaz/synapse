import { Monitor, Tablet, Smartphone, Minus, Plus, Clapperboard } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { IconButton } from "../ui/primitives.jsx";

export default function BottomToolbar() {
  const { viewport, setViewport, zoom, setZoom, timelineOpen, toggleTimeline } = useEditorStore();
  return (
    <div className="panel absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 p-2">
      {[["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]].map(([id, Icon]) => (
        <IconButton key={id} icon={Icon} active={viewport === id} onClick={() => setViewport(id)} />
      ))}
      <span className="mx-1 h-6 w-px bg-ed-border" />
      <IconButton icon={Minus} onClick={() => setZoom(zoom - 0.1)} />
      <span className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
      <IconButton icon={Plus} onClick={() => setZoom(zoom + 0.1)} />
      <span className="mx-1 h-6 w-px bg-ed-border" />
      <IconButton icon={Clapperboard} active={timelineOpen} onClick={toggleTimeline} title="Animation timeline" />
    </div>
  );
}