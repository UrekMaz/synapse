import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Choice from "../ui/Choice.jsx";

export default function AdvancedSettings({ draft, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-ed-border bg-ed-raised/50">
      <button onClick={() => setOpen(!open)} className="flex h-10 w-full items-center justify-between px-3 text-sm">
        Advanced Settings
        <ChevronDown size={14} className={`text-ed-muted transition ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-ed-border p-3">
          <div>
            <div className="label mb-1.5">Page name</div>
            <input className="field" value={draft.name} onChange={(e) => onChange({ name: e.target.value })} />
          </div>
          <Choice label="Tablet columns" unit="" options={[4, 8, 12]} value={draft.tabletColumns} onChange={(v) => onChange({ tabletColumns: v })} />
          <Choice label="Tablet side margin" options={[16, 24, 32]} value={draft.tabletMargin} onChange={(v) => onChange({ tabletMargin: v })} />
          <Choice label="Mobile columns" unit="" options={[1, 2, 4]} value={draft.mobileColumns} onChange={(v) => onChange({ mobileColumns: v })} />
          <Choice label="Mobile side margin" options={[8, 16, 24]} value={draft.mobileMargin} onChange={(v) => onChange({ mobileMargin: v })} />
        </div>
      )}
    </div>
  );
}