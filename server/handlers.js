import { generateAudit, generateBlueprint, generateScope } from './lib/ai.js'
import { getClientIp, readJsonBody, sendJson } from './lib/http.js'
import { checkRateLimit } from './lib/rateLimit.js'

/*
 * Single API router, mounted at /api in both dev (Vite plugin) and prod (Express).
 * `req.url` here is already stripped of the /api prefix by the mount.
 */
export async function apiRouter(req, res, next) {
  const url = (req.url || '').split('?')[0]

  try {
    if (req.method === 'POST') {
      // shared rate limit across all AI endpoints
      const rate = checkRateLimit(getClientIp(req))
      if (!rate.ok) {
        res.setHeader('Retry-After', String(rate.retryAfter))
        return sendJson(res, 429, { error: 'Too many requests — give it a minute and try again.' })
      }

      if (url === '/automation-builder') {
        const body = await readJsonBody(req)
        return sendJson(res, 200, await generateBlueprint({ task: body.task, industry: body.industry }))
      }
      if (url === '/business-audit') {
        const body = await readJsonBody(req)
        return sendJson(res, 200, await generateAudit({ url: body.url }))
      }
      if (url === '/blueprint-wizard') {
        const body = await readJsonBody(req)
        return sendJson(res, 200, await generateScope(body))
      }
    }

    // unknown route
    if (typeof next === 'function') return next()
    return sendJson(res, 404, { error: 'Not found' })
  } catch (err) {
    const status = err?.statusCode || 500
    if (status >= 500) console.error('[api] error:', err)
    return sendJson(res, status, { error: err?.message || 'Something went wrong.' })
  }
}
