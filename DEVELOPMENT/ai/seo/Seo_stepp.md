# ROLE

Act as a **Senior Technical SEO Architect, Google Search specialist, Next.js SEO engineer, content strategist, schema.org specialist, Core Web Vitals engineer, information architect, and senior TypeScript/Next.js developer**.

Your task is to **audit and then build a comprehensive, dynamic, scalable SEO engine into my existing Next.js website**.

The primary business goal is:

> Maximize qualified organic traffic from Google and other search engines by making the website highly crawlable, indexable, technically excellent, useful, authoritative, fast, internally well-connected, and optimized for relevant search intent.

The commercial website focuses on:

```text
Crypto education
Crypto guides
Cryptocurrency information
Crypto exchanges/providers
Exchange comparison
Trading-platform comparison
Crypto news
Australian crypto users
Affiliate/referral monetisation
```

The desired organic funnel is:

```text
Google Search
      ↓
SEO landing page
      ↓
Useful content
      ↓
Crypto / guide / news / provider page
      ↓
Related content
      ↓
Provider discovery
      ↓
Comparison
      ↓
Affiliate CTA
      ↓
Partner
```

SEO must therefore optimize for **qualified users**, not meaningless pageviews.

---

# CRITICAL RULE

Do NOT promise or attempt to "guarantee #1 Google ranking."

No legitimate SEO implementation can guarantee a particular ranking.

Instead optimize the website to maximize:

```text
crawlability
indexability
search relevance
content usefulness
topical authority
internal discoverability
SERP presentation
CTR opportunity
page performance
Core Web Vitals
trust
structured understanding
content freshness
technical correctness
```

Follow current **Google Search Central / Google Search Essentials** guidance.

Do NOT implement:

```text
keyword stuffing
hidden SEO text
doorway pages
cloaking
link schemes
mass low-quality AI pages
duplicate programmatic pages
fake reviews
fake ratings
fake authors
fake dates
fake freshness
fake structured data
schema markup for information not visible on the page
```

SEO must be sustainable and policy-compliant.

---

# 1. AUDIT THE EXISTING PROJECT FIRST

Before changing anything, deeply inspect the current project.

Specifically inspect:

```text
package.json
next.config.*
src/app/
src/components/
src/lib/
prisma/schema.prisma
middleware
robots.ts
sitemap.ts if present
layout.tsx
page.tsx
all dynamic routes
article/content models
provider models
news models
SEO fields
Admin CMS
authentication
existing metadata
JSON-LD
canonical implementation
image handling
fonts
analytics
```

The project already contains routes around:

```text
/
/crypto
/crypto/[slug]
/crypto/guides
/crypto/guides/[slug]
/crypto/exchanges
/crypto/exchanges/[slug]
/compare
/compare/[slug]
/news
/news/[slug]
/methodology
/admin
```

Do NOT replace these blindly.

Determine how to make the existing architecture SEO-native.

---

# 2. BUILD A CENTRAL SEO ENGINE

I do NOT want SEO logic duplicated manually in every page.

Create a reusable centralized SEO architecture.

For example:

```text
src/lib/seo/
```

Potential modules:

```text
config.ts
metadata.ts
canonical.ts
robots.ts
schema.ts
breadcrumbs.ts
sitemap.ts
keywords.ts
content.ts
internal-links.ts
social.ts
validation.ts
types.ts
```

The exact structure should follow the existing project conventions.

The goal is:

```text
Database / page data
       ↓
SEO engine
       ↓
Next.js Metadata
       ↓
Canonical
       ↓
Open Graph
       ↓
Twitter metadata
       ↓
Robots
       ↓
Structured Data
       ↓
Sitemap
```

Do not scatter SEO implementation throughout unrelated UI components.

---

# 3. GLOBAL SEO CONFIGURATION

Create a centralized site SEO configuration.

Conceptually:

```ts
export const siteConfig = {
  name: "...",
  domain: "...",
  description: "...",
  locale: "en_AU",
  language: "en-AU",
  country: "AU"
}
```

It should support:

```text
site name
production URL
default title
title template
default description
default social image
locale
language
country
publisher
social profiles
robots defaults
```

Use environment configuration for production URLs where appropriate.

Do not hard-code development domains into canonical URLs.

---

# 4. DYNAMIC NEXT.JS METADATA

