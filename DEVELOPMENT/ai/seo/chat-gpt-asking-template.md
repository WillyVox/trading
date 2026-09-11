# # ROLE & OBJECTIVE

Act as a combination of:

* senior Australian cryptocurrency researcher;
* financial-content editor;
* SEO strategist;
* affiliate-content strategist;
* factual researcher;
* Australian fintech comparison-platform editor;
* human-quality long-form writer;
* and expert user of this project's existing Article CMS/data model.

You are working inside my existing Australian market intelligence and trading-platform comparison project.

Your task is NOT merely to write a generic SEO blog article.

Your task is to:

1. inspect and understand the latest project code and Article data model;
2. research the strongest cryptocurrency topic opportunity as of **September 2026**;
3. analyse current Australian search intent and competitors;
4. recommend the best topic before writing;
5. explain why it deserves publication;
6. then generate **one complete CMS-ready article** using the exact fields and relationships supported by the current Article model.

Do not modify project code.

Do not create database records yet.

First research, then recommend, then generate the proposed Article data/output for my review.

---

# 1. FIRST STUDY THE PROJECT

Before choosing the topic, inspect the actual current project.

At minimum review:

```text
prisma/schema.prisma

src/lib/articles/
src/lib/articles/actions.ts
src/lib/articles/service.ts
src/lib/articles/validation.ts
src/lib/articles/sanitize.ts

src/components/admin/article/

src/app/admin/articles/
src/app/news/
src/app/crypto/
src/app/compare/

provider/exchange models
crypto asset models
affiliate program/click models
SEO utilities
schema/structured-data utilities
sitemap implementation
```

Find the current exact definitions of:

```text
Article
ArticleType
ArticleStatus
ArticleSource
ArticleTag
ArticleProvider
ArticleCryptoAsset
ArticleRelated
User / author relationship
reviewer relationship
```

Do NOT assume the schema from an earlier version.

The current database model is the source of truth.

---

# 2. CURRENT ARTICLE MODEL — VERIFY THIS AGAINST THE CODE

The Article model currently contains or recently contained concepts including:

```text
id
title
slug
excerpt
content
createdAt
updatedAt

articleType
keyTakeaways
status

author / structured author relation
reviewer / structured reviewer relation

category

seoTitle
seoDescription

featuredImage
featuredImageAlt

affiliateDisclosureRequired
noIndex

publishedAt
scheduledAt
lastReviewedAt

searchIntent

region
canonicalVariant

tags
sources

provider relationships
crypto asset relationships
related articles
```

Statuses include approximately:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

Article types include:

```text
NEWS
GUIDE
```

Verify all of this against the actual latest Prisma schema and validation logic.

If fields have changed, use the current implementation.

Do not invent unsupported fields.

---

# 3. ARTICLE OBJECTIVE

We want a cryptocurrency article that has strong potential to:

* attract Australian organic search traffic;
* remain useful beyond a few days;
* attract people actively researching cryptocurrency;
* help beginners understand an important decision;
* appeal to people considering opening their first crypto account;
* naturally connect to crypto exchanges;
* naturally support exchange comparisons;
* naturally support affiliate/referral links;
* link internally to exchange/provider pages;
* link internally to relevant crypto assets;
* link to related educational articles;
* provide real informational value;
* remain useful even if the reader never clicks an affiliate link.

The content must **not** exist merely to push affiliate links.

---

# 4. TARGET AUDIENCE

Primary audience:

```text
Australians who are:
- new to cryptocurrency;
- learning about Bitcoin/crypto;
- comparing crypto exchanges;
- deciding whether to create a crypto account;
- trying to understand fees;
- trying to understand safety/security;
- trying to understand AUD deposits;
- comparing Australian and global exchanges;
- unsure what matters when choosing an exchange.
```

Secondary audience:

```text
Existing crypto users considering switching exchanges
or opening a second exchange account.
```

Write for an intelligent beginner.

Do not assume professional trading knowledge.

Do not dumb the content down excessively.

---

# 5. RESEARCH CURRENT SEARCH DEMAND — SEPTEMBER 2026

Research current Australian cryptocurrency search behaviour.

Investigate topics such as:

```text
best crypto exchange Australia
best crypto exchanges Australia 2026
crypto exchanges Australia
Australian crypto exchanges
best crypto exchange for beginners Australia
safest crypto exchange Australia
crypto exchange fees Australia
lowest fee crypto exchange Australia
CoinSpot vs Kraken
CoinSpot vs Swyftx
Kraken Australia
CoinSpot Australia
Binance Australia
Coinbase Australia
how to buy Bitcoin Australia
how to buy crypto Australia
where to buy Bitcoin Australia
crypto exchange AUSTRAC
AUSTRAC crypto exchanges
crypto exchange security
crypto exchange fees explained
crypto wallet vs exchange
```

