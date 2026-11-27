import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Link2, Plus, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { Collapsible, Switch } from "../ui/primitives.jsx";
import { FONT_OPTIONS } from "../../utils/fonts.js";
import { readImageFile } from "../../utils/imageUpload.js";
import { TOKEN_OPTIONS, isToken, tokenValue } from "../../utils/tokens.js";
import { useEditorStore } from "../../store/editorStore.js";
import LinkControl from "./LinkControl.jsx";

const chip = (a) =>
  `h-8 flex-1 rounded-lg border text-xs transition ${a ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted hover:text-white"}`;

// URL field + upload (stored as a downscaled data URL) + thumbnail.
function ImageControl({ value, onChange, accept = "image/*" }) {
  const [err, setErr] = useState("");
  const isData = (value || "").startsWith("data:");
  const video = accept.startsWith("video");
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        {value && !video && <img src={value} alt="" className="h-9 w-9 shrink-0 rounded-lg border border-ed-border object-cover" />}
        <input className="field" placeholder={video ? "https://… .mp4" : "https://… or upload"} value={isData ? "Uploaded image" : value ?? ""}
          readOnly={isData} onChange={(e) => onChange(e.target.value)} />
        {value && <button title="Remove" onClick={() => onChange("")} className="text-ed-muted hover:text-white"><X size={14} /></button>}
      </div>
      {!video && (
        <label className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-ed-border text-xs text-ed-muted hover:border-ed-accent hover:text-white">
          <Upload size={12} /> Upload image
          <input type="file" accept={accept} className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            try { setErr(""); onChange(await readImageFile(f)); } catch (x) { setErr(x.message); }
          }} />
        </label>
      )}
      {err && <p className="text-[11px] text-red-400">{err}</p>}
    </div>
  );
}

/*
 * Repeatable items stored as an array on one prop: dropdown links, plan features, footer links, socials…
 * field = { type: "list", itemFields: [...fields], newItem: {...}, titleKey, itemLabel }. Item fields may themselves be lists.
 */
function ListControl({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const set = (i, k, v) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };
  const titleKey = field.titleKey || field.itemFields[0]?.key;
  const btn = "grid h-6 w-6 place-items-center rounded text-ed-muted hover:bg-white/10 hover:text-white disabled:opacity-25";
  return (
    <div className="space-y-1.5">
      {items.map((it, i) => (
        <details key={i} className="group rounded-lg border border-ed-border bg-ed-bg/40" open={items.length <= 1}>
          <summary className="flex cursor-pointer list-none items-center gap-1 py-1 pl-2.5 pr-1 text-xs">
            <ChevronRight size={12} className="shrink-0 text-ed-muted transition group-open:rotate-90" />
            <span className="min-w-0 flex-1 truncate">{String(it?.[titleKey] ?? "") || `${field.itemLabel || "Item"} ${i + 1}`}</span>
            <button title="Move up" disabled={i === 0} onClick={stop(() => move(i, -1))} className={btn}><ChevronUp size={12} /></button>
            <button title="Move down" disabled={i === items.length - 1} onClick={stop(() => move(i, 1))} className={btn}><ChevronDown size={12} /></button>
            <button title="Remove" onClick={stop(() => onChange(items.filter((_, j) => j !== i)))} className={`${btn} hover:!text-red-400`}><Trash2 size={12} /></button>
          </summary>
          <div className="space-y-2.5 border-t border-ed-border p-2.5">
            {field.itemFields.filter((f) => !f.showIf || f.showIf(it)).map((f) => (
              <FieldRow key={f.key} field={f} value={it?.[f.key]} onChange={(v) => set(i, f.key, v)} />
            ))}
          </div>
        </details>
      ))}
      <button onClick={() => onChange([...items, structuredClone(field.newItem || {})])}
        className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-ed-border text-xs text-ed-muted hover:border-ed-accent hover:text-white">
        <Plus size={12} /> Add {(field.itemLabel || "item").toLowerCase()}
      </button>
    </div>
  );
}

// Which global tokens a field may link to.
// Opt-in (fields: tokens: true or token: "size" | "spacing" …) so heroes that use raw colors are unaffected.
function tokenOptionsFor(field) {
  if (!field.tokens && !field.token) return null;
  if (Array.isArray(field.token)) return field.token;
  if (field.type === "color") return TOKEN_OPTIONS.color;
  if (field.type === "font") return TOKEN_OPTIONS.font;
  if (field.token === "size") return TOKEN_OPTIONS.size;
  if (field.token === "spacing") return [{ value: "$section", label: "Section spacing" }, { value: "$gap", label: "Content gap" }, { value: "$pad", label: "Standard padding" }];
  if (field.token === "container") return [{ value: "$container", label: "Container width" }];
  if (field.token === "radius") return [{ value: "$radius", label: "Button radius" }];
  if (field.token === "lh") return [{ value: "$lh-heading", label: "Heading line height" }, { value: "$lh-body", label: "Body line height" }];
  if (field.token === "tracking") return [{ value: "$track-heading", label: "Heading tracking" }, { value: "$track-body", label: "Body tracking" }];
  return null;
}

