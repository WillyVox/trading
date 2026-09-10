# ROLE

Act as a Senior Next.js Architect, Technical SEO Engineer, UX/UI Designer, Content Platform Architect, Affiliate Product Engineer, Prisma/PostgreSQL Engineer, and Australian crypto-information product specialist.

I want you to audit and then build a production-quality **crypto Guide Article system** in my existing Next.js project.

The Guide system is a core acquisition and monetisation channel.

The user journey should be:

```text
Google / Search
    ↓
Guide article
    ↓
Useful answer
    ↓
Related guides / deeper learning
    ↓
Relevant provider / exchange discovery
    ↓
Comparison
    ↓
Optional affiliate CTA
    ↓
Partner website
```

The page must prioritize usefulness and editorial trust first.

Affiliate monetisation should be contextual and secondary.

---

# 1. AUDIT BEFORE CODING

First inspect the existing codebase, especially:

```text
src/app/
src/components/
src/lib/
prisma/schema.prisma
article models
ArticleProvider relationships
Provider models
AffiliatePartnership
AffiliateProgram
AffiliateLink
AffiliatePlacement
AffiliateClick
existing SEO utilities
generateMetadata()
robots.ts
sitemap.ts
authentication/admin
```

Reuse existing architecture.

Do not create duplicate Article, Provider or Affiliate concepts.

IMPORTANT:

```text
Article domain
Provider domain
Affiliate domain
```

must remain separate.

An article may reference a provider without that provider being an affiliate partner.

A provider may exist with no affiliate agreement.

An affiliate placement must represent a real commercial placement, not merely a normal provider mention.

---

# 2. GUIDE URL ARCHITECTURE

Audit whether the project currently uses:

```text
/crypto/guides/[slug]
```

If yes, preserve it unless there is a strong SEO or architecture reason to change it.

Example:

```text
/crypto/guides/how-to-trade-crypto
/crypto/guides/how-to-buy-bitcoin-australia
/crypto/guides/how-to-open-a-crypto-exchange-account
/crypto/guides/binance-trading-guide
/crypto/guides/crypto-trading-fees-explained
```

URLs must be:

```text
short
lowercase
stable
human-readable
descriptive
```

Do not add dates unless the URL genuinely needs them.

---

# 3. GUIDE PAGE LAYOUT

Build a reusable Guide page template.

A high-quality guide page should support:

## Breadcrumb

Example:

```text
Home > Crypto > Guides > How to Trade Crypto
```

Use visible breadcrumbs and valid BreadcrumbList structured data where appropriate.

## Article header

Include:

```text
category
H1
short summary / standfirst
author
reviewer if applicable
date published
last meaningful update
estimated reading time if calculated reliably
```

Do not fake authors or credentials.

## Key takeaways

A short high-value summary near the top:

```text
Key takeaways
• ...
• ...
• ...
```

Do not make this generic.

## Table of contents

Automatically generated from H2/H3 headings.

Desktop:
optionally sticky if good UX.

Mobile:
collapsible.

Use anchor links.

## Main article

Readable editorial width.

Support:

```text
H2
H3
paragraphs
lists
tables
callouts
examples
images
source citations
provider references
warnings
```

Avoid giant text walls.

---

# 4. ARTICLE CONTENT MODEL

Audit the current Article model.

Recommend additions only where necessary.

An article should conceptually support:

```text
title
slug
excerpt
content
status
category
tags

seoTitle
seoDescription
canonicalUrl
socialImage

author
reviewer

publishedAt
updatedAt
lastReviewedAt

sources

relatedArticles
relatedProviders
relatedCrypto

country / region applicability

affiliateDisclosureRequired
```

Do not create duplicate fields if equivalent fields already exist.

---

# 5. DYNAMIC SEO

Each Guide page must use Next.js Metadata API correctly.

Use:

```ts
generateMetadata()
```

from actual article data.

Support:

```text
SEO title
meta description
canonical
Open Graph
Twitter/X metadata
robots
```

Fallback system:

```text
manual seoTitle
    ↓
otherwise generated title from article data

manual seoDescription
    ↓
otherwise generated description from article excerpt
```

Never keyword-stuff.

---

# 6. STRUCTURED DATA

For legitimate guide articles add appropriate:

```text
Article
or
BlogPosting
```

JSON-LD.

Use real:

```text
headline
description
author
datePublished
dateModified
image
publisher
mainEntityOfPage
```

Also use:

```text
BreadcrumbList
```

