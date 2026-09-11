# PROMPT TO GENERATE ARTICLES

# ROLE & OBJECTIVE

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

Verify all claims.

---

# 30. SOURCES

This is critical.

Use primary sources wherever possible.

Priority:

```text
1. AUSTRAC
2. ASIC / Moneysmart
3. official provider fee schedules
4. official provider product/help documentation
5. official provider regulatory disclosures
6. reputable independent research
```

Competitor sites such as Finder/Canstar may be used for:

```text
topic research
SERP analysis
content-gap analysis
```

but wherever possible they should NOT be the primary factual source for:

```text
fees
regulatory status
supported assets
provider features
```

Verify those directly.

---

# 31. SOURCE RECORDS

For every ArticleSource record supported by the current schema, populate as much as possible:

```text
title
URL
source type
publisher/organisation if supported
accessed/verified date if supported
```

Use the actual ArticleSource enum.

Potential types may include:

```text
REGULATOR
GOVERNMENT
OFFICIAL_PROVIDER
OFFICIAL_DOCUMENTATION
RESEARCH
NEWS
OTHER
```

Verify current enum values.

---

# 32. FACT FRESHNESS

Any time-sensitive data such as:

```text
fees
coin counts
deposit methods
regulatory status
promotions
minimum deposits
provider features
```

must include an explicit verification date in the research notes.

Use:

```text
Verified: September 2026
```

or exact date where possible.

Do not treat old 2024/2025 competitor facts as current without rechecking.

---

# 33. PROMOTIONS

Avoid promotions unless necessary.

Promotions age quickly and make evergreen articles stale.

If a current offer is mentioned:

* verify it from the provider;
* record its expiry;
* clearly label conditions;
* avoid placing the promotion in evergreen SEO title/description.

Prefer durable provider facts.

---

# 34. CLAIMS ABOUT "SAFEST" / "BEST"

Be extremely cautious.

Do NOT say:

```text
"CoinSpot is the safest exchange in Australia"
"Kraken is Australia's best exchange"
```

unless the site has a documented methodology capable of substantiating that claim.

Prefer:

```text
"Factors worth checking include..."
"One option to compare is..."
"May suit users looking for..."
"Among the exchanges available to Australians..."
```

If using “best” in the title, provide an explicit methodology.

---

# 35. FINANCIAL ADVICE SAFETY

The article is:

```text
general educational information
```

not personal financial advice.

Do not tell a reader:

```text
"You should invest in Bitcoin."
"You should use Kraken."
"Bitcoin will rise."
"Buy before prices increase."
```

Avoid personalised recommendations.

Where appropriate include the site's existing general-information/risk wording.

---

# 36. RISK DISCUSSION

Include concise but meaningful risks.

Examples:

```text
crypto prices are volatile
exchange failure/custody risk
cybersecurity risk
loss of credentials
withdrawal restrictions
regulatory change
asset-specific risk
```

Do not make the article fear-driven.

Do not bury the risk discussion below affiliate CTAs.

---

# 37. UNIQUE VALUE

Before writing, answer:

> Why would someone choose this article over Finder or Canstar?

The final article needs at least **2–3 genuinely differentiated elements**.

Possible differentiation:

```text
clear "total cost" explanation
2026 AUSTRAC/VASP update
exchange-selection checklist
dynamic verified comparison
Australian payment/deposit considerations
clear distinction between registration and safety
```

Do not merely rephrase competitor content.

---

# 38. INTERNAL LINKS

Inspect actual available routes.

Recommend internal links to appropriate existing pages such as:

```text
/crypto
/crypto/exchanges
/compare
provider detail pages
Bitcoin guide
Bitcoin asset page
crypto-fee guide
methodology
affiliate disclosure
```

Use actual routes from the project.

Do not invent URLs.

---

# 39. DYNAMIC EMBEDS

If the Article renderer supports controlled embeds/components, identify places where structured live data would be stronger than hard-coded prose.

For example:

```text
[crypto-exchange-comparison]
[provider-card]
[provider-fees]
[related-providers]
```

Use ONLY actual embed syntax supported by the current project.

