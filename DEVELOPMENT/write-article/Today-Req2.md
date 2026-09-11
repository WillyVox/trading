# ROLE

Act as a **Senior Staff Software Engineer, Next.js architect, Prisma/PostgreSQL database architect, CMS architect, technical SEO specialist, Australian fintech content-platform engineer, security reviewer, and affiliate-platform engineer**.

You are working directly inside my existing project.

Do **not** treat this as a greenfield application.

Your first responsibility is to deeply inspect the existing project, understand its current architecture and latest completed phases, and then extend it using the project's existing conventions.

The goal of this task is to complete and substantially enhance the existing **Article CMS** so that administrators can create high-quality financial/crypto/trading articles that:

- appear in News;
- appear in Guides;
- relate to exchanges/providers;
- relate to crypto assets;
- appear on exchange detail pages;
- appear alongside comparison pages;
- contain rich HTML;
- contain images and videos;
- embed controlled components from our application inside article content;
- contain strong structured SEO/editorial metadata;
- support Draft → Review → Published workflows;
- support affiliate links without compromising editorial integrity;
- can also be created through the existing article-import workflow.

The ultimate business objective is:

> Build a trustworthy Australian crypto/trading information platform that produces genuinely useful, well-sourced content for users—especially beginners—while gaining organic search visibility and ethically directing suitable users toward approved affiliate partners.

SEO must be based on **people-first, useful, trustworthy content**, not keyword stuffing, mass-generated thin pages, or manipulative affiliate content.

---

# 1. FIRST: STUDY THE CURRENT PROJECT BEFORE CHANGING ANYTHING

Before writing code, inspect at least:

```text
prisma/schema.prisma

src/app/admin/articles/
src/app/admin/media/

src/app/crypto/guides/
src/app/news/
src/app/crypto/exchanges/
src/app/compare/

src/lib/articles/
src/lib/articles/import/
src/lib/providers/
src/lib/affiliates/
src/lib/seo/

src/components/guide/
src/components/providers/
src/components/compare/
src/components/affiliate/
src/components/seo/

scripts/import-articles.ts

docs/ROADMAP.md
docs/IMPLEMENTATION-PLAN.md
docs/article-import-format.md

package.json
```

Also inspect the repository/service conventions used elsewhere before creating new database access patterns.

Do not duplicate systems that already exist.

---

# 2. IMPORTANT CURRENT ARCHITECTURE

The project already has an Article model with concepts including:

- `title`
- `slug`
- `excerpt`
- `content`
- `keyTakeaways`
- `status`
- `author`
- `reviewer`
- `category`
- `seoTitle`
- `seoDescription`
- `canonicalUrl`
- `featuredImage`
- `affiliateDisclosureRequired`
- `noIndex`
- `publishedAt`
- `scheduledAt`
- `lastReviewedAt`
- `searchIntent`
- `region`
- regional variants
- tags
- sources
- provider relationships
- crypto-asset relationships
- curated related articles

Existing relations include:

```text
ArticleTag
ArticleSource
ArticleProvider
ArticleCryptoAsset
ArticleRelated
```

Existing provider relationship types include:

```text
MENTIONED
COMPARED
FEATURED
```

The project also already has:

- Provider domain;
- CryptoAsset domain;
- comparison engine;
- affiliate domain;
- `/go/[partner]` controlled affiliate redirect;
- affiliate click tracking;
- active affiliate-link checking;
- public Guides;
- public News;
- provider/exchange pages;
- comparison pages;
- JSON-LD utilities;
- metadata helpers;
- article file-import pipeline.

REUSE THESE SYSTEMS.

Do not create separate provider/exchange/article/affiliate copies.

---

# 3. FIRST FIX EXISTING ARTICLE SCHEMA / RENDERING INCONSISTENCIES

Before adding new features, audit the existing Article model against every current usage.

I have already noticed an important likely bug:

Public article pages reference:

```ts
article.updatedAt
```

but the current Prisma `Article` model appears not to contain:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Confirm this yourself.

If confirmed, add the timestamps with a safe Prisma migration.

Audit for similar inconsistencies.

Do not simply silence TypeScript errors.

Fix the underlying domain correctly.

---

# 4. EDITORIAL STATUS WORKFLOW

The current statuses appear to be:

```text
DRAFT
PUBLISHED
ARCHIVED
```

I need a proper workflow:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

Potential future state such as `SCHEDULED` can be considered, but do not introduce it if `scheduledAt` plus existing publishing logic is sufficient.

Required permissions/behaviour:

### DRAFT

- visible to ADMIN users;
- editable;
- previewable;
- never visible publicly;
- noindex if rendered through a preview mechanism.

### REVIEW

- visible to ADMIN users;
- editable/previewable;
- designed for editorial checking;
- never available through the normal public article route;
- noindex.

### PUBLISHED

- publicly accessible;
- appears in appropriate listing pages;
- included in appropriate sitemap/indexing logic unless `noIndex = true`;
- related to providers/assets/comparisons as configured.

### ARCHIVED

- not presented as current public editorial content;
- decide whether old public URLs should remain available, redirect, or 404 according to the current product architecture;
- document the chosen behaviour.

Every status mutation must perform independent **server-side ADMIN authorization**.

Never rely only on hiding buttons.

---

