Yes — you understood the important point. **`CONTENT_OPPORTUNITIES` is primarily an internal editorial/SEO planning system. It is not content that should be served directly to visitors, and you do not "run" it to publish articles.**

Think of Phase 9.2 as building the **editorial backlog and decision layer** for what Trading Guide should create next.

## 1. What `CONTENT_OPPORTUNITIES` actually is

Conceptually, your architecture is now:

```text
CONTENT_OPPORTUNITIES
        │
        │ editorial planning
        ▼
Research & verification
        │
        ▼
Create real content
        │
        ▼
Article / Guide / Tool / Comparison / Provider page
        │
        ▼
Publish
        │
        ▼
Google indexes the real URL
```

`CONTENT_OPPORTUNITIES` itself should **not be indexed or exposed to Google**.

For example, imagine it contains something conceptually like:

```ts
{
  id: "share-brokerage-fees-australia",
  title: "Share trading brokerage fees in Australia",
  priority: "BUILD_NOW",
  intent: "EDUCATIONAL",
  format: "GUIDE",
  targetPath: "/guides/share-trading/brokerage-fees",
  rationale: "...",
  evidenceRequired: [
    "Official provider fee schedules",
    "ASIC/Moneysmart information"
  ],
  relatedSurfaces: [
    "/tools/brokerage-calculator",
    "/compare/trading-platforms"
  ]
}
```

That is **not the article**.

It's basically saying:

> Trading Guide should eventually create this content. Here's why, what user intent it answers, what evidence it needs, what URL it should own, and what other parts of Trading Guide it should connect to.

---

# 2. You do NOT need to create an article with the same ID

This is an important distinction.

Suppose:

```ts
id: "share-brokerage-fees-australia";
```

exists in `CONTENT_OPPORTUNITIES`.

You don't need an Article database row with:

```text
id = share-brokerage-fees-australia
```

The opportunity ID is an **internal stable identifier**, not necessarily a public content identifier.

Your eventual article might have:

```text
Database ID:
cm4k8c2...

slug:
share-trading-brokerage-fees-australia

URL:
/guides/share-trading/brokerage-fees

title:
Share Trading Brokerage Fees in Australia: What You Actually Pay
```

while the opportunity remains:

```ts
id: "share-brokerage-fees-australia";
```

They are conceptually related but don't have to share database IDs.

---

# 3. You also don't "run CONTENT_OPPORTUNITIES"

This is the other key distinction.

It isn't intended to work like:

```bash
npm run content-opportunities
```

and suddenly create 50 articles.

I specifically avoided doing that because it would lead Trading Guide toward mass-generated SEO content.

Instead, it behaves more like your product backlog:

```text
50 opportunities
│
├── 10 BUILD_NOW
│      ↓
│   research carefully
│      ↓
│   create individually
│
├── 15 BUILD_NEXT
│
├── 20 LATER
│
└── 5 DO_NOT_BUILD
```

You work through that queue intentionally.

---

# 4. How would we actually build one?

Let's use this hypothetical opportunity:

```text
Share trading brokerage fees in Australia
```

### Step 1 — Pick the opportunity

We decide:

```text
Status: BUILD_NOW

Search intent:
"I want to understand brokerage fees when buying shares
in Australia."

Target:
/guides/share-trading/brokerage-fees
```

At this point there is still **no published page**.

---

## Step 2 — Research it

Before writing anything, we'd research authoritative sources.

For example:

```text
ASIC / Moneysmart
        +
CommSec official pricing
        +
Stake official pricing
        +
CMC official pricing
        +
moomoo official pricing
        +
IBKR official pricing
        ↓
Trading Guide structured research
```

This is especially important for your site because financial content is trust-sensitive.

And ideally we don't duplicate numbers manually if those numbers already exist in your structured provider database.

For example:

```text
OfferingFee

CommSec
Stake
CMC
moomoo
IBKR
```

should remain the source for provider-specific fee facts where appropriate.

---

# 5. Then we create the actual article/guide

There are two architectural possibilities.

### Option A — Article CMS

Create an article using your existing admin editor:

```text
/admin/articles/new
```

For example:

```text
Title:
Share Trading Brokerage Fees in Australia

Slug:
share-trading-brokerage-fees-australia

Category:
Share Trading

Status:
DRAFT
```

You research it, write it, review it, add sources, preview it and eventually:

```text
DRAFT
   ↓
REVIEW
   ↓
PUBLISHED
```

This works well for normal editorial content.

---

### Option B — Dedicated Guide route

Some of your highest-value pages should probably **not be ordinary CMS articles**.

For example:

```text
/guides/share-trading/brokerage-fees
```

could be a richer Next.js guide containing:

```text
Editorial explanation

      +

live brokerage examples

      +

<BrokerageCalculator />

      +

provider fee data

      +

comparison links

      +

source/verification information
```

That is considerably more powerful than a normal blog post.

This is where Trading Guide can differentiate itself.

---

# 6. I recommend a hybrid content architecture

I wouldn't make every `CONTENT_OPPORTUNITY` an Article.

Instead:

```text
CONTENT_OPPORTUNITY
        │
        ▼
What is the best content format?
        │
        ├───────────────┬────────────────┬─────────────────┐
        ▼               ▼                ▼                 ▼
     ARTICLE           GUIDE           TOOL          COMPARISON
        │               │                │                 │
        ▼               ▼                ▼                 ▼
     CMS          dedicated route    calculator       existing
                                                   compare engine
```

For example:

| Search intent       | Best destination                |
| ------------------- | ------------------------------- |
| What is brokerage?  | Guide/article                   |
| Calculate brokerage | Tool                            |
| CHESS vs custody    | Existing interactive guide/tool |
| Stake vs CommSec    | Existing comparison             |
| Stake review        | Provider profile/review         |
| How FX fees work    | Guide                           |
| Calculate FX cost   | FX calculator                   |
| CoinSpot vs Kraken  | Existing comparison             |
| What is a HIN?      | Guide/article                   |

This avoids creating multiple pages targeting the same query.

---

# 7. This is one of the most important purposes of 9.2

Without the content map, a typical SEO implementation could accidentally produce:

```text
/articles/stake-vs-commsec
/guides/stake-vs-commsec
/compare/stake-vs-commsec
/blog/best-stake-commsec-comparison
```

Now four pages compete for essentially the same intent.

Phase 9.2 instead says:

```text
SEARCH INTENT

"Stake vs CommSec"
        │
        ▼
OWNER
/compare/trading-platforms/commsec-vs-stake
```

Everything else should link **to that page**.

That's called preventing keyword/search-intent cannibalisation.

---

# 8. `targetPath` is therefore very important

Think about an opportunity like:

```ts
{
  id: "commsec-vs-stake",
  targetPath:
    "/compare/trading-platforms/commsec-vs-stake"
}
```

This doesn't mean:

> Create an article.

It means:

> This search intent already has a natural destination. Improve that destination.

So Phase 9.3 might take that opportunity and enrich the existing comparison page:

```text
CommSec vs Stake
────────────────────────────────

Introduction

Key differences

Markets available

CHESS / ownership

Brokerage

FX fees

Example:
"What might a $5,000 ASX trade cost?"

Features

Things to verify before choosing

Sources

Last verified

Methodology

Related:
Brokerage calculator
CHESS vs custody
CommSec profile
Stake profile
```

No additional article is needed.

---

# 9. Other opportunities DO require new content

Suppose 9.2 contains:

```text
What is a HIN?
```

and no existing page properly owns that intent.

Then:

```text
CONTENT_OPPORTUNITY
        ↓
No existing owner
        ↓
Create new guide
        ↓
/guides/share-trading/what-is-a-hin
```

After publishing, we connect it:

```text
                    What is a HIN?
                         │
             ┌───────────┼────────────┐
             ▼           ▼            ▼
        CHESS vs       Stake       CommSec
        custody        review      review
             │
             ▼
     Compare platforms
             │
             ▼
    Brokerage calculator
```

That's the topic-cluster architecture we built in Phase 9.1.

---

# 10. What happens to the opportunity after publishing?

This is one area where I'd improve Phase 9.2 further.

Currently the roadmap primarily describes **what should be built**.

