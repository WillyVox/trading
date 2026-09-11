# Article Publishing Format

This is the exact contract for files dropped into `/publish_article` and picked up by
`npm run import:article`. If you're asking an AI tool to generate an article, tell it:

> Generate this article using our publishing format in docs/article-import-format.md,
> and save it as `publish_article/<slug>.md`.

## File format

- Extensions: `.md` or `.txt` — both are parsed identically (YAML frontmatter + Markdown body).
- One article per file.
- The body (everything after the closing `---`) is Markdown. It is converted to sanitized HTML
  on import — `<script>`, `<iframe>`, inline event handlers, and `style` attributes are stripped
  regardless of what the AI produced. Do not rely on raw HTML in the body; write Markdown. Raw
  HTML that only uses tags already on the sanitizer's allowlist (see
  `src/lib/articles/sanitize.ts` — `h2`-`h4`, `p`, `strong`, `em`, `ul`, `ol`, `li`, `a`,
  `blockquote`, `table`/`thead`/`tbody`/`tr`/`th`/`td`, `figure`/`figcaption`, `img`, `code`,
  `pre`, `hr`, `br`) also passes through unchanged, since the Markdown parser leaves already-valid
  HTML alone — useful if you're converting content that was authored as HTML elsewhere.

## Required fields

| Field     | Type   | Rules |
|-----------|--------|-------|
| `title`   | string | 1–200 characters |
| `slug`    | string | lowercase, hyphen-separated, URL-safe (e.g. `how-to-trade-crypto`). No spaces, punctuation, or slashes. |
| *(body)*  | Markdown | must render to non-empty content |

## Optional fields

These field names match the current `Article` Prisma model (`prisma/schema.prisma`) and the admin
editor's form schema (`src/lib/articles/validation.ts`) — the importer and the admin CRUD paths
share one data model, so a value set here maps 1:1 onto the same column/relation an editor would
set by hand in `/admin/articles`.

| Field | Type | Notes |
|---|---|---|
| `articleType` | `NEWS` \| `GUIDE` | **Recommended, not required.** Determines whether the article can ever resolve under `/news/[slug]` (NEWS) or `/crypto/guides/[slug]` (GUIDE) — the two routes strictly enforce this and will 404 on a mismatch. Omitting it produces a warning and defaults to `GUIDE` **on create only**; re-importing an existing article without this field never changes its stored type (same safe-merge rule as every other optional field below). |
| `excerpt` | string | Used as the fallback SEO description and card summary. |
| `category` | string | Free text, matched against existing categories used elsewhere on the site. |
| `tags` | string[] | Lowercased and de-duplicated on import. |
| `region` | `GLOBAL` \| `AU` \| `US` \| `UK` \| `NZ` \| `SG` | Defaults to `GLOBAL`. See "Regional variants" below. |
| `canonicalArticleSlug` | string | Only meaningful when `region` is not `GLOBAL` — see below. |
| `seoTitle` | string | Recommended ≤ 60 chars (warning only, not enforced). |
| `seoDescription` | string | Recommended ≤ 160 chars (warning only, not enforced). |
| `canonicalUrl` | URL | Only set this if the canonical page genuinely lives at a different URL. |
| `featuredImage` | string | Path or absolute URL. |
| `featuredImageAlt` | string | Alt text for `featuredImage`. Nullable/additive — missing alt text is surfaced as a warning on the admin SEO checklist, not a hard import error, but should be filled in for accessibility and image SEO. |
| `author` | string | |
| `reviewer` | string | |
| `noIndex` | boolean | |
| `affiliateDisclosureRequired` | boolean | Whether the affiliate disclosure banner should show on this article. Independent of `affiliateProviders` below — set this explicitly rather than relying on it being inferred from having affiliate placements. |
| `scheduledAt` | date/datetime string | Advisory only — nothing reads this to auto-publish. Purely an editor reminder (see docs/ROADMAP.md "Scheduling"). Invalid/unparseable dates are ignored rather than failing the import. |
| `lastReviewedAt` | date/datetime string | Editorial "meaningfully reviewed" timestamp, shown on Guide pages as "Last updated" instead of the row's technical `updatedAt`. Invalid/unparseable dates are ignored rather than failing the import. |
| `keyTakeaways` | string[] | Short bullet points shown near the top of the guide. |
| `searchIntent` | one of: `LEARN`, `HOW_TO`, `BEGINNER`, `COMPARISON`, `PROVIDER_GUIDE`, `FEES`, `SECURITY`, `WALLET`, `REGULATION`, `MARKET_EDUCATION` | Drives related-content and CTA behavior on the guide template. |
| `providerRelationships` | string[] or `{providerSlug, relationship}`[] | `relationship` is one of `MENTIONED` (default), `COMPARED`, `FEATURED`. Slugs are matched against existing `Provider.slug` — providers are never auto-created. |
| `cryptoAssetSlugs` | string[] | Slugs of `CryptoAsset` rows this article is about (e.g. `bitcoin`), matched against existing `CryptoAsset.slug` — assets are never auto-created, same rule as `providerRelationships`. |
| `relatedGuides` | string[] (article slugs) | Slugs of other articles. A missing slug produces a warning, not a failure — useful for batches where articles reference each other. |
| `sources` | `{label, url, sourceType?}`[] | `sourceType` is one of `OFFICIAL_PROVIDER`, `REGULATOR`, `GOVERNMENT`, `OFFICIAL_DOCUMENTATION`, `NEWS`, `RESEARCH`, `OTHER` and is stored on `ArticleSource.sourceType`. |
| `affiliateProviders` | string[] (provider slugs) | Declares that this article *may* show a contextual affiliate CTA for these providers, if an active affiliate link exists. Never accepts a raw affiliate URL — see "Affiliate resolution". |
| `status` | string | **Ignored.** All imports are created as `DRAFT`; see "Status policy" below. |