where applicable.

Do not fabricate:

```text
ratings
reviews
FAQ schema
prices
authors
```

Do not add schema purely because it exists in schema.org.

Use only types applicable to the visible content and current Google guidance.

---

# 7. REGIONAL SEO ARCHITECTURE

This is extremely important.

The project starts with Australia but should be able to expand.

DO NOT automatically create duplicate pages such as:

```text
/au/how-to-trade-crypto
/us/how-to-trade-crypto
/uk/how-to-trade-crypto
```

if the article body is essentially identical.

A regional version should exist only when the content meaningfully differs.

Examples of meaningful Australian differences:

```text
AUD deposits
Australian provider availability
local payment methods
Australian regulatory context
Australian terminology
local tax/general-information references
local consumer considerations
provider availability
```

Design a country-aware system.

Conceptual model:

```text
Article
 ├── Global
 └── RegionalVariant
       ├── AU
       ├── UK
       ├── US
       ├── NZ
       └── SG
```

But choose the simplest schema suitable for the project.

When legitimate regional variants exist:

```text
self canonical
hreflang
x-default where appropriate
regional internal links
```

must be correct.

Do not dynamically change page text based only on IP in a way that gives search crawlers inconsistent content.

Prefer stable crawlable regional URLs.

---

# 8. SEARCH INTENT

Every article should declare a primary intent.

Potential values:

```text
LEARN
HOW_TO
BEGINNER
COMPARISON
PROVIDER_GUIDE
FEES
SECURITY
WALLET
REGULATION
MARKET_EDUCATION
```

This can be implementation metadata or editorial metadata.

The template should change CTA and related recommendations based on context.

---

# 9. RELATED GUIDES ENGINE

At the end of every article show:

```text
Related Guides
```

Do not randomly pick articles.

Use relevance signals such as:

```text
category
tags
crypto assets
providers referenced
search intent
topic cluster
country
content relationships
```

Potential priority:

```text
manually curated related articles
    ↓
semantic/topic relationships
    ↓
same category
    ↓
same tags
    ↓
recent useful content
```

Avoid showing the current article.

Avoid duplicates.

Show perhaps 3–6 highly relevant guides.

Example:

```text
How to Trade Crypto
    ↓
Crypto Trading Fees Explained
Market vs Limit Orders
How Crypto Exchanges Work
How to Manage Trading Risk
How to Choose a Crypto Exchange
```

---

# 10. “NEXT STEP” LEARNING SECTION

Consider adding a structured learning path.

Example:

```text
New to crypto?

1. What is cryptocurrency?
2. How crypto exchanges work
3. How to open an exchange account
4. How to buy your first crypto
5. Understanding trading fees
```

This should be dynamically generated where possible.

It can significantly improve user exploration.

---

# 11. PROVIDER RECOMMENDATION / DISCOVERY SECTION

Guide pages can show contextually related providers.

Example:

Article:

```text
How to Buy Bitcoin in Australia
```

could show:

```text
Explore crypto exchanges available to Australian users
```

Providers should come from the Provider domain.

Do NOT label a provider:

```text
Best
Recommended for you
Safest
Guaranteed
```

unless there is an explicit defensible editorial methodology supporting that statement.

Safer labels:

```text
Providers mentioned in this guide
Explore exchanges
Platforms related to this guide
Compare relevant exchanges
```

---

# 12. AFFILIATE PARTNER SECTION

At or near the end of the guide add a contextual:

```text
Explore Relevant Platforms
```

or similar section.

IMPORTANT:

Only show an affiliate CTA when:

```text
Provider exists
AND
AffiliatePartnership is ACTIVE
AND
AffiliateLink is ACTIVE
AND
destination URL is approved
```

Otherwise show either:

```text
normal provider profile link
```

or nothing.

Do NOT fabricate affiliate partnerships.

---

# 13. AFFILIATE PLACEMENT LOGIC

Affiliate placements should be selected based on article context.

Potential data:

```text
articleId
providerId
affiliateLinkId
placementType
position
campaign
isActive
```

Examples:

```text
ARTICLE_INLINE
ARTICLE_AFTER_SECTION
ARTICLE_FOOTER
RELATED_PROVIDER
```

Avoid excessive affiliate CTAs.

Suggested page flow:

```text
Article
    ↓
Related Guides
    ↓
Compare Relevant Platforms
    ↓
Affiliate disclosure
    ↓
Partner CTAs
```