Use the current Next.js App Router Metadata API correctly.

Implement dynamic metadata using:

```ts
generateMetadata()
```

where appropriate.

Every important indexable page should have unique:

```text
<title>
meta description
canonical URL
Open Graph title
Open Graph description
Open Graph URL
Open Graph image
Twitter metadata
robots directives
```

Metadata should come dynamically from the page's actual data.

For example:

```text
Article
→ article SEO fields

Provider
→ provider data

Crypto
→ crypto data

News
→ news data

Comparison
→ comparison participants
```

Do not use one generic metadata object for the entire website.

---

# 5. TITLE ENGINE

Create reusable title-generation logic.

Titles should be:

```text
descriptive
natural
page-specific
search-intent aligned
brand-aware
not keyword stuffed
```

Examples:

```text
Bitcoin (BTC): Guide, Risks & How It Works | Brand

How to Buy Bitcoin in Australia: Step-by-Step Guide | Brand

Kraken Australia Review: Fees, Features & Comparison | Brand

Kraken vs Coinbase Australia: Fees & Features Compared | Brand

Crypto Exchanges in Australia: Compare Platforms | Brand
```

These are examples only.

Do not hard-code these exact titles if the content/data does not support them.

Allow Admin SEO overrides.

Logic could be:

```text
custom SEO title exists
       ↓ yes
use it

       ↓ no

generate safe page-type default
```

---

# 6. META DESCRIPTION ENGINE

Implement the same override/fallback model for descriptions.

Descriptions should:

```text
accurately describe the page
match search intent
encourage qualified clicks
avoid misleading claims
avoid keyword stuffing
avoid duplicated descriptions where practical
```

Admin should be able to provide:

```text
seoTitle
seoDescription
```

Otherwise generate sensible defaults from structured page data.

---

# 7. CANONICAL URL ENGINE

Build a reliable canonical URL system.

Every indexable page should have a consistent canonical URL.

Handle:

```text
www vs non-www
HTTP vs HTTPS
trailing slash strategy
query parameters
tracking parameters
pagination
filter URLs
sorting URLs
duplicate comparison URLs
duplicate article URLs
```

Example:

```text
/compare/kraken-vs-coinbase
```

should not accidentally compete with:

```text
/compare/coinbase-vs-kraken
```

unless there is an intentional SEO reason for both.

Choose one canonical ordering strategy.

Do not canonicalize unrelated content together.

---

# 8. INDEXATION ENGINE

Create clear rules for:

```text
index,follow
noindex,follow
noindex,nofollow
```

Pages normally suitable for indexing:

```text
homepage
crypto hubs
crypto detail pages
high-quality guides
provider profiles
useful comparison pages
news articles
methodology/editorial pages
```

Pages that generally should NOT appear in Google:

```text
/admin/**
login/account pages
preview pages
draft articles
internal search results where low value
affiliate redirect URLs
/go/**
temporary/private pages
duplicate parameter pages
```

Do not use `robots.txt` as the only protection for sensitive Admin content.

Admin must still require authentication/authorization.

---

# 9. DYNAMIC XML SITEMAP

Build a dynamic sitemap using the existing Next.js architecture.

Include all eligible published canonical URLs.

Potential sources:

```text
static pages
published articles
published guides
crypto pages
provider profiles
comparison pages
published news
methodology pages
```

Each sitemap entry should use meaningful information where available:

```text
url
lastModified
```

Use priority/changeFrequency only if there is a defensible reason; do not treat them as ranking tricks.

Do NOT include:

```text
admin
draft
preview
affiliate redirects
noindex pages
broken pages
duplicate URLs
```

If the site eventually grows large enough, design the architecture to support sitemap indexes and segmented sitemaps such as:

```text
sitemap-pages.xml
sitemap-articles.xml
sitemap-crypto.xml
sitemap-providers.xml
sitemap-news.xml
```

Do not prematurely complicate the MVP if one sitemap is sufficient.

---

# 10. ROBOTS.TXT

Audit the existing:

```text
src/app/robots.ts
```

Then implement production-safe rules.

Allow search engines to crawl public SEO content.

Prevent unnecessary crawling of areas such as:

```text
/admin/
internal/private routes
affiliate redirect routes where appropriate
```

Reference the production sitemap.

Do not accidentally block:

