I would define **Phase 9.4 as “Content Operations, Freshness & Editorial Governance.”**

Phases 9.0–9.3 have built the public-facing SEO/content architecture. Before publishing many more pages, 9.4 should make that content **manageable and trustworthy over time**.

The progression would be:

```text
Phase 9.0
Provider reviews + curated SEO comparisons
        ↓
Phase 9.1
Topic clusters + internal linking
        ↓
Phase 9.2
50-opportunity content roadmap
        ↓
Phase 9.3
First authoritative guides
        ↓
Phase 9.3.1
Live fee evidence + worked examples
        ↓
Phase 9.3.2
Topic-specific structured evidence
        ↓
PHASE 9.4
Editorial operations + freshness + content governance
        ↓
Phase 9.5
Scale high-quality content
```

## What I propose for Phase 9.4

The main goal is to turn the pieces we've built into an **editorial operating system**.

Right now `CONTENT_OPPORTUNITIES` tells us what we _intend_ to build, and the site contains the actual published content. Phase 9.4 should connect those worlds.

### 1. Content opportunity admin dashboard

Add something like:

```text
/admin/content
```

with a dashboard:

```text
CONTENT PIPELINE

┌───────────────────────────────────────────────────────────────┐
│ 50 opportunities                                             │
│                                                               │
│  Published     Researching     Planned     Refresh due        │
│     8              2              31            3             │
└───────────────────────────────────────────────────────────────┘

BUILD NOW
────────────────────────────────────────────────────────────────

Brokerage fees Australia
GUIDE • SHARE TRADING
✓ Published

CHESS vs custody
GUIDE / TOOL
✓ Published

What is a HIN?
GUIDE
✓ Published

FX fees when buying US shares
GUIDE
○ Not started

Crypto spreads vs trading fees
GUIDE
○ Not started
```

This makes `CONTENT_OPPORTUNITIES` operational instead of just being a TypeScript planning file.

---

## 2. Give opportunities a real lifecycle

Instead of only:

```ts
priority: "BUILD_NOW";
```

we establish:

```ts
status:
  | "PLANNED"
  | "RESEARCHING"
  | "DRAFT"
  | "REVIEW"
  | "PUBLISHED"
  | "REFRESH_DUE"
  | "RETIRED";
```

But I would **not duplicate state unnecessarily**.

For example, if:

```text
/guides/brokerage-fees-australia
```

already exists in the published guide registry, the dashboard should automatically recognise:

```text
✓ PUBLISHED
```

rather than requiring you to manually set two separate statuses.

---

## 3. Content freshness becomes first-class

This is particularly important for Trading Guide.

An article such as:

> What is a HIN?

doesn't need the same review frequency as:

> Crypto exchange fees in Australia

We can introduce a freshness policy:

```text
CONTENT TYPE                     REVIEW

Evergreen education             ~180 days
Regulatory content              ~90 days
Provider comparison             ~60–90 days
Provider pricing                ~30–45 days
Crypto fees                     ~30–45 days
Provider review                 ~60 days
```

These are editorial defaults, not claims that a page is accurate for that entire period.

The dashboard could then show:

```text
CONTENT FRESHNESS

Needs attention
────────────────────────────────────────

Crypto Exchange Fees Australia
Last reviewed: 47 days ago
⚠ Review due

eToro vs moomoo
Last reviewed: 63 days ago
⚠ Review due

What is a HIN?
Last reviewed: 21 days ago
✓ Current
```

---

## 4. Connect content freshness to provider-data freshness

This is probably the most valuable part.

Suppose:

```text
/guides/brokerage-fees-australia
```

uses:

```text
Stake OfferingFee
CMC OfferingFee
moomoo OfferingFee
IBKR OfferingFee
```

Then one of those records becomes:

```text
STALE
```

The content dashboard should know:

```text
Brokerage Fees Australia

Content:
✓ editorial review current

Evidence:
⚠ 1 underlying provider record stale

Affected provider:
CMC Invest

[Review evidence]
```

So we're no longer pretending:

```text
article reviewed recently
=
all underlying data current
```

Those are two different freshness concepts.

The model becomes:

```text
                    PAGE HEALTH
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
     Editorial       Evidence        Sources
     freshness       freshness       available
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                  Publication health
```

That would be a strong feature for a financial research site.

---

## 5. Source coverage audit

For each published page:

```text
Brokerage Fees Australia

Sources
───────────────────────────────

Moneysmart                    ✓
Stake official pricing        ✓
CMC official pricing          ✓
moomoo official pricing       ✓
IBKR official pricing         ✓

Structured evidence
───────────────────────────────

5 verified
0 stale
0 missing source URL
```

Whereas a weak page might show:

```text
Crypto Funding Australia

Structured evidence

4 verified
2 stale
1 missing official source

STATUS
Needs research
```

That tells you what to fix rather than merely saying "update this article."

---

## 6. Introduce page-health states

I'd avoid arbitrary SEO scores like:

```text
SEO score: 83/100
```

They're usually not very meaningful.

Instead use factual states:

```text
HEALTHY
REVIEW_DUE
EVIDENCE_STALE
SOURCE_MISSING
DRAFT
NOT_PUBLISHED
```

For example:

```text
┌──────────────────────────────────────────────────────┐
│ Crypto Exchange Fees in Australia                   │
│                                                      │
│ PUBLISHED                                            │
│                                                      │
│ Editorial review          ✓ Current                  │
│ Structured evidence      ⚠ 2 records stale          │
│ Official sources          ✓ Complete                 │
│ Internal links            ✓ Connected                │
│ Metadata                  ✓ Complete                 │
│ Sitemap                   ✓ Included                 │
│                                                      │
│ Overall state: EVIDENCE_STALE                        │
└──────────────────────────────────────────────────────┘
```

Much more actionable than "SEO 82."

---

## 7. Add a content dependency graph

This becomes especially useful as Trading Guide grows.

For example:

```text
Stake OfferingFee
       │
       ├── Stake profile
       │
       ├── Brokerage calculator
       │
       ├── Trading cost calculator
       │
       ├── Brokerage fees guide
       │
       ├── CommSec vs Stake
       │
       └── moomoo vs Stake
```

If Stake changes its pricing, the admin could eventually show:

```text
STAKE PRICING UPDATED

Potentially affected:

• Stake provider profile
• Brokerage calculator
• Trading cost calculator
• Brokerage Fees Australia
• CommSec vs Stake
• moomoo vs Stake
```

That is much more powerful than manually remembering where a fee has been mentioned.

---

## 8. Content opportunity → publishing workflow

This would also answer the question you asked before about how `CONTENT_OPPORTUNITIES` should eventually work.

Imagine:

```text
/admin/content/opportunities
```

You open:

```text
FX fees when buying US shares
```

and see:

```text
STATUS
PLANNED

PRIORITY
BUILD NOW

SEARCH INTENT
Understand currency-conversion costs when
Australians buy overseas shares.

RECOMMENDED CONTENT TYPE
Guide

TARGET URL
/guides/fx-fees-us-shares-australia

RELATED TOOL
FX Fee Calculator

RELATED PROVIDERS
Stake
CommSec
CMC
moomoo
IBKR
eToro

EVIDENCE REQUIRED
□ Moneysmart
□ Official provider FX schedules
□ Structured OfferingFee records

[Start research]
```

Then:

```text
PLANNED
   ↓
RESEARCHING
   ↓
DRAFT
   ↓
REVIEW
   ↓
PUBLISHED
   ↓
REFRESH DUE
   ↓
REVIEWED
```

Now the 50-opportunity roadmap becomes something you can actually operate from.

---

## 9. But I would keep AI generation controlled

I would **not** add:

```text
[Generate 50 articles]
```

Instead, perhaps later:

```text
[Create research brief]
[Create draft outline]
[Create article draft]
```

with human review before publishing.

For financial content, the desirable workflow is:

```text
AI assistance
      +
structured database
      +
official sources
      +
human/editorial review
      ↓
published content
```

not:

```text
keyword
   ↓
AI
   ↓
auto-publish
```

---

# What Phase 9.4 would actually build

I would scope the implementation to roughly:

```text
/admin/content
/admin/content/opportunities
/admin/content/refresh
```

plus services such as:

```text
src/lib/content/
    opportunity-status.ts
    freshness.ts
    health.ts
    dependencies.ts
    source-coverage.ts
```

and reuse your existing:

```text
CONTENT_OPPORTUNITIES
curated comparisons
guide registry
OfferingFee
OfferingFeature
OfferingCustody
OfferingMarket
verificationStatus
verifiedAt
reviewDueAt
```

Rather than introducing a huge new database model immediately, I'd first calculate as much as possible from the information we already have.

---

# What I would _not_ do in 9.4

I wouldn't use 9.4 to publish another 20–50 pages, build a generic AI writer, add fake review scores, add "best broker" rankings, create thousands of programmatic comparison pages, or rebuild your existing Article CMS.

We've already built enough public surfaces to justify stopping and strengthening the operational layer.

---

## Then Phase 9.5 becomes much safer

Once 9.4 exists, scaling content becomes controlled:

```text
             CONTENT_OPPORTUNITIES
                       │
                       ▼
                 Phase 9.4
             Editorial control
                       │
            ┌──────────┼──────────┐
            ↓          ↓          ↓
         Research   Freshness   Evidence
            │          │          │
            └──────────┼──────────┘
                       ▼
                    Publish
                       │
                       ▼
                    Phase 9.5
                 Scale content
```

So my recommended **Phase 9.4 is not another SEO-content batch**. It is the **Content Operations & Freshness Control Center** that lets you confidently maintain everything we've just built as provider fees, regulations, features and sources change.

That is the phase I would implement next before materially increasing Trading Guide's indexed page count.