Eventually I'd like an opportunity to have a lifecycle such as:

```ts
status: PLANNED;
RESEARCHING;
DRAFTING;
REVIEW;
PUBLISHED;
REFRESH_DUE;
RETIRED;
```

And perhaps:

```ts
{
  id: "share-brokerage-fees-australia",

  priority: "BUILD_NOW",

  status: "PUBLISHED",

  targetPath:
    "/guides/share-trading/brokerage-fees",

  publishedAt:
    "2026-10-10",

  lastReviewedAt:
    "2026-10-10",

  nextReviewAt:
    "2026-12-10"
}
```

Now the opportunity becomes more than an idea list.

It becomes an **editorial operating system**.

---

# 11. But I would NOT manually maintain publication status forever

There's an even better architecture.

We can have the application determine:

```text
CONTENT_OPPORTUNITY
       │
       │ targetPath
       ▼
Does published content exist?
       │
   ┌───┴────┐
   │        │
  YES       NO
   │        │
   ▼        ▼
LIVE      GAP
```

For CMS content:

```text
Opportunity
    ↓
contentType = ARTICLE
    ↓
articleSlug
    ↓
Article table
    ↓
status = PUBLISHED?
```

For curated comparisons:

```text
Opportunity
    ↓
contentType = COMPARISON
    ↓
curated comparison registry
```

For tools:

```text
Opportunity
    ↓
contentType = TOOL
    ↓
known route registry
```

That eliminates duplicate state.

---

# 12. I'd actually evolve the model slightly

Rather than just:

```ts
{
  (id, title, priority, targetPath);
}
```

I would eventually want:

```ts
{
  id: "share-brokerage-fees-australia",

  cluster: "SHARE_TRADING",

  intent: "EDUCATIONAL",

  contentType: "GUIDE",

  priority: "BUILD_NOW",

  targetPath:
    "/guides/share-trading/brokerage-fees",

  primaryQuery:
    "share trading brokerage fees australia",

  secondaryQueries: [
    "brokerage fees australia",
    "share brokerage fees",
    "stock brokerage fees australia"
  ],

  evidenceRequired: [
    "Moneysmart",
    "official provider pricing"
  ],

  relatedTools: [
    "/tools/brokerage-calculator"
  ],

  relatedComparisons: [
    "/compare/trading-platforms"
  ],

  relatedGuides: [
    "/guides/share-trading"
  ]
}
```

Notice that this still contains **no article body**.

It's the specification for the content.

---

# 13. Then your admin system could become very powerful

Eventually I can see:

```text
/admin/content-opportunities
```

showing something like:

| Opportunity              | Priority     | Type       | State   |
| ------------------------ | ------------ | ---------- | ------- |
| Brokerage fees Australia | BUILD NOW    | Guide      | Missing |
| CHESS vs custody         | BUILD NOW    | Guide/Tool | ✓ Live  |
| CommSec vs Stake         | BUILD NOW    | Comparison | ✓ Live  |
| What is a HIN?           | BUILD NOW    | Guide      | Missing |
| Crypto exchange fees     | BUILD NOW    | Guide      | Missing |
| CoinSpot vs Kraken       | BUILD NOW    | Comparison | ✓ Live  |
| Bitcoin price prediction | DO NOT BUILD | —          | Blocked |

Click:

```text
Brokerage fees Australia
```

and the admin could show:

```text
SEARCH INTENT
Understand brokerage costs when trading shares.

WHY BUILD IT
High-value educational intent closely related
to Trading Guide's comparison product.

TARGET
/guides/share-trading/brokerage-fees

STATUS
Not created

EVIDENCE REQUIRED
✓ Moneysmart
□ CommSec
□ Stake
□ CMC
□ moomoo
□ IBKR

RELATED PRODUCT
Brokerage Calculator

RELATED CLUSTER
Share Trading

[ Start research ]
[ Create draft ]
```

That would be a genuinely useful editorial workflow.

---

# 14. "Create draft" could eventually automate the boring parts

When you click:

```text
Create draft
```

Trading Guide could create:

```text
Article
status = DRAFT

Title
Meta title
Description
Slug
Cluster
Suggested outline
Related tools
Related providers
Required sources
```

