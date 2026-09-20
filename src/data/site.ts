/*
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — edit this file to make the site "real".
 *  Everything marked TODO is placeholder content meant to be
 *  replaced with AstralApps' real details.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'AstralApps',
  // TODO: replace with your real tagline if you want a different one
  tagline: 'Intelligent software, automations & AI products.',
  description:
    'A software studio building AI products, web platforms, SaaS dashboards, and automation systems for teams that want to move faster.',

  // TODO: replace with your real contact email
  email: 'hello@astralapps.com',

  /*
   * Embedded booking calendar (#13). Paste your Cal.com or Calendly link, e.g.
   *   'https://cal.com/your-handle/30min'  or  'https://calendly.com/you/30min'
   * Leave empty to show a "book via email" fallback instead of the embed.
   */
  calendarUrl: '',

  /*
   * Contact form delivery.
   * The form POSTs here. Easiest option is Formspree (https://formspree.io):
   *   1. Create a form, copy its endpoint (https://formspree.io/f/xxxxxxx)
   *   2. Put it in a `.env` file as  VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxx
   *      (or paste it directly below).
   * Until configured, the form runs in "demo" mode and shows a success state
   * without actually sending.
   */
  formEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT ?? '',
} as const

export type NavItem = {
  label: string
  href: string
  /** 'anchor' scrolls within the home page; 'route' navigates to its own page. */
  kind: 'anchor' | 'route'
  /** Give the link a standout brand color in the nav (used for the dedicated pages). */
  accent?: boolean
}

export const navItems: NavItem[] = [
  { label: 'Services', href: '#services', kind: 'anchor' },
  { label: 'Work', href: '#work', kind: 'anchor' },
  { label: 'FAQ', href: '#faq', kind: 'anchor' },
  { label: 'Pricing', href: '/pricing', kind: 'route', accent: true },
  { label: 'Contact', href: '/contact', kind: 'route', accent: true },
]

export type SocialLink = {
  label: string
  href: string
  /** matches a symbol id in /public/icons.svg, e.g. "github-icon" */
  icon: string
}

// TODO: replace the "#" hrefs with your real social profile URLs.
export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: '#', icon: 'github-icon' },
  { label: 'X', href: '#', icon: 'x-icon' },
  { label: 'Bluesky', href: '#', icon: 'bluesky-icon' },
  { label: 'Discord', href: '#', icon: 'discord-icon' },
]

// "In production right now" strip (#17). Update weekly so it reads as a live,
// busy operation. TODO: keep these numbers real and current.
export const liveMetrics: { value: string; label: string }[] = [
  { value: '312', label: 'hours saved this month' },
  { value: '7', label: 'automations running live' },
  { value: '4', label: 'active clients' },
  { value: '99.9%', label: 'uptime delivered' },
]

// Tech logos for the credibility marquee (text-based, no asset dependency).
export const techMarquee: string[] = [
  'React',
  'TypeScript',
  'Next.js',
  'Three.js',
  'Node.js',
  'Python',
  'PostgreSQL',
  'OpenAI',
  'LangChain',
  'AWS',
  'Vercel',
  'Tailwind CSS',
]