```text
CSS
JavaScript
images
important public pages
```

---

# 11. STRUCTURED DATA ENGINE

Create reusable JSON-LD generation.

Potential components/functions:

```text
OrganizationSchema
WebSiteSchema
BreadcrumbSchema
ArticleSchema
NewsArticleSchema
PersonSchema
```

Only use structured-data types that accurately represent visible page content and current Google-supported use cases.

Do not assume every schema.org type produces a Google rich result.

Do not create:

```text
fake Review
fake AggregateRating
fake Product
fake author
fake FAQ
fake rating
fake price
```

just to obtain richer search results.

Structured data must correspond to real visible information.

---

# 12. ORGANIZATION / WEBSITE SCHEMA

Where appropriate, define site-level identity using legitimate data.

Potential information:

```text
name
url
logo
sameAs
```

Do not invent corporate details or social accounts.

Use `WebSite` where appropriate.

---

# 13. ARTICLE STRUCTURED DATA

Educational articles/guides should use appropriate Article structured data when eligible.

Use real:

```text
headline
description
image
author
datePublished
dateModified
publisher
canonical URL
```

Never change `dateModified` merely to make content appear fresh.

Only update it when meaningful content changes.

---

# 14. NEWS STRUCTURED DATA

For legitimate news content use appropriate:

```text
NewsArticle
```

information.

Again, only when the content actually qualifies.

Use real publication/update dates.

---

# 15. BREADCRUMBS

Implement visible breadcrumbs plus appropriate `BreadcrumbList` structured data.

Examples:

```text
Home
› Crypto
› Bitcoin
```

```text
Home
› Crypto
› Exchanges
› Kraken
```

```text
Home
› Compare
› Kraken vs Coinbase
```

Breadcrumbs should reflect real site hierarchy.

Create them from a centralized system where practical.

---

# 16. INTERNAL LINKING ENGINE

This is extremely important.

Create a scalable internal-linking system based on actual relationships.

Examples:

```text
Article
  ↓
relatedCrypto
relatedProviders
relatedArticles
relatedComparisons
relatedNews
```

Provider:

```text
relatedGuides
relatedNews
relatedComparisons
```

Crypto:

```text
relatedGuides
relatedNews
relatedProviders
relatedCrypto
```

Comparison:

```text
provider profiles
related guides
alternative comparisons
```

Internal links should help both:

```text
users discover useful information
+
search engines understand site structure
```

Use descriptive anchor text.

Avoid:

```text
click here
read more
here
```

when a meaningful descriptive anchor can be used.

---

# 17. TOPICAL AUTHORITY ARCHITECTURE

Design SEO around topic clusters.

Example:

```text
                    CRYPTO
                       │
       ┌───────────────┼────────────────┐
       │               │                │
    Bitcoin         Ethereum        Exchanges
       │               │                │
    Guides           Guides         Providers
       │               │                │
       └───────────────┼────────────────┘
                       │
                    Compare
```

Example Bitcoin cluster:

```text
/crypto/bitcoin

/crypto/guides/what-is-bitcoin
/crypto/guides/how-to-buy-bitcoin-australia
/crypto/guides/how-bitcoin-works
/crypto/guides/bitcoin-wallets
/crypto/guides/bitcoin-fees
```

These pages should internally support one another.

Do NOT create pages merely because a keyword exists.

Every indexable page should have a useful purpose.

---

# 18. SEARCH-INTENT ARCHITECTURE

Classify content by intent.

## Informational

Examples:

```text
what is bitcoin
how does crypto work
what is ethereum
crypto wallet explained
```

Goal:

```text
education
```

## Commercial Investigation

Examples:

```text
best crypto exchanges Australia
crypto exchange fees Australia
Kraken vs Coinbase
CoinSpot vs Swyftx
```

Goal:

```text
comparison
```

## Provider / Navigational

Examples:

```text
Kraken Australia
CoinSpot fees
Swyftx review
```

Goal:

```text
provider research
```

## Fresh / News

Examples:

```text
Bitcoin news
crypto regulation Australia
exchange news
```

Goal:

```text
current information
```

Page templates should match the user's search intent.

---

# 19. CONTENT QUALITY ENGINE

Because this is a financial/crypto information site, content quality and trust are especially important.

Articles should support:

