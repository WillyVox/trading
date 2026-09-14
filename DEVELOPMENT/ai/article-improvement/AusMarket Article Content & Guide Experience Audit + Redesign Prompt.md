# ROLE

Act as a senior:

- fintech product designer;
- editorial UX designer;
- financial-content strategist;
- Australian financial-services content specialist;
- SEO strategist;
- information architect;
- design-system engineer;
- senior Next.js/React/TypeScript engineer;
- rich-text/editor architect;
- accessibility specialist;
- conversion/affiliate UX specialist;
- technical SEO specialist.

You are reviewing my existing Australian financial comparison and market-intelligence project:

> **AusMarket / trading-online**

The website currently focuses on Australian crypto exchanges and will later expand into:

- share trading platforms;
- brokers;
- forex;
- CFDs where appropriate;
- investment platforms;
- financial-market education;
- market intelligence;
- comparison tools.

The business model includes affiliate/referral revenue, but editorial usefulness, factual accuracy, transparency and user trust must come before monetisation.

---

# CRITICAL WORKING RULE

## DO NOT MODIFY CODE YET.

This task is initially:

> **AUDIT → RESEARCH → COMPARE → DESIGN → RECOMMEND**

not implementation.

Before changing anything:

1. inspect the latest source code;
2. inspect the Article/Guide database models;
3. inspect the admin article editor;
4. inspect how editor content is stored;
5. inspect how article content is rendered publicly;
6. inspect the attached/current AusMarket article screenshot;
7. research high-quality competitors;
8. compare their article UX with ours;
9. identify strengths and weaknesses;
10. propose a comprehensive article-content design system;
11. show examples/mockups/component structures;
12. explain implementation implications;
13. STOP.

Wait for my approval before modifying code.

---

# CURRENT PROBLEM

Our current article page looks approximately like the supplied AusMarket screenshot.

Example article:

> **CoinSpot vs Swyftx vs Independent Reserve: Comparing Three Australian Exchanges**

The top of the article is reasonably structured:

- breadcrumbs;
- category;
- title;
- description/deck;
- author;
- published date;
- updated date;
- reading time;
- Key Takeaways;
- Table of Contents.

However, after the introduction, the article becomes visually flat.

Currently much of the body looks approximately like:

```text
Paragraph
Paragraph
Fees
Paragraph
Coin selection
Paragraph
Interface style
Paragraph
AUD funding
Paragraph

CoinSpot     Swyftx     Independent Reserve
...
```

This does not look like a polished financial publication.

The underlying information may be useful, but the presentation does not communicate hierarchy or make the content enjoyable to scan.

---

# REFERENCE COMPETITOR

One reference is:

> **TradingGuide.co.uk**

I have provided a screenshot of one of its long-form cryptocurrency guides.

Do NOT simply clone TradingGuide.

Instead analyse:

### What they do well

For example:

- strong H2 hierarchy;
- contextual images;
- screenshots/illustrations;
- visual callouts;
- step-by-step sections;
- cards;
- highlighted important information;
- FAQs;
- author/reviewer information;
- related content;
- comfortable article width;
- generous whitespace;
- visual rhythm;
- scannability.

### What they do poorly

Look for:

- excessive affiliate CTAs;
- distracting advertising;
- unnecessary widgets;
- visual clutter;
- generic stock imagery;
- weak evidence/source presentation;
- questionable SEO patterns;
- excessive page length;
- interruptions to reading;
- compliance/trust concerns.

We should adopt the good ideas while improving on their weaknesses.

---

# RESEARCH MORE COMPETITORS

Do not compare only against TradingGuide.

Research current article/guide experiences from relevant publishers such as:

- Finder Australia;
- Canstar;
- Forbes Advisor Australia;
- MoneySmart;
- CHOICE;
- Mozo;
- CoinDesk;
- Investopedia;
- NerdWallet;
- Bankrate;
- reputable Australian broker/exchange education sites where relevant.

For each, analyse:

- article width;
- typography;
- title hierarchy;
- hero imagery;
- author presentation;
- reviewed/fact-checked information;
- updated dates;
- TOC;
- key takeaways;
- tables;
- cards;
- charts;
- images;
- captions;
- callouts;
- warnings;
- definitions;
- steps;
- FAQs;
- sources;
- citations;
- affiliate CTAs;
- related content;
- mobile behaviour.

Create a comparison table.

Example:

| Feature | AusMarket | TradingGuide | Finder | Canstar | Investopedia | Recommendation |
|---|---|---|---|---|---|---|

