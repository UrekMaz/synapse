import { useMemo } from "react";
import { Crosshair, Download, FileText, Globe, Hash, Layers, Link2Off, Mail, Phone, StickyNote } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { getHero } from "../../registry/heroRegistry.js";
import { siteSummary, toLink, validateLink } from "../../utils/links.js";
import { Switch } from "../ui/primitives.jsx";

const TYPES = [
  { id: "section", label: "Section", icon: Hash }, { id: "page", label: "Page", icon: StickyNote }, { id: "external", label: "Website", icon: Globe },
  { id: "email", label: "Email", icon: Mail }, { id: "phone", label: "Phone", icon: Phone }, { id: "file", label: "File", icon: Download },
  { id: "custom", label: "Custom", icon: FileText }, { id: "none", label: "None", icon: Link2Off },
];
const DOT = { ok: "bg-emerald-400", empty: "bg-ed-muted", warn: "bg-amber-400", error: "bg-red-400" };
const chip = (a) => `flex h-8 items-center justify-center gap-1 rounded-lg border text-[11px] transition ${a ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted hover:text-white"}`;
const nameOf = (s) => getHero(s.type)?.name || s.type;

export function useSite() {
  const page = useEditorStore((s) => s.page);
  const pages = useEditorStore((s) => s.pages);
  return useMemo(() => siteSummary(page, pages, nameOf), [page, pages]);
}

function SectionList({ sections, value, onPick }) {
  return (
    <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
      {sections.map((s) => (
        <button key={s.id} type="button" onClick={() => onPick(s.id)}
          className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition ${value === s.id ? "border-ed-accent bg-ed-accent/20 text-white" : "border-ed-border bg-ed-raised hover:bg-white/10"}`}>
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-white/10 text-[10px] tabular-nums text-ed-muted">{s.index + 1}</span>
          <span className="min-w-0 flex-1 truncate">{s.name}</span>
          <span className="shrink-0 text-[10px] text-ed-muted">{getHero(s.type)?.library || s.kind}</span>
        </button>
      ))}
      {!sections.length && <p className="text-[11px] text-ed-muted">This page has no sections yet.</p>}
    </div>
  );
}

// Universal link editor. Value: legacy string or link object (see utils/links.js).
export default function LinkControl({ value, onChange }) {
  const site = useSite();
  const currentPageId = useEditorStore((s) => s.page?.id);
  const setView = useEditorStore((s) => s.setView);
  const picking = useEditorStore((s) => !!s.linkPicker);
  const l = toLink(value);
  const set = (patch) => onChange({ ...l, ...patch });
  const current = site.find((p) => p.id === currentPageId);
  const v = validateLink(l, { site, currentPageId });
  const pick = () => setView("linkPicker", (sectionId) => onChange({ type: "section", sectionId, scroll: l.scroll || "inherit" }));

  const switchType = (type) => {
    if (type === l.type) return;
    const keep = { newTab: l.newTab };
    if (type === "custom" && typeof value === "string") return onChange({ type, url: value });
    onChange({ type, ...keep });
  };

  return (
    <div className="space-y-2.5 rounded-xl border border-ed-border bg-ed-bg/40 p-2.5">
      <div className="grid grid-cols-4 gap-1">
        {TYPES.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => switchType(id)} className={chip(l.type === id)} title={label}><Icon size={12} />{label}</button>
        ))}
      </div>

      {l.type === "section" && (
        <>
          <div className="text-[11px] text-ed-muted">Where should this link go?</div>
          <SectionList sections={current?.sections || []} value={l.sectionId} onPick={(id) => set({ sectionId: id, pageId: undefined })} />
          <button type="button" onClick={pick}
            className={`flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-xs ${picking ? "border-ed-accent bg-ed-accent/25 text-white" : "border-dashed border-ed-border text-ed-muted hover:border-ed-accent hover:text-white"}`}>
            <Crosshair size={13} /> {picking ? "Click a section on the canvas… (Esc to cancel)" : "Choose section on canvas"}
          </button>
          <div className="flex items-center gap-2 text-[11px] text-ed-muted">
            Scroll
            {[["inherit", "Site default"], ["smooth", "Smooth"], ["instant", "Instant"]].map(([k, lab]) => (
              <button key={k} type="button" onClick={() => set({ scroll: k })} className={`rounded-md border px-2 py-0.5 ${(l.scroll || "inherit") === k ? "border-ed-accent text-white" : "border-ed-border"}`}>{lab}</button>
            ))}
          </div>
        </>
      )}

      {l.type === "page" && (
        <>
          <select className="field" value={l.pageId || ""} onChange={(e) => set({ pageId: e.target.value, sectionId: undefined })}>
            <option value="" disabled>Choose a page…</option>
            {site.map((p) => <option key={p.id} value={p.id}>{p.name}{p.home ? " (home)" : ""}{p.id === currentPageId ? " — this page" : ""}</option>)}
          </select>
          {l.pageId && (
            <select className="field" value={l.sectionId || ""} onChange={(e) => set({ sectionId: e.target.value || undefined })}>
              <option value="">Top of the page</option>
              {(site.find((p) => p.id === l.pageId)?.sections || []).map((s) => <option key={s.id} value={s.id}>{s.index + 1}. {s.name}</option>)}
            </select>
          )}
        </>
      )}

      {(l.type === "external" || l.type === "custom" || l.type === "file") && (
        <input className="field" placeholder={l.type === "external" ? "example.com" : l.type === "file" ? "https://…/brochure.pdf" : "/path, #anchor or any URL"} value={l.url || ""} onChange={(e) => set({ url: e.target.value })} />
      )}
      {l.type === "email" && (
        <>
          <input className="field" type="email" placeholder="hello@company.com" value={l.email || ""} onChange={(e) => set({ email: e.target.value })} />
          <input className="field" placeholder="Subject (optional)" value={l.subject || ""} onChange={(e) => set({ subject: e.target.value })} />
        </>
      )}
      {l.type === "phone" && <input className="field" type="tel" placeholder="+1 415 555 0132" value={l.phone || ""} onChange={(e) => set({ phone: e.target.value })} />}

      {(l.type === "external" || l.type === "custom") && (
        <label className="flex items-center justify-between text-xs text-ed-muted">Open in a new tab <Switch checked={!!l.newTab} onChange={(nt) => set({ newTab: nt })} /></label>
      )}
      {l.type === "file" && (
        <label className="flex items-center justify-between text-xs text-ed-muted">Open in a new tab instead of downloading <Switch checked={!!l.newTab} onChange={(nt) => set({ newTab: nt })} /></label>
      )}

      <div className="flex items-start gap-2 text-[11px] leading-snug">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${DOT[v.level]}`} />
        <span className={v.level === "error" ? "text-red-300" : v.level === "warn" ? "text-amber-200" : "text-ed-muted"}>{v.message}</span>
      </div>
      {l.type === "none" && <p className="flex items-center gap-1 text-[11px] text-ed-muted"><Layers size={11} /> Tip: pick “Section” to connect this to part of your page.</p>}
    </div>
  );
}