```text
author
reviewer where appropriate
datePublished
dateModified
sources
related providers
related crypto
category
tags
content status
review status
```

Display useful trust information to users.

Do not create fake credentials.

---

# 20. SOURCE / EVIDENCE SYSTEM

Provider/comparison information should support source provenance.

Prefer:

```text
regulator
government
official provider documentation
official fee schedules
official product documentation
high-quality secondary sources
```

Important provider facts should support:

```text
source URL
verifiedAt
verificationStatus
```

If something cannot be verified:

```text
Unknown
Not verified
Variable
```

is better than guessing.

This improves both trust and maintainability.

---

# 21. CONTENT FRESHNESS ENGINE

Build legitimate freshness tracking.

Support:

```text
publishedAt
updatedAt
lastReviewedAt
nextReviewAt
provider verifiedAt
```

Potential Admin warnings:

```text
Article has not been reviewed in 12 months
Provider fees need verification
Source link is outdated
Comparison contains stale provider data
```

Do NOT automatically change visible "updated" dates without meaningful review.

---

# 22. ADMIN SEO CONTROLS

Extend the existing Admin CMS so editors can control SEO without editing source code.

For articles/news/providers where appropriate support:

```text
SEO title
SEO description
slug
canonical override
social title
social description
social image
index/noindex
```

Prefer sensible defaults.

Editors should normally need to change only:

```text
SEO title
SEO description
social image
```

Advanced options should not clutter the normal workflow.

---

# 23. ADMIN SEO SCORE / CHECKLIST

Create an editorial SEO checklist.

Do NOT pretend this score predicts Google rankings.

Call it something like:

```text
SEO Readiness
```

rather than:

```text
Google Ranking Score
```

Potential checks:

```text
title exists
title length reasonable
description exists
H1 exists
slug valid
canonical valid
featured image exists
image alt text exists
article has sources
article has internal links
article has related content
article has author
article has publication date
structured data valid
indexing allowed
```

Example:

```text
SEO Readiness

✓ SEO title
✓ Meta description
✓ Canonical
✓ Featured image
✓ Article schema
✓ Breadcrumbs
⚠ No related provider
⚠ Only one internal link
```

This is an editorial tool, not a ranking guarantee.

---

# 24. DYNAMIC SOCIAL PREVIEWS

Implement:

```text
Open Graph
Twitter/X metadata
```

for major page types.

Where practical, prepare dynamic Open Graph image generation using Next.js.

Example OG image:

```text
┌──────────────────────────────────────┐
│ BRAND                                │
│                                      │
│ How to Buy Bitcoin                   │
│ in Australia                         │
│                                      │
│ Crypto Guide                         │
└──────────────────────────────────────┘
```

Do not add expensive runtime generation if a simpler reliable implementation is better for the current architecture.

---

# 25. IMAGE SEO

Audit images.

Use:

```text
next/image
descriptive alt text
correct dimensions
responsive sizes
modern image formats
lazy loading where appropriate
```

Do not keyword-stuff alt attributes.

Alt text should describe the image's useful meaning.

---

# 26. PERFORMANCE / CORE WEB VITALS

Technical SEO includes performance.

Audit:

```text
LCP
INP
CLS
TTFB
JavaScript bundle size
image size
font loading
hydration
third-party scripts
layout shifts
```

Prefer:

```text
React Server Components
static rendering
ISR
minimal client JS
next/image
next/font
code splitting
lazy loading
efficient database queries
```

Do not sacrifice UX to chase synthetic performance scores.

---

# 27. MOBILE-FIRST SEO

The website must work exceptionally well on mobile.

Test:

```text
375
390
430
768
1024
1280
1440+
```

Check:

```text
navigation
tables
comparison
images
font sizes
buttons
breadcrumbs
article content
provider pages
affiliate CTAs
```

Avoid horizontal page overflow.

---

# 28. URL ARCHITECTURE

Keep URLs:

```text
short
descriptive
stable
lowercase
human-readable
```

Examples:

```text
/crypto/bitcoin

/crypto/guides/how-to-buy-bitcoin-australia

/crypto/exchanges/kraken

/compare/kraken-vs-coinbase

/news/bitcoin-...
```

Avoid:

```text
?id=4838
/post-1828
random UUIDs in public URLs
```

Do not unnecessarily change URLs that are already indexed.