Also explore related and emerging 2026 queries.

Do not limit the analysis to this list.

---

# 6. DO NOT INVENT SEARCH VOLUME

This requirement is critical.

If you have access to actual reliable keyword-volume data from:

```text
Google Keyword Planner
Google Search Console
Ahrefs
Semrush
Moz
or another recognised SEO dataset
```

you may use it and identify the source/date.

If you do NOT have verified keyword-volume data:

DO NOT claim:

```text
"12,000 searches per month"
"this is Australia's most searched crypto keyword"
"keyword difficulty is 42"
```

unless verified.

Instead classify demand using evidence such as:

```text
HIGH inferred commercial demand
HIGH inferred informational demand
MEDIUM inferred competition
etc.
```

and explain why.

Use:

* current Google SERPs;
* Google Trends where useful;
* competitor coverage;
* autocomplete/related questions if available;
* prevalence of recently updated content;
* commercial intent;
* current Australian crypto developments.

Clearly distinguish:

```text
verified data
```

from:

```text
SEO inference.
```

---

# 7. STUDY CURRENT COMPETITORS

Study live Australian competitors, including at minimum:

```text
Finder Australia
Canstar
```

and where useful:

```text
Forbes Advisor Australia
Mozo
CoinSpot educational content
Swyftx Learn
Independent Reserve educational content
BTC Markets content
Kraken Australia resources
Coinbase Australia resources
```

Study what is ranking/published now.

Do not copy their writing.

Determine what topics they repeatedly cover.

Look especially at:

```text
best exchanges
how to buy Bitcoin
how to buy crypto
exchange reviews
exchange fees
exchange safety
exchange comparisons
AUD deposits
beginner guides
wallet/storage guidance
crypto regulation
AUSTRAC
```

---

# 8. COMPETITOR GAP ANALYSIS

For relevant competitors identify:

### What they do well

For example:

```text
comparison tables
methodology
named authors
fact checking
fee explanations
beginner steps
provider cards
pros/cons
sources
affiliate CTA integration
FAQs
```

### What they could explain better

Find opportunities such as:

```text
confusing fee structures
spread vs trading fee
instant-buy vs spot-market fees
Australian regulatory terminology
what AUSTRAC registration actually means
custody risk
deposit/withdrawal considerations
beginner decision checklist
hidden practical costs
```

Our article should add genuine value rather than rewrite Finder or Canstar.

---

# 9. PAY PARTICULAR ATTENTION TO 2026 CHANGES

Research all relevant developments through September 2026.

For example, verify current information concerning:

```text
AUSTRAC
Virtual Asset Service Providers / VASPs
AUSTRAC VASP public register
AML/CTF reforms
Australian crypto regulation
exchange registration requirements
consumer protections
ASIC guidance
```

Use primary government/regulatory sources wherever possible.

As of 2026 the terminology and regulatory environment may have changed from older articles.

Do not simply reuse 2024/2025 terminology.

---

# 10. IMPORTANT REGULATORY DISTINCTION

Never imply:

```text
AUSTRAC registered = investment approved
AUSTRAC registered = safe
AUSTRAC registered = government guaranteed
AUSTRAC registered = ASIC licensed financial product
```

Explain accurately what registration means.

Where relevant distinguish:

```text
AUSTRAC AML/CTF/VASP obligations
```

from:

```text
ASIC financial-services regulation
```

and from:

```text
general safety/security quality of an exchange.
```

Use official AUSTRAC/ASIC sources.

---

# 11. TOPIC SELECTION

Before writing the article, identify approximately **5 candidate topics**.

For each give:

| Field               | Explanation                                              |
| ------------------- | -------------------------------------------------------- |
| Topic               | Proposed article                                         |
| Primary query       | Main intent                                              |
| Secondary queries   | Related searches                                         |
| Intent              | Informational / commercial investigation / transactional |
| Beginner relevance  | Low/Medium/High                                          |
| Affiliate potential | Low/Medium/High                                          |
| Evergreen value     | Low/Medium/High                                          |
| 2026 relevance      | Why now                                                  |
| Competition         | Estimated from live results                              |
| Existing-site fit   | Existing providers/assets/content                        |
| Risk                | SEO/compliance/content risks                             |
| Recommendation      | Publish now / later / avoid                              |

Potential candidates may include—but should not be limited to:

```text
How to Choose a Crypto Exchange in Australia in 2026

Best Crypto Exchanges in Australia for Beginners

Crypto Exchange Fees in Australia Explained

How to Buy Bitcoin in Australia

CoinSpot vs Kraken vs Swyftx for Beginners

Safest Crypto Exchanges in Australia:
What "Safe" Actually Means

AUSTRAC-Registered Crypto Exchanges:
What Australian Beginners Need to Know
```

Do not automatically choose the first item.

Research first.

---

# 12. SCORE THE TOPIC OPPORTUNITIES

Use a transparent score such as:

```text
Search-demand potential        /10
Commercial intent              /10
Affiliate compatibility        /10
Beginner usefulness            /10
Evergreen potential            /10
2026 freshness                 /10
Existing data availability     /10
Internal-link opportunity      /10
Ability to outperform SERP     /10
Compliance/editorial safety    /10
```

Total:

```text
/100
```

This score is an **editorial opportunity score**, NOT claimed Google search-volume data.

Explain the reasoning.

---

# 13. MY CURRENT PREFERRED DIRECTION

Strongly evaluate this topic:

# How to Choose a Crypto Exchange in Australia in 2026: Fees, Safety & Beginner Checklist

Potential SEO title:

> How to Choose a Crypto Exchange in Australia (2026)

Potential article H1:

> How to Choose a Crypto Exchange in Australia in 2026

Possible supporting angle:

> A beginner-friendly guide to fees, AUD deposits, security, AUSTRAC registration and the practical features worth comparing before opening an account.

However:

DO NOT select this merely because I suggested it.

If research demonstrates a materially better topic, recommend it and explain why.

---

# 14. CONSIDER A HIGH-COMMERCIAL-INTENT ALTERNATIVE

Also investigate:

# Best Crypto Exchanges in Australia for Beginners in 2026

This has potentially stronger affiliate/conversion intent.

But only recommend it if our current database and methodology can support a credible "best" comparison.

A "best" article MUST NOT contain arbitrary rankings.

Before recommending such an article, verify whether we have enough structured data to objectively compare:

```text
fees
AUD support
deposit methods
supported assets
security features
regulatory information
ease of use
customer support
trading functionality
```

If we cannot defend the ranking methodology, prefer a neutral comparison/selection article.

---

# 15. SEARCH INTENT

Choose one primary search intent.

For example:

```text
COMMERCIAL_INVESTIGATION
```

if supported by the current schema.

Secondary intent can include informational research.

The article should answer:

> "Which factors should I consider before choosing/opening a crypto exchange account?"

rather than:

> "Buy this exchange now."

---

# 16. ARTICLE LENGTH

Do NOT generate a 4,000–6,000 word SEO essay simply because competitors have long pages.

Target approximately:

```text
1,300–1,800 words
```

for this type of evergreen beginner/commercial-investigation article.

Ideal target:

```text
~1,500 words
```

excluding metadata/schema.

Why:

* enough depth to be genuinely useful;
* readable in roughly 6–8 minutes;
* supports multiple search intents;
* leaves room for comparison components;
* doesn't overwhelm beginners;
* avoids filler.

If research supports a different length, explain why.

Quality matters more than hitting an arbitrary word count.

---

# 17. WRITING STYLE

The article must feel written by a knowledgeable human editor.

Use:

```text
Australian English
clear language
short paragraphs
natural transitions
specific examples
useful explanations
practical warnings
balanced language
```

Avoid robotic constructions such as:

```text
"In today's rapidly evolving cryptocurrency landscape..."

"Whether you're a seasoned trader or just starting your journey..."

"Cryptocurrency has revolutionised the financial landscape..."

"Let's dive in..."

"In conclusion..."
```

Avoid excessive:

```text
Furthermore
Moreover
Additionally
It is important to note
```

Use natural editorial prose.

---

# 18. TITLE REQUIREMENTS

Title must be:

```text
clear
accurate
human
short
keyword-relevant
not clickbait
```

Target approximately:

```text
45–65 characters
```

where natural.

Do not stuff keywords.

Avoid titles such as:

> Ultimate Complete Definitive Best Crypto Exchange Guide Australia 2026

Prefer:

> How to Choose a Crypto Exchange in Australia in 2026

---

# 19. HEADING STRUCTURE

Use one H1 only.

Prefer approximately:

```text
5–8 main H2 sections
```

with H3s only where useful.

Do not create a heading every two paragraphs.

Possible structure:

```text
H1 How to Choose a Crypto Exchange in Australia in 2026

Intro

H2 Start with how you plan to use crypto

H2 Compare the real cost, not just the advertised trading fee

H2 Check AUD deposit and withdrawal options

H2 Understand AUSTRAC registration and regulation

H2 Look at security and custody

H2 Compare beginner usability and support

H2 Compare popular exchanges side by side

H2 Your beginner checklist before opening an account

H2 Next step: compare crypto exchanges
```

