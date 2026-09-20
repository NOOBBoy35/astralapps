# AstralApps

**The marketing site for AstralApps, an AI automation studio — where the site *is* the product demo.**

Most agency sites tell you what the agency can do. This one shows you, before you ever
talk to anyone: you type a task your team does by hand every week, and a real AI call
returns a concrete automation blueprint — the trigger, the steps, the tools, the hours
it would save, and what it would cost to build.

---

## Why this exists

Selling automation work is a trust problem. A prospect can't tell a studio that ships
real systems from one that will disappear after the deposit, because every site makes
the same claims with the same stock photography. The usual answer is a case-study page
and a "book a call" button — which asks the visitor to spend social capital on a sales
call *before* getting anything of value.

This site inverts that. The argument it makes is:

> If we can design a credible automation for *your* business, in seconds, for free,
> while you're still anonymous — you can reasonably believe we can build it.

Everything on the page serves that one move:

- **Proof before the pitch.** The hero isn't a headline over a stock image, it's a working
  tool. The visitor gets real output on their real problem before being asked for anything —
  no signup, no email gate.
- **Specific beats generic.** A visitor picks their vertical ("I run a…") and the hero copy,
  the examples of manual work, the before/after timeline, and the featured case study all
  swap to that industry. Generic automation pitches are easy to ignore; a list of the exact
  tasks *your* kind of business does by hand is not.
- **Name the pain in hours, not adjectives.** The "graveyard" section lists the repetitive
  tasks the visitor's team still does manually, each with a weekly hour cost that adds up
  to a visible total. The point is to make an invisible, tolerated expense legible.
- **Transparency as a filter.** Pricing is published openly, and an honest-fit section says
  plainly who the studio *won't* take on. Turning work away is a costly signal — it reads
  as confidence, and it screens out bad-fit leads before they consume a call.
- **Earn the meeting last.** Pricing and contact are their own pages at the end of the
  journey, not a popup on arrival. By the time someone reaches them they've already seen
  the studio do the work.

The code carries `#N` comments (`#1`, `#6`, `#14`, `#20`…) that tag each section back to
the numbered conversion tactic it implements.

---

## The three live AI features

All three run server-side against the Google Gemini API using **structured output**
(`responseMimeType: application/json` plus a response schema), so the model always returns
parseable JSON rather than prose the UI has to guess at.

| Feature | Where | What it does |
| --- | --- | --- |
| **Live Automation Builder** (`#1`) | Hero | Describe a manual task → a full blueprint: trigger, steps, real tools, hours saved/week, complexity, and a rough one-time build cost. |
| **Instant Business Audit** (`#2`) | Mid-page | Enter a company URL → the server fetches and strips the page, then returns 3–5 workflows that business is probably doing by hand, each with an hours/week estimate. |
| **Blueprint Wizard** (`#4`) | Conversion section | A short intake (industry, team size, biggest time-drain, urgency) → a realistic scope: deliverables, timeline in weeks, price range, and a concrete first step. |

### Demo mode

**The site runs fully without any API key.** When `GEMINI_API_KEY` is unset, each feature
returns a hand-written, believable mock and flags it with `demo: true`, which the UI
surfaces as a labelled demo preview. This keeps local development, CI, and pre-launch
deploys working with zero credentials — and means a contributor can clone and run the
whole thing with no accounts to create.

### Safety on the public endpoints

Because these endpoints are unauthenticated and cost money per call:

- **Rate limiting** — a sliding window of 10 requests per IP per 10 minutes, shared across
  all three endpoints ([`server/lib/rateLimit.js`](server/lib/rateLimit.js)).
- **Body size cap** — request bodies over 16 KB are rejected with a 413.
- **Input clamping** — every free-text field is trimmed and truncated before it reaches the model.
- **SSRF guard** — the audit's URL fetcher rejects non-HTTP(S) schemes and blocks `localhost`,
  `.local`, and private/link-local IP ranges, with an 8-second timeout.