If Block 4 embeds are not implemented yet, provide recommendations separately rather than inserting unsupported markup into production article HTML.

---

# 40. AVOID HARD-CODING VOLATILE DATA

Where the platform already holds structured provider data, prefer dynamic rendering over embedding volatile values permanently into prose.

For example:

Bad architecture:

> CoinSpot supports exactly 476 assets.

if that value changes frequently.

Better:

> CoinSpot supports a broad range of crypto assets.

and allow a structured Provider component to show the current verified count.

If a number is editorially necessary, source and date it.

---

# 41. SEO FIELDS

Generate:

```text
seoTitle
seoDescription
slug
searchIntent
```

SEO title:

```text
~50–60 characters where practical
```

Meta description:

```text
approximately 140–160 characters
natural
useful
no keyword stuffing
no unsupported superlatives
```

Example concept:

```text
Compare fees, AUD funding, security and AUSTRAC registration when choosing a crypto exchange in Australia. A practical 2026 guide for beginners.
```

Refine it after keyword research.

---

# 42. SLUG

Keep the slug:

```text
short
descriptive
stable
lowercase
hyphenated
```

Prefer:

```text
how-to-choose-crypto-exchange-australia
```

over:

```text
ultimate-best-how-to-choose-the-best-cryptocurrency-exchange-in-australia-2026
```

Consider omitting `2026` from the slug if the content is intended to be updated annually while retaining the same evergreen URL.

Explain your recommendation.

---

# 43. URL LONGEVITY

Strongly consider:

```text
/how-to-choose-crypto-exchange-australia
```

rather than:

```text
/how-to-choose-crypto-exchange-australia-2026
```

if we expect to refresh the article in 2027.

The visible title can contain 2026 while the URL remains evergreen.

Evaluate against existing project slug conventions.

---

# 44. EXCERPT

Generate a concise human-readable excerpt.

Target:

```text
~25–45 words
```

This is not simply a duplicate of the SEO description.

It should work well on article cards.

---

# 45. FEATURED IMAGE

Recommend:

```text
featuredImage concept
featuredImageAlt
```

Do not invent an image URL unless an actual asset exists.

Example image concept:

> Australian beginner comparing crypto exchanges on a laptop, with neutral exchange/interface motifs and no misleading profit imagery.

Alt text should describe the image, not stuff SEO keywords.

---

# 46. ARTICLE TYPE

Determine whether this belongs as:

```text
GUIDE
```

rather than:

```text
NEWS
```

For the proposed evergreen topic, `GUIDE` will probably be correct.

Explain.

---

# 47. CATEGORY

Use the actual project category conventions.

Potentially:

```text
cryptocurrency
crypto-exchanges
```

but inspect existing content first.

Avoid creating unnecessary new category vocabulary.

---

# 48. REGION

The article is specifically targeted at:

```text
Australia
```

Set the relevant region/canonical variant fields according to the actual schema.

Do not invent values unsupported by the enum/model.

---

# 49. CANONICAL

Use the normal self-referencing canonical generated by the project's SEO system unless there is a concrete reason not to.

Do not manually override `canonicalUrl` unnecessarily.

If the field is optional, recommend leaving it null/default unless a canonical override is genuinely required.

---

# 50. NOINDEX

The intended published article should normally be:

```text
noIndex = false
```

assuming it satisfies publication quality requirements.

Draft/preview visibility remains governed by the existing Article CMS workflow.

---

# 51. ARTICLE STATUS

The generated record must begin:

```text
status = DRAFT
```

Do NOT set:

```text
PUBLISHED
```

automatically.

It must go through the project's editorial review workflow.

---

# 52. SCHEDULING

Do not invent `scheduledAt`.

Unless I explicitly specify a publishing schedule:

```text
scheduledAt = null
```

The admin/editor can schedule later.

---

# 53. AUTHOR / REVIEWER

Follow the current structured ownership model.

Do not invent User IDs.

If author/reviewer User records are unknown, output:

```text
authorUserId: NEEDS_RESOLUTION
reviewerUserId: null
```

or the closest valid planning representation.