// A prop linked to the design system: shows the token, lets the user switch token or customize (unlink).
function LinkedControl({ value, options, theme, onChange }) {
  const opt = options.find((o) => o.value === value);
  const v = tokenValue(value, theme);
  return (
    <div className="flex items-center gap-2 rounded-xl border border-ed-accent/40 bg-ed-accent/10 px-2 py-1.5">
      <Link2 size={12} className="shrink-0 text-violet-300" />
      {/^#/.test(v) && <i className="h-4 w-4 shrink-0 rounded border border-white/20" style={{ background: v }} />}
      <select className="min-w-0 flex-1 bg-transparent text-xs outline-none" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value} className="bg-ed-panel">{`Global · ${o.label}`}</option>)}
        {!opt && <option value={value}>{value}</option>}
      </select>
      <span className="text-[10px] tabular-nums text-ed-muted">{String(v)}</span>
      <button title="Customize this element only" onClick={() => onChange(v)} className="rounded px-1.5 py-0.5 text-[10px] text-ed-muted hover:bg-white/10 hover:text-white">Customize</button>
    </div>
  );
}

export function Control({ field, value, onChange }) {
  switch (field.type) {
    case "list": return <ListControl field={field} value={value} onChange={onChange} />;
    case "link": return <LinkControl value={value} onChange={onChange} />;
    case "image": return <ImageControl value={value} onChange={onChange} accept={field.accept} />;
    case "text": return <input className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "textarea": return <textarea className="field min-h-[68px] resize-y" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number": return <input className="field" type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case "range":
      return (
        <div className="flex items-center gap-2">
          <input type="range" min={field.min} max={field.max} step={field.step} value={Number(value ?? 0)}
                 onChange={(e) => onChange(Number(e.target.value))} className="h-1 flex-1 cursor-pointer accent-[#8b6cff]" />
          <input type="number" step={field.step} value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))}
                 className="field !w-[68px] !px-2 !py-1 text-xs" />
        </div>
      );
    case "select":
    case "font": {
      const options = field.type === "font" ? FONT_OPTIONS : field.options;
      return (
        <select className="field" value={String(value)} onChange={(e) => onChange(options.find((o) => String(o.value) === e.target.value)?.value ?? e.target.value)}>
          {options.map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
        </select>
      );
    }
    case "segmented":
      return <div className="flex gap-1">{field.options.map((o) => <button key={o.value} className={chip(value === o.value)} onClick={() => onChange(o.value)}>{o.label}</button>)}</div>;
    case "toggle": return <Switch checked={!!value} onChange={onChange} />;
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#000000"} onChange={(e) => onChange(e.target.value)}
                 className="h-9 w-12 cursor-pointer rounded-lg border border-ed-border bg-ed-raised" />
          <input className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    default: return null;
  }
}

export function FieldRow({ field, value, onChange, overridden, onReset, viewport, themeDefault }) {
  const theme = useEditorStore((s) => s.page?.theme);
  const showBp = field.responsive && viewport && viewport !== "desktop";
  const inline = field.type === "toggle";
  const tokens = tokenOptionsFor(field);
  const linked = tokens && isToken(value);
  return (
    <div className={inline ? "flex items-center justify-between" : ""}>
      <div className={`flex items-center justify-between ${inline ? "" : "mb-1"}`}>
        <span className="text-xs text-ed-muted">
          {field.label}
          {field.unit && field.type !== "range" ? ` (${field.unit})` : ""}
          {showBp && <span className="ml-1.5 rounded bg-ed-accent/20 px-1 text-[9px] uppercase text-violet-200">{viewport}</span>}
        </span>
        <span className="flex items-center gap-1.5">
          {/* Overrides a theme token → one click links it back to the theme default */}
          {isToken(themeDefault) && value !== themeDefault && (
            <button title="Reset to theme default" onClick={() => onChange(themeDefault)} className="rounded bg-ed-accent/20 px-1.5 text-[9px] font-semibold uppercase tracking-wide text-violet-200 hover:bg-ed-accent/40">Theme</button>
          )}
          {tokens && !linked && !isToken(themeDefault) && (
            <button title="Link to the global design system" onClick={() => onChange(field.defaultToken || tokens[0].value)} className="text-ed-muted hover:text-violet-300"><Link2 size={11} /></button>
          )}
          {overridden && (
            <button title="Reset to desktop value" onClick={onReset} className="text-ed-muted hover:text-white"><RotateCcw size={11} /></button>
          )}
        </span>
      </div>
      {linked ? <LinkedControl value={value} options={tokens} theme={theme} onChange={onChange} /> : <Control field={field} value={value} onChange={onChange} />}
    </div>
  );
}

export default function PropertyControls({ fields, values, sectionValues = {}, overrides = {}, viewport, onChange, onReset, defaults = {}, sectionDefaults = {} }) {
  const visible = fields.filter((f) => !f.showIf || f.showIf(values, sectionValues));
  const groups = [...new Set(visible.map((f) => f.group || "General"))];
  return groups.map((g, i) => (
    <Collapsible key={g} title={g} defaultOpen={i < 2}>
      {visible.filter((f) => (f.group || "General") === g).map((f) => (
        <FieldRow key={`${f.scope || "el"}:${f.key}`} field={f} viewport={viewport}
          value={f.scope === "section" ? sectionValues[f.key] : values[f.key]}
          overridden={!!f.responsive && f.key in overrides}
          themeDefault={f.scope === "section" ? sectionDefaults[f.key] : defaults[f.key]}
          onChange={(v) => onChange(f, v)} onReset={() => onReset(f)} />
      ))}
    </Collapsible>
  ));
}