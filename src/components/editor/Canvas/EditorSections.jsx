import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, RefreshCw, Trash2 } from "lucide-react";
import SectionRenderer from "../../../renderer/SectionRenderer.jsx";
import { useEditorStore } from "../../../store/editorStore.js";
import { getHero } from "../../../registry/heroRegistry.js";
import { createHeroNode, setElementProp } from "../../../utils/heroNode.js";
import { altFor, navClearFor } from "../../../utils/layoutUtils.js";

// Native HTML5 drag & drop: works across the absolutely positioned sidebar and the zoomed canvas.
export const DND_HERO = "application/x-synapse-hero";
export const DND_SECTION = "application/x-synapse-section";
const isOurs = (e) => e.dataTransfer.types.includes(DND_HERO) || e.dataTransfer.types.includes(DND_SECTION);

function SectionToolbar({ section, index, count }) {
  const { moveSection, duplicateSection, requestDelete, setView, openLibrary } = useEditorStore();
  const stop = (e) => e.stopPropagation();
  const btn = "grid h-7 w-7 place-items-center rounded-md text-ed-muted hover:bg-white/10 hover:text-white disabled:opacity-30";
  return (
    <div onPointerDown={stop} className="absolute right-3 top-3 z-50 flex items-center gap-1 rounded-xl border border-ed-border bg-ed-panel/95 p-1 text-ed-text shadow-lg backdrop-blur">
      <span draggable title="Drag to move this section (also between layout regions)"
        onDragStart={(e) => { e.dataTransfer.setData(DND_SECTION, section.id); e.dataTransfer.effectAllowed = "move"; setView("dragging", true); }}
        onDragEnd={() => setView("dragging", false)}
        className={`${btn} cursor-grab active:cursor-grabbing`}><GripVertical size={14} /></span>
      <span className="px-2 text-xs font-medium">{getHero(section.type)?.name}</span>
      <button className={btn} disabled={index === 0} onClick={() => moveSection(section.id, -1)} title="Move up"><ArrowUp size={14} /></button>
      <button className={btn} disabled={index === count - 1} onClick={() => moveSection(section.id, 1)} title="Move down"><ArrowDown size={14} /></button>
      <button className={btn} onClick={() => openLibrary({ mode: "after", id: section.id })} title="Insert a section below"><Plus size={14} /></button>
      <button className={btn} onClick={() => openLibrary({ mode: "replace", id: section.id }, getHero(section.type)?.library)} title="Replace with another section"><RefreshCw size={13} /></button>
      <button className={btn} onClick={() => duplicateSection(section.id)} title="Duplicate"><Copy size={14} /></button>
      <button className={`${btn} hover:!text-red-400`} onClick={() => requestDelete(section.id)} title="Delete"><Trash2 size={14} /></button>
    </div>
  );
}

const Marker = () => <div className="pointer-events-none relative z-50 h-0"><div className="absolute -top-[3px] left-0 right-0 h-[6px] rounded-full bg-[#8b6cff] shadow-[0_0_18px_rgba(139,108,255,.9)]" /></div>;

function Placeholder({ region, first, active }) {
  return (
    <div className={`grid place-items-center rounded-xl border-2 border-dashed text-center transition ${active ? "border-[#8b6cff] bg-violet-100" : "border-violet-300 bg-violet-50/70"}`}
      style={{ minHeight: first ? (region.primary ? 420 : 200) : 140 }}>
      {region.primary || !first ? (
        <div className="px-4">
          <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-500"><Plus size={18} /></div>
          <div className="text-sm font-medium text-neutral-700">{first ? "Drag your first section here" : `Drop a section into “${region.label}”`}</div>
          <div className="mt-1 text-xs text-neutral-500">{first ? "Or press + on any section in the library" : "Drag a card from the section library"}</div>
        </div>
      ) : (
        <span className="text-xs font-medium uppercase tracking-widest text-violet-400">{region.label}</span>
      )}
    </div>
  );
}

// One composition region in the editor: its sections, insertion marker and drop handling.
export default function EditorRegion({ region, sections, page, viewport, bleed, width, empty, style }) {
  const s = useEditorStore();
  const [dropAt, setDropAt] = useState(null);

  const indexFromPointer = (e) => {
    const nodes = [...e.currentTarget.querySelectorAll(":scope > [data-section]")];
    const k = nodes.findIndex((n) => { const r = n.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    return k < 0 ? nodes.length : k;
  };
  const onDragOver = (e) => {
    if (!isOurs(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes(DND_HERO) ? "copy" : "move";
    const k = indexFromPointer(e);
    if (k !== dropAt) setDropAt(k);
  };
  const onDrop = (e) => {
    if (!isOurs(e)) return;
    e.preventDefault();
    const k = indexFromPointer(e);
    setDropAt(null);
    s.setView("dragging", false);
    const all = page.sections;
    const flat = k < sections.length ? all.findIndex((x) => x.id === sections[k].id)
      : sections.length ? all.findIndex((x) => x.id === sections[sections.length - 1].id) + 1 : all.length;
    const [heroId, variationId] = e.dataTransfer.getData(DND_HERO).split("::");
    const sectionId = e.dataTransfer.getData(DND_SECTION);
    if (heroId && getHero(heroId)) s.insertSection(createHeroNode(heroId, variationId || null), region.id, flat);
    else if (sectionId) s.moveSectionTo(sectionId, region.id, flat);
  };

  return (
    <div className="layout-region" data-region={region.id} style={style}
      onDragOver={onDragOver} onDrop={onDrop}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropAt(null); }}>
      {sections.map((section, i) => {
        const selected = s.selectedId === section.id;
        const flatIndex = page.sections.indexOf(section);
        return [
          dropAt === i && <Marker key={`m-${section.id}`} />,
          <SectionRenderer
            key={section.id} section={section} navClear={navClearFor(sections, i, viewport)} alt={altFor(sections, i)} editor viewport={viewport} bleed={bleed} layoutWidth={width} selected={selected}
            selectedElementId={selected ? s.selectedElementId : null}
            playKey={s.playKeys[section.id] || 0} preview={s.previews[section.id] || null}
            // While choosing a link destination, a click picks the section instead of selecting it.
            onSelect={(e) => { e.stopPropagation(); if (s.linkPicker) { s.linkPicker(section.id); s.setView("linkPicker", null); } else s.select(section.id); }}
            onSelectElement={(id) => (s.linkPicker ? null : s.selectElement(section.id, id))}
            onEditProp={(id, key, v) => s.editSection(section.id, (n) => setElementProp(n, id, key, v, "desktop", false))}
            onResizeElement={(id, patch, bp) => s.resizeElement(section.id, id, patch, bp)}
            onResizeSection={(patch) => s.resizeSection(section.id, patch, viewport || "desktop")}
            toolbar={selected ? <SectionToolbar section={section} index={flatIndex} count={page.sections.length} /> : null}
          />,
        ];
      })}
      {dropAt === sections.length && sections.length > 0 && <Marker />}
      {(sections.length === 0 || s.dragging) && (
        <div style={{ marginTop: sections.length ? 12 : 0 }}>
          <Placeholder region={region} first={sections.length === 0 && empty} active={dropAt != null} />
        </div>
      )}
    </div>
  );
}