# 5. INTRODUCE A REAL ARTICLE TYPE

Do not continue relying solely on an arbitrary category string to determine where an article belongs.

Investigate whether we should introduce something like:

```prisma
enum ArticleType {
  NEWS
  GUIDE
  EDUCATION
  PROVIDER_REVIEW
  COMPARISON
  MARKET_ANALYSIS
}
```

You may modify the exact values after inspecting the project.

However, keep the first implementation practical.

At minimum, the system must clearly distinguish:

```text
NEWS
GUIDE
```

from arbitrary topical categories.

This is important because currently both:

```text
/news/[slug]
/crypto/guides/[slug]
```

appear capable of looking up an Article simply by slug.

Prevent a Guide from accidentally rendering as News and vice versa.

The article service should support something equivalent to:

```ts
getPublishedArticleBySlugAndType(...)
```

or another clean domain-based solution.

---

# 6. ARTICLE ADMIN PAGES

Fully implement:

```text
/admin/articles
/admin/articles/new
/admin/articles/[id]
```

The existing placeholder pages must become a complete CMS.

Use Server Components and Server Actions where appropriate.

Use `"use client"` only for genuinely interactive editor behaviour.

---

# 7. NEW ARTICLE FORM

Create a professional admin form designed for long-form editorial work.

Organise it into sensible sections rather than one giant uncontrolled form.

Suggested sections:

```text
Basic information
Content
Editorial information
SEO
Search intent
Relationships
Provider/exchange placement
Crypto asset placement
Affiliate configuration
Sources & evidence
Related content
Media
Publishing
Preview
```

---

# 8. CORE ARTICLE FIELDS

Support at minimum:

## Identity

```text
Title
Slug
Article Type
Category
Excerpt / Summary
```

Slug should:

- auto-generate from title initially;
- remain editable;
- validate URL safety;
- prevent duplicates;
- warn admins before changing an already-published slug.

Consider whether historical slug redirects are appropriate, but don't over-engineer unless useful.

---

# 9. HIGH-VALUE USER INFORMATION

The article system should encourage writers to provide useful information rather than just generic text.

Retain/use:

```text
keyTakeaways
searchIntent
sources
providers
cryptoAssets
```

Consider adding structured fields such as:

```text
Target audience
Difficulty / experience level
Primary question answered
Summary / quick answer
Risks to know
Methodology note
Last fact-checked date
```

Do not blindly add every possible field.

Choose fields that:

1. improve user usefulness;
2. improve editorial quality;
3. improve filtering/internal linking;
4. improve trust;
5. have real usage in UI or SEO.

Avoid fields that will simply become unused CMS clutter.

---

# 10. BEGINNER-FRIENDLY FINANCIAL CONTENT

Many target visitors are new to:

- crypto;
- exchanges;
- investing;
- trading;
- fees;
- wallets;
- market terminology.

The article form and public renderer should make it easy to provide:

- key takeaways;
- definitions;
- step-by-step sections;
- risks;
- fee explanations;
- comparison tables;
- examples;
- FAQs;
- related beginner guides;
- related exchange profiles;
- relevant cryptocurrency pages;
- references/sources.

Do not automatically manufacture these values.

Editors enter them or they come through validated imports.

---

# 11. SEO FIELDS

The existing fields include:

```text
seoTitle
seoDescription
canonicalUrl
noIndex
searchIntent
featuredImage
```

Preserve them.

Evaluate whether the following are valuable:

```text
focusKeyword
secondaryKeywords
ogTitle
ogDescription
socialImage
```

Do not add fields merely because an SEO plugin normally has them.

For keywords, remember:

**keywords are editorial planning metadata—not an instruction to repeat phrases unnaturally throughout the page.**

If `focusKeyword` / `secondaryKeywords` are stored, use them for:

- editorial guidance;
- internal search;
- content auditing;
- related-content discovery;
- admin SEO feedback.

Do not output obsolete `<meta name="keywords">` tags.

---

# 12. SEO ASSISTANCE IN ADMIN

Create a useful SEO/editorial quality panel.

Examples:

```text
SEO title length
Meta description length
Title present
Excerpt present
H1 uniqueness
Featured image present
Image alt text coverage
Canonical validity
Sources present
Author present
Reviewer present
Last-reviewed date
Internal links
Provider relationships
Crypto relationships
Key takeaways
FAQ presence
Article body word count
Estimated reading time
Noindex state
Affiliate disclosure state
Broken/invalid embed references
```

This should be advisory.

Do NOT create a fake "SEO score = guaranteed ranking."

Do not encourage keyword stuffing.

Warnings such as these are useful:

```text
SEO title may be too long
Meta description missing
Article contains no sources
Financial comparison article has no methodology/source information
Featured image has no alt text
Article mentions an affiliate provider but disclosure is disabled
Article references an unknown provider
```

---

# 13. AUTHORS / REVIEWERS / TRUST

This is financial/crypto content, so trust matters.

The existing `author` and `reviewer` strings may be insufficient long-term.

Investigate whether a small structured author profile would materially improve the architecture.

For example:

```prisma
AuthorProfile
- id
- name
- slug
- jobTitle
- bio
- avatarUrl
- expertise
- profileUrl / social links where appropriate
```

Articles could reference:

```text
authorId
reviewerId
```

However:

