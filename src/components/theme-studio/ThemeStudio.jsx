import { useEffect, useMemo, useState } from "react";
import { Brush, Columns2, Copy, Download, Layers, Monitor, Moon, Music, Palette, SwatchBook, Wind, Paintbrush, Shapes, Smartphone, Sparkles, Trash2, Type, Upload, Wand2, X } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { THEME_FILTERS, THEME_PRESETS } from "../../data/themes.js";
import { buildTheme, darkVariant, resolveTheme } from "../../utils/tokens.js";
import { contrast } from "../../utils/color.js";
import { getHero } from "../../registry/heroRegistry.js";
import { FieldRow } from "../inspector/PropertyControls.jsx";
import { Collapsible } from "../ui/primitives.jsx";
import ThemePreview from "./ThemePreview.jsx";
import ThemeCard from "./ThemeCard.jsx";
import MoodPanel, { MOOD_TABS } from "./MoodStudio.jsx";
import { stop as stopSound } from "../../audio/soundscapes.js";

const MOOD_ICONS = { "m-explore": Sparkles, "m-identity": Brush, "m-motifs": Layers, "m-motion": Wind, "m-sound": Music, "m-type": Type, "m-materials": SwatchBook, "m-custom": Wand2 };

const TABS = [
  { id: "explore", label: "Explore Themes", icon: Sparkles }, { id: "colors", label: "Color Palette", icon: Palette },
  { id: "type", label: "Typography", icon: Type }, { id: "components", label: "Components", icon: Shapes },
  { id: "effects", label: "Backgrounds & Effects", icon: Paintbrush }, { id: "custom", label: "Custom Theme", icon: Wand2 },
];
const W = [300, 400, 500, 600, 650, 700, 750, 800, 900].map((w) => ({ value: w, label: String(w) }));
const r = (key, label, min, max, step = 1, unit = "px") => ({ key, label, type: "range", min, max, step, unit });
const col = (key, label) => ({ key, label, type: "color" });

