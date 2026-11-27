import { ArrowRight, Briefcase, Check, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LAYOUT_PRESETS } from "../../data/layoutPresets.js";
import { DEFAULT_OWNER, SITE_TYPES } from "../../data/portfolio.js";
import { useEditorStore } from "../../store/editorStore.js";
import LayoutCard from "./LayoutCard.jsx";
import WizardHeader from "./WizardHeader.jsx";

const ICONS = { portfolio: UserRound, website: Briefcase };

export default function LayoutSelectionPage() {
  const navigate = useNavigate();
  const draft = useEditorStore((s) => s.draft);
  const selectPreset = useEditorStore((s) => s.selectPreset);
  const patchDraft = useEditorStore((s) => s.patchDraft);
  const siteType = draft.siteType || "portfolio";
  const portfolio = siteType === "portfolio";

  return (
    <div className="h-full overflow-y-auto">
      <WizardHeader step={1} backTo="/dashboard" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-semibold">What are you building?</h1>
        <p className="mt-2 text-ed-muted">You can change this later in the editor.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Project type">
          {SITE_TYPES.map((t) => {
            const Icon = ICONS[t.id];
            const on = siteType === t.id;
            return (
              <button key={t.id} role="radio" aria-checked={on} onClick={() => patchDraft({ siteType: t.id })}
                className={`panel relative flex gap-4 p-5 text-left transition ${on ? "border-ed-accent bg-ed-accent/10" : "hover:border-white/25"}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${on ? "bg-ed-accent text-white" : "bg-ed-raised"}`}><Icon size={20} /></span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-semibold">{t.label}{t.badge && <span className="rounded-full bg-ed-accent/25 px-2 py-0.5 text-[10px] font-semibold text-white">{t.badge}</span>}</span>
                  <span className="mt-1 block text-sm text-ed-muted">{t.description}</span>
                </span>
                {on && <Check size={16} className="absolute right-4 top-4 text-ed-accent" />}
              </button>
            );
          })}
        </div>

        {portfolio && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm text-ed-muted">Your name
              <input className="field" value={draft.ownerName || ""} placeholder={DEFAULT_OWNER.name} maxLength={60} onChange={(e) => patchDraft({ ownerName: e.target.value })} />
            </label>
            <label className="block space-y-1.5 text-sm text-ed-muted">What you do
              <input className="field" value={draft.ownerRole || ""} placeholder={`e.g. ${DEFAULT_OWNER.role}, Photographer, Developer`} maxLength={60} onChange={(e) => patchDraft({ ownerRole: e.target.value })} />
            </label>
            <p className="text-xs text-ed-muted sm:col-span-2">We'll use these to fill in your starter portfolio: intro, projects, about, services, kind words and contact. Every word is editable.</p>
          </div>
        )}

        <h2 className="mt-12 text-xl font-semibold">Choose your {portfolio ? "portfolio" : "page"} layout</h2>
        <p className="mt-1 text-ed-muted">Select a starting structure. You can customize everything later.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LAYOUT_PRESETS.map((p) => (
            <LayoutCard key={p.id} preset={p} selected={draft.presetId === p.id} onSelect={() => selectPreset(p.id)} />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={() => navigate("/new/configure")}
                  className="flex h-11 items-center gap-2 rounded-xl bg-ed-accent px-5 text-sm font-semibold hover:brightness-110">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
