import { LayoutTemplate, Eye } from "lucide-react";
import { useEditorStore } from "../../../store/editorStore.js";
import { Collapsible, Switch, Tag } from "../../ui/primitives.jsx";
import { LayoutControls } from "../../layout-selection/LayoutConfiguration.jsx";

export default function PageSettingsInspector() {
  const { page, viewport, updateLayout, updateResponsive, showGrid, showBounds, setView } = useEditorStore();
  const r = page.responsive[viewport];

  // columns + side margin are per-viewport; everything else is page-wide
  const value = {
    width: page.layout.width,
    composition: page.layout.type,
    maxWidth: page.layout.maxWidth,
    columnGap: page.layout.columnGap,
    columns: r.columns,
    sideMargin: r.sideMargin,
  };

  const onChange = (patch) => {
    const { composition, columns, sideMargin, ...rest } = patch;
    const layoutPatch = { ...rest };
    if (composition) layoutPatch.type = composition;

    if (viewport === "desktop") {
      if (columns !== undefined) layoutPatch.columns = columns;
      if (sideMargin !== undefined) layoutPatch.sideMargin = sideMargin;
    } else {
      const rp = {};
      if (columns !== undefined) rp.columns = columns;
      if (sideMargin !== undefined) rp.sideMargin = sideMargin;
      if (Object.keys(rp).length) updateResponsive(viewport, rp);
    }
    if (Object.keys(layoutPatch).length) updateLayout(layoutPatch);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 border-b border-ed-border p-4">
        <Tag>Page</Tag>
        <h3 className="font-semibold">{page.name}</h3>
        <p className="text-xs text-ed-muted">
          Columns and side margins apply to the <span className="capitalize text-white">{viewport}</span> viewport.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Collapsible title="Page Layout" icon={LayoutTemplate}>
          <LayoutControls value={value} onChange={onChange} />
        </Collapsible>

        <Collapsible title="Canvas View" icon={Eye}>
          <div className="flex items-center justify-between text-sm">Show grid <Switch checked={showGrid} onChange={(v) => setView("showGrid", v)} /></div>
          <div className="flex items-center justify-between text-sm">Show page bounds <Switch checked={showBounds} onChange={(v) => setView("showBounds", v)} /></div>
        </Collapsible>
      </div>
    </div>
  );
}