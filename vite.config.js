import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createSitesApi } from './server/sitesApi.js'

// Serves the publishing API during `npm run dev` / `npm run preview` (production uses server/index.js).
function sitesApi() {
  const mount = (server) => {
    const api = createSitesApi({ dataDir: process.env.SYNAPSE_DATA_DIR || '.synapse-data' })
    server.middlewares.use((req, res, next) => { api(req, res).then((handled) => { if (!handled) next() }, next) })
  }
  return { name: 'synapse-sites-api', configureServer: mount, configurePreviewServer: mount }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitesApi()],
  server: { watch: { ignored: ['**/.synapse-data/**'] } },
})