### Deprecated field names (still accepted)

Files written against the older contract keep working — these are accepted as aliases, mapped
onto the current field, and flagged with a warning so you know to update the file:

| Deprecated | Use instead |
|---|---|
| `relatedProviders: [{slug, relationship}]` | `providerRelationships: [{providerSlug, relationship}]` |
| `sources[].type` | `sources[].sourceType` |

If both the deprecated and current field are present, the current one wins.

## Example

```md
---
title: "How to Trade Crypto: A Beginner Guide"
slug: "how-to-trade-crypto"
articleType: "GUIDE"
excerpt: "Learn how crypto trading works, including exchanges, order types, fees and major risks."
category: "Crypto Trading"
tags:
  - crypto-trading
  - beginners
region: "GLOBAL"
searchIntent: "BEGINNER"
seoTitle: "How to Trade Crypto: Beginner Guide"
seoDescription: "Learn how crypto trading works, how exchanges operate, common order types, fees and key risks."
featuredImageAlt: "A beginner comparing order types on a crypto exchange screen"
author: "Editorial Team"
affiliateDisclosureRequired: true
keyTakeaways:
  - "Exchanges differ in fees, supported assets and AUD support."
  - "Market orders execute immediately; limit orders execute at your price or better."
providerRelationships:
  - kraken
  - providerSlug: binance
    relationship: COMPARED
cryptoAssetSlugs:
  - bitcoin
  - ethereum
relatedGuides:
  - crypto-trading-fees
  - market-vs-limit-orders
sources:
  - label: "Example Source"
    url: "https://example.com"
    sourceType: "OFFICIAL_DOCUMENTATION"
affiliateProviders:
  - kraken
---

# How to Trade Crypto

Article content here, as Markdown...
```

## Status policy

Every imported article is created as `DRAFT`, even if the file says otherwise. A `status:
PUBLISHED` line produces a warning during import but is ignored. This is intentional — AI-generated
content is never auto-published. Publishing an article is a separate, deliberate action taken in
`/admin/articles` once an editor has reviewed it.

Re-running the import against an article that's already `PUBLISHED` **never changes its status**
either way — the importer only touches fields actually present in the file.

## Regional variants

`region: GLOBAL` (or omitting `region`) is the default/global version of an article. Setting
`region` to `AU`/`US`/`UK`/`NZ`/`SG` marks the file as a regional variant and requires
`canonicalArticleSlug` pointing at the slug of the global article it's a variant of. Only create a
regional variant when the content is meaningfully different for that region — never duplicate
identical content across regions.

## Affiliate resolution

`affiliateProviders` never accepts a URL. It only declares intent: "this article may show a
contextual placement for provider X." The importer resolves the provider by slug and checks for an
existing **active** `AffiliateLink` for it. If none exists, you'll see a warning and no placement is
shown — the importer never fabricates or stores an affiliate destination from article content.

`affiliateDisclosureRequired` is a separate, explicit flag for whether the disclosure banner
itself should render — it is not inferred from having `affiliateProviders` set.

## Content rendering & embed markers (Article CMS Block 3)

Imported Markdown/HTML is parsed, sanitized, and stored in `Article.content` exactly like
admin-authored content — there is one shared HTML sanitization policy
(`src/lib/articles/sanitize.ts`) and one shared rendering pipeline (`renderArticleContent()` in
`src/lib/articles/renderer.tsx`) used by public Guide pages, public News pages, and admin preview.
An imported file's content is rendered through that same pipeline once the article is published, so
everything below applies to imported articles too, with no separate import-only rendering path.

The renderer:

- re-sanitizes on every render (defense in depth on top of sanitizing at write time);
- injects stable heading ids for table-of-contents links;
- wraps `<table>` elements so wide tables don't break the mobile layout;
- splits content on `{{type:args}}` embed markers.

**Embed markers you can put in imported content today:**

- `{{video:youtube:VIDEO_ID}}` or `{{video:youtube:VIDEO_ID:Optional caption}}` — renders a
  responsive, lazy-loaded YouTube embed via our own component (never a raw stored iframe).
- `{{video:vimeo:VIDEO_ID}}` — same, for Vimeo.

Any other marker (`{{provider-comparison:...}}`, `{{affiliate-cta:...}}`, etc.) is recognized by the
parser but has no renderer yet — that's Block 4 ("dynamic article components"). Until then, such a
marker renders nothing on the public page and shows a "not yet available" notice only in
`/admin/articles/[id]/preview`. It's safe to import content containing these markers now; they'll
simply light up once Block 4 ships, with no re-import required.

## Known limitations

- `providerRelationships`/`cryptoAssetSlugs` slugs must already exist as `Provider`/`CryptoAsset`
  records. This job does not create providers or crypto assets.

## Filename recommendations

Name the file after the slug, e.g. `publish_article/how-to-trade-crypto.md`. This isn't enforced,
but keeps the inbox easy to scan and avoids confusion if a file gets renamed after export.
