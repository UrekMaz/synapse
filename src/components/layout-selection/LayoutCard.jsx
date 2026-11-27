import { Check } from "lucide-react";
import LayoutPreview from "./LayoutPreview.jsx";
import { DEFAULT_DRAFT } from "../../data/layoutPresets.js";

export default function LayoutCard({ preset, selected, onSelect }) {
  const settings = { ...DEFAULT_DRAFT, width: preset.width, composition: preset.composition };
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`group rounded-2xl border p-3 text-left transition-all duration-200
        ${selected
          ? "border-ed-accent bg-ed-accent/10 shadow-[0_0_0_1px_rgba(139,108,255,.9),0_0_28px_rgba(139,108,255,.25)]"
          : "border-ed-border bg-ed-panel hover:-translate-y-0.5 hover:border-white/25"}`}
    >
      <LayoutPreview settings={settings} />
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="font-medium">{preset.name}</span>
        {preset.recommended && (
          <span className="rounded-full bg-ed-accent/25 px-2 py-0.5 text-[10px] font-semibold text-violet-200">Recommended</span>
        )}
        {selected && <Check size={16} className="ml-auto text-ed-accent" />}
      </div>
      <p className="mt-1 px-1 pb-1 text-xs text-ed-muted">{preset.description}</p>
    </button>
  );
}