- don't introduce a huge author-management system unnecessarily;
- keep backward compatibility where reasonable;
- do not invent qualifications.

Public articles should clearly show who wrote/reviewed them when that data exists.

---

# 14. SOURCES & FACT CHECKING

The existing `ArticleSource` currently has basic:

```text
label
url
```

Evaluate expanding it with fields such as:

```text
sourceType
publisher
publishedAt
accessedAt
notes
```

Potential source types:

```text
OFFICIAL_PROVIDER
REGULATOR
GOVERNMENT
OFFICIAL_DOCUMENTATION
OFFICIAL_FEES
NEWS
RESEARCH
OTHER
```

Reuse Provider source concepts where sensible without incorrectly merging ArticleSource and ProviderSource.

For finance/crypto articles, source quality should be visible.

---

# 15. FAQ SUPPORT

Consider creating structured FAQ data rather than burying FAQs only inside HTML.

For example:

```prisma
ArticleFaq {
  id
  articleId
  question
  answer
  position
}
```

Benefits:

- consistent UI;
- easier admin editing;
- reusable structured data where appropriate;
- better semantic article organization.

Do not add FAQ structured data indiscriminately.

Only render schema that matches visible page content and is appropriate under current search-engine rules.

---

# 16. HTML ARTICLE CONTENT

I want article content to support HTML.

Continue storing the main article body in a database field such as:

```text
content @db.Text
```

but create a proper rich-content editing and rendering architecture.

The editor needs to support common content including:

```html
h2
h3
h4

p

strong
em

ul
ol
li

a

blockquote

table
thead
tbody
tr
th
td

figure
figcaption

img

video/embed representations where permitted

code
pre

horizontal separator
```

If selecting a rich text editor library, choose one deliberately after checking compatibility with:

- Next.js 16;
- React 19;
- SSR;
- TypeScript;
- HTML output;
- security;
- maintenance quality.

Do not install a massive dependency without explaining why.

---

# 17. HTML SECURITY

Do NOT trust arbitrary raw HTML merely because the writer is an ADMIN.

Articles eventually become public attack surfaces.

Create a shared sanitisation policy.

Allow only approved:

- elements;
- attributes;
- protocols;
- image properties;
- iframe/video hosts.

Disallow dangerous things such as:

```text
<script>
inline event handlers
javascript: URLs
unsafe arbitrary iframes
unknown embeds
```

The same sanitisation rules must apply to:

- admin-created articles;
- imported articles;
- preview rendering;
- final public rendering.

Avoid having three inconsistent HTML policies.

---

# 18. IMAGES

Articles must support images.

At minimum support:

```text
image URL/source
alt text
caption
optional credit/source
width/height where known
```

The featured image should also support meaningful alt text.

Do not treat alt text as a keyword-stuffing field.

Provide a Media experience in:

```text
/admin/media
```

if practical within the current architecture.

If real upload/storage infrastructure does not yet exist, create an abstraction and clearly document what's still needed rather than faking persistent upload functionality.

---

# 19. VIDEO

Articles should support videos.

Prefer controlled embeds.

Initially support approved sources such as:

```text
YouTube
Vimeo
```

depending on project requirements.

Do not store arbitrary iframe HTML.

Represent the video safely, for example:

```text
provider
videoId / approved URL
title
caption
```

Render through our own component.

Use responsive aspect ratios.

Lazy-load where appropriate.

---

# 20. MOST IMPORTANT: EMBED APPLICATION COMPONENTS INSIDE ARTICLE CONTENT

I need articles such as:

> 5 Best Crypto Exchanges in Australia in 2026

to contain our actual comparison UI somewhere in the middle of the article.

Example article:

```text
Introduction

Key considerations

CoinSpot section

<OUR REAL EXCHANGE COMPARISON COMPONENT HERE>

Fees explained

Security

Conclusion
```

Do NOT allow arbitrary React source code or executable MDX entered through the CMS.

Do NOT store:

```jsx
<CompareTable ... />
```

and eval it.

Instead create a controlled **Article Embed / Content Block system**.

---

# 21. RECOMMENDED EMBED ARCHITECTURE

Investigate the cleanest implementation for the existing application.

One acceptable architecture would keep the main article as sanitized HTML and insert controlled markers such as:

```text
{{provider-comparison:coinspot,independent-reserve,kraken}}

{{provider-card:coinspot}}

{{provider-fees:coinspot}}

{{affiliate-cta:coinspot}}

{{crypto-asset:bitcoin}}

{{related-guides}}

{{article-table-of-contents}}
```

But do not blindly adopt this syntax.

Another option is structured records such as:

```prisma
ArticleEmbed {
  id
  articleId
  embedType
  configuration Json
  position / key
}
```

with placeholders in content.

Pick the architecture that is:

- secure;
- server-renderable;
- typed;
- validated;
- easy to edit;
- easy to import;
- SEO-friendly;
- maintainable.

---

# 22. APPROVED ARTICLE EMBEDS

Initially consider supporting controlled components such as:

```text
PROVIDER_COMPARISON
PROVIDER_CARD
PROVIDER_FACTS
PROVIDER_FEES
PROVIDER_FEATURES
AFFILIATE_CTA
CRYPTO_ASSET_CARD
RELATED_GUIDES
RELATED_NEWS
TABLE_OF_CONTENTS
```

