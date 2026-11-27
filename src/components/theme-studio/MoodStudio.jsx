import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Music, Pause, Play, Plus, RotateCcw, Sparkles, Trash2, Upload } from "lucide-react";
import { FieldRow } from "../inspector/PropertyControls.jsx";
import { Collapsible, Switch } from "../ui/primitives.jsx";
import { THEME_PRESETS } from "../../data/themes.js";
import { MOTIF_ANIMS, MOTIF_BY_ID, MOTIF_CATALOG, MOTIF_CATEGORIES, MOTIF_HOVERS, PLACEMENTS, motifInstance } from "../../library/motifs/catalog.js";
import { Motif } from "../../library/motifs/Motifs.jsx";
import { CARD_HOVERS, CTA_STYLES, DEFAULT_EXPERIENCE, HEADLINE_STYLES, IMAGE_HOVERS, IMAGE_STYLES, MATERIALS, NAV_STYLES, TRANSITIONS, resolveExperience } from "../../library/motifs/experience.js";
import { SOUNDSCAPES, SOUND_BY_ID, SOUND_CATEGORIES, play, stop, subscribe, supported } from "../../audio/soundscapes.js";
import { getHero } from "../../registry/heroRegistry.js";
import { useEditorStore } from "../../store/editorStore.js";

export const MOOD_TABS = [
  { id: "m-explore", label: "Explore Moods" }, { id: "m-identity", label: "Visual Identity" }, { id: "m-motifs", label: "Motifs & Objects" },
  { id: "m-motion", label: "Motion & Interactions" }, { id: "m-sound", label: "Sound & Music" }, { id: "m-type", label: "Typography" },
  { id: "m-materials", label: "Color & Materials" }, { id: "m-custom", label: "Custom Experience" },
];

const sel = (key, label, options) => ({ key, label, type: "select", options });
const rng = (key, label, min, max, step = 1, unit = "") => ({ key, label, type: "range", min, max, step, unit });
const tog = (key, label) => ({ key, label, type: "toggle" });
const MAX_AUDIO = 1.5 * 1024 * 1024;

// Shared helper: edit draft.experience immutably (creating it from defaults when the theme had none).
export function useExperienceDraft(draft, setDraft) {
  const exp = resolveExperience(draft.experience) || structuredClone(DEFAULT_EXPERIENCE);
  const setExp = (fn) => setDraft((d) => {
    const next = structuredClone(resolveExperience(d.experience) || DEFAULT_EXPERIENCE);
    fn(next);
    return { ...d, experience: next };
  });
  const setGroup = (group, key, v) => setExp((e) => { e[group][key] = v; });
  return { exp, setExp, setGroup, has: !!draft.experience };
}

