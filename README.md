# eulcorp.com

One-page site for Eulcorp — a diversified holding company building across
markets, real estate, construction, and technology.

Single self-contained `index.html`: markup, styles, and scripts in one file,
no build step. The UI is built with React 18, transpiled in the browser by
Babel standalone (both loaded from a CDN).

## Files

- `index.html` — the entire site (styles + four inlined `text/babel` modules)
- `vercel.json` — Vercel config (security headers + clean URLs)
- `README.md` — this file

## What's on the page

The page is one continuous scroll with four snap sections and a fixed chrome
bar. Each section crossfades to its own animated black-and-white background.

- **Chrome bar** — EULCORP wordmark, `HOME / ABOUT / PORTFOLIO / CONTACT` nav
  that tracks the active section, live ET clock with Globex session status
  (`GLOBEX LIVE` / `MAINT` / `WEEKEND`).
- **EOD strip** — end-of-day closing prices for ES, NQ, YM, RTY, GC, MGC, CL,
  SI, VX. Looked up via `window.claude.complete` when available; falls back to
  seed values (and an `OFFLINE` status) outside that environment.
- **Home** — animated `EULCORP` wordmark (scramble-decode reveal + shimmer,
  hover/click to re-trigger) with corner annotations, over a looping SVG
  candlestick chart (chop → wick tap → demand zone → mid-tap → breakout).
- **About** — philosophy statement and a four-item principles list, over a
  drifting-words background.
- **Portfolio** — three verticals (Eulcorp Capital, Build, Estate), over an
  isometric blueprint background.
- **Contact** — social channels, over a radar-sweep background.
- **Footer** — social handles (X, Instagram, TikTok) and `NY · LDN · JPN`.
- **Tweaks panel** — toolbar-triggered controls for accent, background,
  glow, wordmark style, and ticker.

## Editing placeholders

Open `index.html` and look in the inlined `text/babel` modules:

1. **Social links** — the `SOCIALS` array (`app.jsx` module) and the
   `ContactSection` rows (`site.jsx` module).
2. **Section copy** — `AboutSection`, `VERTICALS`, and `ContactSection` in the
   `site.jsx` module.
3. **EOD / ticker symbols** — the `SEED` array in the `app.jsx` module.

## Deploy to Vercel

The site is fully static, so deployment is just uploading the file.

### Option A — Vercel dashboard (no CLI)

1. Push this folder to a GitHub/GitLab repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other**. Leave build command and output directory
   empty — there is no build step.
4. Click **Deploy**. Vercel serves `index.html` at the root automatically and
   picks up `vercel.json` for headers + clean URLs.

### Option B — Vercel CLI

```bash
npm i -g vercel      # one-time install
cd eulcorp
vercel               # preview deploy — follow the prompts
vercel --prod        # promote to production
```

### Custom domain

In the Vercel project: **Settings → Domains → Add** `eulcorp.com`, then
point your registrar's DNS at Vercel (an `A` record to `76.76.21.21`, or a
`CNAME` to `cname.vercel-dns.com` for `www`). Vercel issues HTTPS
automatically.

## Notes

- Black-and-white theme, mobile-responsive, no horizontal scroll.
- No analytics, tracking, or cookies.
- External CDNs used: React 18 + Babel standalone, and Google Fonts (Inter
  Tight, JetBrains Mono, Instrument Serif, Archivo).
- `prefers-reduced-motion` is honored by the animated layers.

## Deploy to Cloudflare Pages (alternative)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages →
   Create → Pages**.
2. Connect the repo (or use **Direct Upload** and drop the folder in).
3. Build command: *(empty)*. Output directory: `/` (root).
4. Deploy.
