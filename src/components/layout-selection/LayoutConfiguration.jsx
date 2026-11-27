import { LAYOUT_PRESETS, NARROW_MAX, WIDTH_OPTIONS, COMPOSITION_OPTIONS, MAX_WIDTH_OPTIONS, COLUMN_OPTIONS, GAP_OPTIONS, MARGIN_OPTIONS } from "../../data/layoutPresets.js";
import { useEditorStore } from "../../store/editorStore.js";
import Choice from "../ui/Choice.jsx";
import LayoutPreview from "./LayoutPreview.jsx";
import AdvancedSettings from "./AdvancedSettings.jsx";

/** value = { width, composition, maxWidth, columns, columnGap, sideMargin } */
export function LayoutControls({ value, onChange }) {
  return (
    <div className="space-y-4">
      <Choice label="Page width" options={WIDTH_OPTIONS} value={value.width} onChange={(v) => onChange({ width: v })} />
      <Choice label="Page composition" options={COMPOSITION_OPTIONS} cols={3} value={value.composition} onChange={(v) => onChange({ composition: v })} />
      <div>
        <Choice label="Content max width" options={MAX_WIDTH_OPTIONS} allowCustom min={320} max={2560}
                value={value.maxWidth} onChange={(v) => onChange({ maxWidth: v })} />
        {value.width === "narrow" && <p className="mt-1.5 text-xs text-ed-muted">Narrow pages cap content at {NARROW_MAX}px.</p>}
      </div>
      <Choice label="Grid columns" unit="" options={COLUMN_OPTIONS} value={value.columns} onChange={(v) => onChange({ columns: v })} />
      <Choice label="Column gap" options={GAP_OPTIONS} value={value.columnGap} onChange={(v) => onChange({ columnGap: v })} />
      <Choice label="Side margins" options={MARGIN_OPTIONS} allowCustom min={0} max={400}
              value={value.sideMargin} onChange={(v) => onChange({ sideMargin: v })} />
    </div>
  );
}

export default function LayoutConfiguration({ footer }) {
  const draft = useEditorStore((s) => s.draft);
  const patchDraft = useEditorStore((s) => s.patchDraft);
  const preset = LAYOUT_PRESETS.find((p) => p.id === draft.presetId);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="panel p-4">
        <h2 className="font-semibold">{preset ? `${preset.name} Layout` : "Custom Layout"}</h2>
        <p className="mb-4 mt-1 text-xs text-ed-muted">{preset?.description ?? "A custom combination of width and composition."}</p>
        <LayoutPreview settings={draft} variant="config" showGrid />
      </section>

      <section className="panel space-y-4 p-5">
        <h2 className="font-semibold">Layout Settings</h2>
        <LayoutControls value={draft} onChange={patchDraft} />
        <AdvancedSettings draft={draft} onChange={patchDraft} />
        {footer}
      </section>
    </div>
  );
}