- **Key isolation** — `GEMINI_API_KEY` is read server-side only and never reaches the browser.
  Vite only exposes `VITE_`-prefixed vars to the client, and the API key deliberately isn't one.

---

## Architecture

One codebase, one process, in both development and production:

```
Browser
  │
  ├─ React SPA (Vite build → /dist)
  │
  └─ POST /api/automation-builder
     POST /api/business-audit          ─┐
     POST /api/blueprint-wizard         │
                                        ▼
                    server/handlers.js  (one router, shared rate limit)
                                        │
                                        ▼
                    server/lib/ai.js    (Gemini structured output, or mock)
```

The same `apiRouter` is mounted two ways, so dev and prod run identical server code:

- **Development** — [`server/vitePlugin.js`](server/vitePlugin.js) mounts it as Vite dev-server
  middleware. `npm run dev` gives you the site *and* the AI backend in one process: no second
  terminal, no proxy config.
- **Production** — [`server/index.js`](server/index.js) mounts it in Express alongside the
  static `/dist` build, with an SPA fallback so deep links and refreshes work.

The HTTP helpers in [`server/lib/http.js`](server/lib/http.js) are deliberately
framework-agnostic (raw Node `req`/`res`), which is what lets the same handler satisfy both
Connect-style Vite middleware and Express.

### Front end

- **Routing** — a ~140-line dependency-free history router ([`src/lib/router.ts`](src/lib/router.ts)).
  A single delegated click listener upgrades internal `<a>` clicks to client-side navigation,
  so section CTAs pointing at `#pricing`/`#contact` route correctly without per-link wiring,
  while modified clicks, downloads, and external links fall through to the browser.
- **Industry personalization** — [`IndustryContext`](src/context/IndustryContext.tsx) holds the
  selected vertical, persists it to `localStorage`, and feeds content to every section that adapts.
- **Theming** — light "editorial" cream-and-ink by default with a dark variant, as CSS custom
  properties in [`src/index.css`](src/index.css). An inline script in [`index.html`](index.html)
  resolves the stored theme *before first paint* to avoid a flash of the wrong theme.
- **Motion** — GSAP with `useGSAP`, scoped to component refs and reverted on unmount. Every
  animation path checks `prefers-reduced-motion` and degrades to a static end state.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no config file) |
| Animation | GSAP 3 + `@gsap/react` |
| Server | Express 5 (Node 20.12+ — `npm start` uses `--env-file-if-exists`) |
| AI | Google Gemini via REST (`gemini-flash-latest` by default) |
| Routing | Custom — no router dependency |

