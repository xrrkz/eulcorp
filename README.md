# eulcorp.com

Single-page personal landing site for an independent index futures trader.
Plain HTML + CSS + vanilla JS — no framework, no build step.

## Files

- `index.html` — the entire site (markup, styles, and script in one file)
- `api/eod.js` — Vercel serverless function that calls Claude with web search
  to look up real end-of-day futures prices for the EOD strip
- `vercel.json` — Vercel config (security headers + clean URLs)
- `README.md` — this file

## What's on the page

- **Chrome bar** — pulsing purple dot, EULCORP / PRIVATE wordmark, live ET clock
  with Globex session status (`GLOBEX LIVE` / `MAINT` / `WEEKEND`).
- **Ticker** — scrolling strip of ES, NQ, YM, RTY, GC, MGC, CL, SI, VX seeded at
  mid-May 2026 levels and drifting on a small random walk every 1.4s.
- **Hero** — italic `EULCORP` wordmark with a purple-shimmer gradient and a
  scramble-decode reveal on load (hover or click to re-trigger).
- **Backdrop** — animated TradingView-style chart that loops: chop → wick tap
  of a purple demand zone → mid-tap → breakout candles that march up and off
  the top of the frame, with right-edge price ladder, crosshair, live cursor
  pill, and `NQ1! | 5M` watermark. Re-seeds on every cycle. Separate desktop
  (landscape) and mobile (portrait) layouts.
- **EOD strip** — fixed strip above the footer with the previous session's
  closing prices, fetched at page load from `/api/eod` (Claude + web search).
  Falls back gracefully to seed prices if the API isn't configured.
- **Footer** — social handles (X, Instagram, TikTok) and `NY · LDN · JPN`.

## Editing placeholders

Open `index.html` and look for these spots:

1. **Social links** — the three `<a>` tags inside `<footer class="socials">`.
   Swap the `href` and `@handle` text for each.
2. **Ticker data** — edit the `SEED` array inside the `<script>` block.
   Each entry: `{ sym, px, tick, dec }`. The random walk takes over from there.
   To wire real prices, swap the `setInterval(tickPrices, 1400)` for a fetch
   to your data source (Polygon, Databento, TradingView widget, etc.).
3. **OG image** — add a 1200×630 image at `/og-image.png` (already referenced
   in the `<meta property="og:image">` tag).
4. **EOD API** — `api/eod.js` calls Claude with web search to fetch real EOD
   prices. Set `ANTHROPIC_API_KEY` in the Vercel project (Settings →
   Environment Variables). Without it, the endpoint returns 503 and the
   front-end shows seed prices with status `OFFLINE`. The model is
   `claude-opus-4-7` — swap to `claude-haiku-4-5` in `api/eod.js` if you
   prefer the cheaper / faster option. Responses are edge-cached for an hour.

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

- Dark theme only, mobile-responsive, no horizontal scroll.
- No analytics, tracking, or cookies.
- External CDNs used: Google Fonts (Inter Tight, JetBrains Mono,
  Instrument Serif, Archivo). The site degrades gracefully (system serif and
  sans fallbacks) if Google Fonts fails to load.
- `prefers-reduced-motion` disables the wordmark shimmer, ticker scroll,
  and pulse animations.

## Deploy to Cloudflare Pages (alternative)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages →
   Create → Pages**.
2. Connect the repo (or use **Direct Upload** and drop the folder in).
3. Build command: *(empty)*. Output directory: `/` (root).
4. Deploy.