---

# IMPORTANT: ANALYSE OUR EXISTING CODE FIRST

Find the actual implementation.

Inspect at minimum:

```text
prisma/schema.prisma

src/app/**/articles/**
src/app/**/guides/**
src/app/**/[slug]/**

src/components/article/**
src/components/articles/**
src/components/content/**
src/components/editor/**

src/lib/articles/**
src/lib/content/**

admin article create/edit pages
rich-text editor configuration
article renderer
CSS/Tailwind styles
typography configuration
```

Search for:

```text
Article
ArticleProvider
content
body
featuredImage
featuredImageAlt
excerpt
summary

Editor
TipTap
Lexical
ProseMirror
Slate
EditorJS

dangerouslySetInnerHTML
prose
@tailwindcss/typography

TableOfContents
KeyTakeaways
RelatedGuides
Sources
```

Determine exactly:

> **Is our problem primarily the editor, the stored content, the renderer, the CSS/design system, the article template—or all of them?**

Do not assume.

---

# PROBLEM 1 — TYPOGRAPHY

Our current article body appears too visually uniform.

Audit:

- body font;
- body size;
- line height;
- paragraph spacing;
- heading font;
- H2/H3/H4 hierarchy;
- heading margins;
- list spacing;
- inline links;
- bold/italic treatment;
- blockquotes;
- captions;
- table typography;
- mobile typography.

The reader should immediately distinguish:

```text
H1

Intro/deck

H2

Body

H3

Body

Callout

Table

Caption
```

without consciously thinking about it.

---

# PROBLEM 2 — CONTENT WIDTH

Investigate our current reading width.

Long-form article text should not stretch excessively wide.

Recommend appropriate:

```text
article max width
paragraph measure
sidebar width
gutter
desktop container
tablet layout
mobile layout
```

Do not arbitrarily copy another site's pixel values.

Explain the reasoning.

---

# PROBLEM 3 — VISUAL RHYTHM

The current page has long runs of plain text.

Design a system that creates intentional rhythm:

```text
Text
↓
Visual
↓
Text
↓
Callout
↓
Comparison
↓
Text
↓
Steps
↓
Evidence
↓
Decision aid
```

rather than:

```text
Text
Text
Text
Text
Text
Table
Text
Text
```

---

# PROBLEM 4 — IMAGES

Our rich editor supports or should support images.

Determine how article images should work.

Potential types:

### Hero image

```text
Title
Deck
Author/date
Hero image
Caption/source
```

### Inline explanatory image

```text
H2
Paragraph
Image
Caption
Paragraph
```

### Provider screenshots

Example:

```text
CoinSpot trading interface
[image]

Caption:
CoinSpot Markets interface.
Source: CoinSpot. Captured September 2026.
```

### Diagrams

Example:

```text
AUD
 ↓
Exchange
 ↓
Crypto purchase
 ↓
Exchange wallet
 ↓
Optional self-custody
```

### Data visualisations

Example:

```text
Trading fee comparison
CoinSpot       0.10%
Swyftx         0.10–0.60%
Ind. Reserve   tiered
```

Analyse:

- image sizes;
- aspect ratios;
- responsive rendering;
- captions;
- alt text;
- lazy loading;
- attribution;
- source URL;
- copyright;
- screenshots;
- optimisation;
- WebP/AVIF;
- SVG safety.

---

# IMPORTANT IMAGE RULE

Do NOT recommend adding decorative images merely to make an article longer or prettier.

Every image should ideally do at least one of:

- explain;
- demonstrate;
- compare;
- provide evidence;
- orient the reader;
- break complexity;
- show a real interface/product.

Avoid meaningless stock photography where possible.

---

# PROBLEM 5 — COMPARISON TABLES

Our current comparison table is visually weak.

Redesign tables as a reusable financial-comparison component.

Example:

| Feature | CoinSpot | Swyftx | Independent Reserve |
|---|---:|---:|---:|
| Order-book fee | 0.10% | 0.10–0.60% | Tiered |
| Instant buy | 1% + spread | fee + spread | — |
| AUD funding | ✓ | ✓ | ✓ |
| Assets | 470+ | 410+ | narrower |
| Interface | Beginner | Beginner | Advanced |

Consider:

- sticky first column;
- horizontal mobile scrolling;
- zebra/row separation;
- highlighted differences;
- source indicators;
- verification dates;
- tooltips;
- responsive card transformation.

Do NOT use misleading:

```text
BEST
WINNER
#1
RECOMMENDED FOR YOU
```

unless our methodology genuinely supports the claim and compliance review permits it.

---

# PROBLEM 6 — FACT CARDS

Introduce reusable data/fact cards where appropriate.

Example:

```text
┌───────────────────────────────┐
│ COINSPOT                      │
│                               │
│ Markets fee       0.10%       │
│ Instant buy       1%          │
│ Assets            470+        │
│ AUD deposits      Available   │
│                               │
│ Verified 14 Sep 2026          │
│ View sources →                │
└───────────────────────────────┘
```

These should preferably use our structured provider database rather than duplicate manually entered facts.

Analyse whether article components can reference:

```text
Provider
ProviderFee
ProviderFact
ProviderFeature
ProviderRegulation
```

instead of authors manually typing volatile numbers.

---

# THIS IS VERY IMPORTANT

We already maintain structured provider data.

Do NOT create an architecture where an editor manually writes:

```text
CoinSpot has 470+ assets
```

in ten different articles if that value could instead be rendered from the verified Provider dataset.

Investigate a hybrid model:

```text
EDITORIAL CONTENT
+
STRUCTURED VERIFIED DATA
```

Example:

```text
Article
   ↓
ProviderComparisonBlock
   ↓
Provider IDs
   ↓
Provider database
   ↓
latest verified fees/features
```

Explain feasibility, benefits and risks.

---

# PROBLEM 7 — CALLOUT BLOCKS

Design reusable semantic blocks.

Potential blocks:

## Key takeaway

```text
KEY TAKEAWAY
CoinSpot's Markets fee is materially lower than its
Instant Buy/Sell fee. These products should not be
compared as though they were the same service.
```

## Important

```text
IMPORTANT
Fees can change. Verify the provider's current fee
schedule before opening an account or trading.
```

## Risk

```text
CRYPTO RISK
Crypto assets are volatile and you can lose money.
```

## Example

```text
EXAMPLE
A $1,000 transaction at 0.10% equals $1 in explicit
trading fees before considering spreads.
```

## Definition

```text
WHAT IS A SPREAD?
The spread is the difference...
```

## Source/evidence

```text
SOURCE CHECK
Fee verified against CoinSpot's official fee schedule
on 14 September 2026.
```

Create a coherent design system rather than random coloured boxes.

---

# PROBLEM 8 — STEP-BY-STEP CONTENT

For How-To guides, support a dedicated step component.

Example:

```text
STEP 1
Choose an exchange

Compare:
• fees
• AUD funding
• supported assets
• security features
• regulatory information

[Compare exchanges →]
```

Then:

```text
STEP 2
Create an account
```

etc.

Determine whether steps should be rich-editor nodes/components rather than manually styled paragraphs.

---

# PROBLEM 9 — TABLE OF CONTENTS

Our TOC currently sits on the right.

Audit it.

Consider:

Desktop:

```text
Article                Sticky TOC
                       ──────────
                       Fees
                       Coin selection
                       Interface
                       AUD funding
                       Who it suits
```

Potential enhancements:

- sticky behaviour;
- active-section indicator;
- scroll spy;
- accessible anchor links;
- collapsible mobile TOC;
- progress indicator.

Avoid making it distracting.

---

# PROBLEM 10 — KEY TAKEAWAYS

Our Key Takeaways block is useful.

Do NOT remove it just because the competitor looks different.

Improve it.

Consider:

```text
KEY TAKEAWAYS

01  CoinSpot has the lowest explicit
    order-book fee of these three.

02  Swyftx uses tiered fees...

03  Independent Reserve is more
    order-book oriented.

04  All support AUD funding...
```

Determine whether numbered takeaways improve scanning.

---

# PROBLEM 11 — DECISION SUMMARY

Comparison articles should help readers understand differences without giving inappropriate personalised financial advice.

Consider a section such as:

# Which platform may suit which use case?

Instead of:

> Best exchange

use objective framing:

```text
IF YOU PRIORITISE             CONSIDER RESEARCHING

Simple instant-buy UX        CoinSpot / Swyftx

Order-book trading           Independent Reserve

Broad asset selection        CoinSpot / Swyftx
```

Include appropriate qualification.

Analyse compliance implications.

---

# PROBLEM 12 — SOURCES

I want AusMarket to be **better than competitors at evidence**.

Current source links at the bottom are useful but insufficient.

Design a stronger evidence system.

Potentially:

```text
Markets fee 0.10% [1]
```

and:

```text
Sources

1. CoinSpot — Official fee schedule
   Checked 14 Sep 2026

2. Swyftx — Official fee schedule
   Checked 14 Sep 2026

3. Independent Reserve — Official fee schedule
   Checked 14 Sep 2026
```

Consider:

- inline citations;
- footnotes;
- source cards;
- checked dates;
- official/regulator badges;
- external-link indicators.

Avoid citation clutter.

---

# PROBLEM 13 — AUTHOR / REVIEWER / FACT CHECKING

Financial content is trust-sensitive.

Evaluate:

```text
Written by
Edited by
Reviewed by
Fact checked by
Last verified
```

Do not fake expertise.

Only show roles that correspond to real people/processes.

Potential design:

```text
Written by Editorial Team

Fact checked
14 Sep 2026

Provider data verified
against primary sources
```

Research competitor approaches.

---

# PROBLEM 14 — ARTICLE INTRODUCTION

Current introductions may be too generic.

Develop an editorial standard.

The first 100–150 words should answer:

1. What is this article about?
2. Who is it for?
3. What did we compare/research?
4. What will the reader learn?
5. When was the information verified?

Avoid SEO filler.

---

# PROBLEM 15 — AFFILIATE CTAs

Do NOT turn articles into advertisements.

Research competitors and propose a restrained CTA system.

Potential CTA:

```text
CoinSpot
Fees from 0.10% on Markets

[View provider details]
[Visit provider ↗]

Affiliate link
```

Potential placements:

- comparison table;
- provider section;
- end of relevant section;
- final comparison summary.

Do NOT insert CTA after every paragraph.

Clearly distinguish:

```text
Editorial information
```

from:

```text
Commercial/affiliate link
```

---

# PROBLEM 16 — RELATED CONTENT

Improve our Related Guides area.

Instead of generic cards only:

```text
Continue researching

How to choose a crypto exchange
5 min read

CoinSpot review
8 min read

Crypto exchange fees explained
6 min read
```

Use meaningful internal linking.

Analyse SEO/content-cluster benefits.

---

# PROBLEM 17 — ARTICLE FOOTER

Our article currently ends with:

```text
Sources
Related guides
Site footer
```

Consider a stronger ending:

```text
Summary
↓
Important risks
↓
Sources
↓
Methodology / how we researched
↓
Author / verification
↓
Related guides
↓
Newsletter (if appropriate)
↓
Site footer
```

Do not unnecessarily duplicate information.

---

# PROBLEM 18 — RICH EDITOR ARCHITECTURE

Inspect our existing editor.

Determine whether it can support semantic nodes such as:

```text
paragraph
heading
bulletList
orderedList
blockquote
link
image
video
table

callout
keyTakeaways
comparisonTable
providerCard
providerComparison
step
prosCons
definition
riskWarning
source
quote
chart
embed
CTA
```

Do NOT assume every component belongs in the editor.

Some may be template-level components.

Separate:

### Article-template components

from:

### Editor-controlled content blocks

from:

### Database-powered dynamic components.

Explain the distinction.

---

# PROBLEM 19 — STRUCTURED CONTENT

Evaluate whether storing only HTML is sufficient.

Compare:

### HTML

vs

### TipTap JSON / ProseMirror JSON

vs

### block-based JSON

vs

### MDX

vs

### hybrid architecture.

Consider:

- rendering;
- sanitisation;
- migrations;
- SEO;
- dynamic provider blocks;
- versioning;
- editor compatibility;
- portability.

Do NOT migrate anything yet.

---

# PROBLEM 20 — MOBILE

The competitor screenshot demonstrates a very long mobile article.

Design mobile intentionally.

Audit:

- title wrapping;
- hero;
- TOC;
- tables;
- images;
- captions;
- callouts;
- CTA size;
- sticky elements;
- line length;
- font size;
- related content.

Avoid excessive sticky banners or overlays.

---

# PROBLEM 21 — ACCESSIBILITY

Audit:

- semantic headings;
- heading order;
- table headers;
- captions;
- image alt text;
- link labels;
- contrast;
- keyboard navigation;
- focus states;
- embedded media;
- reduced motion.

Target WCAG 2.2 AA where practical.

---

# PROBLEM 22 — PERFORMANCE

Rich articles can become heavy.

Analyse:

- image optimisation;
- Next/Image;
- lazy loading;
- responsive `sizes`;
- video loading;
- embeds;
- third-party scripts;
- TOC JavaScript;
- hydration;
- Core Web Vitals.