Do not implement unnecessary ones if no existing component/data supports them.

Most importantly:

**reuse current components/data services whenever possible.**

For example:

- comparison embeds should use the real Provider domain;
- fee embeds should use ProviderFee;
- feature embeds should use ProviderFeature;
- affiliate CTAs should use approved AffiliateLink records;
- do not copy provider data into article HTML.

That ensures factual information stays synchronized.

---

# 23. ARTICLE RENDERER

Create one shared rendering pipeline.

Something conceptually similar to:

```text
ArticleRenderer
```

should be used by:

```text
published Guide
published News
admin Draft preview
admin Review preview
```

Avoid having public and admin preview render differently.

Possible responsibilities:

```text
sanitize HTML
extract headings
generate stable heading IDs
split/render controlled article embeds
render media
render tables
render external links safely
render internal links
collect article TOC
handle affiliate disclosure
```

Do not destroy the existing guide renderer functionality.

Refactor it into reusable pieces if appropriate.

---

# 24. ARTICLE PLACEMENT ON EXCHANGE PAGES

The existing `ArticleProvider` relation should be the main mechanism unless a better existing mechanism already exists.

I want an admin to create an article and select:

```text
Related providers:
- CoinSpot
- Kraken
```

with relationship:

```text
MENTIONED
COMPARED
FEATURED
```

Then:

```text
/crypto/exchanges/coinspot
```

could automatically display relevant published articles.

Examples:

```text
CoinSpot Review
CoinSpot Fees Explained
CoinSpot vs Kraken
How to Buy Bitcoin with CoinSpot
```

Only:

```text
PUBLISHED
```

articles should appear publicly.

Allow sensible ordering/ranking.

Possible order:

```text
FEATURED
COMPARED
MENTIONED
then recency/relevance
```

but do not let affiliate commission influence editorial ranking.

---

# 25. ARTICLES ON CRYPTO ASSET PAGES

Reuse `ArticleCryptoAsset`.

Example:

An article:

```text
How to Buy Bitcoin in Australia
```

could relate to:

```text
Bitcoin
```

Then future/current:

```text
/crypto/bitcoin
```

could show that article.

Make service methods reusable even if not every page currently exists.

---

# 26. ARTICLES ON COMPARISON PAGES

I also want comparison articles to be linkable to pages such as:

```text
/compare/coinspot-vs-kraken
```

Investigate the best solution.

Do not introduce a generic polymorphic table unnecessarily if existing relationships can represent this cleanly.

For pair/multi-provider comparison articles, we may be able to derive relevance from:

```text
ArticleProvider.relationshipType = COMPARED
```

and the set of selected providers.

For example:

```text
CoinSpot vs Kraken: Which Exchange Is Better for Australian Users?
```

related providers:

```text
CoinSpot -> COMPARED
Kraken -> COMPARED
```

Then `/compare/coinspot-vs-kraken` could query for published articles containing that provider set.

If that is insufficient for explicit placements, propose a minimal typed relationship.

Do not hard-code article IDs into page components.

---

# 27. AFFILIATE INTEGRATION

Articles can promote approved affiliate partners, but editorial content and commercial relationships must stay separate.

Reuse the existing affiliate domain.

Never store arbitrary affiliate destination URLs directly in article body when an internal affiliate partner link exists.

Use:

```text
/go/[partnerSlug]
```

or the existing approved redirect architecture.

This gives:

- approved destination validation;
- click tracking;
- partner state management;
- future reporting;
- safe central link changes.

---

# 28. AFFILIATE ARTICLE RULES

If an article has commercial links:

- display affiliate disclosure appropriately;
- maintain editorial independence;
- do not claim a platform is "best" solely because it pays commission;
- do not reorder comparisons according to commission;
- disable/hide affiliate CTA automatically if the AffiliateLink is inactive;
- keep the factual article/provider content visible even without an affiliate relationship.

The existing:

```text
affiliateDisclosureRequired
```

field should be integrated properly.

Potentially auto-warn the editor when an affiliate embed/provider is present but disclosure is disabled.

---

# 29. AFFILIATE EMBEDS

If an article contains:

```text
{{affiliate-cta:coinspot}}
```

or the equivalent structured block:

the renderer must:

1. resolve the Provider;
2. check the real affiliate domain;
3. check partnership/link activity;
4. render only if valid;
5. use the internal redirect route;
6. provide disclosure according to page context;
7. never accept arbitrary URLs from the embed config.

---

# 30. NEWS VS GUIDE PAGE EXPERIENCE

Do not render News and Guide identically.

Reuse core components but maintain appropriate templates.

### Guide

Can include:

- Key Takeaways
- Table of Contents
- Last reviewed
- Reviewer
- Sources
- Related providers
- Related guides
- Beginner next steps
- comparison embeds

### News

Can include:

- publication date;
- author;
- update timestamp;
- sources;
- relevant provider/asset links;
- concise related content;
- appropriate news structured data.

Both should use the same secure underlying renderer.

---

# 31. ARTICLE DISPLAY QUALITY

Published articles should be excellent on:

```text
desktop
tablet
mobile
```

Pay special attention to:

- readable line length;
- heading hierarchy;
- paragraph spacing;
- tables;
- horizontal overflow;
- comparison components;
- images;
- captions;
- video;
- blockquotes;
- lists;
- mobile cards;
- embedded provider comparisons;
- sticky TOC only where appropriate;
- accessibility.