Or place one subtle contextual CTA within a relevant section.

---

# 14. AFFILIATE DISCLOSURE

If affiliate links are present, render a clear reusable disclosure.

Example concept:

```text
Some links on this page are affiliate links. We may receive a commission if you use them, at no additional cost to you. Affiliate relationships do not determine our editorial conclusions.
```

Use the project's approved legal wording.

Do not claim “no additional cost” unless that is valid for the relevant programs.

Use appropriate sponsored link attributes where necessary.

---

# 15. INTERNAL AFFILIATE REDIRECT

Do not place arbitrary raw affiliate links throughout article bodies.

Use the project's affiliate redirect architecture, such as:

```text
/go/[partnerSlug]
```

Flow:

```text
CTA
 ↓
server
 ↓
validate active AffiliateLink
 ↓
record click
 ↓
safe redirect
```

Do not support:

```text
/go?url=https://anything.com
```

Avoid open redirects.

---

# 16. GUIDE CTA STRATEGY

CTA should match article intent.

Examples:

“How to choose a crypto exchange”

```text
Compare Crypto Exchanges
```

“Binance trading guide”

```text
View Binance Profile
Compare Binance with Alternatives
Visit Binance
```

Only show “Visit Binance” as an affiliate CTA if the active commercial relationship exists.

“Crypto trading fees”

```text
Compare Exchange Fees
```

This makes monetisation contextual rather than intrusive.

---

# 17. ARTICLE SIDEBAR

Desktop only where appropriate:

```text
Table of contents
Article details
Related guide
Compare exchanges CTA
```

Do not create an ad-heavy visual layout.

Reading should remain the primary experience.

---

# 18. ARTICLE SOURCES

Provide a Sources / References section where appropriate.

Use sources such as:

```text
official exchange documentation
regulators
government sources
official fee pages
official help centres
official technical docs
high-quality research
```

External source links must be clearly distinguishable from affiliate CTAs.

---

# 19. SEO INTERNAL LINKS

Automatically suggest internal links from article content when possible.

For example:

```text
Bitcoin
→ /crypto/bitcoin

crypto exchange
→ /crypto/exchanges

Kraken
→ /crypto/exchanges/kraken

trading fees
→ /crypto/guides/crypto-trading-fees
```

But do not overlink every occurrence.

Use natural descriptive anchors.

---

# 20. MOBILE DESIGN

The article must be excellent at:

```text
375px
390px
430px
768px
```

Pay particular attention to:

```text
tables
code/examples
TOC
CTA cards
provider cards
related guides
headings
line length
```

---

# 21. PERFORMANCE

Prefer:

```text
Server Components
static generation / ISR where appropriate
minimal client JS
next/image
next/font
cached DB queries where appropriate
```

Guide pages are SEO landing pages and should load very quickly.

---

# 22. ARTICLE COMPONENT ARCHITECTURE

Evaluate reusable components such as:

```text
GuideHeader
GuideBreadcrumbs
GuideTableOfContents
GuideContent
KeyTakeaways
GuideSourceList
GuideAuthor
RelatedGuides
RelatedProviders
AffiliateDisclosure
AffiliatePartnerCards
GuideNextSteps
ArticleJsonLd
BreadcrumbJsonLd
```

Follow the existing design system.

---

# 23. INDEXATION QUALITY GATE

Do not automatically index every generated draft.

Suggested lifecycle:

```text
AI-generated draft
    ↓
DRAFT
    ↓
validation
    ↓
research/source verification
    ↓
editorial review
    ↓
SEO review
    ↓
PUBLISHED
    ↓
indexable
```

Draft/review/preview content must be noindex and/or inaccessible publicly as appropriate.

---

# 24. IMPLEMENTATION PHASES

PHASE 0:
Audit only.

Return:

```text
existing Guide architecture
existing Article schema
existing SEO implementation
existing Provider relationships
existing Affiliate architecture
gaps
recommended schema changes
component architecture
route architecture
exact file plan
```

STOP.

Only after I say:

```text
IMPLEMENT GUIDE PHASE 1
```

start implementation.

Then:

```text
lint
typecheck
tests
build
```

Fix errors caused by the changes.

STOP after each implementation phase.

---

# FINAL PRINCIPLE

Build Guide pages for:

```text
Search visibility
+
genuine reader usefulness
+
strong internal discovery
+
provider discovery
+
ethical affiliate monetisation
```

in that order.

The page must remain useful even if every affiliate link is removed.