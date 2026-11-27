import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { getHero } from "../../registry/heroRegistry.js";

// Shown when deleting a section that links point to: redirect those links, unlink them, or cancel.
export default function DeleteGuard() {
  const { pendingDelete, page, resolveDelete, setView } = useEditorStore();
  const [target, setTarget] = useState("");
  if (!pendingDelete) return null;
  const section = page.sections.find((s) => s.id === pendingDelete.id);
  const name = section?.name || getHero(section?.type)?.name || "this section";
  const others = page.sections.filter((s) => s.id !== pendingDelete.id);
  const n = pendingDelete.refs.length;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-md space-y-4 p-5" role="alertdialog" aria-labelledby="dg-title">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-300"><AlertTriangle size={18} /></span>
          <div>
            <h3 id="dg-title" className="font-semibold">{n} link{n > 1 ? "s" : ""} point to “{name}”</h3>
            <p className="mt-1 text-sm text-ed-muted">Deleting it would leave {n > 1 ? "them" : "it"} broken. Redirect {n > 1 ? "them" : "it"} somewhere else, or unlink.</p>
          </div>
        </div>
        <ul className="max-h-40 space-y-1 overflow-y-auto text-xs">
          {pendingDelete.refs.map((r, i) => (
            <li key={i} className="rounded-lg border border-ed-border bg-ed-raised px-2.5 py-1.5"><b>{r.label || "Link"}</b> <span className="text-ed-muted">in {r.sectionName}{r.pageId !== page.id ? ` · ${r.pageName}` : ""}</span></li>
          ))}
        </ul>
        <label className="block space-y-1.5 text-xs text-ed-muted">
          Redirect links to
          <select className="field" value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Choose a section…</option>
            {others.map((s) => <option key={s.id} value={s.id}>{s.name || getHero(s.type)?.name}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap justify-end gap-2">
          <button onClick={() => setView("pendingDelete", null)} className="h-9 rounded-xl border border-ed-border bg-ed-raised px-4 text-sm">Cancel</button>
          <button onClick={() => resolveDelete(null)} className="h-9 rounded-xl border border-red-400/50 bg-red-500/15 px-4 text-sm text-red-200">Unlink & delete</button>
          <button disabled={!target} onClick={() => resolveDelete(target)} className="h-9 rounded-xl bg-ed-accent px-4 text-sm font-semibold disabled:opacity-40">Redirect & delete</button>
        </div>
      </div>
    </div>
  );
}
