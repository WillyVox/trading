# Automatic fallback featured images (article import)

When an imported article's frontmatter doesn't set `featuredImage`, the
importer can generate one automatically instead of leaving the article
with no image at all. This covers `featuredImage`/`featuredImageAlt` on
**CMS articles** specifically (`guides/[slug]`, `news/[slug]`) — for the
separate system that covers static hub/legal pages, see
`docs/og-images.md`. Both share the same underlying template code
(`src/lib/articles/import/featured-image-svg.ts`).

## How it decides whether to generate one

`src/lib/articles/import/featured-image.ts` — `resolveFallbackFeaturedImage()`
runs for every file during `npm run import:article`, and only ever _adds_
a value the file didn't specify:

- If the file's frontmatter sets `featuredImage`, that value always wins —
  never overridden.
- If it doesn't, and the article already exists with a real image on
  record, that's left alone (same safe-merge rule as every other omitted
  field — see `docs/article-import-format.md`).
- Otherwise, a fallback image is generated, written to
  `public/images/articles/<slug>.png`, and `featuredImage` (plus
  `featuredImageAlt`, if that's also missing) is set on the payload before
  it's saved.

Dry runs (`--dry-run`) never write a file — they only report what _would_
happen, in the warnings list.

## Why PNG, not SVG

The generated image doubles as both the in-page card thumbnail
(`ArticleCard`, a plain `<img>` — any format works) and the
`og:image`/`twitter:image` for social sharing. Most social crawlers
(Facebook, X/Twitter, LinkedIn) don't reliably render SVG for link-preview
images, so the output is always rasterized to PNG via `sharp`, even though
the templates themselves are built as SVG strings first.

## Picking a visual concept

`pickConcept()` in `featured-image-svg.ts` maps the article's
`searchIntent` (the most content-meaningful field available without
reading the body) to one of 7 templates:

| searchIntent                   | concept                                     |
| ------------------------------ | ------------------------------------------- |
| `HOW_TO`, `BEGINNER`           | `steps`                                     |
| `COMPARISON`, `PROVIDER_GUIDE` | `compare`                                   |
| `FEES`                         | `fees`                                      |
| `SECURITY`, `WALLET`           | `security`                                  |
| `REGULATION`                   | `verify`                                    |
| `LEARN`, `MARKET_EDUCATION`    | `learn`                                     |
| _(not set)_                    | `news` if `articleType: NEWS`, else `steps` |

If the article's `cryptoAssetSlugs` includes a recognized asset (bitcoin,
ethereum, litecoin, dogecoin, cardano, solana, ripple/xrp), a small coin
badge with a plain A-Z monogram is added — deliberately never a currency
glyph like ₿ or Ξ, since sharp's SVG rasterizer depends on whatever fonts
the _server_ has installed, which is a much smaller, less predictable set
than a workstation (especially in minimal Docker/serverless images). A-Z
always renders on any fallback font.

## Running it

There's no separate command — it's built into the normal import:

```bash
npm run import:article -- --dry-run   # see what would be generated, nothing written
npm run import:article                # actually import + generate images
npm run import:article -- --no-auto-image   # opt out entirely for this run
```

To regenerate an existing article's fallback image (e.g. after tweaking a
concept template), delete its `featuredImage` line from the frontmatter,
delete the existing `public/images/articles/<slug>.png`, and re-run the
import — a real `featuredImage` in the file always wins, and an existing
file on disk isn't checked, only the DB column and the frontmatter are.

## Testing

`src/lib/articles/import/__test__/featured-image-svg.test.ts` covers the
pure logic (concept selection, SVG shape, asset-badge behavior) with no
filesystem/sharp/Prisma involved:

```bash
npm test
```

`resolveFallbackFeaturedImage()` itself (the I/O half — DB lookup, sharp
rasterization, file write) isn't unit tested, since that would mean
mocking Prisma and the filesystem for limited value; it's exercised
in practice via `--dry-run` against real data before any real import.
