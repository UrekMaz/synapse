import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteRenderer from "./SiteRenderer.jsx";
import { fetchSite } from "../utils/publish.js";

// Public, deployed site: /s/:site is its home page, /s/:site/:page any other page.
export default function PublishedSiteRoute() {
  const { site, page: pageSlug } = useParams();
  const [state, setState] = useState({ status: "loading", site: null });

  useEffect(() => {
    let live = true;
    fetchSite(site).then(
      (data) => live && setState({ status: data ? "ok" : "missing", site: data }),
      () => live && setState({ status: "error", site: null }),
    );
    return () => { live = false; };
  }, [site]);

  if (state.status === "loading") return <div className="grid h-full place-items-center bg-white text-sm text-neutral-400">Loading…</div>;
  if (state.status !== "ok") {
    return (
      <div className="grid h-full place-items-center bg-white p-6 text-center text-neutral-700">
        <div>
          <div className="text-5xl font-bold text-neutral-900">404</div>
          <p className="mt-2">{state.status === "missing" ? `There is no published site called “${site}”.` : "This site couldn't be loaded right now."}</p>
          <Link to="/" className="mt-4 inline-block text-sm text-indigo-600 underline">Go to Synapse</Link>
        </div>
      </div>
    );
  }
  const pages = state.site.pages;
  const current = pageSlug ? pages.find((p) => p.slug === pageSlug) : pages.find((p) => p.home) || pages[0];
  if (!current) {
    return <div className="grid h-full place-items-center bg-white text-neutral-700">Page not found. <Link to={`/s/${site}`} className="ml-1 underline">Home</Link></div>;
  }
  const pageTitle = current.meta?.title || (current.home ? "" : current.name);
  return (
    <SiteRenderer pages={pages} current={current} linkSettings={state.site.linkSettings} basePath={`/s/${state.site.slug}`}
      title={pageTitle ? `${pageTitle} · ${state.site.name}` : state.site.name} />
  );
}
