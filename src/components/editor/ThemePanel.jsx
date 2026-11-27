import { Palette } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { resolveTheme } from "../../utils/tokens.js";
import { FieldRow } from "../inspector/PropertyControls.jsx";
import { Collapsible } from "../ui/primitives.jsx";

const QUICK = ["primary", "accent", "background", "surface", "headingText", "text"];

// Sidebar summary of the site theme; the full editor lives in Theme Studio.
export default function ThemePanel() {
  const { page, updateTheme, setView } = useEditorStore();
  const t = resolveTheme(page.theme);
  return (
    <div className="-mx-3 -mt-3">
      <div className="space-y-3 p-3">
        <div className="label">Design system</div>
        <div className="overflow-hidden rounded-xl border border-ed-border">
          <div className="flex h-10">{["background", "surface", "primary", "accent", "secondary", "text"].map((k) => <i key={k} className="flex-1" style={{ background: t.colors[k] }} />)}</div>
          <div className="bg-ed-raised p-2.5">
            <div className="text-sm font-semibold">{t.name}</div>
            <div className="text-[11px] text-ed-muted">{t.typography.heading} · {t.typography.body} · {t.mode}</div>
          </div>
        </div>
        <button onClick={() => setView("themeStudioOpen", true)} className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-ed-accent text-sm font-semibold hover:brightness-110"><Palette size={14} /> Open Theme Studio</button>
        <p className="text-[11px] text-ed-muted">Browse 20 themes (including the Music &amp; Eras collection), tune colors, type and components with a live preview, and save your own.</p>
      </div>
      <Collapsible title="Quick colors" defaultOpen>
        {QUICK.map((k) => <FieldRow key={k} field={{ key: k, label: k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()), type: "color" }} value={t.colors[k]} onChange={(v) => updateTheme("colors", k, v)} />)}
      </Collapsible>
    </div>
  );
}