A large comparison table must not destroy the mobile article layout.

Reuse the existing comparison mobile-card fallback when possible.

---

# 32. INTERNAL LINKING

Use article relationships to create genuine internal linking.

Examples:

```text
Article → Provider
Provider → Article

Article → Crypto Asset
Crypto Asset → Article

Article → Related Article
Article → Comparison

Guide → Beginner next step
```

Do not create a giant uncontrolled "related everything" section.

Prefer curated relationships first, then sensible relevance fallback.

The current related-guide strategy already follows this philosophy; preserve it.

---

# 33. ARTICLE SEO OUTPUT

Ensure published articles correctly produce:

```text
<title>
meta description
canonical
robots/index/noindex
OpenGraph
Twitter/social metadata if supported
published time
modified time
authors
featured image
hreflang where regional variants genuinely exist
```

Reuse:

```text
src/lib/seo/*
```

Do not create parallel metadata helpers.

---

# 34. STRUCTURED DATA

Review existing JSON-LD.

Use the appropriate schema for:

```text
Article
NewsArticle
BreadcrumbList
```

Potentially other schemas only if:

- they accurately represent visible content;
- they are currently supported;
- they are not being added merely in the hope of manipulating rankings.

Avoid duplicate or contradictory JSON-LD.

---

# 35. FINANCIAL/YMYL TRUST SIGNALS

This is crypto/trading/financial content.

Build article templates around trust.

Where data exists, clearly display:

```text
Written by
Reviewed by
Published
Last reviewed / meaningfully updated
Sources
Methodology
Affiliate disclosure
Risk notices
```

Do not present financial information as guaranteed outcomes.

Do not generate fake:

```text
returns
performance
ratings
regulatory approval
security claims
fees
```

All factual provider information should come from the existing structured Provider data whenever possible.

---

# 36. CONTENT FRESHNESS

For articles involving:

- fees;
- regulation;
- provider features;
- supported assets;
- exchange availability;
- crypto market information;

support editorial review/freshness workflows.

Existing:

```text
lastReviewedAt
```

should be meaningful.

Consider admin warnings such as:

```text
This article has not been reviewed in 180 days
```

but don't automatically change published dates merely to make content appear fresh.

---

# 37. IMPORT ARTICLE SCRIPT

The existing import architecture must be upgraded to support the same useful article fields as the admin CMS.

Do not create an import-only second schema.

Admin form and import files should ultimately map into the same Article domain.

Review:

```text
scripts/import-articles.ts

src/lib/articles/import/
docs/article-import-format.md
```

---

# 38. IMPORT FORMAT

Extend article frontmatter where appropriate.

An example might eventually look similar to:

```yaml
---
title: "5 Best Crypto Exchanges in Australia in 2026"
slug: "best-crypto-exchanges-australia"
articleType: "GUIDE"

category: "crypto-exchanges"

excerpt: >
  Compare leading cryptocurrency exchanges available to Australian users,
  including trading fees, AUD deposit options, security features and supported assets.

author: "..."
reviewer: "..."

searchIntent: "COMPARISON"

focusKeyword: "best crypto exchanges australia"

secondaryKeywords:
  - "crypto exchanges australia"
  - "australian crypto exchange"
  - "compare crypto exchanges"

keyTakeaways:
  - "..."
  - "..."
  - "..."

tags:
  - "crypto"
  - "exchanges"
  - "australia"
  - "beginner"

relatedProviders:
  - slug: "coinspot"
    relationship: "COMPARED"
  - slug: "independent-reserve"
    relationship: "COMPARED"
  - slug: "kraken"
    relationship: "COMPARED"

cryptoAssets:
  - "bitcoin"
  - "ethereum"

relatedGuides:
  - "how-to-buy-bitcoin-australia"

sources:
  - label: "..."
    url: "https://..."
    type: "OFFICIAL_PROVIDER"

featuredImage: "..."
featuredImageAlt: "..."

affiliateDisclosureRequired: true

noIndex: false
---
```

Then body HTML/content.

This is illustrative.

Adapt it to the final schema rather than copying it blindly.

---

# 39. IMPORTED EMBEDS

The importer must also understand the approved embedded-component format.

Example:

```text
{{provider-comparison:coinspot,independent-reserve,kraken}}
```

or structured equivalent.

Validation must fail or warn appropriately when:

- provider slug doesn't exist;
- crypto asset doesn't exist;
- embed type isn't allowed;
- configuration is malformed;
- affiliate provider has no active affiliate link;
- a related article doesn't exist;
- an iframe/video provider is unsupported.

Do not allow arbitrary executable markup.

---

# 40. IMPORT SAFETY

Preserve good existing importer properties:

```text
idempotent by slug
safe updates
two-pass relationship resolution
DRAFT by default
dry-run
validation
warnings
sanitisation
```

Imported articles must continue to default to:

```text
DRAFT
```

Never let an uploaded/imported file silently publish itself.

Publication remains an explicit admin/editorial action.

---

# 41. IMPORT HTML AND MARKDOWN

The importer currently handles Markdown → HTML.

I also want HTML article content supported where practical.

Design explicit behaviour.

For example:

```text
.md -> parse Markdown -> sanitize -> store HTML
.html -> sanitize -> store HTML
.txt -> existing supported policy
```

Do not guess format based on unsafe content.

Document it.

---

# 42. PREVIEW

Admin users need preview capability for:

```text
DRAFT
REVIEW
PUBLISHED
```

Preview should render the actual article template with the real:

- ArticleRenderer;
- embeds;
- provider data;
- comparison data;
- affiliate behaviour;
- media;
- responsive layout.

Potential route:

```text
/admin/articles/[id]/preview
```

or another secure architecture.

Do not expose Draft/Review through public article URLs.

Preview routes must:

```text
require ADMIN
noindex
no-store where appropriate
```

---

# 43. CREATE / UPDATE / REVIEW / PUBLISH ACTIONS

Implement server actions or server-side mutations for:

```text
createArticle
updateArticle
submitArticleForReview
moveArticleBackToDraft
publishArticle
unpublishArticle
archiveArticle
```

Adapt naming to current conventions.

Each action must:

- call `requireAdmin()`;
- validate with Zod;
- normalize data;
- sanitize content;
- validate relations;
- use transactions when mutating several related records;
- revalidate relevant routes;
- set publication timestamps correctly.

---

# 44. PUBLISHING RULES

Publishing should verify minimum content quality.

Do not prevent publication based on arbitrary SEO scores.

But sensible hard/soft checks include:

### Hard validation

```text
title exists
slug exists
content exists
valid article type
valid related provider IDs
valid asset IDs
valid URLs
sanitized content
```

### Editorial warnings

```text
excerpt missing
SEO description missing
sources missing
featured image missing
author missing
reviewer missing
key takeaways missing
financial article not reviewed recently
affiliate disclosure mismatch
```

Allow admins to make informed decisions.

---

# 45. SCHEDULING

There is already:

```text
scheduledAt
```

Inspect how it should work.

If no scheduler/background infrastructure currently exists:

do not pretend scheduled publishing works automatically.

Either:

1. implement a reliable mechanism supported by this project/deployment architecture; or
2. leave scheduling explicitly disabled/not active and document what is missing.

Never create a field that gives admins a false impression that content will publish automatically.

---

# 46. ARTICLE LIST ADMIN UX

Improve:

```text
/admin/articles
```

Add useful columns/filters:

```text
Title
Type
Status
Category
Author
Updated
Published
Last reviewed
SEO/index status
```

Useful filters:

```text
Status
Article Type
Category
Provider
Crypto Asset
Search intent
```

Optional search:

```text
title
slug
```

Include actions:

```text
Edit
Preview
Publish
Move to Review
Archive
```

Avoid loading every relation unnecessarily.

---

# 47. PROVIDER PAGE ARTICLE LINKS

Enhance:

```text
/crypto/exchanges/[slug]
```

using existing relations.

Add sections such as:

```text
Featured guides
Comparisons
Latest news
```

depending on real linked content.

Only show sections when content exists.

Do not render empty placeholders publicly.

---

# 48. COMPARISON PAGE RELATED CONTENT

Enhance:

```text
/compare/[slug]
```

so that if there are genuinely relevant published comparison articles they can appear below the comparison table.

Example:

```text
Read our detailed CoinSpot vs Kraken comparison
```

But avoid duplicate/thin content.

The dynamic comparison itself should remain generated from Provider domain facts.

The article adds editorial analysis, context, methodology and explanations.

---

# 49. SITE SEARCH / CONTENT DISCOVERY PREPARATION

Design fields so future site search can use:

```text
title
excerpt
content text
category
tags
provider relationships
asset relationships
searchIntent
articleType
```

Do not build Elasticsearch or another complex infrastructure unless justified.

Postgres is sufficient initially.

---

# 50. DATABASE DESIGN PRINCIPLES

Keep these domains separate:

```text
Article
Provider
Affiliate
CryptoAsset
```

Relations connect them.

Do not put:

```text
provider fees
affiliate commission rates
crypto market prices
```

directly into Article merely to make rendering easier.

Article should reference structured domain data.

---

# 51. LIKELY SCHEMA CHANGES TO INVESTIGATE

At minimum evaluate:

```prisma
ArticleStatus
  + REVIEW

Article
  + createdAt
  + updatedAt

Article
  + articleType
```

Potentially:

```text
focusKeyword
secondaryKeywords

featuredImageAlt

targetAudience
difficulty

ArticleFaq

ArticleEmbed / ArticleContentBlock

expanded ArticleSource

structured author profile
```

Do NOT add every field above automatically.

For every schema addition explain:

1. what user/business problem it solves;
2. where the application actually consumes it;
3. why an existing field/relation isn't sufficient.

---

# 52. IMPORTANT INDEXES

Review indexing for likely queries.

Potential examples:

```text
Article(status, articleType, publishedAt)
Article(category)
Article(searchIntent)
Article(region)

ArticleProvider(providerId, relationshipType)
ArticleCryptoAsset(assetId)
ArticleTag(tag)
```

Only add indexes justified by actual query paths.

---

# 53. SLUG / ROUTE COLLISIONS

Because Article has a globally unique slug, decide whether that remains desirable.

If `NEWS` and `GUIDE` cannot share the same slug, global uniqueness is fine.

More importantly, enforce ArticleType when resolving routes.