Article richness must not destroy performance.

---

# PROBLEM 23 — SEO

Audit article SEO.

Consider:

```text
title
meta description
canonical
OpenGraph
Twitter metadata
breadcrumbs
Article structured data
BlogPosting where appropriate
Person
Organization
BreadcrumbList
```

Do not blindly generate unsupported/deprecated structured data.

Google should receive the same truthful content users see.

---

# VERY IMPORTANT — PEOPLE-FIRST CONTENT

Do not optimise articles merely by:

- making them longer;
- stuffing keywords;
- generating FAQs for every article;
- adding unnecessary headings;
- adding generic AI prose;
- adding meaningless stock images;
- repeating provider descriptions.

We want:

> useful, original, evidence-based Australian financial content.

Every section should answer a real reader question.

---

# YMYL / FINANCIAL TRUST

Because our content concerns money/investing/trading, evaluate stronger trust requirements.

Research current Google guidance around:

- helpful content;
- people-first content;
- E-E-A-T concepts;
- financial/YMYL content;
- authorship;
- sourcing;
- factual accuracy;
- update processes.

Do NOT make unsupported claims that a particular UI change directly increases ranking.

Separate:

```text
Good user/editorial practice
```

from:

```text
Confirmed Google guidance
```

from:

```text
Our hypothesis
```

---

# ARTICLE DESIGN SYSTEM

Propose a complete reusable system.

For example:

```text
ArticlePage
│
├── Breadcrumbs
│
├── ArticleHeader
│   ├── Category
│   ├── H1
│   ├── Deck
│   ├── Author
│   ├── Published
│   ├── Updated
│   └── ReadingTime
│
├── HeroMedia
│
├── ArticleLayout
│   │
│   ├── ArticleBody
│   │   ├── KeyTakeaways
│   │   ├── Paragraph
│   │   ├── Heading
│   │   ├── Image
│   │   ├── Callout
│   │   ├── ProviderFactCard
│   │   ├── ComparisonTable
│   │   ├── Steps
│   │   ├── ProsCons
│   │   ├── RiskNotice
│   │   └── Citation
│   │
│   └── ArticleTOC
│
├── Sources
├── Methodology
├── AuthorCard
├── RelatedContent
└── ArticleDisclosure
```

Critique this structure and improve it.

---

# VISUAL MOCKUP

Before implementation, produce a text/wireframe mockup of how our existing:

> CoinSpot vs Swyftx vs Independent Reserve

article should look after redesign.

For example:

```text
┌─────────────────────────────────────────────────────────┐

Home › Crypto › Exchanges › Compare

CRYPTO EXCHANGES

CoinSpot vs Swyftx vs Independent Reserve
Comparing three Australian crypto exchanges

A source-linked comparison of fees, AUD funding,
asset selection and trading interfaces.

By AusMarket Editorial Team
Updated 14 Sep 2026 • 8 min read

──────────────────────────────────────────────────────────

[HERO / COMPARISON VISUAL]

──────────────────────────────────────────────────────────

KEY TAKEAWAYS

01  ...
02  ...
03  ...

──────────────────────────────────────────────────────────

                 ARTICLE               CONTENTS

                 Introduction          Fees
                                       Assets
                 ## Fees               Interface
                                       Funding
                 [fee cards]           Comparison
                                       Sources

                 [comparison table]

                 ## Coin selection

                 [provider cards]

                 ## Interface

                 [screenshots]

                 ## AUD funding

                 [comparison]

                 ## Side-by-side summary

                 [rich table]

                 ## Which differences matter?

                 [decision matrix]

                 ## Risks and limitations

                 ## Sources

──────────────────────────────────────────────────────────

HOW WE RESEARCH

AUTHOR / FACT CHECK

RELATED GUIDES

└─────────────────────────────────────────────────────────┘
```

Improve substantially on this.

---

# ALSO MOCK UP MOBILE

Show how the same article should behave at approximately:

```text
390px
```

especially:

- title;
- key takeaways;
- TOC;
- tables;
- provider cards;
- images;
- callouts.

---

# CONTENT QUALITY AUDIT

Do not focus only on appearance.

Read the actual current article content and identify:

### Good content

What should remain?

### Weak content

What is generic, repetitive, unsupported or insufficient?

### Missing content

What would genuinely help a reader make sense of the comparison?

### Volatile facts

What should come dynamically from our Provider database?

### Claims requiring evidence

What needs citations?

### Potentially risky wording