But **not automatically fabricate the finished financial article**.

For example:

```text
Share Trading Brokerage Fees in Australia

Introduction

H2 What is brokerage?
[research required]

H2 How brokerage is calculated
[research required]

H2 Common brokerage structures
[structured explanation]

H2 Worked examples
[connect calculator]

H2 Other costs
[FX / platform / transfer]

H2 How to compare platforms
[link comparison]

H2 Sources
[required]

H2 Methodology
```

Then an editor researches and completes it.

That's a much healthier AI/content workflow.

---

# 15. Why I don't want 9.2 automatically creating 50 articles

Because you'd quickly end up with:

```text
50 URLs
×
1,000 words
=
50,000 words
```

but perhaps only 10 pages have genuinely useful information.

Google doesn't reward the number `50`.

What we actually want is:

```text
10 exceptional pages
        ↓
real usefulness
        ↓
calculator interaction
        ↓
provider research
        ↓
comparison
        ↓
internal links
        ↓
citations / backlinks
        ↓
authority
```

Then publish the next 10.

---

# 16. How I would use the 50 opportunities in practice

I would work in waves.

**Wave 1 — Foundation**

Build roughly 6–10 of the `BUILD_NOW` topics that complete the fundamental educational journey:

```text
Brokerage fees
CHESS vs custody
What is a HIN?
FX fees
Fractional shares
Share-trading fee checklist

Crypto exchange fees
Crypto spreads vs fees
Crypto withdrawal/network fees
AUSTRAC/VASP registration
```

Several of these can strengthen existing tools rather than becoming independent articles.

**Wave 2 — Commercial research intent**

Deepen:

```text
CommSec vs Stake
moomoo vs Stake
eToro vs moomoo

CoinSpot vs Swyftx
CoinSpot vs Kraken
CoinSpot vs eToro
```

Those pages sit closer to your eventual affiliate conversion funnel.

**Wave 3 — Provider research**

Strengthen:

```text
Stake review
CommSec review
CMC review
moomoo review
eToro review

CoinSpot review
Swyftx review
Kraken review
eToro crypto review
...
```

Again, don't create `/articles/stake-review` if `/share-trading/stake` already owns that intent.

Enhance the provider page.

---

# 17. The resulting funnel becomes much clearer

Imagine someone searches:

> "how much does it cost to buy shares in australia"

They land on:

```text
/guides/share-trading/brokerage-fees
```

Then:

```text
Understand brokerage
        ↓
Try Brokerage Calculator
        ↓
See provider examples
        ↓
Research provider
        ↓
Compare providers
        ↓
Read source evidence
        ↓
Visit provider
```

Another person searches:

> "stake vs commsec"

They enter directly:

```text
/compare/trading-platforms/commsec-vs-stake
```

Then:

```text
Comparison
    ↓
Fee calculation
    ↓
CHESS explanation
    ↓
Stake profile / CommSec profile
    ↓
Provider site
```

Different search intent, same research ecosystem.

That is what Phase **9.1 + 9.2** are trying to establish.

---

## What Phase 9.2 has therefore accomplished

Think of our phases this way:

```text
PHASE 9
"What pages should be indexable?"

            ↓

PHASE 9.1
"How should those pages connect?"

            ↓

PHASE 9.2
"What should we build next,
what intent does each page own,
and what should we deliberately NOT build?"

            ↓

PHASE 9.3
"Research and actually publish
the first high-authority content."
```

So **yes, `CONTENT_OPPORTUNITIES` is mainly for future use**—but I wouldn't call it disposable planning data. It should evolve into the blueprint governing your content production.

And **no, you shouldn't manually create an Article with the same opportunity ID and then "run" `CONTENT_OPPORTUNITIES`.** Instead, choose an opportunity → determine whether it maps to an existing page or needs a new page → research it → build/revise the appropriate content → review → publish → link it into its cluster → monitor and refresh it.

For **Phase 9.3**, I would now actually start executing that pipeline rather than adding more planning infrastructure: take the first high-priority opportunities, research each against current Australian/official sources, determine which should be dedicated guides versus enhancements to existing tools/pages, and build the first genuinely publishable content batch.
