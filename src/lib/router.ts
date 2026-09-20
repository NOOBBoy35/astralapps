import { useEffect, useSyncExternalStore } from 'react'

/*
 * ─────────────────────────────────────────────────────────────
 *  Tiny history-based router — no dependency.
 *  The home page ('/') holds the full story; pricing and contact
 *  live on their own pages so the landing scroll stays short.
 *
 *  A single delegated click listener (useLinkInterceptor) turns
 *  every internal <a>/Button into a client-side navigation, so the
 *  section CTAs that point at "#contact"/"#pricing" route to the
 *  right page without wiring each one by hand.
 *
 *  Deep links + refresh work because both the dev server (Vite) and
 *  prod server (server/index.js) fall back to index.html.
 * ─────────────────────────────────────────────────────────────
 */

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  contact: '/contact',
} as const

// px — matches `scroll-padding-top: 5.5rem` so anchored sections clear the fixed header.
const HEADER_OFFSET = 88

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('popstate', onChange)
  }
}

function getPath() {
  return window.location.pathname
}

/** Current route path; re-renders the component on navigation (back/forward included). */
export function useRoute() {
  return useSyncExternalStore(subscribe, getPath)
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/** Smooth-scroll a section into view, offset for the fixed header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

// Wait two frames so the destination page has mounted before we scroll.
function afterRender(fn: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(fn))
}

type NavigateOptions = { scrollToId?: string }

/** Push a route, notify subscribers, then scroll (to an anchor, or to the top). */
export function navigate(path: string, options: NavigateOptions = {}) {
  if (getPath() !== path) {
    window.history.pushState(null, '', path)
    emit()
  }
  const targetId = options.scrollToId
  afterRender(() => (targetId ? scrollToId(targetId) : window.scrollTo({ top: 0, left: 0 })))
}

type Intent = { type: 'route'; path: string } | { type: 'anchor'; id: string }

/*
 * Resolve a raw href into a navigation intent, or null to let the browser
 * handle it natively (external links, mailto:, tel:, unknown paths).
 *   '#pricing' | '/pricing'    → pricing page
 *   '#contact' | '/contact'    → contact page
 *   '/'                        → home (top)
 *   '#services' | '/#services' → in-page anchor (on the home page)
 */
function resolveHref(raw: string | null): Intent | null {
  if (!raw) return null
  if (raw === ROUTES.pricing || raw === '#pricing') return { type: 'route', path: ROUTES.pricing }
  if (raw === ROUTES.contact || raw === '#contact') return { type: 'route', path: ROUTES.contact }
  if (raw === ROUTES.home) return { type: 'route', path: ROUTES.home }
  if (raw.startsWith('/#')) return { type: 'anchor', id: raw.slice(2) }
  if (raw.startsWith('#')) return { type: 'anchor', id: raw.slice(1) }
  return null
}

function go(intent: Intent) {
  if (intent.type === 'route') {
    navigate(intent.path)
  } else if (getPath() !== ROUTES.home) {
    // An in-page anchor clicked from a sub-page: go home first, then scroll to it.
    navigate(ROUTES.home, { scrollToId: intent.id })
  } else {
    scrollToId(intent.id)
  }
}

/*
 * Install one document-level click listener that upgrades internal-link clicks
 * to client-side navigation. Leaves modified clicks, new-tab clicks, downloads,
 * and external/mailto links to the browser.
 */
export function useLinkInterceptor() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest('a')
      if (!anchor) return

      const target = anchor.getAttribute('target')
      if (target && target !== '_self') return
      if (anchor.hasAttribute('download')) return
      if ((anchor.getAttribute('rel') || '').includes('external')) return

      const intent = resolveHref(anchor.getAttribute('href'))
      if (!intent) return

      event.preventDefault()
      go(intent)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