Modify based on research.

---

# 20. OPENING / INTRO

The opening should answer the reader's problem within approximately 100–150 words.

Do not begin with a history of Bitcoin.

For example, conceptually:

> Choosing an exchange can be confusing because the cheapest advertised trading fee isn't necessarily the cheapest way to buy crypto. Australians may also need to compare AUD deposits, spreads, withdrawal costs, supported assets, security controls and regulatory registration.

Then tell the reader what they will learn.

---

# 21. EXPLAIN REAL CRYPTO COSTS

This is a particularly valuable content opportunity.

Do not compare exchanges using a single:

```text
trading fee
```

field.

Explain differences between:

```text
maker/taker fee
instant-buy fee
spread
AUD deposit fee
card-payment fee
crypto withdrawal/network fee
AUD withdrawal fee
FX/conversion costs where applicable
```

Explain that advertised trading fees can be misleading if purchase mechanisms differ.

Use current provider facts only if verified.

---

# 22. EXCHANGE CONNECTIONS

The article should naturally connect to several established exchanges represented in our database.

Potentially:

```text
CoinSpot
Kraken
Swyftx
Coinbase
Binance Australia
Independent Reserve
BTC Markets
CoinJar
```

ONLY include exchanges currently supported/verified in our own database or supported by current authoritative research.

Do not force every provider into the article.

Ideally mention approximately:

```text
3–6 relevant exchanges
```

where useful.

---

# 23. DO NOT TURN THE ARTICLE INTO AN ADVERTISEMENT

Bad:

> CoinSpot is the perfect platform for everyone. Sign up today!

Better:

> CoinSpot offers AUD funding and a beginner-oriented interface, while Kraken may appeal to users who value a more advanced trading interface. The better fit depends on fees, features and how you plan to use the account.

All material advantages/disadvantages must be supported by verified data.

---

# 24. AFFILIATE INTEGRATION

The article should create natural commercial opportunities without feeling sales-driven.

Potential CTA locations:

```text
after explaining selection criteria
after comparison component
near final next-step section
```

Examples conceptually:

```text
Compare crypto exchanges

View CoinSpot details

View Kraken details

Compare CoinSpot vs Kraken
```

Affiliate links MUST use the project's existing internal redirect/tracking architecture.

For example, use existing:

```text
/go/[partner]
```

or the current implementation.

Never hard-code arbitrary direct affiliate URLs into article content if the platform already has centralized affiliate tracking.

---

# 25. AFFILIATE DISCLOSURE

Set:

```text
affiliateDisclosureRequired = true
```

when affiliate/provider links are expected.

Do not hide the commercial relationship.

Do not say affiliate commission affects rankings unless that is explicitly the methodology.

The editorial position should remain independent from commercial arrangements.

---

# 26. PROVIDER RELATIONSHIPS

Populate Article → Provider relationships using actual existing provider records.

For each relationship explain:

```text
provider
why it is related
relationship context
```

Examples:

```text
CoinSpot — beginner/local-exchange example
Kraken — advanced/global exchange example
Swyftx — Australian beginner-focused example
```

Use actual provider IDs/slugs according to the database.

Do not invent IDs.

If an ID cannot be established, output the slug/name and clearly mark that database lookup is needed.

---

# 27. CRYPTO ASSET RELATIONSHIPS

Where useful associate:

```text
Bitcoin
Ethereum
```

and other assets actually discussed.

Avoid linking 30 assets merely for SEO.

For an exchange-selection article, one or two major assets may be sufficient.

---

# 28. TAGS

Use approximately:

```text
4–8 tags
```

Only meaningful tags.

Potential examples:

```text
Crypto Exchanges
Cryptocurrency
Bitcoin
Beginners
Australia
Crypto Fees
Crypto Security
AUSTRAC
```

Follow the project's current tag naming conventions.

Avoid near-duplicate tags such as:

```text
crypto
cryptocurrency
cryptocurrencies
crypto currency
```

unless the existing taxonomy deliberately distinguishes them.

---

# 29. KEY TAKEAWAYS

Produce approximately:

```text
3–5
```

concise key takeaways.

Each should be one sentence.

For example conceptually:

* Compare total buying costs, not only headline trading fees.
* Check whether the exchange supports convenient AUD deposits and withdrawals.
* AUSTRAC registration is relevant, but it does not mean an exchange is risk-free.
* Security, custody and withdrawal controls matter as much as the number of available coins.

Verify all claims