const COLOR_GROUPS = [
  ["Brand", [col("primary", "Primary"), col("primaryHover", "Primary hover"), col("secondary", "Secondary"), col("accent", "Accent"), col("buttonText", "Text on primary")]],
  ["Backgrounds & surfaces", [col("background", "Background"), col("backgroundAlt", "Background (secondary)"), col("surface", "Surface / cards"), col("surfaceElevated", "Elevated surface")]],
  ["Text", [col("headingText", "Headings"), col("text", "Body text"), col("muted", "Muted text")]],
  ["Lines & status", [col("border", "Border"), col("divider", "Divider"), col("success", "Success"), col("warning", "Warning"), col("error", "Error")]],
];
const TYPE_FIELDS = [
  ["Fonts", [
    { key: "heading", label: "Heading font", type: "font" }, { key: "body", label: "Body font", type: "font" }, { key: "accent", label: "Accent font (logos, quotes)", type: "font" },
    { key: "nav", label: "Navigation font", type: "font" }, { key: "button", label: "Button font", type: "font" },
  ]],
  ["Style", [
    { key: "headingWeight", label: "Heading weight", type: "select", options: W }, { key: "bodyWeight", label: "Body weight", type: "select", options: W },
    r("headingLineHeight", "Heading line height", 0.85, 1.5, 0.01, ""), r("bodyLineHeight", "Body line height", 1.2, 2, 0.01, ""),
    r("headingTracking", "Heading letter spacing", -0.08, 0.12, 0.005, "em"), r("bodyTracking", "Body letter spacing", -0.03, 0.1, 0.005, "em"),
    { key: "headingCase", label: "Heading case", type: "segmented", options: [{ value: "none", label: "Aa" }, { value: "uppercase", label: "AA" }] },
  ]],
  ["Scale", [r("h1", "H1", 32, 120), r("h2", "H2", 24, 90), r("h3", "H3", 14, 40), r("h4", "H4", 12, 30), r("bodyLarge", "Body large", 14, 26), r("bodySize", "Body", 12, 22), r("bodySmall", "Body small", 10, 18), r("caption", "Caption", 10, 16)]],
];
const COMPONENT_FIELDS = [
  ["buttons", "Buttons", [r("radius", "Corner radius", 0, 40), r("paddingX", "Padding X", 8, 48), r("paddingY", "Padding Y", 4, 24), r("fontSize", "Font size", 11, 20), { key: "fontWeight", label: "Weight", type: "select", options: W }, { key: "uppercase", label: "Uppercase", type: "toggle" }, { key: "hover", label: "Hover", type: "select", options: ["lift", "glow", "scale", "brighten", "none"].map((v) => ({ value: v, label: v })) }]],
  ["cards", "Cards", [r("radius", "Corner radius", 0, 48), r("shadow", "Shadow", 0, 1, 0.05, ""), r("borderWidth", "Border width", 0, 3), r("padding", "Padding", 8, 56), r("blur", "Glass blur", 0, 40)]],
  ["forms", "Forms", [col("inputBg", "Input background"), col("inputText", "Input text"), col("inputBorder", "Input border"), col("placeholder", "Placeholder"), col("focus", "Focus ring"), r("radius", "Input radius", 0, 24)]],
  ["nav", "Navigation", [col("link", "Link"), col("hover", "Hover"), col("active", "Active"), col("dropdownBg", "Dropdown background"), col("dropdownText", "Dropdown text")]],
];
const EFFECT_FIELDS = [
  ["sections", "Sections", [{ key: "alternate", label: "Alternate section backgrounds", type: "toggle" }, { key: "dividers", label: "Dividers between sections", type: "toggle" }, r("section", "Section spacing", 32, 240, 2), r("container", "Content width", 720, 1600, 10), r("gap", "Content gap", 8, 80), r("padding", "Standard padding", 8, 80)]],
  ["effects", "Backgrounds & effects", [{ key: "sectionGradient", label: "Soft gradient section backgrounds", type: "toggle" }, col("gradientFrom", "Gradient from"), col("gradientTo", "Gradient to"), r("glow", "Glow intensity", 0, 1, 0.05, ""), r("grain", "Film grain", 0, 0.25, 0.01, "")]],
  ["footer", "Footer", [col("background", "Background"), col("text", "Text"), col("muted", "Secondary text"), col("line", "Dividers")]],
];

function Fields({ fields, values, onChange }) {
  return fields.map((f) => <FieldRow key={f.key} field={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} />);
}

function ContrastBadge({ t }) {
  const checks = [["Body text on background", t.colors.text, t.colors.background], ["Button text on primary", t.colors.buttonText, t.colors.primary], ["Muted text on background", t.colors.muted, t.colors.background]];
  return (
    <div className="space-y-1 rounded-lg border border-ed-border bg-ed-bg/40 p-2.5 text-[11px]">
      <div className="font-semibold">Accessibility (WCAG contrast)</div>
      {checks.map(([label, a, b]) => {
        const ok = /^#/.test(a) && /^#/.test(b);
        const cr = ok ? contrast(a, b) : null;
        return (
          <div key={label} className="flex justify-between gap-2 text-ed-muted">
            <span>{label}</span>
            <span className={cr == null ? "" : cr >= 4.5 ? "text-emerald-300" : cr >= 3 ? "text-amber-300" : "text-red-300"}>{cr == null ? "n/a" : `${cr.toFixed(1)}:1 ${cr >= 4.5 ? "AA" : cr >= 3 ? "AA large" : "low"}`}</span>
          </div>
        );
      })}
    </div>
  );
}

