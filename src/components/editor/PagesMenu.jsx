import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy, Home, Plus, Trash2 } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";

// Page switcher + page management (names, URL slugs, home page) for multi-page sites.
export default function PagesMenu() {
  const { page, pages, allPages, switchPage, addPage, duplicatePage, deletePage, updatePageMeta, setHomePage } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);
  const list = allPages();
  const btn = "grid h-6 w-6 place-items-center rounded text-ed-muted hover:bg-white/10 hover:text-white disabled:opacity-30";

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex h-9 items-center gap-2 rounded-xl border border-transparent px-2 text-sm hover:border-ed-border" title="Pages">
        <span className="max-w-[160px] truncate">{page.name}</span>
        <span className="rounded bg-white/10 px-1.5 text-[10px] text-ed-muted">{list.length} page{list.length > 1 ? "s" : ""}</span>
        <ChevronDown size={14} className="text-ed-muted" />
      </button>
      {open && (
        <div className="panel absolute left-0 top-11 z-50 w-[340px] space-y-2 p-3 shadow-2xl">
          <div className="label">Pages</div>
          {list.map((p) => {
            const active = p.id === page.id;
            return (
              <div key={p.id} className={`space-y-1.5 rounded-xl border p-2 ${active ? "border-ed-accent bg-ed-accent/10" : "border-ed-border bg-ed-raised"}`}>
                <div className="flex items-center gap-1">
                  <input value={p.name} onChange={(e) => updatePageMeta(p.id, { name: e.target.value })} className="min-w-0 flex-1 rounded-lg bg-transparent px-1.5 py-1 text-sm font-medium outline-none focus:bg-ed-bg" />
                  {!active && <button onClick={() => { switchPage(p.id); setOpen(false); }} className="rounded-lg bg-ed-accent/25 px-2 py-1 text-[11px] hover:bg-ed-accent">Open</button>}
                  <button title={p.home ? "Home page" : "Make this the home page"} onClick={() => setHomePage(p.id)} className={`${btn} ${p.home ? "!text-amber-300" : ""}`}><Home size={13} /></button>
                  <button title="Duplicate page" onClick={() => duplicatePage(p.id)} className={btn}><Copy size={13} /></button>
                  <button title="Delete page" disabled={list.length < 2} onClick={() => deletePage(p.id)} className={`${btn} hover:!text-red-400`}><Trash2 size={13} /></button>
                </div>
                <label className="flex items-center gap-1 px-1.5 text-[11px] text-ed-muted">
                  /preview{p.home ? "" : "/"}
                  {p.home ? <span className="italic">(home)</span> : (
                    <input value={p.slug || ""} onChange={(e) => updatePageMeta(p.id, { slug: e.target.value })} className="min-w-0 flex-1 rounded bg-transparent px-1 outline-none focus:bg-ed-bg" />
                  )}
                  <span className="ml-auto">{p.sections?.length || 0} sections</span>
                </label>
              </div>
            );
          })}
          <form onSubmit={(e) => { e.preventDefault(); addPage(name.trim() || `Page ${list.length + 1}`); setName(""); setOpen(false); }} className="flex gap-2 pt-1">
            <input className="field" placeholder="New page name (e.g. About)" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="flex h-9 shrink-0 items-center gap-1 rounded-xl bg-ed-accent px-3 text-sm font-semibold"><Plus size={14} /> Add</button>
          </form>
          <p className="text-[11px] text-ed-muted">New pages reuse this page's navbar, footer and theme. {pages.length ? "" : "Links can point to any page and section."}</p>
        </div>
      )}
    </div>
  );
}
