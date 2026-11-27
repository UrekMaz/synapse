import { Suspense } from "react";
import { HeroHost } from "../components/hero-studio/runtime/HeroRuntime.jsx";
import { getHero } from "../registry/heroRegistry.js";
import { bpFromWidth, narrowestBp } from "../utils/heroResolve.js";

// layoutWidth: simulated width of the slot the hero sits in (editor), so a hero inside a narrow region uses its tablet/mobile layout.
export default function HeroRenderer({ node, editor = false, viewport = null, layoutWidth = null, animated = true, playKey = 0, preview = null, selectedElementId = null, onSelectElement, onEditProp, onResizeElement }) {
  const def = getHero(node.type);
  if (!def) return <div style={{ padding: 24, color: "#b91c1c" }}>Unknown hero “{node.type}”</div>;
  const Component = def.component;
  const forced = viewport && layoutWidth ? narrowestBp(viewport, bpFromWidth(layoutWidth)) : viewport;
  return (
    <HeroHost node={node} editor={editor} forcedBp={forced} animated={animated} playKey={playKey} preview={preview}
      selectedElementId={selectedElementId} onSelectElement={onSelectElement} onEditProp={onEditProp} onResizeElement={onResizeElement}>
      <Suspense fallback={<div style={{ minHeight: def.defaults.props.minHeight, background: def.defaults.props.backgroundColor || "#f4f4f5" }} />}>
        <Component />
      </Suspense>
    </HeroHost>
  );
}