No state-management library, no UI kit, no 3D runtime. Fonts (Inter, Instrument Serif,
JetBrains Mono) load from Google Fonts; icons are an inline SVG sprite in `public/`.

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (default <http://localhost:5173>). That's it — the AI features work
immediately in demo mode, no key required.

To run the real models, add a key:

```bash
cp .env.example .env
# put a Gemini key in .env, then restart the dev server
```

A free key comes from <https://aistudio.google.com/apikey>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server **+ the AI API** in one process |
| `npm run build` | `tsc -b` type-check, then production build to `/dist` |
| `npm run preview` | Serve the built `/dist` (static only — no API) |
| `npm start` | Production Express server: serves `/dist` **and** `/api` |
| `npm run lint` | ESLint |

---

## Configuration

Everything is optional. Each unset variable degrades to a labelled fallback rather than
an error.

| Variable | Where | Effect if unset |
| --- | --- | --- |
| `GEMINI_API_KEY` | `.env` (server-side) | All three AI features return mock data flagged `demo: true` |
| `GEMINI_MODEL` | `.env` (server-side) | Defaults to `gemini-flash-latest` |
| `PORT` | `.env` / host panel | Production server defaults to `8080` |
| `VITE_FORMSPREE_ENDPOINT` | `.env` (client-side) | Contact form validates and shows success without sending |

Two more live in code rather than env, because they're public URLs, not secrets:

- `calendarUrl` in [`src/data/site.ts`](src/data/site.ts) — a Cal.com or Calendly link for the
  embedded booking widget. Empty shows a book-by-email fallback.
- `loomUrl` per project in [`src/data/projects.ts`](src/data/projects.ts) — a Loom share URL for a
  case-study walkthrough. Without one, the card plays a synthetic **build replay**: a self-playing,
  theme-aware animation standing in for a screen recording ([`BuildReplay.tsx`](src/components/ui/BuildReplay.tsx)).

`.env` is gitignored. `.env.example` is committed with empty values as the template.

---

## Project structure

```
server/
  index.js          Express production server (static /dist + /api)
  handlers.js       The one API router — mounted by BOTH dev and prod
  vitePlugin.js     Mounts that router inside the Vite dev server
  lib/
    ai.js           Gemini structured-output calls + the demo-mode mocks
    http.js         Framework-agnostic body reader / JSON sender / IP extraction
    rateLimit.js    In-memory sliding-window limiter

src/
  components/
    pages/          HomePage · PricingPage · ContactPage
    sections/       The ~17 page sections (hero, graveyard, timeline, ROI, FAQ, fit…)
    builder/        The Live Automation Builder and its result card
    layout/         Header, mobile menu, footer
    ui/             Button, Logo, Icon, ThemeToggle, IndustrySelector, BuildReplay…
  context/          IndustryContext — the selected vertical, persisted
  data/             ← all editable copy lives here
  hooks/            useReveal, useScrollSpy, useMediaQuery, usePrefersReducedMotion
  lib/              router.ts · api.ts (typed fetch wrappers) · gsap.ts
  index.css         Design tokens + the editorial design system
```

### Page flow

The home page is a deliberate sequence, not a pile of sections:

**Hook** (hero with the live builder → live metrics) → **Story** (before/after → the graveyard
of manual work → side-by-side timeline) → **Capability & proof** (services → live business audit
→ shipped work → stack → process) → **Conversion** (ROI calculator → blueprint wizard) →
**Trust & close** (FAQ → honest fit → hand-off to pricing/contact).

---

## Editing content

Copy is data, not markup. You can change almost everything without touching a component —
search for `TODO` to find every placeholder.

| What | File |
| --- | --- |
| Name, tagline, email, nav, socials, calendar link, live metrics | [`src/data/site.ts`](src/data/site.ts) |
| Industry verticals + their manual-work examples and case studies | [`src/data/industries.ts`](src/data/industries.ts) |
| Shipped projects, Loom links, replay scenes | [`src/data/projects.ts`](src/data/projects.ts) |
| Pricing tiers and deliverables | [`src/data/pricing.ts`](src/data/pricing.ts) |
| Services | [`src/data/services.ts`](src/data/services.ts) |
| Live event ticker copy | [`src/data/liveEvents.ts`](src/data/liveEvents.ts) |

---

## Deployment

The build is a static front end plus a small Node API, and `server/index.js` serves both —
so it deploys anywhere Node runs (a VPS, Hostinger's Node hosting, Railway, Fly, a container).

```bash
npm ci
npm run build     # → /dist
npm start         # serves /dist + /api on $PORT (default 8080)
```

Set `GEMINI_API_KEY`, `GEMINI_MODEL`, and `PORT` as real environment variables in your host's
panel rather than shipping a `.env`. Point the host's Node entry point at `server/index.js`.

> A static-only host (Netlify, GitHub Pages, plain Vercel static) will serve the site fine,
> but the three AI features will 404 — they need the Node process. Put the API behind a
> serverless function or use a Node host if you deploy statically.

---

## Status

This is a live, working site, but the **business content is still placeholder**. Before
launching it for real, replace:

- Contact email and social URLs in `site.ts` (socials currently point at `#`)
- The live metrics strip and the "shipped this week" project feed — these are written to read
  as a busy operation and should be kept honest and current
- Pricing figures in `pricing.ts`
- Case-study numbers in `industries.ts` and `projects.ts`
- The booking `calendarUrl`

The live event ticker (`liveEvents.ts`) is illustrative, not a real feed.

See [`SETUP.md`](SETUP.md) for step-by-step instructions on obtaining each key.
