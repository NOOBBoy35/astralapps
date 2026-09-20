# AstralApps — Setup & keys guide

Everything works out of the box in **demo mode** (the AI features return realistic mock
data, the form/booking show fallbacks). This guide walks you through getting each real
key so the site goes fully live. Do them in any order — each is independent.

---

## 0. Run it locally

```bash
npm install
npm run dev        # http://localhost:5175
```

Copy the env template once:

```bash
cp .env.example .env
```

Then fill in the keys below (each goes in `.env`). **Restart `npm run dev` after editing `.env`.**

---

## 1. Gemini API key — makes the AI features live ⭐ most important

Powers the **Live Automation Builder**, **Instant Business Audit**, and **Blueprint Wizard**.
Until set, those show a labeled "demo preview". Uses Google Gemini — it has a **free tier**.

1. Go to **https://aistudio.google.com/apikey** and sign in with a Google account.
2. **Create API key**, copy it.
3. Paste it into `.env`:
   ```
   GEMINI_API_KEY=your-key-here
   ```
4. (Optional) change the model (default is fast + free-tier friendly):
   ```
   GEMINI_MODEL=gemini-flash-latest
   ```

> The key lives **server-side only** — it's never sent to the browser, and `.env` is gitignored.

## 2. Formspree — makes the contact form actually send

1. Go to **https://formspree.io** and sign up (free tier is fine).
2. **+ New Form**, give it a name, choose the email to receive submissions.
3. Copy the form endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
4. Paste into `.env`:
   ```
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```

## 3. Booking calendar — the embedded "Pick a time" (#13)

Use **Cal.com** (free, recommended) or **Calendly**.

**Cal.com:** sign up at **https://cal.com** → create an event type (e.g. "30 Min Meeting") →
copy your link, e.g. `https://cal.com/your-handle/30min`.

**Calendly:** sign up at **https://calendly.com** → create an event → copy its link,
e.g. `https://calendly.com/your-handle/30min`.

Paste it into [`src/data/site.ts`](src/data/site.ts) → `calendarUrl`:
```ts
calendarUrl: 'https://cal.com/your-handle/30min',
```

## 4. Loom — the "watch a build" case-study videos (#18)

1. Go to **https://loom.com**, install the recorder, record a 2-minute walkthrough.
2. **Share → Copy link** — it looks like `https://www.loom.com/share/abc123...`.
3. Paste it into [`src/data/projects.ts`](src/data/projects.ts) on the relevant project as `loomUrl`. The card auto-embeds the video.

---

## 5. Swap in your real content

All editable content is in [`src/data/`](src/data/) (search for `TODO`):

| What | File |
| --- | --- |
| Name, tagline, **email**, **socials**, **calendar link**, live metrics | [`src/data/site.ts`](src/data/site.ts) |
| Industry verticals + case studies (hero, graveyard, timeline adapt to these) | [`src/data/industries.ts`](src/data/industries.ts) |
| Recent projects + Loom links (live feed + case studies) | [`src/data/projects.ts`](src/data/projects.ts) |
| Pricing tiers + deliverables | [`src/data/pricing.ts`](src/data/pricing.ts) |
| Services (with the mini-demos) | [`src/data/services.ts`](src/data/services.ts) |
| Live event ticker copy | [`src/data/liveEvents.ts`](src/data/liveEvents.ts) |
| Discovery FAQ | [`src/components/sections/FaqSection.tsx`](src/components/sections/FaqSection.tsx) |
| "Who we work with" fit list | [`src/components/sections/RefusalSection.tsx`](src/components/sections/RefusalSection.tsx) |

---

## 6. Deploy to Hostinger

The app is a static front-end + a small Node API. The production server
([`server/index.js`](server/index.js)) serves both.

```bash
npm run build      # builds the site into /dist
npm start          # serves /dist + /api on PORT (default 8080)
```

On Hostinger (VPS or Node.js hosting):
1. Upload the project (or `git clone`), run `npm ci` then `npm run build`.
2. Set environment variables (`GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`) in the Hostinger panel, or keep them in `.env`.
3. Start the app with `npm start` (point Hostinger's Node app entry at `server/index.js`).

That's it — the same server handles the website and the live AI endpoints.