If changing an existing URL is necessary, implement appropriate redirects.

---

# 29. PAGINATION / FILTER SEO

If provider/news/content lists gain:

```text
pagination
filters
sorting
```

define clear indexation/canonical rules.

Avoid accidentally creating unlimited crawlable combinations such as:

```text
?sort=
?filter=
?page=
?fee=
?asset=
?country=
```

Do not allow faceted navigation to create an uncontrolled indexation explosion.

---

# 30. 404 / REDIRECT STRATEGY

Audit:

```text
404
notFound()
redirect()
permanentRedirect()
```

Dynamic pages for nonexistent entities should return genuine 404 responses.

Do not return:

```text
200 OK + "Provider not found"
```

for nonexistent indexable entities.

Avoid redirect chains.

---

# 31. SEARCH CONSOLE READINESS

Prepare the site for Google Search Console.

The implementation should make it straightforward to:

```text
verify domain
submit sitemap
inspect URLs
monitor indexing
monitor Core Web Vitals
monitor rich-result errors
monitor search queries
monitor impressions
monitor clicks
monitor CTR
monitor average position
```

Do not attempt to fake Search Console metrics.

---

# 32. SEO ANALYTICS MODEL

Prepare analytics so we can eventually measure SEO performance by landing page.

We should be able to correlate:

```text
organic landing page
page type
provider viewed
comparison started
affiliate click
```

Potential funnel:

```text
organic session
    ↓
article
    ↓
provider
    ↓
comparison
    ↓
affiliate click
```

Do not mix Search Console rankings with first-party analytics incorrectly.

---

# 33. SEO DATABASE SUPPORT

Review the existing Prisma schema.

Where useful, prepare structured SEO fields such as:

```text
seoTitle
seoDescription
canonicalUrl
robotsIndex
socialTitle
socialDescription
socialImage
publishedAt
updatedAt
lastReviewedAt
```

Do NOT add the same SEO columns to every model if a reusable architecture would be cleaner.

Propose the best model first.

Do not perform destructive migrations without explaining them.

---

# 34. PROGRAMMATIC SEO — STRICT RULE

I want the architecture to support scale, but NOT low-quality mass-generated pages.

A programmatic page may exist only when:

```text
it satisfies real search intent
+
contains meaningful unique information
+
has sufficient verified data
+
is useful without Google
```

Do NOT generate combinations such as:

```text
100 coins
×
50 providers
×
20 countries
×
10 intents
```

merely to create thousands of URLs.

If data is insufficient, the page should not be indexed or should not exist.

---

# 35. COMPARISON SEO

Comparison pages are commercially important.

Examples:

```text
Kraken vs Coinbase
CoinSpot vs Swyftx
```

Each comparison should contain genuinely useful information:

```text
overview
key differences
fees
features
AUD support
supported assets
security information
regulatory information
advantages
limitations
sources
last verified date
```

Avoid thin pages where only provider names change.

Comparison data should come from the Provider domain.

Affiliate commission must not change editorial conclusions.

---

# 36. PROVIDER SEO

Provider pages should be substantial research pages.

Potential sections:

```text
Overview
Fees
Features
Products
AUD support
Deposit methods
Withdrawal methods
Security
Regulation
Mobile app
Trading tools
Sources
Last verified
Related guides
Related comparisons
Related news
```

Do not create an indexable provider page if the database has almost no useful information.

---

# 37. CRYPTO ENTITY SEO

Crypto pages should act as hubs.

Example:

```text
/crypto/bitcoin
```

could connect:

```text
Bitcoin explanation
Bitcoin guides
Bitcoin news
Bitcoin exchange information
related crypto
relevant comparisons
```

Do not simply display a price widget.

---

# 38. NEWS SEO

News should use:

```text
clear publication dates
real authorship
meaningful updates
canonical URLs
NewsArticle where appropriate
internal links
related entities
```

Do not rewrite third-party news with minimal added value.

Original reporting, explanation, synthesis or useful context should be prioritized.

---

# 39. AUSTRALIAN SEO STRATEGY

The initial target market is Australia.

Use natural Australian relevance where content genuinely differs:

```text
AUD deposits
Australian availability
Australian regulatory context
Australian exchanges
Australian tax/general-information context
local terminology
```

Do not add "Australia" to every page merely for SEO.