/* ---------- Explore Moods ---------- */
function MoodCard({ theme: t, active, onPreview, onApply }) {
  const e = t.experience;
  const sig = e.motifs.find((m) => m.id === e.signature) || e.motifs.find((m) => MOTIF_BY_ID[m.asset]?.kind === "object") || e.motifs[0];
  return (
    <div className={`overflow-hidden rounded-xl border ${active ? "border-ed-accent shadow-[0_0_0_1px_rgba(139,108,255,.8)]" : "border-ed-border hover:border-white/25"}`}>
      <button type="button" onClick={onPreview} className="relative block h-[92px] w-full overflow-hidden text-left" style={{ background: `linear-gradient(135deg, ${t.colors.background}, ${t.colors.surface})` }} title="Preview this mood">
        {sig && <div className="absolute inset-0"><Motif m={{ ...sig, x: 62, y: 52, size: Math.min(sig.size, 220) * 0.55, count: Math.min(sig.count, 10), opacity: 1 }} motion={false} /></div>}
        <div className="absolute bottom-2 left-2.5 right-2.5">
          <div className="truncate text-[15px] font-semibold" style={{ color: t.colors.headingText, fontFamily: `'${t.typography.heading}'` }}>{e.title}</div>
        </div>
      </button>
      <div className="space-y-1.5 bg-ed-raised p-2.5">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 truncate text-[10px] text-ed-muted">{t.name}{t.artist ? ` · ${t.artist}` : ""}</div>
          <div className="flex shrink-0 overflow-hidden rounded">{["primary", "accent", "background", "text"].map((k) => <i key={k} className="h-3.5 w-2.5" style={{ background: t.colors[k] }} />)}</div>
        </div>
        <p className="line-clamp-2 text-[11px] leading-snug text-ed-muted">{e.tagline}</p>
        <div className="flex flex-wrap gap-1">{(e.mood || []).slice(0, 4).map((g) => <span key={g} className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9.5px] text-ed-muted">{g}</span>)}</div>
        <div className="flex gap-1.5 pt-0.5">
          <button onClick={onPreview} className="h-7 flex-1 rounded-lg border border-ed-border text-[11px] hover:bg-white/5">Preview</button>
          <button onClick={onApply} className="h-7 flex-1 rounded-lg bg-ed-accent text-[11px] font-semibold">Apply</button>
        </div>
      </div>
    </div>
  );
}

function Explore({ draft, setDraft, apply, customThemes }) {
  const moods = [...THEME_PRESETS, ...customThemes].filter((t) => t.experience?.motifs);
  const groups = [...new Set(moods.map((t) => (t.collection === "Custom" ? "My moods" : t.artist || "Other")))];
  const { setExp, has } = useExperienceDraft(draft, setDraft);
  return (
    <div className="space-y-4 p-4">
      <p className="text-[11px] leading-relaxed text-ed-muted">
        A mood is a complete experience: palette, type, decorative motifs, motion, section styling and an optional soundscape. These are original
        interpretations of a feeling — not official artist themes, and they contain no album artwork, logos, photos, lyrics or recordings.
      </p>
      {!has && (
        <button onClick={() => setExp(() => {})} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ed-border text-xs text-ed-muted hover:text-white">
          <Plus size={13} /> Add a blank experience layer to “{draft.name}”
        </button>
      )}
      {groups.map((g) => (
        <div key={g} className="space-y-2">
          <div className="label">{g}</div>
          <div className="grid grid-cols-2 gap-3">
            {moods.filter((t) => (t.collection === "Custom" ? "My moods" : t.artist || "Other") === g).map((t) => (
              <MoodCard key={t.id} theme={t} active={draft.id === t.id} onPreview={() => setDraft(t)} onApply={() => { setDraft(t); apply(t); }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Visual Identity ---------- */
function Identity({ draft, setDraft }) {
  const { exp, setExp, setGroup } = useExperienceDraft(draft, setDraft);
  const [moodText, setMoodText] = useState((exp.mood || []).join(", "));
  return (
    <>
      <div className="space-y-3 p-4">
        <label className="block space-y-1.5 text-xs text-ed-muted">Mood name
          <input className="field" value={exp.title || ""} placeholder="e.g. Midnight Glow" onChange={(e) => setExp((x) => { x.title = e.target.value; })} />
        </label>
        <label className="block space-y-1.5 text-xs text-ed-muted">Tagline
          <input className="field" value={exp.tagline || ""} onChange={(e) => setExp((x) => { x.tagline = e.target.value; })} />
        </label>
        <label className="block space-y-1.5 text-xs text-ed-muted">Mood keywords (comma separated)
          <input className="field" value={moodText} onChange={(e) => setMoodText(e.target.value)}
            onBlur={() => setExp((x) => { x.mood = moodText.split(",").map((s) => s.trim()).filter(Boolean); })} />
        </label>
        <div className="flex items-center justify-between rounded-lg border border-ed-border bg-ed-raised px-3 py-2 text-sm">
          <span>Show decorations & motifs</span>
          <Switch checked={exp.decorations} onChange={(v) => setExp((x) => { x.decorations = v; })} />
        </div>
      </div>
      <Collapsible title="Section styling" defaultOpen>
        <FieldRow field={sel("nav", "Navigation bar", NAV_STYLES)} value={exp.styles.nav} onChange={(v) => setGroup("styles", "nav", v)} />
        <FieldRow field={sel("headline", "Section headlines", HEADLINE_STYLES)} value={exp.styles.headline} onChange={(v) => setGroup("styles", "headline", v)} />
        <FieldRow field={sel("image", "Image treatment", IMAGE_STYLES)} value={exp.styles.image} onChange={(v) => setGroup("styles", "image", v)} />
        <FieldRow field={sel("cta", "Call-to-action buttons", CTA_STYLES)} value={exp.styles.cta} onChange={(v) => setGroup("styles", "cta", v)} />
        <FieldRow field={sel("card", "Card material", MATERIALS)} value={exp.materials.card} onChange={(v) => setGroup("materials", "card", v)} />
      </Collapsible>
    </>
  );
}

/* ---------- Motifs & Objects ---------- */
const defaultPlacement = (asset) => {
  const k = MOTIF_BY_ID[asset]?.kind;
  return k === "overlay" || k === "particles" ? "hero" : k === "band" ? "footer" : "hero";
};

function MotifEditor({ m, sections, onChange, onRemove, onDuplicate, onMove, first, last }) {
  const [open, setOpen] = useState(false);
  const cat = MOTIF_BY_ID[m.asset];
  const kind = cat?.kind || "object";
  const set = (k, v) => onChange({ ...m, [k]: v });
  const btn = "grid h-6 w-6 place-items-center rounded text-ed-muted hover:bg-white/10 hover:text-white disabled:opacity-25";
  const placementLabel = PLACEMENTS.find((p) => p.value === m.placement)?.label;
  return (
    <div className={`rounded-lg border ${m.hidden ? "border-ed-border/50 opacity-60" : "border-ed-border"} bg-ed-raised`}>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <button onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left">
          <div className="truncate text-xs font-semibold">{m.asset === "custom" ? "Custom image" : cat?.label || m.asset}</div>
          <div className="truncate text-[10px] text-ed-muted">{placementLabel} · {m.layer === "front" ? "in front" : "behind content"}</div>
        </button>
        <button className={btn} title={m.hidden ? "Show" : "Hide"} onClick={() => set("hidden", !m.hidden)}>{m.hidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
        <button className={btn} title="Lower layer" disabled={first} onClick={() => onMove(-1)}><ArrowDown size={12} /></button>
        <button className={btn} title="Raise layer" disabled={last} onClick={() => onMove(1)}><ArrowUp size={12} /></button>
        <button className={btn} title="Duplicate" onClick={onDuplicate}><Copy size={12} /></button>
        <button className={btn} title="Remove" onClick={onRemove}><Trash2 size={12} /></button>
      </div>
      {open && (
        <div className="border-t border-ed-border px-1 pb-2">
          <FieldRow field={sel("placement", "Where", PLACEMENTS)} value={m.placement} onChange={(v) => set("placement", v)} />
          {m.placement === "section" && (
            <FieldRow field={sel("sectionId", "Section", [{ value: "", label: "Choose…" }, ...sections.filter((s) => s.kind !== "nav").map((s) => ({ value: s.id, label: s.name || getHero(s.type)?.name }))])}
              value={m.sectionId} onChange={(v) => set("sectionId", v)} />
          )}
          <FieldRow field={{ key: "layer", label: "Layer", type: "segmented", options: [{ value: "back", label: "Behind" }, { value: "front", label: "In front" }] }} value={m.layer} onChange={(v) => set("layer", v)} />
          {m.asset === "custom" && <FieldRow field={{ key: "imageUrl", label: "Image (PNG with transparency works best)", type: "image" }} value={m.imageUrl} onChange={(v) => set("imageUrl", v)} />}
          {kind === "object" && <><FieldRow field={rng("x", "Horizontal position", -10, 110, 1, "%")} value={m.x} onChange={(v) => set("x", v)} /><FieldRow field={rng("y", "Vertical position", -10, 110, 1, "%")} value={m.y} onChange={(v) => set("y", v)} /></>}
          {kind === "band" && <FieldRow field={rng("y", "Vertical position", 0, 100, 1, "%")} value={m.y} onChange={(v) => set("y", v)} />}
          {kind !== "overlay" && <FieldRow field={rng("size", kind === "band" ? "Height" : "Size", 4, 900, 1, "px")} value={m.size} onChange={(v) => set("size", v)} />}
          {kind === "particles" && <FieldRow field={rng("count", "Amount", 1, 80)} value={m.count} onChange={(v) => set("count", v)} />}
          {kind === "object" && <FieldRow field={rng("rotation", "Rotation", -180, 180, 1, "°")} value={m.rotation} onChange={(v) => set("rotation", v)} />}
          <FieldRow field={rng("opacity", "Opacity", 0, 1, 0.01)} value={m.opacity} onChange={(v) => set("opacity", v)} />
          {m.asset !== "custom" && m.asset !== "grain" && <><FieldRow field={{ key: "color", label: m.asset === "snake" ? "Metallic tone" : "Color", type: "color" }} value={m.color} onChange={(v) => set("color", v)} />
            <FieldRow field={{ key: "accent", label: m.asset === "snake" ? "Shadow tone" : "Accent", type: "color" }} value={m.accent} onChange={(v) => set("accent", v)} /></>}
          {m.asset === "snake" && <FieldRow field={tog("texture", "Scale texture")} value={m.texture !== false} onChange={(v) => set("texture", v)} />}
          <FieldRow field={rng("glow", "Glow", 0, 1, 0.05)} value={m.glow || 0} onChange={(v) => set("glow", v)} />
          {cat?.text !== undefined && <FieldRow field={{ key: "text", label: "Text on the object", type: "text" }} value={m.text} onChange={(v) => set("text", v)} />}
          {kind === "object" && <FieldRow field={tog("flip", "Mirror")} value={m.flip} onChange={(v) => set("flip", v)} />}
          <FieldRow field={sel("animation", "Animation", MOTIF_ANIMS.map((a) => ({ value: a, label: a === "auto" ? `Natural (${cat?.anim || "float"})` : a })))} value={m.animation} onChange={(v) => set("animation", v)} />
          <FieldRow field={rng("speed", "Speed", 0.2, 3, 0.05, "×")} value={m.speed} onChange={(v) => set("speed", v)} />
          {kind === "object" && <FieldRow field={rng("delay", "Entrance delay", 0, 3, 0.1, "s")} value={m.delay} onChange={(v) => set("delay", v)} />}
          <FieldRow field={sel("hover", "Cursor interaction", MOTIF_HOVERS)} value={m.hover} onChange={(v) => set("hover", v)} />
          {m.hover !== "none" && <FieldRow field={rng("depth", "Interaction strength", 0, 1, 0.05)} value={m.depth} onChange={(v) => set("depth", v)} />}
          <div className="px-2 pt-2 text-[11px] text-ed-muted">Visible on</div>
          <div className="flex gap-1.5 px-2 pt-1">
            {["desktop", "tablet", "mobile"].map((bp) => (
              <button key={bp} onClick={() => set(bp, !m[bp])} className={`h-7 flex-1 rounded-lg border text-[11px] capitalize ${m[bp] !== false ? "border-ed-accent bg-ed-accent/20" : "border-ed-border text-ed-muted line-through"}`}>{bp}</button>
            ))}
          </div>
          {kind !== "overlay" && <FieldRow field={rng("mobileScale", "Size on mobile", 0.2, 1, 0.05, "×")} value={m.mobileScale ?? 0.55} onChange={(v) => set("mobileScale", v)} />}
        </div>
      )}
    </div>
  );
}

function Motifs({ draft, setDraft, sections }) {
  const { exp, setExp } = useExperienceDraft(draft, setDraft);
  const [cat, setCat] = useState("Objects");
  const add = (asset, patch) => setExp((e) => { e.motifs.push(motifInstance(asset, { placement: defaultPlacement(asset), z: e.motifs.length + 1, ...patch })); });
  const list = exp.motifs;
  const update = (i, m) => setExp((e) => { e.motifs[i] = m; });
  const move = (i, d) => setExp((e) => {
    const j = i + d; if (j < 0 || j >= e.motifs.length) return;
    [e.motifs[i], e.motifs[j]] = [e.motifs[j], e.motifs[i]];
    e.motifs.forEach((m, k) => { m.z = k + 1; });
  });
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <div className="label">On this theme ({list.length})</div>
        {list.length === 0 && <p className="text-xs text-ed-muted">No motifs yet — add some from the library below.</p>}
        {list.map((m, i) => (
          <MotifEditor key={m.id} m={m} sections={sections} first={i === 0} last={i === list.length - 1}
            onChange={(v) => update(i, v)} onMove={(d) => move(i, d)}
            onRemove={() => setExp((e) => { e.motifs.splice(i, 1); })}
            onDuplicate={() => setExp((e) => { e.motifs.splice(i + 1, 0, { ...structuredClone(m), id: motifInstance(m.asset).id, x: Math.min(100, m.x + 8) }); })} />
        ))}
        <p className="text-[11px] text-ed-muted">Motifs never block clicks or text selection, and they stop moving for visitors who prefer reduced motion.</p>
      </div>
      <div className="space-y-2">
        <div className="label">Motif library</div>
        <div className="flex flex-wrap gap-1.5">
          {MOTIF_CATEGORIES.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-2.5 py-1 text-[11px] ${cat === c ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted"}`}>{c}</button>)}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MOTIF_CATALOG.filter((x) => x.category === cat).map((x) => (
            <button key={x.id} onClick={() => add(x.id)} title={`Add ${x.label}`}
              className="group overflow-hidden rounded-lg border border-ed-border bg-ed-raised text-left hover:border-ed-accent">
              <div className="relative h-16 overflow-hidden" style={{ background: draft.colors.background }}>
                <Motif m={{ ...motifInstance(x.id, { id: `thumb-${x.id}` }), x: 50, y: x.kind === "band" ? 100 : 50, size: x.kind === "band" ? 46 : x.kind === "particles" ? Math.min(x.size, 26) : 92, count: Math.min(x.count, 12), opacity: x.kind === "overlay" ? Math.max(0.5, x.opacity ?? 1) : 1, color: x.color.startsWith("$") ? draft.colors[x.color.slice(1)] || draft.colors.primary : x.color, accent: x.accent.startsWith("$") ? draft.colors[x.accent.slice(1)] || draft.colors.accent : x.accent }} motion={false} />
              </div>
              <div className="flex items-center gap-1 px-1.5 py-1 text-[10.5px]"><Plus size={10} className="text-ed-muted group-hover:text-white" /><span className="truncate">{x.label}</span></div>
            </button>
          ))}
          {cat === "Objects" && (
            <button onClick={() => add("custom", { size: 220 })} className="grid h-[88px] place-items-center rounded-lg border border-dashed border-ed-border text-[10.5px] text-ed-muted hover:text-white">
              <span className="flex flex-col items-center gap-1"><Upload size={14} />Your own image</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Motion & Interactions ---------- */
function Motion({ draft, setDraft }) {
  const { exp, setGroup } = useExperienceDraft(draft, setDraft);
  const mo = exp.motion;
  return (
    <>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between rounded-lg border border-ed-border bg-ed-raised px-3 py-2 text-sm">
          <span>Animations & moving motifs</span>
          <Switch checked={mo.enabled} onChange={(v) => setGroup("motion", "enabled", v)} />
        </div>
        <p className="text-[11px] text-ed-muted">Visitors whose device asks for reduced motion always get a still version. Nothing in these moods flashes or strobes.</p>
      </div>
      <Collapsible title="Movement" defaultOpen>
        <FieldRow field={rng("intensity", "Motif speed", 0.3, 2, 0.05, "×")} value={mo.intensity} onChange={(v) => setGroup("motion", "intensity", v)} />
        <FieldRow field={sel("transition", "Section transition (on scroll)", TRANSITIONS)} value={mo.transition} onChange={(v) => setGroup("motion", "transition", v)} />
        <FieldRow field={sel("choreography", "Entrance choreography (applied on Apply)", [{ value: "", label: "Keep each section's own" }, { value: "rise", label: "Rise in" }, { value: "fade", label: "Soft fade" }, { value: "zoom", label: "Zoom stagger" }, { value: "blur", label: "Blur reveal" }])} value={mo.choreography} onChange={(v) => setGroup("motion", "choreography", v)} />
      </Collapsible>
      <Collapsible title="Hover interactions" defaultOpen>
        <FieldRow field={sel("cardHover", "Cards", CARD_HOVERS)} value={mo.cardHover} onChange={(v) => setGroup("motion", "cardHover", v)} />
        <FieldRow field={sel("imageHover", "Images", IMAGE_HOVERS)} value={mo.imageHover} onChange={(v) => setGroup("motion", "imageHover", v)} />
        <p className="px-3 pb-2 text-[11px] text-ed-muted">Cursor effects for individual motifs (parallax, follow, tilt) are set per motif in Motifs &amp; Objects.</p>
      </Collapsible>
    </>
  );
}

/* ---------- Sound & Music ---------- */
function Sound({ draft, setDraft }) {
  const { exp, setExp, setGroup } = useExperienceDraft(draft, setDraft);
  const s = exp.sound;
  const [cat, setCat] = useState("Recommended");
  const [now, setNow] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => subscribe((st) => setNow(st.playing ? st.track : null)), []);
  useEffect(() => () => stop(0.4), []);
  const rec = s.recommended || [];
  const shown = cat === "Recommended" ? SOUNDSCAPES.filter((x) => rec.includes(x.id)) : SOUNDSCAPES.filter((x) => x.category === cat);
  const preview = (src, id) => (now === id ? stop(0.6) : play(src, { volume: s.volume, loop: true, fadeIn: 0.8 }));
  const upload = (f) => {
    setErr("");
    if (!f) return;
    if (!f.type.startsWith("audio/")) return setErr("That isn't an audio file.");
    if (f.size > MAX_AUDIO) return setErr("Please choose a file under 1.5 MB (it's saved with your site). Short loops work best.");
    const r = new FileReader();
    r.onload = () => setExp((e) => { e.sound.track = "upload"; e.sound.uploadUrl = r.result; e.sound.uploadName = f.name; e.sound.enabled = true; });
    r.readAsDataURL(f);
  };
  return (
    <>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between rounded-lg border border-ed-border bg-ed-raised px-3 py-2 text-sm">
          <span>Offer background sound to visitors</span>
          <Switch checked={s.enabled} onChange={(v) => setGroup("sound", "enabled", v)} />
        </div>
        <p className="text-[11px] leading-relaxed text-ed-muted">
          Sound never plays on its own: visitors see a play / pause button and choose to start it. Their volume and mute choice is remembered on their
          device, and the whole site works with sound off. Built-in soundscapes are original pieces generated live in the browser — no recordings are bundled.
        </p>
        {!supported() && <p className="text-[11px] text-amber-300">This browser doesn't support Web Audio previews.</p>}
      </div>
      <Collapsible title="Soundscapes" defaultOpen>
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {["Recommended", ...SOUND_CATEGORIES].map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-2 py-0.5 text-[10.5px] ${cat === c ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted"}`}>{c}</button>)}
        </div>
        <div className="space-y-1.5 px-3 pb-3">
          {shown.length === 0 && <p className="text-xs text-ed-muted">No recommendations for this theme — browse a category.</p>}
          {shown.map((x) => (
            <div key={x.id} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${s.track === x.id ? "border-ed-accent bg-ed-accent/10" : "border-ed-border bg-ed-raised"}`}>
              <button onClick={() => preview(x.id, x.id)} aria-label={now === x.id ? `Stop preview of ${x.label}` : `Preview ${x.label}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20">{now === x.id ? <Pause size={12} /> : <Play size={12} />}</button>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold">{x.label} <span className="font-normal text-ed-muted">· {x.category}</span>{rec.includes(x.id) && <span className="ml-1 rounded bg-ed-accent/25 px-1 text-[9.5px]">fits this mood</span>}</div>
                <div className="truncate text-[10.5px] text-ed-muted">{x.description}</div>
              </div>
              <button onClick={() => setExp((e) => { e.sound.track = x.id; e.sound.enabled = true; })} className={`h-7 shrink-0 rounded-lg px-2 text-[11px] ${s.track === x.id ? "bg-ed-accent font-semibold" : "border border-ed-border"}`}>{s.track === x.id ? "Selected" : "Use"}</button>
            </div>
          ))}
        </div>
      </Collapsible>
      <Collapsible title="Your own audio" defaultOpen={s.track === "upload"}>
        <div className="space-y-2 px-3 pb-3">
          {s.uploadUrl && (
            <div className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${s.track === "upload" ? "border-ed-accent bg-ed-accent/10" : "border-ed-border"}`}>
              <button onClick={() => preview({ url: s.uploadUrl }, "upload")} className="grid h-7 w-7 place-items-center rounded-full bg-white/10">{now === "upload" ? <Pause size={12} /> : <Play size={12} />}</button>
              <span className="min-w-0 flex-1 truncate text-xs">{s.uploadName || "Uploaded audio"}</span>
              <button onClick={() => setExp((e) => { e.sound.track = "upload"; })} className="h-7 rounded-lg border border-ed-border px-2 text-[11px]">Use</button>
              <button title="Remove" onClick={() => setExp((e) => { e.sound.uploadUrl = ""; e.sound.uploadName = ""; if (e.sound.track === "upload") e.sound.track = e.sound.recommended?.[0] || ""; })} className="text-ed-muted hover:text-red-400"><Trash2 size={12} /></button>
            </div>
          )}
          <label className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-ed-border text-xs text-ed-muted hover:text-white">
            <Upload size={12} /> Upload an audio file (MP3, OGG, WAV · max 1.5 MB)
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; upload(f); }} />
          </label>
          {err && <p className="text-[11px] text-red-400">{err}</p>}
          <p className="text-[11px] text-ed-muted">Only upload audio you made or have the rights to use on a website. Synapse doesn't check or claim licensing for uploaded files.</p>
        </div>
      </Collapsible>
      <Collapsible title="Playback" defaultOpen>
        <FieldRow field={rng("volume", "Default volume", 0, 1, 0.05)} value={s.volume} onChange={(v) => setGroup("sound", "volume", v)} />
        <FieldRow field={tog("loop", "Loop")} value={s.loop} onChange={(v) => setGroup("sound", "loop", v)} />
        <FieldRow field={rng("fadeIn", "Fade in", 0, 8, 0.25, "s")} value={s.fadeIn} onChange={(v) => setGroup("sound", "fadeIn", v)} />
        <FieldRow field={rng("fadeOut", "Fade out", 0, 8, 0.25, "s")} value={s.fadeOut} onChange={(v) => setGroup("sound", "fadeOut", v)} />
        <FieldRow field={tog("sfx", "Soft click sounds on links & buttons (only while sound is on)")} value={s.sfx} onChange={(v) => setGroup("sound", "sfx", v)} />
      </Collapsible>
      <div className="px-4 pb-4 text-[11px] text-ed-muted"><Music size={11} className="mr-1 inline" />Currently selected: {s.track === "upload" ? s.uploadName || "your audio" : SOUND_BY_ID[s.track]?.label || "none"}</div>
    </>
  );
}

/* ---------- Custom Experience ---------- */
function Custom({ draft, setDraft, saveAs, sections }) {
  const { has, setExp } = useExperienceDraft(draft, setDraft);
  const setSectionMotifs = useEditorStore((s) => s.setSectionMotifs);
  const preset = useMemo(() => THEME_PRESETS.find((t) => t.id === draft.id || draft.experience?.basedOn === t.id), [draft]);
  return (
    <div className="space-y-4 p-4">
      <button onClick={saveAs} className="h-9 w-full rounded-xl bg-ed-accent text-sm font-semibold">Save as a new theme</button>
      <p className="text-[11px] text-ed-muted">Saves the palette, fonts, components and this whole experience layer (motifs, motion, sound) under “My themes”.</p>
      {preset?.experience && (
        <button onClick={() => setExp((e) => { Object.assign(e, structuredClone(preset.experience)); })} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-ed-border text-xs text-ed-muted hover:text-white">
          <RotateCcw size={12} /> Reset experience to “{preset.experience.title}” defaults
        </button>
      )}
      {has && (
        <button onClick={() => setDraft((d) => { const rest = { ...d }; delete rest.experience; return rest; })} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-ed-border text-xs text-ed-muted hover:text-red-300">
          <Trash2 size={12} /> Remove the experience layer (keep colors & fonts)
        </button>
      )}
      <div className="label pt-2">Decorations per section</div>
      <p className="text-[11px] text-ed-muted">Turn motifs off for individual sections of the current page. This changes the page right away (undo with Ctrl+Z).</p>
      {sections.filter((s) => s.kind !== "nav").map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-ed-border bg-ed-raised px-3 py-1.5 text-xs">
          <span className="truncate">{s.name || getHero(s.type)?.name}</span>
          <Switch checked={!s.hideMotifs} onChange={(v) => setSectionMotifs(s.id, !v)} />
        </div>
      ))}
      <div className="flex items-start gap-1.5 rounded-lg border border-ed-border bg-ed-bg/40 p-2.5 text-[11px] text-ed-muted"><Sparkles size={12} className="mt-0.5 shrink-0" />Tip: use “Apply to → Selected section” in the footer to give one section a different mood from the rest of the site.</div>
    </div>
  );
}

export default function MoodPanel({ tab, draft, setDraft, apply, saveAs, customThemes, sections, renderType, renderColors }) {
  const { exp, setGroup } = useExperienceDraft(draft, setDraft);
  switch (tab) {
    case "m-explore": return <Explore draft={draft} setDraft={setDraft} apply={apply} customThemes={customThemes} />;
    case "m-identity": return <Identity draft={draft} setDraft={setDraft} />;
    case "m-motifs": return <Motifs draft={draft} setDraft={setDraft} sections={sections} />;
    case "m-motion": return <Motion draft={draft} setDraft={setDraft} />;
    case "m-sound": return <Sound draft={draft} setDraft={setDraft} />;
    case "m-type": return (
      <>
        <Collapsible title="Mood headline style" defaultOpen>
          <FieldRow field={sel("headline", "Section headlines", HEADLINE_STYLES)} value={exp.styles.headline} onChange={(v) => setGroup("styles", "headline", v)} />
          <p className="px-3 pb-2 text-[11px] text-ed-muted">“Handwritten” uses the accent font — try Caveat, Homemade Apple or Permanent Marker. “Newspaper” pairs well with Special Elite or Oswald.</p>
        </Collapsible>
        {renderType()}
      </>
    );
    case "m-materials": return (
      <>
        <Collapsible title="Materials & textures" defaultOpen>
          <FieldRow field={sel("card", "Card material", MATERIALS)} value={exp.materials.card} onChange={(v) => setGroup("materials", "card", v)} />
          <FieldRow field={sel("image", "Image treatment", IMAGE_STYLES)} value={exp.styles.image} onChange={(v) => setGroup("styles", "image", v)} />
        </Collapsible>
        {renderColors()}
      </>
    );
    case "m-custom": return <Custom draft={draft} setDraft={setDraft} saveAs={saveAs} sections={sections} />;
    default: return null;
  }
}