What could sound like personal financial advice, an unsupported ranking, or a regulatory claim?

---

# COMPARE THE CURRENT ARTICLE WITH A BETTER VERSION

Take approximately one representative section such as:

> Fees

Show:

### CURRENT APPROACH

Explain its weaknesses.

Then:

### RECOMMENDED CONTENT STRUCTURE

Show the improved structure.

For example:

```text
## Fees

Short explanation

[visual fee comparison]

Important distinction:
order-book vs instant-buy pricing

[comparison table]

### CoinSpot

...

### Swyftx

...

### Independent Reserve

...

[example calculation]

Source / verified date
```

Do this without fabricating facts.

---

# DESIGN PRINCIPLE

The finished page should feel like:

> **an independent Australian financial research publication**

not:

> blog post

and not:

> affiliate landing page.

Target characteristics:

- authoritative;
- calm;
- modern;
- evidence-driven;
- readable;
- premium;
- trustworthy;
- distinctly Australian;
- useful to beginners;
- useful to more experienced users;
- commercially viable without looking commercially compromised.

---

# DO NOT COPY COMPETITORS

TradingGuide and other competitors are references only.

Identify:

> **ADOPT**

things they do well.

> **IMPROVE**

things they do imperfectly.

> **AVOID**

things that would weaken AusMarket.

Then identify:

> **OUR DIFFERENTIATOR**

For example, our opportunity may be:

```text
Beautiful editorial presentation
+
structured provider data
+
primary-source provenance
+
verification dates
+
transparent methodology
+
comparison tools
```

That could be substantially stronger than simply producing prettier articles.

---

# EXPECTED OUTPUT

Return the analysis in this order:

## 1. Executive assessment

Give the current AusMarket article experience a score out of 10.

Explain the largest problems.

---

## 2. What is already good

Do not redesign good features unnecessarily.

---

## 3. Screenshot comparison

AusMarket vs TradingGuide.

---

## 4. Competitor research

Compare several high-quality publishers.

---

## 5. Content-quality audit

Evaluate the actual article, not just CSS.

---

## 6. UX/UI problems

Rank:

```text
Critical
High
Medium
Low
```

---

## 7. Article information architecture

Propose the ideal page structure.

---

## 8. Article content-block system

List recommended blocks and explain when each should be used.

---

## 9. Editor audit

Determine what our admin editor can currently create and what is missing.

---

## 10. Renderer audit

Determine whether existing rich content is being rendered/styled correctly.

---

## 11. Structured-data integration

Explain how Provider facts/fees/features can power article components.

---

## 12. Typography/design system

Recommend hierarchy, spacing, widths and responsive behaviour.

---

## 13. Image/media strategy

Recommend hero/inline/screenshot/diagram behaviour.

---

## 14. Table strategy

Design proper comparison tables.

---

## 15. Trust/source system

Improve citations, verification and author/reviewer presentation.

---

## 16. Affiliate strategy

Explain how to monetise without degrading trust.

---

## 17. SEO assessment

People-first + technical SEO.

---

## 18. Desktop wireframe

Show the redesigned article.

---

## 19. Mobile wireframe

Show the redesigned article at ~390px.

---

## 20. Before/after example

Rewrite/restructure one current article section as a demonstration.

---

## 21. Component architecture

Propose React components, but DO NOT implement them.

---

## 22. Data-model implications

Identify whether Prisma/editor schemas need changes.

Do NOT migrate anything.

---

## 23. Implementation phases

For example:

### Phase 1 — Article typography and renderer
High impact / low risk

### Phase 2 — Rich semantic blocks

### Phase 3 — Provider-data-powered blocks

### Phase 4 — Images/media

### Phase 5 — citations/trust

### Phase 6 — analytics and optimisation

Improve this ordering if necessary.

---

## 24. Files that would eventually change

List exact files based on the actual repository.

---

## 25. Risks and concerns

Include:

- SEO;
- accessibility;
- compliance;
- content integrity;
- affiliate bias;
- performance;
- image copyright;
- stale financial data;
- editor complexity.

---

## 26. Final recommendation

Clearly state:

### KEEP

### CHANGE

### ADD

### REMOVE

### DEFER

---

# FINAL INSTRUCTION

Do not start coding.

I want to understand:

> what is wrong,
> why it is wrong,
> what competitors do better,
> what competitors do worse,
> what AusMarket should uniquely do,
> what architecture we should adopt,
> and what the finished article should look like

**before I approve implementation.**

STOP after the analysis and wait for my approval.