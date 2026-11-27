import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { getHero } from "../../registry/heroRegistry.js";
import { siteSummary, validateLink, walkLinks } from "../../utils/links.js";

const GROUPS = [
  { level: "error", title: "Broken", dot: "bg-red-400" },
  { level: "warn", title: "Needs attention", dot: "bg-amber-400" },
  { level: "empty", title: "Not connected", dot: "bg-ed-muted" },
  { level: "ok", title: "Connected", dot: "bg-emerald-400" },
];

// Site-wide link audit + smart auto-connect + scroll settings.
export default function LinksPanel() {
  const { page, pages, linkSettings, setLinkSettings, autoConnectLinks, selectElement, switchPage } = useEditorStore();
  const [note, setNote] = useState("");
  const nameOf = (s) => s.name || getHero(s.type)?.name || s.type;
  const site = useMemo(() => siteSummary(page, pages, (s) => getHero(s.type)?.name || s.type), [page, pages]);

  const links = useMemo(() => {
    const out = [];
    [page, ...pages].forEach((pg) => walkLinks(pg.sections, (v, info) => {
      const res = validateLink(v, { site, currentPageId: pg.id });
      out.push({ ...res, pageId: pg.id, pageName: pg.name, sectionId: info.section.id, section: nameOf(info.section), elementId: info.element.id, label: info.label || info.element.label });
    }));
    return out;
  }, [page, pages, site]); // eslint-disable-line

  const open = (l) => {
    if (l.pageId !== page.id) switchPage(l.pageId);
    selectElement(l.sectionId, l.elementId);
  };
  const run = () => {
    const n = autoConnectLinks();
    setNote(n ? `Connected ${n} link${n > 1 ? "s" : ""} to matching sections.` : "No unconnected links matched a section name.");
  };

  return (
    <div className="space-y-3">
      <div className="label">Links</div>
      <p className="text-[11px] text-ed-muted">Every link on your website. Select one to edit it — or let Synapse connect links whose labels match a section (e.g. “Pricing” → your Pricing section).</p>
      <button onClick={run} className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-ed-accent text-sm font-semibold hover:brightness-110"><Wand2 size={14} /> Auto-connect links on this page</button>
      {note && <p className="text-[11px] text-emerald-300">{note}</p>}

      {GROUPS.map((g) => {
        const list = links.filter((l) => l.level === g.level);
        if (!list.length) return null;
        return (
          <div key={g.level} className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold"><span className={`h-2 w-2 rounded-full ${g.dot}`} />{g.title} <span className="text-ed-muted">{list.length}</span></div>
            {list.map((l, i) => (
              <button key={i} onClick={() => open(l)} className="block w-full rounded-lg border border-ed-border bg-ed-raised px-2.5 py-1.5 text-left text-xs hover:bg-white/10">
                <div className="truncate font-medium">{l.label || "Link"}</div>
                <div className="truncate text-[10px] text-ed-muted">{l.section}{l.pageId !== page.id ? ` · ${l.pageName}` : ""} · {l.message}</div>
              </button>
            ))}
          </div>
        );
      })}

      <div className="space-y-2 border-t border-ed-border pt-3">
        <div className="label">Scrolling</div>
        <div className="flex gap-1">
          {["smooth", "instant"].map((b) => (
            <button key={b} onClick={() => setLinkSettings({ behavior: b })} className={`h-8 flex-1 rounded-lg border text-xs capitalize ${linkSettings.behavior === b ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted"}`}>{b}</button>
          ))}
        </div>
        <label className="block text-xs text-ed-muted">Extra offset below sticky navbars: {linkSettings.offset}px
          <input type="range" min={0} max={160} value={linkSettings.offset} onChange={(e) => setLinkSettings({ offset: Number(e.target.value) })} className="mt-1 w-full accent-[#8b6cff]" />
        </label>
        <p className="text-[11px] text-ed-muted">Sticky and fixed navbar heights are always cleared automatically. Visitors who prefer reduced motion get instant jumps.</p>
      </div>
    </div>
  );
}
