# Social share (OG/Twitter) images

## The bug this doc explains

Sharing almost any page on the site (homepage, `/crypto`, `/compare`,
`/methodology`, `/news`, `/guides`, the legal pages, and 3 of the
hand-written guide pages) produced a link preview with a title and
description but **no image** — e.g. pasting the URL into a Facebook post
composer.

Two separate causes, both now fixed:

1. **The sitewide fallback file didn't exist.** `buildMetadata()` (in
   `src/lib/seo/metadata.ts`) points every page that doesn't pass its own
   `image` at `/og-default.png`. That file was never actually created, so
   the `og:image`/`twitter:image` meta tags pointed at a 404. Facebook's
   scraper fetches the page fine (hence the title/description showing up)
   but drops the image entirely when it can't fetch the declared URL.
2. **Three static guide pages pointed at `.svg` files.** Even though those
   files existed and loaded fine in a browser, most social crawlers
   (Facebook, X/Twitter, LinkedIn) don't render SVG as a link-preview
   image — it needs to be raster (PNG/JPG/WEBP).

## How it's fixed

- `public/og-default.png` now exists — a generic branded fallback (logo
  mark + wordmark, centered, no topic-specific motif) for the one or two
  pages (currently `/terms`, `/privacy`) that genuinely don't have a topic.
- Every hub/legal page that previously set no `image` now passes one
  explicitly, pointing at a pre-generated PNG under `public/images/og/`.
- The 3 static guide pages that pointed at `.svg` files now point at `.png`
  equivalents instead (same visual, raster export).

## How the images are generated

`scripts/generate-page-og-images.ts` builds every static (non-CMS)
page-level image in one run, using the same topic-concept SVG templates
and sharp-based rasterizer already built for per-article featured images
(`src/lib/articles/import/featured-image-svg.ts` — see that file's own
doc comments, and the article-import format docs, for the concept system
itself: `steps`, `compare`, `fees`, `security`, `verify`, `learn`, `news`).

```bash
npm run generate:og-images
```

Safe to re-run any time — it always regenerates and overwrites every file
in its list, there's no "skip if it exists" check like there is for
per-article images. Run it whenever you:

- Add a new hub/legal page and want a topic-specific share image for it —
  add an entry to the `PAGE_IMAGES` array in the script, pick the closest
  matching concept, then set `image: "/images/og/<your-file>.png"` in that
  page's `buildMetadata()` call.
- Tweak one of the concept templates in `featured-image-svg.ts` and want
  every page using it to pick up the change.

**What this script does _not_ cover:** CMS articles (`guides/[slug]`,
`news/[slug]`) already get a real, article-specific image at import time
(see `src/lib/articles/import/featured-image.ts`) or a genuinely custom
one a human supplied — this script never touches those. Per-instance
dynamic pages (a specific crypto asset page, a specific exchange profile)
intentionally share one image per _route type_ here (e.g. every
`/crypto/[slug]` page uses the same `images/og/crypto-asset.png`) rather
than a unique image per slug — doing that properly would mean generating
from the database per-slug, which is a bigger feature than this fix called
for.

## Verifying a fix actually shows up

Facebook (and most other platforms) cache a URL's link-preview data
per-URL, so a code fix alone won't change what's already been shared.
After deploying:

1. Run the URL through [Facebook's Sharing
   Debugger](https://developers.facebook.com/tools/debug/) and click
   "Scrape Again" to force a re-fetch.
2. For Twitter/X, use their [Card
   Validator](https://cards-dev.twitter.com/validator) (may require login).
3. LinkedIn has a similar [Post
   Inspector](https://www.linkedin.com/post-inspector/).

A quick sanity check that doesn't depend on any platform's cache: view the
page source and confirm `<meta property="og:image" ...>` points at a URL
that actually loads (not a 404) and is a raster format.