Do not fabricate credentials or people.

The final database write can resolve actual IDs later.

---

# 54. LAST REVIEWED

For a newly created DRAFT:

```text
lastReviewedAt = null
```

unless current application logic specifies otherwise.

Do not pretend editorial review has happened.

---

# 55. PUBLISHED AT

For DRAFT:

```text
publishedAt = null
```

unless current model/actions populate it differently.

Do not pre-date publication.

---

# 56. ARTICLE CONTENT FORMAT

Use exactly the format expected by the current Article renderer.

If `content` stores sanitized HTML, return sanitized-compatible HTML.

If Markdown is currently supported, use the appropriate format.

Do not assume Markdown merely because it is easier.

Inspect the implementation.

The output must be directly compatible with the current Article form.

---

# 57. CONTENT QUALITY CHECK

Before finalising, check the article for:

```text
unsupported claims
stale fees
fake rankings
keyword stuffing
AI clichés
duplicated paragraphs
unnecessary length
excess headings
affiliate bias
regulatory inaccuracies
personal financial advice
```

Rewrite anything problematic.

---

# 58. GOOGLE / AFFILIATE QUALITY

The article must offer genuine added value.

Do not simply copy provider descriptions.

Do not generate a "thin affiliate" article.

Our page should contribute:

```text
original synthesis
comparison
decision framework
verified data
Australian-specific context
practical explanation
transparent methodology
```

---

# 59. READABILITY

Target approximately:

```text
Year 8–10 reading level
```

while retaining technically correct terminology.

When introducing concepts such as:

```text
spread
maker/taker
custody
VASP
AUSTRAC
```

explain them briefly the first time.

---

# 60. TABLES

Use no more than:

```text
1–2 useful tables
```

unless a dynamic comparison component is used.

Possible table:

| Factor      | What to check                              | Why it matters                  |
| ----------- | ------------------------------------------ | ------------------------------- |
| Fees        | Trading fee, spread, deposits, withdrawals | Changes total cost              |
| AUD support | PayID/Osko/bank transfer                   | Convenience/cost                |
| Security    | 2FA, withdrawal controls, custody          | Account/asset protection        |
| AUSTRAC     | Registration status                        | Australian AML/CTF registration |
| Assets      | Coins/markets available                    | Determines what can be traded   |

Do not create tables purely to increase content length.

---

# 61. BEGINNER CHECKLIST

Add a compact actionable checklist near the end.

For example:

```text
Before opening an exchange account:

□ Check the provider in the AUSTRAC VASP register where relevant
□ Compare total trading/purchase costs
□ Confirm AUD deposit/withdrawal methods
□ Check withdrawal and network fees
□ Enable 2FA
□ Understand who controls/custodies the crypto
□ Check the assets/markets you actually need
□ Read the provider's current terms and fees
```

Verify wording against current regulations.

---

# 62. CTA DESIGN

Use low-pressure CTA language.

Prefer:

```text
Compare crypto exchanges
Compare current fees and features
View exchange details
```

Avoid:

```text
Start making money today
Don't miss out
Buy before Bitcoin rises
Guaranteed best exchange
```

---

# 63. RELATED CONTENT OPPORTUNITIES

After the article, recommend approximately **5 follow-up articles** forming a content cluster.

For example:

```text
Crypto Exchange Fees in Australia Explained

CoinSpot vs Kraken: Fees and Features Compared

How to Buy Bitcoin in Australia

What Does AUSTRAC Registration Mean for Crypto Users?

Crypto Wallet vs Exchange: Where Should Beginners Keep Crypto?
```

For each give:

```text
primary intent
relationship to pillar article
affiliate potential
```

---

# 64. OUTPUT — PART A: RESEARCH SUMMARY

Before the article, return:

## Research date

September 2026 / exact date.

## Current SERP observations

Summarise what currently appears to perform well.

## Competitor analysis

Finder
Canstar
Other relevant competitors

## Search-intent observations

Explain inferred demand.

## 2026 trend/relevance factors

Explain current reasons the topic matters.

## Important regulatory changes

Use sources.

---

# 65. OUTPUT — PART B: TOPIC SHORTLIST