For example:

```text
/news/foo
```

must not show a GUIDE named `foo`.

And:

```text
/crypto/guides/foo
```

must not show a NEWS article.

---

# 54. CACHING / REVALIDATION

Inspect current Next.js 16 caching behaviour.

After:

```text
create
update
publish
archive
relationship change
```

revalidate all affected routes appropriately.

Potentially:

```text
/news
/news/[slug]

/crypto/guides
/crypto/guides/[slug]

/crypto/exchanges/[related-provider]

/compare/[affected-comparison]
```

Do not use broad cache invalidation unnecessarily.

---

# 55. SEO AND AFFILIATE QUALITY PRINCIPLE

Our goal is organic growth, but do not optimize around:

> "How many keywords can we insert?"

Optimize around:

> "Does this answer the visitor's question better and more reliably than competing pages?"

Particularly for comparison/affiliate articles, provide original added value:

- structured provider facts;
- verified fee data;
- meaningful side-by-side comparison;
- methodology;
- Australian relevance;
- regulator/source links;
- understandable explanations;
- beginner-friendly context;
- risks;
- real limitations;
- transparent affiliate disclosures.

The website must not become a thin affiliate directory.

---

# 56. DO NOT DUPLICATE PROVIDER FACTS INSIDE CONTENT WHEN STRUCTURED DATA EXISTS

For example, if an article contains a comparison component, it should load:

```text
ProviderFee
ProviderFeature
ProviderFact
ProviderRegulation
```

rather than storing another snapshot in Article HTML.

Editorial prose can explain the data.

Structured facts should remain authoritative from the Provider domain.

This minimizes stale information.

---

# 57. ARTICLE EMBED EXAMPLE

The final system should make an article like this possible:

```html
<h2>Our top Australian crypto exchanges</h2>

<p>
Choosing an exchange depends on fees, AUD deposit options, available assets,
security features and the type of trading you plan to do.
</p>

[CONTROLLED PROVIDER COMPARISON BLOCK]

<h2>How trading fees compare</h2>

<p>
...
</p>

[CONTROLLED PROVIDER FEE BLOCK]

<h2>What beginners should consider</h2>

<p>
...
</p>

[CONTROLLED RELATED BEGINNER GUIDE BLOCK]
```

The admin preview and public page must look identical except for admin controls.

---

# 58. CONTENT EDITOR UX

The editor should allow an admin to insert a controlled component without manually remembering syntax.

Ideally:

```text
Insert block
  -> Provider comparison
  -> Provider card
  -> Provider fee table
  -> Affiliate CTA
  -> Video
  -> Crypto asset
```

Then choose providers/assets through searchable/select controls.

The underlying stored representation may be shortcode/structured config, but the editor UX should validate it.

If implementing a rich graphical block picker becomes disproportionately large, implement the secure underlying model first and a practical admin control for inserting blocks.

---

# 59. ARTICLE VERSIONING

Consider whether basic revision history is valuable.

I do NOT require a full Google Docs versioning system now.

But avoid architecture that prevents future:

```text
ArticleRevision
```

support.

At minimum prevent accidental publish overwrites where practical.

---

# 60. PUBLIC ARTICLE PERFORMANCE

Article pages must remain performant.

Do not load data for every possible embed before knowing which embeds exist.

Parse the article/embed configuration and fetch only required:

```text
providers
assets
affiliate links
related articles
```

Batch database queries where possible to avoid N+1 queries.

Images/videos should not destroy Core Web Vitals.

---

# 61. ACCESSIBILITY

Ensure:

- semantic heading structure;
- image alt text;
- keyboard accessibility;
- descriptive link text;
- accessible tables;
- video titles;
- sufficient contrast;
- proper labels in admin forms;
- clear validation errors.

---

# 62. TESTS

Add meaningful tests.

At minimum cover:

### Article validation

```text
valid article
invalid slug
invalid URLs
invalid type
invalid embed
```

### Import

```text
new fields parse correctly
existing safe-merge behaviour remains
HTML sanitisation
DRAFT-only imports
related provider resolution
asset resolution
affiliate validation
embed validation
```

### Status / access

```text
public gets PUBLISHED only
DRAFT not public
REVIEW not public
ARCHIVED behaviour
admin preview works
```

### Renderer

```text
plain HTML
headings
safe links
comparison embed
provider embed
unsupported embed
malicious HTML
```

### Routing

```text
NEWS cannot appear as GUIDE
GUIDE cannot appear as NEWS
```

---

# 63. MIGRATION

Create proper Prisma migration(s).

Do not:

```text
db push
drop production data
reset database
```

unless explicitly required for a development-only environment.

Explain migration impact.

Preserve existing Article rows.

If introducing ArticleType, create a safe migration strategy for existing records.

For example, infer from the existing category only if the mapping is deterministic.

Otherwise provide a safe default and document manual migration requirements.

---

# 64. DOCUMENTATION

Update:

```text
docs/ROADMAP.md
docs/IMPLEMENTATION-PLAN.md
docs/article-import-format.md
```

or the actual existing equivalent.

Document:

- article fields;
- status workflow;
- article types;
- embed syntax/model;
- supported embeds;
- import fields;
- preview behaviour;
- publish behaviour;
- affiliate rules;
- security/sanitisation;
- media limitations;
- scheduled publishing limitations if any.

