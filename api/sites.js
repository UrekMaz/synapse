/*
 * Vercel serverless entry for the publishing API. vercel.json rewrites
 *   /api/sites/:slug            → /api/sites?__slug=:slug
 *   /api/sites/:slug/available  → /api/sites?__slug=:slug&__check=1
 * and this rebuilds the original path for the shared handler in server/sitesApi.js.
 * Vercel's disk is read-only and not shared between requests, so sites are stored in Upstash Redis
 * (add it under Vercel → Storage; that sets KV_REST_API_URL / KV_REST_API_TOKEN).
 */
import { createSitesApi } from "../server/sitesApi.js";
import { pickStore } from "../server/siteStores.js";

const store = pickStore({ dataDir: "/tmp/synapse-data" });
const api = createSitesApi({ store, maxBody: 4 * 1024 * 1024 });

export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const slug = url.searchParams.get("__slug");
  if (slug) {
    const check = url.searchParams.get("__check");
    url.searchParams.delete("__slug");
    url.searchParams.delete("__check");
    const q = url.searchParams.toString();
    req.url = `/api/sites/${encodeURIComponent(slug)}${check ? "/available" : ""}${q ? `?${q}` : ""}`;
  }
  if (store.kind !== "redis") {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ error: "Publishing isn't set up on this deployment yet: connect an Upstash Redis database in Vercel → Storage, then redeploy." }));
  }
  if (!(await api(req, res))) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Not found" }));
  }
}
