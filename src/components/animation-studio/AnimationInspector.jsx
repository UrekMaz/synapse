import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { PRESET_KINDS, PRESET_LIST, allowedTriggers, getPreset } from "../../animations/presets/index.js";
import { EASING_OPTIONS } from "../../utils/easings.js";
import { FieldRow } from "../inspector/PropertyControls.jsx";

const DIRS = [{ value: "up", label: "↑" }, { value: "down", label: "↓" }, { value: "left", label: "←" }, { value: "right", label: "→" }];
const CONTROLS = {
  duration: { label: "Duration", type: "range", min: 0.1, max: 5, step: 0.05, unit: "s" },
  delay: { label: "Delay / start time", type: "range", min: 0, max: 8, step: 0.05, unit: "s" },
  easing: { label: "Easing", type: "select", options: EASING_OPTIONS },
  distance: { label: "Distance", type: "range", min: 0, max: 400, step: 2, unit: "px" },
  scale: { label: "Scale", type: "range", min: 0.1, max: 3, step: 0.01 },
  rotation: { label: "Rotation", type: "range", min: -360, max: 360, step: 1, unit: "°" },
  opacity: { label: "Start opacity", type: "range", min: 0, max: 1, step: 0.01 },
  amplitude: { label: "Amplitude", type: "range", min: 0, max: 120, step: 1, unit: "px" },
  blur: { label: "Blur", type: "range", min: 0, max: 40, step: 1, unit: "px" },
  stagger: { label: "Stagger interval", type: "range", min: 0, max: 0.3, step: 0.005, unit: "s" },
  direction: { label: "Direction", type: "segmented", options: DIRS },
  repeat: { label: "Repeat", type: "select", options: [{ value: 0, label: "Once" }, { value: 1, label: "1×" }, { value: 2, label: "2×" }, { value: 3, label: "3×" }, { value: 5, label: "5×" }, { value: "infinite", label: "Infinite" }] },
  reverse: { label: "Reverse (ping-pong)", type: "toggle" },
  color: { label: "Color", type: "color" },
  split: { label: "Split text", type: "segmented", options: [{ value: "none", label: "None" }, { value: "chars", label: "Letters" }, { value: "words", label: "Words" }] },
};
const FALLBACK = { duration: 0.8, delay: 0, easing: "ease-out", distance: 48, scale: 1, rotation: 0, opacity: 0, amplitude: 10, blur: 12, stagger: 0.04, direction: "up", repeat: 0, reverse: false, color: "#8b6cff", split: "none" };

export default function AnimationInspector({ element, api, isText }) {
  const cfg = element.animation || { preset: "none" };
  const preset = getPreset(cfg.preset);
  const [kind, setKind] = useState(preset?.kind || "entrance");
  const set = (patch) => api.setAnimation(element.id, patch);

  // Live preview: replay shortly after any animation change (debounced)
  const sig = JSON.stringify(cfg);
  const last = useRef({ id: element.id, sig });
  useEffect(() => {
    if (last.current.id !== element.id) {
      last.current = { id: element.id, sig };
      setKind(getPreset(cfg.preset)?.kind || "entrance");
      return;
    }
    if (last.current.sig === sig) return;
    last.current.sig = sig;
    const t = setTimeout(() => api.previewElement(element.id), 350);
    return () => clearTimeout(t);
  }, [element.id, sig]); // eslint-disable-line

  const choose = (p) => {
    const patch = { preset: p.id, split: "none", ...p.defaults };
    if (p.kind === "hover") patch.trigger = "hover";
    else if (p.kind === "scroll") patch.trigger = "scroll";
    else if (cfg.trigger === "hover" || cfg.trigger === "scroll" || !cfg.trigger) patch.trigger = "page-load";
    set(patch);
  };

  const list = PRESET_LIST.filter((p) => p.kind === kind && (!p.textOnly || isText));
  const triggers = allowedTriggers(preset).map((t) => ({ value: t.value, label: t.label }));
  const controls = (preset?.controls || []).filter((k) => !((k === "split" || k === "stagger") && (!isText || preset.kind !== "entrance")));

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-1">
        {PRESET_KINDS.map((k) => (
          <button key={k.id} onClick={() => setKind(k.id)}
            className={`rounded-lg border px-2.5 py-1 text-xs ${kind === k.id ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted"}`}>
            {k.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button onClick={() => set({ preset: "none" })}
          className={`h-9 rounded-lg border text-xs ${!preset ? "border-ed-accent bg-ed-accent/25" : "border-ed-border bg-ed-raised text-ed-muted"}`}>None</button>
        {list.map((p) => (
          <button key={p.id} onClick={() => choose(p)}
            className={`h-9 rounded-lg border px-2 text-xs ${cfg.preset === p.id ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted hover:text-white"}`}>
            {p.label}
          </button>
        ))}
      </div>

      {preset && (
        <>
          <FieldRow field={{ key: "trigger", label: "Trigger", type: "select", options: triggers }} value={cfg.trigger || "page-load"} onChange={(v) => set({ trigger: v })} />
          {cfg.trigger === "after-delay" && (
            <FieldRow field={{ key: "triggerDelay", label: "Wait before starting", type: "range", min: 0, max: 10, step: 0.1, unit: "s" }} value={cfg.triggerDelay ?? 1} onChange={(v) => set({ triggerDelay: v })} />
          )}
          {controls.map((k) => (
            <FieldRow key={k} field={{ key: k, ...CONTROLS[k] }} value={cfg[k] ?? preset.defaults[k] ?? FALLBACK[k]} onChange={(v) => set({ [k]: v })} />
          ))}
          {cfg.easing === "custom" && (
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <input key={i} type="number" step="0.05" className="field !px-2 !py-1 text-xs" value={(cfg.bezier || [0.25, 0.1, 0.25, 1])[i]}
                  onChange={(e) => { const b = [...(cfg.bezier || [0.25, 0.1, 0.25, 1])]; b[i] = Number(e.target.value); set({ bezier: b }); }} />
              ))}
            </div>
          )}
        </>
      )}

      <button onClick={() => api.previewElement(element.id)} className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-ed-accent text-sm font-semibold hover:brightness-110">
        <Play size={14} /> Play animation
      </button>
      <p className="text-[11px] leading-relaxed text-ed-muted">
        {preset?.kind === "hover" || cfg.trigger === "hover" || cfg.trigger === "click"
          ? "This animation runs when you hover / click the element on the canvas."
          : "Plays this element on its own. Its delay is used when the whole section plays (Animations → Whole section → Play sequence, or the timeline)."}
      </p>
    </div>
  );
}