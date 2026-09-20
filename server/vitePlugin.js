import { loadEnv } from 'vite'
import { apiRouter } from './handlers.js'

/*
 * Serves the /api routes from inside the Vite dev server, so `npm run dev`
 * runs the app and the AI backend in one process — no second server, no proxy.
 * Loads server-only env (ANTHROPIC_*) from .env into process.env since Vite
 * only exposes VITE_-prefixed vars to the client.
 */
export function apiPlugin() {
  return {
    name: 'astralapps-api',
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), '')
      for (const key of ['GEMINI_API_KEY', 'GEMINI_MODEL']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }
    },
    configureServer(server) {
      server.middlewares.use('/api', (req, res) => {
        apiRouter(req, res)
      })
    },
  }
}
