# eulcorp.com

Single-page personal landing site for an independent index futures trader.
Plain HTML + CSS + vanilla JS — no framework, no build step.

## Files

- `index.html` — the entire site (markup, styles, and script in one file)
- `README.md` — this file

## Editing placeholders

Open `index.html` and read the comment block at the top — it lists every
placeholder and where to change it:

1. **Social links** — search for `href="#"`; each button is labelled
   (`<!-- X -->`, `<!-- YouTube -->`, …). Swap `#` for your real URLs.
2. **Email** — replace `hello@eulcorp.com` (appears in the hero, contact
   section, and meta tags).
3. **Ticker data** — edit the `watchlist` array in the `<script>`. A `TODO`
   comment marks where to wire a live market-data API later.
4. **About text**, **stat cards**, and **OG image** — also noted in the
   top comment block. Add a 1200×630 image at `/og-image.png`.

## Deploy to Vercel

The site is fully static, so deployment is just uploading the file.

### Option A — Vercel dashboard (no CLI)

1. Push this folder to a GitHub/GitLab repo (or keep it local for option B).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other**. Leave build command and output directory
   empty — there is no build step.
4. Click **Deploy**. Vercel serves `index.html` at the root automatically.

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
- External CDNs used: Google Fonts (Inter) and Tabler icons webfont.
  Both are optional — the site degrades gracefully (system font, missing
  glyphs) if they fail to load.

## Deploy to Cloudflare Pages (alternative)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages →
   Create → Pages**.
2. Connect the repo (or use **Direct Upload** and drop the folder in).
3. Build command: *(empty)*. Output directory: `/` (root).
4. Deploy.
