/*
 * Where published sites are kept. Each store is { get(slug) → site|null, put(slug, site) }.
 *
 *   fileStore  — JSON files on disk (local dev, `npm start` on a normal server)
 *   redisStore — Upstash Redis over its REST API (Vercel / any serverless host, whose disk is read-only + wiped)
 *
 * pickStore() uses Redis when its env vars are set, otherwise files.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export function fileStore(dataDir) {
  const dir = path.resolve(dataDir, "sites");
  const file = (slug) => path.join(dir, `${slug}.json`);
  return {
    kind: "file",
    async get(slug) { try { return JSON.parse(await readFile(file(slug), "utf8")); } catch { return null; } },
    async put(slug, site) {
      await mkdir(dir, { recursive: true });
      // Write-then-rename so a reader never sees a half-written file.
      const tmp = `${file(slug)}.${process.pid}.tmp`;
      await writeFile(tmp, JSON.stringify(site));
      await rename(tmp, file(slug));
    },
  };
}

export function redisStore(url, token) {
  const key = (slug) => `synapse:site:${slug}`;
  const call = async (...command) => {
    const res = await fetch(url.replace(/\/+$/, ""), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.error) throw new Error(`Redis ${command[0]} failed: ${body.error || res.status}`);
    return body.result;
  };
  return {
    kind: "redis",
    async get(slug) { const v = await call("GET", key(slug)); return v ? JSON.parse(v) : null; },
    async put(slug, site) { await call("SET", key(slug), JSON.stringify(site)); },
  };
}

export function pickStore({ dataDir, env = process.env }) {
  // Vercel's Upstash integration sets KV_REST_API_*; a direct Upstash database sets UPSTASH_REDIS_REST_*.
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return redisStore(url, token);
  return fileStore(dataDir);
}
