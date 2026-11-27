import { ArrowRight, Briefcase, Globe, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEditorStore } from "../store/editorStore.js";
import { isPortfolio } from "../data/portfolio.js";
import Logo from "../components/ui/Logo.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const page = useEditorStore((s) => s.page);
  const published = useEditorStore((s) => s.published);
  const resetDraft = useEditorStore((s) => s.resetDraft);
  const patchDraft = useEditorStore((s) => s.patchDraft);
  const start = (siteType) => { resetDraft(); patchDraft({ siteType }); navigate("/new"); };

  return (
    <div className="h-full overflow-y-auto">
      <header className="flex h-14 items-center border-b border-ed-border px-6"><Link to="/" title="Home"><Logo /></Link></header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold">Build a portfolio that gets you hired</h1>
        <p className="mt-1 text-ed-muted">Show your best work, tell your story and publish it with your own link. No code needed.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button onClick={() => start("portfolio")}
                  className="panel border-ed-accent/60 bg-ed-accent/10 p-5 text-left transition hover:border-ed-accent">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-ed-accent/30"><UserRound size={18} /></span>
            <div className="font-medium">Create your portfolio</div>
            <p className="mt-1 text-sm text-ed-muted">Start from a ready-made portfolio with your name, projects, about, services and contact. Make it yours in the editor.</p>
          </button>
          <button onClick={() => start("website")} className="panel p-5 text-left transition hover:border-white/25">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-ed-raised"><Briefcase size={18} /></span>
            <div className="font-medium">Business website</div>
            <p className="mt-1 text-sm text-ed-muted">Building for a company or product instead? Start from a blank page.</p>
          </button>
        </div>

        {page && (
          <section className="mt-10">
            <div className="label mb-3">Your projects</div>
            <button onClick={() => navigate("/editor")}
                    className="panel flex w-full items-center justify-between p-4 text-left transition hover:border-ed-accent">
              <div>
                <div className="font-medium">{isPortfolio(page) ? `${page.owner?.name ? `${page.owner.name}'s portfolio` : "My portfolio"}` : page.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-ed-muted">
                  {isPortfolio(page) ? "Portfolio" : "Website"} · {page.layout.width} · {page.layout.type}
                  {published && <><span>·</span><Globe size={11} className="text-emerald-400" /><span className="text-emerald-300">/s/{published.slug}</span></>}
                </div>
              </div>
              <ArrowRight size={16} className="text-ed-muted" />
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