Create Australia-specific pages when the content is genuinely Australia-specific.

Prepare architecture for international expansion later.

If future regional URLs are introduced, evaluate:

```text
hreflang
regional canonicals
duplicate-content implications
```

before implementation.

---

# 40. E-E-A-T / TRUST SIGNALS

Do not treat E-E-A-T as a meta tag or simple ranking switch.

Instead improve real trust signals through:

```text
transparent authorship
source citations
editorial policy
methodology
affiliate disclosure
corrections policy
review dates
provider verification
company/about information
clear contact information where available
```

Never fabricate expertise or credentials.

---

# 41. AFFILIATE SEO SAFETY

Affiliate monetisation must not degrade content quality.

Use affiliate links contextually.

Use appropriate sponsored attributes where required.

Keep:

```text
editorial ranking
```

separate from:

```text
affiliate commission
```

Do not automatically rank the highest-paying provider first.

---

# 42. CONTENT DUPLICATION

Detect/prevent duplication between:

```text
articles
guides
crypto pages
provider profiles
comparison pages
news
```

For example, do not create:

```text
/crypto/guides/kraken-review
```

and:

```text
/crypto/exchanges/kraken
```

with nearly identical content unless they serve genuinely different intent.

Define which page owns which search intent.

---

# 43. CONTENT CANNIBALIZATION

Create rules to reduce pages competing against each other for the same intent.

Example:

```text
/crypto/exchanges
```

owns:

```text
crypto exchanges
crypto exchanges Australia
```

while:

```text
/compare/crypto-exchanges
```

could own stronger comparison intent.

Document the intent map.

---

# 44. SEO CONTENT BRIEFS

Prepare a reusable content brief structure for Admin/editorial workflows.

For each planned article:

```text
Primary topic
Search intent
Target audience
Primary question
Supporting questions
Related entities
Internal links
Related provider pages
Related comparison pages
Sources required
Content freshness requirements
```

Do not turn this into keyword-density optimization.

---

# 45. AUTOMATED SEO VALIDATION

Where practical, create automated tests/checks for:

```text
missing title
missing description
invalid canonical
duplicate canonical
indexable page without H1
broken structured data generation
draft marked indexable
affiliate redirect accidentally indexable
admin accidentally indexable
invalid sitemap entries
```

Prefer deterministic tests over arbitrary "SEO score" formulas.

---

# 46. BUILD-TIME SEO AUDIT

Create an internal script if appropriate:

```bash
npm run seo:audit
```

Potential checks:

```text
route metadata
canonical configuration
robots
sitemap
structured data generation
missing SEO fields
broken internal links where detectable
duplicate slugs
```

Only implement this if it can be maintained cleanly.

---

# 47. SEO ADMIN DASHBOARD — FUTURE READY

Prepare for an Admin SEO overview.

Potential route:

```text
/admin/seo
```

This does not have to be a top-level MVP navigation item immediately.

Potential metrics/checks:

```text
Published pages
Indexable pages
Noindex pages
Missing SEO titles
Missing descriptions
Missing featured images
Articles needing review
Provider data needing verification
Broken internal links
Stale content
```

Later, Search Console data may be integrated through an official API if configured.

Do not fabricate external SEO metrics.

---

# 48. DO NOT OVER-ENGINEER

This project is still growing.

Implement the highest-value SEO foundation first.

Do not introduce:

```text
Elasticsearch
complex SEO microservices
huge third-party SEO libraries
AI content generation pipelines
enterprise crawling infrastructure
```

unless there is a demonstrated requirement.

Prefer native Next.js capabilities.

---

# 49. IMPLEMENTATION PHASES

## PHASE 0 — SEO AUDIT

Do not modify code yet.

Inspect the entire project and return:

```text
Current SEO architecture
Current metadata
Current robots
Current sitemap
Current structured data
Current URL architecture
Current internal linking
Current content models
Current provider models
Current Admin SEO controls
Current performance risks
Current indexation risks
Current duplicate-content risks
```

Then classify findings:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

STOP.

---

## PHASE 1 — SEO FOUNDATION

After I say:

```text
IMPLEMENT SEO PHASE 1
```

implement:

```text
central SEO configuration
metadata helpers
dynamic metadata
canonical engine
robots
dynamic sitemap
basic JSON-LD framework
breadcrumbs
indexation rules
```