Return the 5 candidates in a comparison table.

Then:

```text
Recommended topic:
...

Opportunity score:
__/100

Why:
...
```

Also explain:

```text
Why this is preferable to the alternatives right now.
```

---

# 66. OUTPUT — PART C: SEO STRATEGY

Provide:

```text
Primary search query
Secondary queries
Long-tail queries
Search intent
Target audience
Funnel stage
Recommended slug
SEO title
Meta description
H1
Estimated article length
Estimated reading time
```

Again:

Do not fabricate keyword volume.

---

# 67. OUTPUT — PART D: ARTICLE OUTLINE

Before writing full prose, provide:

```text
H1
intro purpose

H2
H2
H2
...
```

For each heading state:

```text
reader question answered
search intent served
provider/data opportunity
```

---

# 68. OUTPUT — PART E: COMPLETE ARTICLE

Then generate the full final article.

Target:

```text
~1,300–1,800 words
```

unless research justifies otherwise.

Make it publication quality.

---

# 69. OUTPUT — PART F: COMPLETE ARTICLE DATABASE PAYLOAD

After the article, output a structured representation matching the actual current Prisma Article model.

Example concept only:

```ts
{
  title: "...",
  slug: "...",
  excerpt: "...",
  content: "...",

  articleType: "GUIDE",
  status: "DRAFT",

  keyTakeaways: [
    "...",
    "...",
    "..."
  ],

  category: "...",

  seoTitle: "...",
  seoDescription: "...",

  featuredImage: null,
  featuredImageAlt: "...",

  affiliateDisclosureRequired: true,
  noIndex: false,

  publishedAt: null,
  scheduledAt: null,
  lastReviewedAt: null,

  searchIntent: "...",

  region: "...",
  canonicalVariant: ...,

  tags: [...],

  sources: [...],

  providers: [...],

  cryptoAssets: [...],

  relatedArticles: [...]
}
```

THIS IS ONLY AN EXAMPLE STRUCTURE.

Use the actual latest schema/validation format.

Do not invent enum values.

Do not invent foreign-key IDs.

---

# 70. OUTPUT — PART G: SOURCE AUDIT

For every time-sensitive factual claim list:

| Claim | Source | Source Type | Verified Date |
| ----- | ------ | ----------- | ------------- |

Pay particular attention to:

```text
fees
registration
supported assets
payment methods
security claims
provider availability
regulatory claims
```

---

# 71. OUTPUT — PART H: INTERNAL/AFFILIATE LINK PLAN

Provide a table:

| Article location | Link target       | Link type | Reason                   |
| ---------------- | ----------------- | --------- | ------------------------ |
| Exchange section | /crypto/exchanges | Internal  | Comparison               |
| CoinSpot mention | provider page     | Internal  | Provider research        |
| CTA              | /go/...           | Affiliate | Qualified outbound visit |

Use actual project routes.

Do not fabricate provider affiliate URLs.

---

# 72. OUTPUT — PART I: EDITORIAL REVIEW FLAGS

Tell me anything the human reviewer should verify before publication.

Examples:

```text
provider fee changed recently
AUSTRAC registration requires recheck
missing structured provider data
affiliate partner not yet active
article contains a potentially time-sensitive claim
```

Do not hide uncertainty.

---

# 73. OUTPUT — PART J: FINAL SELF-CRITIQUE

Finally answer:

### What makes this article useful?

### What makes it different from Finder/Canstar?

### Where could the article still be stronger?

### What facts will age fastest?

### What should be dynamically sourced from our database?

### What should be manually reviewed before publishing?

### Is the title genuinely human or too SEO-driven?

### Does any section sound AI-generated?

If yes, rewrite it.

---

# FINAL PRINCIPLE

The goal is NOT:

> publish as many crypto SEO articles as possible.

The goal is:

> publish a smaller number of genuinely useful, current, Australian-focused cryptocurrency guides that help users make informed platform-comparison decisions and naturally lead qualified readers into our exchange-comparison and affiliate funnel.

Research → usefulness → trust → comparison → conversion.

In that order.
