import { Undo2, Redo2, Sparkles, Eye, EyeOff, ExternalLink, Rocket, Check, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEditorStore } from "../../store/editorStore.js";
import { IconButton, Pill } from "../ui/primitives.jsx";
import Logo from "../ui/Logo.jsx";
import PagesMenu from "./PagesMenu.jsx";
import PublishDialog from "./PublishDialog.jsx";
import { SITE_TYPES, isPortfolio } from "../../data/portfolio.js";

export default function TopToolbar() {
  const navigate = useNavigate();
  const { mode, setView, undo, redo, past, future, published, page, setSiteType } = useEditorStore();
  const preview = mode === "preview";

  return (
    <header className="z-30 flex h-14 items-center gap-3 border-b border-ed-border bg-ed-bg/70 px-3 backdrop-blur">
      <button onClick={() => navigate("/dashboard")} className="flex h-10 items-center rounded-2xl border border-ed-border bg-ed-raised px-3" title="Dashboard">
        <Logo />
      </button>
      <IconButton icon={Undo2} title="Undo (Ctrl+Z)" onClick={undo} disabled={!past.length} className={past.length ? "" : "opacity-40"} />
     <IconButton icon={Redo2} title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!future.length} className={future.length ? "" : "opacity-40"} />
      <PagesMenu />
      <label className="flex h-8 items-center rounded-full border border-ed-border bg-ed-raised pl-3 text-xs text-ed-muted" title="What this project is — changes wording and the copy new sections start with">
        <span className="sr-only">Project type</span>
        <select value={isPortfolio(page) ? "portfolio" : "website"} onChange={(e) => setSiteType(e.target.value)} className="h-full cursor-pointer rounded-full bg-transparent pr-2 font-semibold text-white outline-none">
          {SITE_TYPES.map((t) => <option key={t.id} value={t.id} className="bg-ed-raised">{t.label}</option>)}
        </select>
      </label>
      <span className="flex items-center gap-1 rounded-full border border-ed-border bg-ed-raised px-3 py-1 text-xs font-semibold">
        <Check size={12} className="text-emerald-400" /> Saved
      </span>

      <div className="flex-1" />

      <Pill onClick={() => setView("themeStudioOpen", true)}><Palette size={14} className="mr-1.5 inline" />Theme Studio</Pill>
      <Pill><Sparkles size={14} className="mr-1.5 inline" />AI</Pill>
      <Pill active={preview} onClick={() => setView("mode", preview ? "edit" : "preview")}>
        {preview ? <EyeOff size={14} className="mr-1.5 inline" /> : <Eye size={14} className="mr-1.5 inline" />}
        {preview ? "Exit preview" : "Preview"}
      </Pill>
      <IconButton icon={ExternalLink} title="Open real preview in a new tab" onClick={() => { const p = useEditorStore.getState().page; window.open(p.home || !p.slug ? "/preview" : `/preview/${p.slug}`, "_blank"); }} />
      {published && (
        <a href={`/s/${published.slug}`} target="_blank" rel="noreferrer" title={`Live: ${window.location.host}/s/${published.slug}`} className="hidden max-w-[180px] items-center gap-1.5 truncate rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 lg:flex">
          <i className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />/s/{published.slug}
        </a>
      )}
      <Pill className="!border-ed-accent !bg-ed-accent text-white" onClick={() => setView("publishOpen", true)}><Rocket size={14} className="mr-1.5 inline" />{published ? "Update" : "Publish"}</Pill>
      <PublishDialog />
    </header>
  );
}