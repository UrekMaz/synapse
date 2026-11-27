import { useState } from "react";
import { Plus, Layers, Palette, Link2, LayoutGrid, Image as ImageIcon, PenLine, ChevronDown, ChevronRight } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { getHero } from "../../registry/heroRegistry.js";
import { IconButton, Pill } from "../ui/primitives.jsx";
import SectionLibrary from "../hero-studio/SectionLibrary.jsx";
import ThemePanel from "./ThemePanel.jsx";
import LinksPanel from "./LinksPanel.jsx";

const TABS = [
  { id: "layers", icon: Layers },
  { id: "sections", icon: LayoutGrid, title: "Section library" },
  { id: "theme", icon: Palette, title: "Design system" },
  { id: "links", icon: Link2, title: "Links" },
  { id: "assets", icon: ImageIcon },
  { id: "components", icon: PenLine },
];
const row = (a) => `flex h-8 w-full items-center gap-2 rounded-lg border px-2.5 text-left text-xs transition ${a ? "border-ed-accent bg-ed-accent/15" : "border-ed-border bg-ed-raised hover:bg-white/10"}`;

function LayersPanel() {
  const { page, selectedId, selectedElementId, select, selectElement, setPanel } = useEditorStore();
  const [open, setOpen] = useState({});
  return (
    <div className="space-y-2">
      <div className="label">Layers</div>
      <button onClick={() => select(null)} className={row(selectedId === null)}><Layers size={13} /><span className="truncate">Page · {page.name}</span></button>
      {page.sections.length === 0 && (
        <p className="px-1 pt-1 text-xs text-ed-muted">
          No sections yet. Open the <button className="text-ed-accent" onClick={() => setPanel("sections")}>Section library</button> to add one.
        </p>
      )}
      {page.sections.map((s) => {
        const isOpen = open[s.id] ?? selectedId === s.id;
        return (
          <div key={s.id}>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen({ ...open, [s.id]: !isOpen })} className="text-ed-muted">{isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button>
              <button onClick={() => select(s.id)} className={row(selectedId === s.id && !selectedElementId)}><span className="truncate">{s.name || getHero(s.type)?.name || s.type}</span><span className="ml-auto shrink-0 text-[10px] text-ed-muted">#{s.anchor || s.id}</span></button>
            </div>
            {isOpen && (
              <div className="ml-5 mt-1 space-y-1">
                {s.elements.map((el) => (
                  <button key={el.id} onClick={() => selectElement(s.id, el.id)} className={row(selectedId === s.id && selectedElementId === el.id)}>
                    <span className="truncate">{el.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LeftSidebar() {
  const { activePanel, setPanel, openLibrary } = useEditorStore();
  const panel = activePanel === "heroes" ? "sections" : activePanel;
  return (
    <aside className="absolute bottom-16 left-3 top-3 z-20 flex w-[260px] flex-col gap-3">
      <div className="flex gap-2">
        <IconButton icon={Plus} onClick={() => openLibrary()} title="Add section" />
        <Pill active={panel === "theme"} onClick={() => setPanel("theme")}>Theme</Pill>
        <Pill active={panel === "layers"} onClick={() => setPanel("layers")}>Layout</Pill>
        <Pill>Tools</Pill>
      </div>
      <div className="panel flex min-h-0 flex-1 flex-col">
        <div className="flex justify-between border-b border-ed-border p-3">
          {TABS.map(({ id, icon, title }) => <IconButton key={id} icon={icon} title={title} active={panel === id} onClick={() => setPanel(id)} />)}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {panel === "layers" ? <LayersPanel /> : panel === "sections" ? <SectionLibrary /> : panel === "theme" ? <ThemePanel /> : panel === "links" ? <LinksPanel /> : (
            <p className="text-sm capitalize text-ed-muted">{panel} panel arrives in a later module.</p>
          )}
        </div>
      </div>
    </aside>
  );
}