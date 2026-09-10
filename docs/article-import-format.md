# Article Publishing Format

This is the exact contract for files dropped into `/publish_article` and picked up by
`npm run import:article`. If you're asking an AI tool to generate an article, tell it:

> Generate this article using our publishing format in docs/article-publishing-format.md,
> and save it as `publish_article/<slug>.md`.

## File format

- Extensions: `.md` or `.txt` — both are parsed identically (YAML frontmatter + Markdown body).
- One article per file.
- The body (everything after the closing `---`) is Markdown. It is converted to sanitized HTML
  on import — `<script>`, `<iframe>`, inline event handlers, and `style` attributes are stripped
  regardless of what the AI produced. Do not rely on raw HTML in the body; write Markdown.

## Required fields

| Field     | Type   | Rules |
|-----------|--------|-------|
| `title`   | string | 1–200 characters |
| `slug`    | string | lowercase, hyphen-separated, URL-safe (e.g. `how-to-trade-crypto`). No spaces, punctuation, or slashes. |
| *(body)*  | Markdown | must render to non-empty content |

## Optional fields

| Field | Type | Notes |
|---|---|---|
| `excerpt` | string | Used as the fallback SEO description and card summary. |
| `category` | string | Free text, matched against existing categories used elsewhere on the site. |
| `tags` | string[] | Lowercased and de-duplicated on import. |
| `region` | `GLOBAL` \| `AU` \| `US` \| `UK` \| `NZ` \| `SG` | Defaults to `GLOBAL`. See "Regional variants" below. |
| `canonicalArticleSlug` | string | Only meaningful when `region` is not `GLOBAL` — see below. |
| `seoTitle` | string | Recommended ≤ 60 chars (warning only, not enforced). |
| `seoDescription` | string | Recommended ≤ 160 chars (warning only, not enforced). |
| `canonicalUrl` | URL | Only set this if the canonical page genuinely lives at a different URL. |
| `featuredImage` | string | Path or absolute URL. |
| `author` | string | |
| `reviewer` | string | |
| `noIndex` | boolean | |
| `keyTakeaways` | string[] | Short bullet points shown near the top of the guide. |
| `searchIntent` | one of: `LEARN`, `HOW_TO`, `BEGINNER`, `COMPARISON`, `PROVIDER_GUIDE`, `FEES`, `SECURITY`, `WALLET`, `REGULATION`, `MARKET_EDUCATION` | Drives related-content and CTA behavior on the guide template. |
| `relatedProviders` | string[] or `{slug, relationship}`[] | `relationship` is one of `MENTIONED` (default), `COMPARED`, `FEATURED`. Slugs are matched against existing `Provider.slug` — providers are never auto-created. |
| `relatedGuides` | string[] (article slugs) | Slugs of other articles. A missing slug produces a warning, not a failure — useful for batches where articles reference each other. |
| `sources` | `{label, url, type?}`[] | `type` is accepted but currently **not stored** (see "Known limitations"). |
| `affiliateProviders` | string[] (provider slugs) | Declares that this article *may* show a contextual affiliate CTA for these providers, if an active affiliate link exists. Never accepts a raw affiliate URL — see "Affiliate resolution". |
| `status` | string | **Ignored.** All imports are created as `DRAFT`; see "Status policy" below. |

## Example

```md
---
title: "How to Trade Crypto: A Beginner Guide"
slug: "how-to-trade-crypto"
excerpt: "Learn how crypto trading works, including exchanges, order types, fees and major risks."
category: "Crypto Trading"
tags:
  - crypto-trading
  - beginners
region: "GLOBAL"
searchIntent: "BEGINNER"
seoTitle: "How to Trade Crypto: Beginner Guide"
seoDescription: "Learn how crypto trading works, how exchanges operate, common order types, fees and key risks."
author: "Editorial Team"
keyTakeaways:
  - "Exchanges differ in fees, supported assets and AUD support."
  - "Market orders execute immediately; limit orders execute at your price or better."
relatedProviders:
  - kraken
  - slug: binance
    relationship: COMPARED
relatedGuides:
  - crypto-trading-fees
  - market-vs-limit-orders
sources:
  - label: "Example Source"
    url: "https://example.com"
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

## Known limitations

- `sources[].type` is accepted in the file format for forward-compatibility but is not currently
  stored — `ArticleSource` has no `type` column yet. You'll get a warning if you set it.
- `relatedProviders` slugs must already exist as `Provider` records. This job does not create
  providers.

## Filename recommendations

Name the file after the slug, e.g. `publish_article/how-to-trade-crypto.md`. This isn't enforced,
but keeps the inbox easy to scan and avoids confusion if a file gets renamed after export.