function Studio() {
  const { page, selectedId, customThemes, setView, applyThemeToSite, resetToThemeDefaults, saveCustomTheme, deleteCustomTheme } = useEditorStore();
  const current = resolveTheme(page.theme);
  const [draft, setDraft] = useState(current);
  const [mode, setMode] = useState("theme");
  const [tab, setTab] = useState("explore");
  useEffect(() => () => stopSound(0.3), []);
  const switchMode = (m) => { setMode(m); setTab(m === "mood" ? "m-explore" : "explore"); };
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(false);
  const [vp, setVp] = useState("desktop");
  const [source, setSource] = useState(page.sections.length ? "page" : "sample");
  const [compare, setCompare] = useState(false);
  const [scope, setScope] = useState("site");
  const [heroLevel, setHeroLevel] = useState("accent");
  const [confirmReset, setConfirmReset] = useState(false);
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");
  const shown = useMemo(() => (dark ? darkVariant(draft) : draft), [dark, draft]);
  const selected = page.sections.find((s) => s.id === selectedId);
  const close = () => setView("themeStudioOpen", false);
  const set = (group, key, v) => setDraft((d) => ({ ...d, [group]: { ...d[group], [key]: v } }));

  const apply = (theme = shown) => {
    applyThemeToSite(theme, { scope, heroLevel, sectionIds: selected ? [selected.id] : [] });
    setMsg(scope === "sections" ? `Applied “${theme.name}” to ${selected?.name || "the selected section"}.` : scope === "new" ? `New sections will use “${theme.name}”; existing sections keep their look.` : `“${theme.name}” is now your website's theme.`);
  };
  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(shown, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${shown.id || "theme"}.synapse-theme.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const importTheme = (text) => {
    try {
      const raw = JSON.parse(text);
      if (!raw.colors || !raw.typography) throw new Error("missing colors / typography");
      const t = buildTheme({ ...raw, id: `custom-${Date.now().toString(36)}`, collection: "Custom" });
      saveCustomTheme(t);
      setDraft(t);
      setMsg(`Imported “${t.name}”.`);
    } catch (e) { setMsg(`Couldn't import that theme: ${e.message}`); }
  };
  const saveAs = () => {
    const custom = draft.collection === "Custom" && customThemes.some((t) => t.id === draft.id);
    const t = custom ? draft : { ...draft, id: `custom-${Date.now().toString(36)}`, name: draft.name.endsWith("(copy)") || draft.collection === "Custom" ? draft.name : `${draft.name} (copy)`, collection: "Custom" };
    saveCustomTheme(t);
    setDraft(t);
    setMsg(`Saved “${t.name}” to your themes.`);
  };

  const renderColors = () => COLOR_GROUPS.slice(0, 3).map(([title, fields], i) => (
    <Collapsible key={title} title={title} defaultOpen={i < 1}><Fields fields={fields} values={draft.colors} onChange={(k, v) => set("colors", k, v)} /></Collapsible>
  ));
  const renderType = () => TYPE_FIELDS.slice(0, 2).map(([title, fields], i) => (
    <Collapsible key={title} title={title} defaultOpen={i === 0}><Fields fields={fields} values={draft.typography} onChange={(k, v) => set("typography", k, v)} /></Collapsible>
  ));
  const presets = THEME_PRESETS.filter((t) => filter === "All" || t.tags.includes(filter));
  const pro = presets.filter((t) => t.collection === "Professional");
  const music = presets.filter((t) => t.collection !== "Professional");
  const artists = [...new Set(music.map((t) => t.artist))];
  const card = (t) => <ThemeCard key={t.id} theme={t} active={draft.id === t.id} onPreview={() => { setDraft(t); setDark(false); }} onApply={() => { setDraft(t); apply(t); }} />;

  return (
    <div className="fixed inset-0 z-[75] flex bg-black/70 p-3 backdrop-blur-sm">
      <div className="panel flex min-w-0 flex-1 overflow-hidden">
        {/* Tabs */}
        <nav className="flex w-[196px] shrink-0 flex-col gap-1 border-r border-ed-border p-3">
          <div className="mb-2 flex items-center gap-2 px-1"><Palette size={16} className="text-ed-accent" /><b>Theme Studio</b></div>
          <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg border border-ed-border p-0.5 text-[11px]">
            {[["theme", "Theme"], ["mood", "Mood & Experience"]].map(([k, l]) => (
              <button key={k} onClick={() => switchMode(k)} className={`rounded-md px-1.5 py-1.5 leading-tight ${mode === k ? "bg-ed-accent/25 text-white" : "text-ed-muted hover:text-white"}`}>{l}</button>
            ))}
          </div>
          {(mode === "mood" ? MOOD_TABS.map((t) => ({ ...t, icon: MOOD_ICONS[t.id] })) : TABS).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex h-9 items-center gap-2 rounded-lg px-2.5 text-left text-sm ${tab === id ? "bg-ed-accent/20 text-white" : "text-ed-muted hover:bg-white/5 hover:text-white"}`}><Icon size={14} />{label}</button>
          ))}
          <div className="mt-auto rounded-xl border border-ed-border bg-ed-raised p-2.5 text-[11px] text-ed-muted">
            Current theme
            <div className="truncate text-sm font-semibold text-white">{current.name}</div>
          </div>
        </nav>

        {/* Tab content */}
        <section className="flex w-[400px] shrink-0 flex-col border-r border-ed-border">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "explore" && (
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {["All", ...THEME_FILTERS].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-2.5 py-1 text-[11px] ${filter === f ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted hover:text-white"}`}>{f}</button>
                  ))}
                </div>
                {pro.length > 0 && <><div className="label">Professional themes</div><div className="grid grid-cols-2 gap-3">{pro.map(card)}</div></>}
                {music.length > 0 && (
                  <>
                    <div className="label pt-2">Inspired by Music &amp; Eras</div>
                    <p className="text-[11px] leading-relaxed text-ed-muted">Original visual-mood interpretations of musical eras — not official or endorsed artist themes, and no album artwork, photos or logos are used.</p>
                    {artists.map((a) => (
                      <div key={a} className="space-y-2">
                        <div className="text-xs font-semibold text-ed-muted">{a}</div>
                        <div className="grid grid-cols-2 gap-3">{music.filter((t) => t.artist === a).map(card)}</div>
                      </div>
                    ))}
                  </>
                )}
                {customThemes.length > 0 && <><div className="label pt-2">My themes</div><div className="grid grid-cols-2 gap-3">{customThemes.map(card)}</div></>}
              </div>
            )}
            {mode === "mood" && (
              <MoodPanel tab={tab} draft={draft} setDraft={setDraft} apply={apply} saveAs={saveAs} customThemes={customThemes} sections={page.sections}
                renderType={() => renderType()} renderColors={() => renderColors()} />
            )}
            {tab === "colors" && (
              <>
                <div className="space-y-2 p-4">
                  <ContrastBadge t={shown} />
                  <button onClick={() => setDraft(buildTheme({ ...draft, colors: { primary: draft.colors.primary, accent: draft.colors.accent, background: draft.colors.background, text: draft.colors.text, secondary: draft.colors.secondary }, forms: undefined, nav: undefined, footer: undefined }))}
                    className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-ed-border text-xs text-ed-muted hover:text-white"><Wand2 size={12} /> Re-derive the palette from primary, accent, background & text</button>
                </div>
                {COLOR_GROUPS.map(([title, fields], i) => (
                  <Collapsible key={title} title={title} defaultOpen={i < 2}><Fields fields={fields} values={draft.colors} onChange={(k, v) => set("colors", k, v)} /></Collapsible>
                ))}
              </>
            )}
            {tab === "type" && (
              <>
                <div className="space-y-1 p-4" style={{ background: shown.colors.background, color: shown.colors.text }}>
                  <div style={{ fontFamily: `'${shown.typography.heading}'`, fontWeight: shown.typography.headingWeight, fontSize: 30, lineHeight: 1.05, letterSpacing: `${shown.typography.headingTracking}em`, textTransform: shown.typography.headingCase, color: shown.colors.headingText }}>The quick brown fox</div>
                  <div style={{ fontFamily: `'${shown.typography.body}'`, fontSize: 14, lineHeight: shown.typography.bodyLineHeight, color: shown.colors.muted }}>Body copy sits comfortably under the headline, readable at every size.</div>
                  <div style={{ fontFamily: `'${shown.typography.accent}'`, fontSize: 16, fontStyle: "italic" }}>“An accent line for quotes and logos.”</div>
                </div>
                {TYPE_FIELDS.map(([title, fields], i) => (
                  <Collapsible key={title} title={title} defaultOpen={i === 0}><Fields fields={fields} values={draft.typography} onChange={(k, v) => set("typography", k, v)} /></Collapsible>
                ))}
              </>
            )}
            {tab === "components" && COMPONENT_FIELDS.map(([group, title, fields], i) => (
              <Collapsible key={group} title={title} defaultOpen={i < 2}><Fields fields={fields} values={draft[group]} onChange={(k, v) => set(group, k, v)} /></Collapsible>
            ))}
            {tab === "effects" && EFFECT_FIELDS.map(([group, title, fields]) => (
              <Collapsible key={group} title={title}><Fields fields={fields} values={draft[group]} onChange={(k, v) => set(group, k, v)} /></Collapsible>
            ))}
            {tab === "custom" && (
              <div className="space-y-4 p-4">
                <label className="block space-y-1.5 text-xs text-ed-muted">Theme name
                  <input className="field" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </label>
                <label className="block space-y-1.5 text-xs text-ed-muted">Description
                  <input className="field" value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                </label>
                <button onClick={saveAs} className="h-9 w-full rounded-xl bg-ed-accent text-sm font-semibold">Save to my themes</button>
                <p className="text-[11px] text-ed-muted">Tip: start from any preset, adjust colors, fonts and components in the other tabs, then save. Saved themes are available on every page and in new websites.</p>
                <div className="label pt-2">My themes</div>
                {customThemes.length === 0 && <p className="text-xs text-ed-muted">No saved themes yet.</p>}
                {customThemes.map((t) => (
                  <div key={t.id} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${draft.id === t.id ? "border-ed-accent bg-ed-accent/10" : "border-ed-border bg-ed-raised"}`}>
                    <div className="flex overflow-hidden rounded">{["primary", "accent", "background", "text"].map((k) => <i key={k} className="h-5 w-2.5" style={{ background: t.colors[k] }} />)}</div>
                    <button className="min-w-0 flex-1 truncate text-left text-sm" onClick={() => setDraft(t)}>{t.name}</button>
                    <button title="Duplicate" onClick={() => saveCustomTheme({ ...t, id: `custom-${Date.now().toString(36)}`, name: `${t.name} copy` })} className="text-ed-muted hover:text-white"><Copy size={13} /></button>
                    <button title="Delete" onClick={() => deleteCustomTheme(t.id)} className="text-ed-muted hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
                <div className="label pt-2">Import / export</div>
                <button onClick={exportTheme} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-ed-border text-xs"><Download size={12} /> Export this theme (.json)</button>
                <label className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-ed-border text-xs text-ed-muted hover:text-white">
                  <Upload size={12} /> Import a theme file
                  <input type="file" accept="application/json,.json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) importTheme(await f.text()); }} />
                </label>
                <textarea className="field min-h-[70px] text-xs" placeholder="…or paste theme JSON here" value={importText} onChange={(e) => setImportText(e.target.value)} />
                {importText && <button onClick={() => { importTheme(importText); setImportText(""); }} className="h-8 w-full rounded-lg border border-ed-border text-xs">Import pasted JSON</button>}
              </div>
            )}
          </div>
        </section>

        {/* Live preview */}
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center gap-2 border-b border-ed-border px-4 py-2.5">
            <div className="min-w-0">
              <div className="truncate font-semibold">{shown.experience?.title ? `${shown.experience.title} · ${shown.name}` : shown.name}</div>
              <div className="truncate text-xs text-ed-muted">{shown.experience?.tagline || shown.description}</div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-1.5 text-xs">
              {[["page", "Your page"], ["sample", "Sample site"]].map(([k, l]) => <button key={k} onClick={() => setSource(k)} className={`h-8 rounded-lg border px-2.5 ${source === k ? "border-ed-accent bg-ed-accent/20" : "border-ed-border text-ed-muted"}`}>{l}</button>)}
              <span className="mx-1 h-5 w-px bg-ed-border" />
              <button onClick={() => setVp("desktop")} className={`grid h-8 w-8 place-items-center rounded-lg border ${vp === "desktop" ? "border-ed-accent bg-ed-accent/20" : "border-ed-border text-ed-muted"}`} title="Desktop"><Monitor size={14} /></button>
              <button onClick={() => setVp("mobile")} className={`grid h-8 w-8 place-items-center rounded-lg border ${vp === "mobile" ? "border-ed-accent bg-ed-accent/20" : "border-ed-border text-ed-muted"}`} title="Mobile"><Smartphone size={14} /></button>
              <button onClick={() => setDark(!dark)} disabled={draft.mode === "dark"} className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 disabled:opacity-40 ${dark ? "border-ed-accent bg-ed-accent/20" : "border-ed-border text-ed-muted"}`} title={draft.mode === "dark" ? "This theme is already dark" : "Preview the dark variant"}><Moon size={13} /> {draft.mode === "dark" ? "Dark theme" : dark ? "Dark" : "Light"}</button>
              <button onClick={() => setCompare(!compare)} className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 ${compare ? "border-ed-accent bg-ed-accent/20" : "border-ed-border text-ed-muted"}`}><Columns2 size={13} /> Before / after</button>
              <button onClick={close} className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-ed-muted hover:text-white" title="Close"><X size={16} /></button>
            </div>
          </header>
          <div className="flex min-h-0 flex-1 gap-3 p-3">
            {compare && <div className="min-w-0 flex-1"><ThemePreview theme={current} basePage={page} source={source} viewport={vp} heroLevel="none" label={`Before · ${current.name}`} /></div>}
            <div className="min-w-0 flex-1"><ThemePreview theme={shown} basePage={page} source={source} viewport={vp} heroLevel={heroLevel} label={compare ? `After · ${shown.name}` : undefined} /></div>
          </div>
          <footer className="flex flex-wrap items-center gap-2 border-t border-ed-border px-4 py-3 text-xs">
            <label className="flex items-center gap-1.5 text-ed-muted">Apply to
              <select className="field !h-8 !w-auto !py-0 text-xs" value={scope} onChange={(e) => setScope(e.target.value)}>
                <option value="site">Entire website</option>
                <option value="sections" disabled={!selected}>{selected ? `Selected section (${selected.name || getHero(selected.type)?.name})` : "Selected section (select one first)"}</option>
                <option value="new">Only new sections</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-ed-muted">Hero sections
              <select className="field !h-8 !w-auto !py-0 text-xs" value={heroLevel} onChange={(e) => setHeroLevel(e.target.value)}>
                <option value="none">Keep their own palette</option>
                <option value="accent">Adopt accent & fonts</option>
                <option value="full">Adopt the full theme</option>
              </select>
            </label>
            {msg && <span className="text-emerald-300">{msg}</span>}
            <div className="ml-auto flex items-center gap-2">
              {confirmReset ? (
                <span className="flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-500/10 px-2 py-1">
                  Remove every custom override and section opt-out?
                  <button onClick={() => { resetToThemeDefaults(); setConfirmReset(false); setMsg("Every section follows the theme again."); }} className="rounded bg-amber-500/30 px-2 py-0.5 text-white">Reset</button>
                  <button onClick={() => setConfirmReset(false)} className="text-ed-muted">Cancel</button>
                </span>
              ) : (
                <button onClick={() => setConfirmReset(true)} className="h-9 rounded-xl border border-ed-border px-3 text-ed-muted hover:text-white">Reset site to theme defaults</button>
              )}
              <button onClick={() => apply()} className="h-9 rounded-xl bg-ed-accent px-5 text-sm font-semibold hover:brightness-110">Apply theme</button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default function ThemeStudio() {
  const open = useEditorStore((s) => s.themeStudioOpen);
  return open ? <Studio /> : null;
}