---

# 65. IMPLEMENTATION STRATEGY

Do not attempt an uncontrolled rewrite.

Work in logical stages.

Recommended sequence:

## Stage A — Audit & design

Report:

```text
existing architecture
bugs/inconsistencies
schema changes required
files to change
migration plan
embed design
security design
```

Then continue implementation unless a truly destructive ambiguity prevents it.

## Stage B — Core Article domain

Implement:

```text
timestamps
REVIEW
article type
validation
repository/service methods
```

## Stage C — Admin CRUD

Implement:

```text
new
edit
save
review
publish
archive
preview
```

## Stage D — Rich renderer

Implement:

```text
HTML
sanitisation
media
controlled embeds
```

## Stage E — Relationships

Implement:

```text
providers
assets
related articles
comparison relevance
```

## Stage F — SEO / editorial quality

Implement:

```text
metadata
SEO panel
structured data
trust fields
```

## Stage G — Import pipeline

Update the importer to match the CMS.

## Stage H — Public integrations

Update:

```text
guides
news
exchange detail pages
comparison pages
```

## Stage I — Tests / documentation / validation

---

# 66. RUN VALIDATION

After implementation run the actual available commands.

Inspect `package.json`; do not assume scripts exist.

At minimum run equivalents of:

```bash
npx prisma validate
npx prisma generate
npm test
npm run build
```

Run lint/typecheck if appropriate scripts exist or direct commands are available.

Fix errors caused by your implementation.

Do not leave known TypeScript/Prisma failures.

---

# 67. DO NOT DO THESE THINGS

Do not:

- create a second Provider model;
- create a second affiliate system;
- duplicate provider fees into articles;
- allow arbitrary React/JavaScript inside articles;
- execute MDX entered by admins;
- allow arbitrary iframe URLs;
- allow arbitrary affiliate redirects;
- let imported files auto-publish;
- expose Draft/Review articles publicly;
- let affiliate commission determine rankings;
- hard-code provider names in article components;
- create SEO keyword stuffing tools;
- output obsolete meta-keywords;
- fabricate author qualifications;
- fabricate financial claims;
- fabricate provider facts;
- fabricate exchange rankings;
- change article dates simply to appear fresh;
- mass-generate near-identical SEO pages;
- replace current architecture unnecessarily.

---

# 68. DEFINITION OF DONE

I should be able to perform this workflow:

### Admin workflow

1. Login as ADMIN.
2. Visit:

```text
/admin/articles/new
```

3. Select:

```text
GUIDE
```

4. Enter:

```text
5 Best Crypto Exchanges in Australia in 2026
```

5. Enter rich article content.
6. Add key takeaways.
7. Add sources.
8. Link:

```text
CoinSpot
Independent Reserve
Kraken
```

as `COMPARED`.
9. Link Bitcoin/Ethereum if relevant.
10. Add SEO metadata.
11. Add featured image.
12. Insert a live Provider Comparison block into the middle of the article.
13. Insert an approved affiliate CTA if applicable.
14. Save as `DRAFT`.
15. Preview it.
16. Move it to `REVIEW`.
17. Preview again.
18. Publish it.
19. Public users can now access it.
20. It appears in the relevant Guides listing.
21. The related exchange pages can link back to it.
22. Relevant comparison pages can link to it.
23. The embedded comparison loads current Provider-domain data.
24. Affiliate CTA uses the approved `/go/...` flow.
25. Draft/Review versions remain inaccessible to visitors.

### Import workflow

I should also be able to create an equivalent article through the article import format.

The imported article:

```text
validates
sanitizes content
resolves providers
resolves assets
resolves related content
validates embeds
imports as DRAFT
appears in admin
can be previewed
can later be reviewed/published
```

---

# 69. FINAL REPORT

When finished, return a clear report containing:

## A. What you discovered

Especially:

```text
current Article architecture
schema issues
route issues
security concerns
import limitations
```

## B. Architecture decisions

Explain:

```text
ArticleType design
REVIEW workflow
HTML strategy
embed strategy
provider/article relationship strategy
comparison article strategy
affiliate strategy
SEO strategy
```

## C. Database changes

Show new/changed models and migration name.

## D. Files changed

Group by:

```text
Prisma
Article domain
Admin
Renderer
SEO
Provider integrations
Comparison integrations
Import
Tests
Docs
```

## E. Security

Explain:

```text
HTML sanitisation
embed validation
admin authorization
affiliate URL handling
preview protection
```

## F. Manual verification

Give exact steps I can perform locally.

## G. Remaining limitations

Be explicit about anything intentionally not implemented.

---

# FINAL PRODUCT PRINCIPLE

The objective is **not merely to create more pages for Google**.

The objective is to create a content system capable of producing articles that users would genuinely choose to read because they contain:

- trustworthy information;
- Australian relevance;
- real structured provider data;
- transparent sources;
- understandable explanations;
- useful comparisons;
- current facts;
- clear risks;
- good internal navigation;
- excellent mobile presentation;
- transparent affiliate relationships.

SEO and affiliate monetisation should benefit from that quality—not replace it.

Study the existing project thoroughly, make the smallest coherent architectural changes necessary, implement the feature end-to-end, preserve existing working behaviour, and leave the project in a buildable/tested state.