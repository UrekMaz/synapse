/*
 * Publishing API. Published sites are immutable snapshots of the editor's pages, stored as JSON (files or Redis — see siteStores.js):
 *
 *   GET  /api/sites/:slug           → the published snapshot (public)
 *   GET  /api/sites/:slug/available → { available, reason? }
 *   PUT  /api/sites/:slug           → publish / update. Body: { name, pages, linkSettings, token? }
 *
 * The first publish of a name claims it and returns a secret token; later updates must send that token,
 * so nobody else can overwrite a site. Only a hash of the token is stored.
 * Used by the Vite dev server (middleware), server/index.js (self-hosted) and api/sites.js (Vercel).
 * Storage is pluggable — see siteStores.js.
 */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { pickStore } from "./siteStores.js";

// Uploaded images / audio travel as data URLs. Vercel caps request bodies at 4.5 MB.
const DEFAULT_MAX_BODY = 25 * 1024 * 1024;
const mb = (n) => `${Math.round((n / 1024 / 1024) * 10) / 10} MB`;
const RESERVED = new Set(["api", "admin", "assets", "editor", "preview", "new", "s", "www", "app", "static", "synapse"]);
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,46}[a-z0-9])$/;

const sha = (s) => createHash("sha256").update(s).digest("hex");
const same = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export function createSitesApi({ dataDir = ".synapse-data", store = pickStore({ dataDir }), maxBody = DEFAULT_MAX_BODY } = {}) {
  const load = (slug) => store.get(slug);

  const send = (res, status, body) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(body));
  };
  const readBody = (req) => new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    // Past the limit, keep draining (don't buffer) so the 413 response can still reach the client.
    req.on("data", (c) => { size += c.length; if (size > maxBody) { chunks.length = 0; reject(Object.assign(new Error(`Site is too large to publish (${mb(maxBody)} max) — try smaller images or audio.`), { status: 413 })); } else chunks.push(c); });
    req.on("end", () => { if (size > maxBody) return; try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch { reject(Object.assign(new Error("Invalid JSON"), { status: 400 })); } });
    req.on("error", reject);
  });
  const check = (slug) => (!SLUG_RE.test(slug) ? "Use 3–48 lowercase letters, numbers or dashes." : RESERVED.has(slug) ? "That name is reserved." : null);

  // Returns true when the request was handled.
  return async function handle(req, res) {
    const url = new URL(req.url, "http://x");
    const m = url.pathname.match(/^\/api\/sites\/([^/]+)(\/available)?\/?$/);
    if (!m) return false;
    const slug = decodeURIComponent(m[1]).toLowerCase();
    try {
      const invalid = check(slug);
      if (m[2]) {
        if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" }), true;
        if (invalid) return send(res, 200, { available: false, reason: invalid }), true;
        const existing = await load(slug);
        const token = url.searchParams.get("token");
        const mine = !!(existing && token && same(sha(token), existing.tokenHash));
        return send(res, 200, { available: !existing || mine, mine, reason: existing && !mine ? "That name is already taken." : undefined }), true;
      }
      if (invalid) return send(res, 400, { error: invalid }), true;

      if (req.method === "GET") {
        const site = await load(slug);
        if (!site) return send(res, 404, { error: "Site not found" }), true;
        delete site.tokenHash;
        return send(res, 200, site), true;
      }

      if (req.method === "PUT") {
        const body = await readBody(req);
        if (!Array.isArray(body.pages) || !body.pages.length) return send(res, 400, { error: "Nothing to publish — add a page first." }), true;
        const existing = await load(slug);
        let token = body.token;
        if (existing) {
          if (!token || !same(sha(token), existing.tokenHash)) return send(res, 409, { error: "That name is already taken." }), true;
        } else token = randomBytes(24).toString("hex");
        const now = new Date().toISOString();
        const site = {
          slug, name: String(body.name || slug).slice(0, 80),
          pages: body.pages, linkSettings: body.linkSettings || null,
          version: (existing?.version || 0) + 1, createdAt: existing?.createdAt || now, publishedAt: now,
          tokenHash: existing?.tokenHash || sha(token),
        };
        await store.put(slug, site);
        return send(res, existing ? 200 : 201, { slug, name: site.name, version: site.version, publishedAt: now, token }), true;
      }
      return send(res, 405, { error: "Method not allowed" }), true;
    } catch (e) {
      if (!e.status) console.error("[sites api]", e);
      return send(res, e.status || 500, { error: e.status ? e.message : "Publishing failed on the server." }), true;
    }
  };
}
