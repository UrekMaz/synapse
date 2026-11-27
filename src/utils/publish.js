import { slugify } from "./links.js";

// Client for the publishing API (server/sitesApi.js).
export const siteSlug = (name) => slugify(name || "").slice(0, 48).replace(/-+$/, "");
export const siteUrl = (slug) => `${window.location.origin}/s/${slug}`;
export const isLocalHost = () => /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(window.location.hostname);

async function json(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export async function checkName(slug, token) {
  const q = token ? `?token=${encodeURIComponent(token)}` : "";
  return json(await fetch(`/api/sites/${encodeURIComponent(slug)}/available${q}`));
}

export async function publishSite({ slug, name, pages, linkSettings, token }) {
  return json(await fetch(`/api/sites/${encodeURIComponent(slug)}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, pages, linkSettings, token }),
  }));
}

// null when the site doesn't exist.
export async function fetchSite(slug) {
  const res = await fetch(`/api/sites/${encodeURIComponent(slug)}`);
  if (res.status === 404 || res.status === 400) return null;
  return json(res);
}
