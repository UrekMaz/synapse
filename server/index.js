/*
 * Production server: serves the built app (dist/) and the publishing API.
 *   npm run build && npm start      → http://localhost:3000 (PORT / SYNAPSE_DATA_DIR configurable)
 * Published sites live at /s/<site-name>.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSitesApi } from "./sitesApi.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT) || 3000;
const api = createSitesApi({ dataDir: process.env.SYNAPSE_DATA_DIR || path.join(root, ".synapse-data") });

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".json": "application/json", ".woff2": "font/woff2" };

async function serveFile(res, file, immutable) {
  const body = await readFile(file);
  res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
  res.setHeader("Cache-Control", immutable ? "public, max-age=31536000, immutable" : "no-cache");
  res.end(body);
}

createServer(async (req, res) => {
  try {
    if (await api(req, res)) return;
    const { pathname } = new URL(req.url, "http://x");
    const file = path.join(dist, path.normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, ""));
    if (file.startsWith(dist)) {
      const s = await stat(file).catch(() => null);
      if (s?.isFile()) return await serveFile(res, file, pathname.startsWith("/assets/"));
    }
    // Client-side routes (/editor, /s/my-site, …) all load the app shell.
    await serveFile(res, path.join(dist, "index.html"), false);
  } catch {
    res.statusCode = 500;
    res.end("Server error — did you run `npm run build`?");
  }
}).listen(port, () => console.log(`Synapse running at http://localhost:${port}`));
