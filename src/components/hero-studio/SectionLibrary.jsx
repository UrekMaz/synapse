import { useMemo, useState } from "react";
import { GripVertical, Plus, Search, X } from "lucide-react";
import { LIBRARY_CATEGORIES, getHero, listLibrary } from "../../registry/heroRegistry.js";
import { PORTFOLIO_CATEGORY_LABELS, isPortfolio } from "../../data/portfolio.js";
import { useEditorStore } from "../../store/editorStore.js";
import HeroThumbnail from "./HeroThumbnail.jsx";
import { DND_HERO } from "../editor/Canvas/EditorSections.jsx";

function LibraryCard({ item }) {
  const { openStudio, addFromLibrary, setView, libraryTarget } = useEditorStore();
  return (
    <div draggable
      onDragStart={(e) => { e.dataTransfer.setData(DND_HERO, item.key); e.dataTransfer.effectAllowed = "copy"; setView("dragging", true); }}
      onDragEnd={() => setView("dragging", false)}
      className="cursor-grab rounded-xl border border-ed-border bg-ed-raised p-2 transition hover:border-ed-accent active:cursor-grabbing">
      {/* Not a <button>: the live thumbnail itself contains buttons (carousels, toggles…). */}
      <div role="button" tabIndex={0} className="block w-full cursor-pointer text-left" title="Preview & customize before adding"
        onClick={() => openStudio(item.key)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openStudio(item.key))}>
        <HeroThumbnail heroId={item.id} variationId={item.variationId} />
      </div>
      <div className="mt-2 flex items-center gap-2 px-1">
        <GripVertical size={14} className="shrink-0 text-ed-muted" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{item.name}</div>
          <div className="truncate text-[11px] text-ed-muted">{item.category}{item.variationId ? ` · ${item.def.name}` : ""}</div>
        </div>
        <button title={libraryTarget?.mode === "replace" ? "Replace with this" : "Add to page"} onClick={() => addFromLibrary(item.id, item.variationId)}
          className="grid h-8 w-8 place-items-center rounded-lg bg-ed-accent/20 hover:bg-ed-accent"><Plus size={14} /></button>
      </div>
    </div>
  );
}

// Unified library: navigation, heroes, body sections and footers.
export default function SectionLibrary() {
  const { page, libraryTarget, libraryCategory: cat, setView } = useEditorStore();
  const [q, setQ] = useState("");
  const all = useMemo(() => listLibrary(), []);
  const counts = useMemo(() => Object.fromEntries(LIBRARY_CATEGORIES.map((c) => [c, all.filter((i) => i.category === c).length])), [all]);
  const items = all.filter((i) => (cat === "All" || i.category === cat)
    && `${i.name} ${i.def.name} ${i.description} ${i.category} ${PORTFOLIO_CATEGORY_LABELS[i.category] || ""} ${i.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  const target = libraryTarget && page.sections.find((s) => s.id === libraryTarget.id);
  // Portfolio projects see portfolio names for the categories (Skills, Projects, Kind words…).
  const labelOf = (c) => (isPortfolio(page) && PORTFOLIO_CATEGORY_LABELS[c]) || c;

  return (
    <div className="space-y-3">
      <div className="label">Section library</div>
      {target ? (
        <div className="flex items-center gap-2 rounded-lg border border-ed-accent/50 bg-ed-accent/15 px-2.5 py-2 text-[11px]">
          <span className="flex-1">{libraryTarget.mode === "replace" ? "Replacing" : "Inserting below"} <b>{getHero(target.type)?.name}</b></span>
          <button title="Cancel" onClick={() => setView("libraryTarget", null)} className="text-ed-muted hover:text-white"><X size={13} /></button>
        </div>
      ) : (
        <p className="text-[11px] text-ed-muted">Drag a section onto the canvas, press + to add it (navbars go to the top, footers to the bottom), or click a preview to customize it first.</p>
      )}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ed-muted" />
        <input className="field !pl-8" placeholder="Search sections…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["All", ...LIBRARY_CATEGORIES].filter((c) => c === "All" || counts[c]).map((c) => (
          <button key={c} onClick={() => setView("libraryCategory", c)}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${cat === c ? "border-ed-accent bg-ed-accent/25 text-white" : "border-ed-border bg-ed-raised text-ed-muted hover:text-white"}`}>
            {labelOf(c)}{c !== "All" && <span className="ml-1 opacity-50">{counts[c]}</span>}
          </button>
        ))}
      </div>
      {items.length === 0
        ? <p className="px-1 text-xs text-ed-muted">No sections match.</p>
        : items.map((i) => <LibraryCard key={i.key} item={i} />)}
    </div>
  );
}
