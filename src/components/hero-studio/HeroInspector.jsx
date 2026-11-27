import { useMemo } from "react";
import { ChevronDown, ChevronUp, Clapperboard, Eye, EyeOff, Layers, Palette, Play, Plus, Trash2 } from "lucide-react";
import { Collapsible, Segmented, Switch, Tag } from "../ui/primitives.jsx";
import PropertyControls from "../inspector/PropertyControls.jsx";
import AnimationInspector from "../animation-studio/AnimationInspector.jsx";
import { resolveProps } from "../../utils/heroResolve.js";
import { applyVariation, createHeroNode } from "../../utils/heroNode.js";
import HeroThumbnail from "./HeroThumbnail.jsx";

// This section re-dressed in another design (text, links and images kept), for the variation previews.
function useVariationNodes(node, def) {
  return useMemo(() => Object.fromEntries(Object.entries(def.variations || {}).map(([id, v]) => {
    const copy = structuredClone(node);
    applyVariation(copy, v, id, def.variations);
    return [id, copy];
  })), [node, def]);
}

const TEXT_TYPES = ["heading-line", "heading", "text", "meta"];

// Style presets from the hero definition. They only restyle; text, links and uploads are kept.
function Variations({ node, def, api }) {
  const previews = useVariationNodes(node, def);
  if (!def.variations) return null;
  return (
    <Collapsible title="Design variation" icon={Palette}>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(def.variations).map(([id, v]) => {
          const on = node.variation === id;
          return (
            <div key={id} role="button" tabIndex={0} onClick={() => api.applyVariation(id)} title={v.description}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), api.applyVariation(id))}
              className={`cursor-pointer rounded-xl border p-1.5 text-left text-xs transition ${on ? "border-ed-accent bg-ed-accent/15 text-white" : "border-ed-border bg-ed-raised text-ed-muted hover:border-white/30 hover:text-white"}`}>
              <HeroThumbnail node={previews[id]} maxHeight={760} />
              <div className="flex items-center gap-1.5 px-1 pt-1.5">
                <span className="min-w-0 flex-1 truncate font-medium">{v.label}</span>
                {on && <span className="rounded-full bg-ed-accent px-1.5 py-0.5 text-[9.5px] font-semibold text-white">Current</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-ed-muted">Previews show your own section in each design — hover to see its animation. Your text, links and uploaded images are kept.</p>
    </Collapsible>
  );
}
const row = (a) => `flex h-8 items-center gap-2 rounded-lg border px-2.5 text-left text-xs transition ${a ? "border-ed-accent bg-ed-accent/15" : "border-ed-border bg-ed-raised hover:bg-white/10"}`;

function ElementList({ node, def, selectedElementId, api }) {
  const templates = def.elementTemplates || {};
  return (
    <Collapsible title="Elements" icon={Layers}>
      <button className={`${row(!selectedElementId)} w-full`} onClick={() => api.select(null)}>Whole section</button>
      {node.elements.map((el) => (
        <div key={el.id} className="flex items-center gap-1">
          <button className={`${row(selectedElementId === el.id)} min-w-0 flex-1`} onClick={() => api.select(el.id)}>
            <span className="truncate">{el.label}</span>
            <span className="ml-auto text-[10px] text-ed-muted">{el.type}</span>
          </button>
          {templates[el.type] && (
            <>
              <button title="Move up" className="text-ed-muted hover:text-white" onClick={() => api.moveElement(el.id, -1)}><ChevronUp size={14} /></button>
              <button title="Move down" className="text-ed-muted hover:text-white" onClick={() => api.moveElement(el.id, 1)}><ChevronDown size={14} /></button>
              <button title="Delete" className="text-ed-muted hover:text-red-400" onClick={() => api.removeElement(el.id)}><Trash2 size={13} /></button>
            </>
          )}
          <button title={el.visible === false ? "Show" : "Hide"} className="text-ed-muted hover:text-white" onClick={() => api.setVisible(el.id, el.visible === false)}>
            {el.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      ))}
      {Object.entries(templates).map(([type, t]) => (
        <button key={type} onClick={() => api.addElement(type)} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-ed-border text-xs text-ed-muted hover:border-ed-accent hover:text-white">
          <Plus size={13} /> Add {t.label.toLowerCase()}
        </button>
      ))}
    </Collapsible>
  );
}

function SectionAnimations({ node, def, api }) {
  return (
    <div className="space-y-3 p-4">
      <div className="label">Choreography</div>
      {Object.entries(def.choreographies || {}).map(([id, c]) => (
        <button key={id} onClick={() => api.applyChoreography(id)}
          className={`w-full rounded-xl border p-3 text-left ${node.animationSettings?.choreography === id ? "border-ed-accent bg-ed-accent/15" : "border-ed-border bg-ed-raised hover:bg-white/10"}`}>
          <div className="text-sm font-medium">{c.label}</div>
          <div className="text-xs text-ed-muted">{c.description}</div>
        </button>
      ))}
      <div className="flex items-center justify-between text-sm">
        Respect reduced motion
        <Switch checked={node.animationSettings?.respectReducedMotion !== false} onChange={(v) => api.setAnimationSetting("respectReducedMotion", v)} />
      </div>
      <button onClick={api.replay} className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-ed-accent text-sm font-semibold"><Play size={14} /> Play sequence</button>
      {api.toggleTimeline && (
        <button onClick={api.toggleTimeline} className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-ed-border bg-ed-raised text-sm"><Clapperboard size={14} /> Toggle timeline</button>
      )}
      <p className="text-xs text-ed-muted">Select an element to edit its animation.</p>
    </div>
  );
}

export default function HeroInspector({ node, def, viewport, selectedElementId, api, tab, onTab, identity = null }) {
  const el = selectedElementId ? node.elements.find((e) => e.id === selectedElementId) : null;
  // Variation-aware defaults: used to offer "reset to theme default" on overridden token props.
  const base = useMemo(() => createHeroNode(def.id, node.variation), [def.id, node.variation]);
  const elDefaults = el ? base.elements.find((b) => b.id === el.id)?.props || def.elementTemplates?.[el.type]?.element?.props || {} : {};
  const sectionValues = resolveProps(node.props, node.responsive, viewport);
  const elValues = el ? resolveProps(el.props, el.responsive, viewport) : {};
  const elOverrides = el && viewport !== "desktop" ? el.responsive?.[viewport] || {} : {};
  const secOverrides = viewport !== "desktop" ? node.responsive?.[viewport] || {} : {};

  const onElementChange = (f, v) => (f.scope === "section" ? api.setSectionProp(f.key, v, f.responsive) : api.setElementProp(el.id, f.key, v, f.responsive));
  const onElementReset = (f) => (f.scope === "section" ? api.resetSectionProp(f.key) : api.resetElementProp(el.id, f.key));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-3 border-b border-ed-border p-4">
        <div className="flex gap-2"><Tag>{el ? el.type : "Section"}</Tag><Tag>{viewport}</Tag></div>
        <h3 className="font-semibold">{el ? el.label : def.name}</h3>
        <Segmented value={tab} onChange={onTab} options={[{ id: "design", label: "Design" }, { id: "animations", label: "Animations" }]} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedElementId && tab === "design" && identity}
        {tab === "design" && el && "text" in el.props && (
          <p className="border-b border-ed-border px-4 py-2 text-[11px] text-ed-muted">Tip: double-click text on the canvas to edit it in place.</p>
        )}
        {tab === "design" && (el ? (
          <PropertyControls fields={def.elementSchemas[el.type] || []} values={elValues} sectionValues={sectionValues}
            overrides={elOverrides} viewport={viewport} onChange={onElementChange} onReset={onElementReset} defaults={elDefaults} sectionDefaults={base.props} />
        ) : (
          <>
            <Variations node={node} def={def} api={api} />
            <PropertyControls fields={def.editableProperties} values={sectionValues} sectionValues={sectionValues}
              overrides={secOverrides} viewport={viewport} onChange={(f, v) => api.setSectionProp(f.key, v, f.responsive)} onReset={(f) => api.resetSectionProp(f.key)} defaults={base.props} sectionDefaults={base.props} />
          </>
        ))}

        {tab === "animations" && (el
          ? <AnimationInspector element={el} api={api} isText={TEXT_TYPES.includes(el.type)} />
          : <SectionAnimations node={node} def={def} api={api} />)}

        <ElementList node={node} def={def} selectedElementId={selectedElementId} api={api} />
      </div>
    </div>
  );
}