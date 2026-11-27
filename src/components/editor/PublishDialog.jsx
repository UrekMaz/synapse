import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Globe, Loader2, Rocket, X } from "lucide-react";
import { useEditorStore } from "../../store/editorStore.js";
import { checkName, isLocalHost, publishSite, siteSlug, siteUrl } from "../../utils/publish.js";
import { isPortfolio } from "../../data/portfolio.js";

const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

// Publish: pick a site name + address the first time, then one click to push updates to the same link.
export default function PublishDialog() {
  const open = useEditorStore((s) => s.publishOpen);
  // Mounting the form on open gives it fresh state every time.
  return open ? <PublishForm /> : null;
}

function PublishForm() {
  const { published, page, setView, setPublished } = useEditorStore();
  const portfolio = isPortfolio(page);
  const noun = portfolio ? "portfolio" : "site";
  const [name, setName] = useState(() => published?.name
    || (portfolio ? page?.owner?.name || "My portfolio" : page?.name && page.name !== "Untitled Page" ? page.name : "My website"));
  const [slug, setSlug] = useState(() => published?.slug || siteSlug(name));
  const [slugEdited, setSlugEdited] = useState(!!published);
  const [result, setResult] = useState(null); // { slug, available, reason } for the last checked address
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const updating = !!published && published.slug === slug;

  // Live availability check for a new address (debounced).
  useEffect(() => {
    if (updating || !slug) return;
    let live = true;
    const t = setTimeout(() => {
      checkName(slug).then((r) => live && setResult({ ...r, slug }), (e) => live && setResult({ slug, available: false, reason: e instanceof TypeError ? "Couldn't reach the publishing server." : e.message }));
    }, 350);
    return () => { live = false; clearTimeout(t); };
  }, [slug, updating]);

  const avail = !slug ? { available: false, reason: "Choose an address." } : result?.slug === slug ? result : "checking";
  const close = () => setView("publishOpen", false);
  const ready = name.trim() && slug && (updating || (avail !== "checking" && avail.available));

  const publish = async () => {
    setBusy(true); setErr("");
    try {
      const st = useEditorStore.getState();
      const r = await publishSite({ slug, name: name.trim(), pages: st.allPages(), linkSettings: st.linkSettings, token: updating ? published.token : undefined });
      setPublished({ slug: r.slug, name: r.name, token: r.token, version: r.version, publishedAt: r.publishedAt, url: siteUrl(r.slug) });
      setJustPublished(true);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(siteUrl(published.slug)); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="panel w-full max-w-lg space-y-4 p-5" role="dialog" aria-labelledby="pub-title">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ed-accent/25 text-ed-accent"><Rocket size={18} /></span>
          <div className="min-w-0 flex-1">
            <h3 id="pub-title" className="font-semibold">{justPublished ? `Your ${noun} is live` : published ? `Update your ${noun}` : `Publish your ${noun}`}</h3>
            <p className="mt-0.5 text-sm text-ed-muted">{justPublished ? (portfolio ? "Share the link with clients, recruiters and friends." : "Anyone with the link can visit it.") : "All pages, links, themes and moods are published together."}</p>
          </div>
          <button onClick={close} title="Close" className="text-ed-muted hover:text-white"><X size={16} /></button>
        </div>

        {justPublished && published ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-2.5">
              <Globe size={16} className="shrink-0 text-emerald-300" />
              <a href={siteUrl(published.slug)} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-semibold text-emerald-200 underline-offset-2 hover:underline">{siteUrl(published.slug)}</a>
              <button onClick={copy} className="flex h-8 items-center gap-1 rounded-lg border border-ed-border bg-ed-raised px-2.5 text-xs">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Copied" : "Copy"}</button>
              <a href={siteUrl(published.slug)} target="_blank" rel="noreferrer" className="flex h-8 items-center gap-1 rounded-lg bg-ed-accent px-2.5 text-xs font-semibold"><ExternalLink size={12} />Open</a>
            </div>
            <p className="text-xs text-ed-muted"><b className="text-white">{published.name}</b> · version {published.version} · published {when(published.publishedAt)}. Edits you make from now on stay private until you press Publish again.</p>
          </div>
        ) : (
          <>
            <label className="block space-y-1.5 text-xs text-ed-muted">{portfolio ? "Portfolio name (shown in the browser tab)" : "Site name"}
              <input className="field" value={name} maxLength={80} autoFocus
                onChange={(e) => { setName(e.target.value); if (!slugEdited) setSlug(siteSlug(e.target.value)); }} />
            </label>
            <label className="block space-y-1.5 text-xs text-ed-muted">Address
              <div className="flex items-center overflow-hidden rounded-xl border border-ed-border bg-ed-raised">
                <span className="shrink-0 pl-3 text-ed-muted">{window.location.host}/s/</span>
                <input className="min-w-0 flex-1 bg-transparent py-2 pr-3 text-sm text-white outline-none disabled:opacity-60" value={slug} disabled={!!published}
                  onChange={(e) => { setSlugEdited(true); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 48)); }} />
              </div>
              <span className="block min-h-[16px]">
                {updating ? <span>Updates go to your existing link.</span>
                  : avail === "checking" ? <span className="inline-flex items-center gap-1"><Loader2 size={11} className="animate-spin" />Checking…</span>
                    : avail?.available ? <span className="text-emerald-300">✓ Available</span>
                      : avail ? <span className="text-red-300">{avail.reason}</span> : null}
              </span>
            </label>
            {published && <p className="text-xs text-ed-muted">Live at <a className="underline" href={siteUrl(published.slug)} target="_blank" rel="noreferrer">{siteUrl(published.slug)}</a> · version {published.version}, {when(published.publishedAt)}</p>}
            {err && <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{err}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={close} className="h-9 rounded-xl border border-ed-border bg-ed-raised px-4 text-sm">Cancel</button>
              <button onClick={publish} disabled={!ready || busy} className="flex h-9 items-center gap-1.5 rounded-xl bg-ed-accent px-5 text-sm font-semibold disabled:opacity-40">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}{published ? `Update ${noun}` : "Publish"}
              </button>
            </div>
          </>
        )}
        {isLocalHost() && (
          <p className="border-t border-ed-border pt-3 text-[11px] leading-relaxed text-ed-muted">
            You're running Synapse on this computer, so this link only opens here. For a public link, deploy Synapse
            (e.g. to Vercel with an Upstash Redis database; see README). Published sites then live at <code>your-domain/s/…</code>.
          </p>
        )}
      </div>
    </div>
  );
}