Then run:

```text
lint
typecheck
tests
build
```

Fix errors.

STOP.

---

## PHASE 2 — PAGE-TYPE SEO

Implement SEO for:

```text
Homepage
Crypto
Crypto detail
Guides
Provider profiles
Compare
Comparison detail
News
News article
Methodology
```

Add appropriate structured data.

STOP.

---

## PHASE 3 — INTERNAL LINKING + TOPICAL AUTHORITY

Implement:

```text
related articles
related crypto
related providers
related comparisons
breadcrumbs
topic hubs
descriptive anchor strategy
```

STOP.

---

## PHASE 4 — ADMIN SEO

Implement:

```text
SEO title
description
slug
canonical controls
social metadata
index/noindex
SEO readiness checklist
preview
```

STOP.

---

## PHASE 5 — PERFORMANCE SEO

Audit and optimize:

```text
Core Web Vitals
images
fonts
JavaScript
Server Components
rendering strategy
database queries
layout shifts
```

STOP.

---

## PHASE 6 — ADVANCED SEO QUALITY

Implement:

```text
content freshness
staleness warnings
source verification
content cannibalization checks
duplicate slug checks
SEO audit tooling
```

STOP.

---

## PHASE 7 — SEARCH CONSOLE / PRODUCTION READINESS

Prepare:

```text
Search Console verification
sitemap submission
URL Inspection workflow
Rich Results validation
production crawl checklist
analytics events
```

Do not claim integration with external APIs unless credentials/configuration actually exist.

---

# 50. FIRST RESPONSE REQUIRED FROM YOU

Before changing code, return exactly these sections:

## A. Current SEO Audit

Analyse the existing project.

## B. Google Search Compliance Risks

Identify anything potentially harmful.

## C. Technical SEO Problems

Rank:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

## D. Existing Route SEO Map

List every important public route and its intended search intent.

## E. Proposed SEO Architecture

Show the proposed:

```text
src/lib/seo/
```

architecture.

## F. Metadata Strategy

Explain static vs dynamic metadata.

## G. Canonical Strategy

Explain canonical rules.

## H. Indexation Strategy

Explain index/noindex rules.

## I. Sitemap Strategy

Explain dynamic sitemap architecture.

## J. Structured Data Strategy

Show which schema types belong to which page types.

## K. Internal Linking Strategy

Explain the topic graph.

## L. Content Cluster Strategy

Show the initial Australian crypto topical map.

## M. Provider SEO Strategy

Explain provider-page search intent.

## N. Comparison SEO Strategy

Explain comparison-page search intent.

## O. News SEO Strategy

Explain freshness and NewsArticle handling.

## P. Admin SEO Controls

Explain what editors need.

## Q. Core Web Vitals Strategy

Identify likely improvements.

## R. SEO Measurement Strategy

Explain:

```text
Search Console
analytics
organic landing pages
affiliate funnel
```

## S. Database Changes

List Prisma changes if required.

## T. Exact Phase 1 File Plan

List:

```text
CREATE
MODIFY
DELETE
```

with the reason for every file.

---

# 51. STOP RULE

After returning the audit and proposed architecture:

**STOP.**

Do not modify files.

Wait for:

```text
IMPLEMENT SEO PHASE 1
```

After each phase:

1. implement only the approved scope
2. run lint
3. run TypeScript checks
4. run tests
5. run production build
6. fix errors caused by your work
7. list changed files
8. explain how to verify
9. explain SEO behaviour
10. STOP

---

# 52. FINAL PRINCIPLE

Build the SEO system around this philosophy:

```text
Search demand
      ↓
Useful page
      ↓
Clear search intent
      ↓
Excellent content
      ↓
Strong technical SEO
      ↓
Clear site architecture
      ↓
Internal links
      ↓
Google discovers page
      ↓
Google understands page
      ↓
User chooses result
      ↓
Useful experience
      ↓
Trust
      ↓
More discovery / comparison
      ↓
Affiliate conversion
```

Do not optimize merely for crawlers.

Optimize for:

> **People first, search engines clearly, and business conversion contextually.**

The objective is to build the strongest technically sound SEO foundation possible for a serious Australian crypto education and comparison platform, while complying with Google Search guidelines and avoiding manipulative shortcuts.
