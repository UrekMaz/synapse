# Synapse

Portfolio / website builder. Build pages in the editor, then publish them to a public link at `/s/<your-site>`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 — sites are saved to .synapse-data/
```

## Deploy to Vercel (live link)

The app is a static Vite build plus one serverless function (`api/sites.js`) for publishing.
Vercel's disk is read-only, so published sites are stored in **Upstash Redis**.

1. **Deploy the app**
   ```bash
   npx vercel login
   npx vercel --prod
   ```
   (Or push this folder to GitHub and import it at vercel.com/new. If the repo has other folders, set **Root Directory** to this folder.)
2. **Add the database:** in the Vercel dashboard open the project → **Storage** → **Create Database** → **Upstash for Redis** (free tier) → connect it to the project. This sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. **Redeploy** (`npx vercel --prod`) so the function picks up the new env vars.

Your app is then live at `https://<project>.vercel.app`, and published sites at `https://<project>.vercel.app/s/<site>`.

Notes:
- Without the database, the app still loads but Publish shows "Publishing isn't set up on this deployment yet".
- Vercel caps uploads at 4.5 MB, so a published site (including uploaded images/audio) can be up to 4 MB there.
- A standalone Upstash database works too: set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` instead.

## Self-host on any Node server

```bash
npm run build && npm start   # PORT (default 3000), SYNAPSE_DATA_DIR (default .synapse-data)
```

Uses files on disk, or Redis if the env vars above are set.

## Structure

- `/` landing page (stitched wordmark), `/dashboard` projects, `/editor` the builder, `/s/:site` published sites
- `server/sitesApi.js` publishing API · `server/siteStores.js` file / Redis storage · `api/sites.js` Vercel entry · `server/index.js` self-hosted server
