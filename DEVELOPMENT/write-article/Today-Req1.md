1. Your database is much more advanced than your admin CMS

Your Article model already contains a lot of useful infrastructure:

title and slug
excerpt and HTML content
key takeaways
SEO title and description
canonical URL
featured image
author/reviewer
publish/schedule timestamps
last-reviewed timestamp
search intent
regional variants
tags
sources
related providers
related crypto assets
curated related articles
affiliate disclosure control

It can already connect an article to providers such as CoinSpot or Kraken through ArticleProvider, and distinguish whether a provider is merely mentioned, actually compared, or featured.

So your database is already capable of representing something like:

“5 Best Crypto Exchanges in Australia in 2026”

with:

CoinSpot → COMPARED
Kraken → COMPARED
Independent Reserve → COMPARED
Bitcoin → related crypto asset
Search intent → COMPARISON
Key takeaways
Sources
SEO metadata
Affiliate disclosure
Related beginner guides

The problem is that your admin user currently has almost no practical way to create that data.

Your /admin/articles/new literally says:

Placeholder — no editor or createArticle() server action wired up yet.

And /admin/articles/[id] says the same thing for editing.

So today, the architecture is somewhat like having a well-designed database behind a CMS that has no editor.

2. This is now blocking several later features

This is why I said the project has “circled back” to Phase 3.

You have continued building later phases:

provider/exchange database
provider fees/features/facts
comparison functionality
affiliate system
crypto assets
SEO
guide templates
related guides
source display
affiliate CTAs
provider-related content

But many of those features depend on having actual editorial content stored correctly in Article.

For example, you already have code for:

Provider
↓
ArticleProvider
↓
Article

which means an exchange page can show articles related to it.

But unless the admin CMS lets you select:

Related provider:
CoinSpot

Relationship:
FEATURED

that relationship either has to be manually seeded/imported or doesn't exist.

So the backend feature technically exists, but the business workflow does not.

3. One important problem: Guide and News are not really different content types yet

This is one of the bigger architectural problems I found.

Your existing public routes are:

/news/[slug]

/crypto/guides/[slug]

But both use the same function:

getArticleBySlug(slug)

That function checks:

status === "PUBLISHED"

but does not check whether the article is actually a News article or Guide article.

That means conceptually this can happen:

Article:
slug = bitcoin-fees-australia
category = guide

Then:

/crypto/guides/bitcoin-fees-australia

works.

But potentially:

/news/bitcoin-fees-australia

can resolve the same article too.

That is not good for SEO or content architecture.

You could end up with duplicate content under different URLs.

And Google could see:

/news/foo

/crypto/guides/foo

containing effectively the same page.

That creates:

duplicate URL problems
canonical ambiguity
incorrect breadcrumbs
incorrect structured data
wrong NewsArticle schema
wrong user expectations
What we should do

Create a proper field like:

enum ArticleType {
  NEWS
  GUIDE
  COMPARISON
  PROVIDER_REVIEW
  EDUCATION
  MARKET_ANALYSIS
}

Then resolve:

getPublishedArticle({
  slug,
  type: "GUIDE"
})

for guide pages.

And:

getPublishedArticle({
  slug,
  type: "NEWS"
})

for News.

Even if you start with only:

NEWS
GUIDE

that is already much safer.

4. Your current category is doing too many jobs

Right now you're apparently using strings like:

category = "guide"

to tell the application what kind of content something is.

But "Guide" is really a content type, not necessarily a topic.

A better architecture separates these ideas.

For example:

Article type:
GUIDE

Category:
Crypto Exchanges

Search intent:
COMPARISON

Tags:
Australia
Crypto
Beginner
Fees

Another article could be:

Article type:
GUIDE

Category:
Bitcoin

Search intent:
BEGINNER

And another:

Article type:
NEWS

Category:
Regulation

Search intent:
MARKET_EDUCATION

This gives you much better SEO structure later.

5. Your editorial workflow is incomplete

Currently your enum is essentially:

DRAFT
PUBLISHED
ARCHIVED

But you specifically want editors/admins to inspect articles before publishing.

So we need:

DRAFT
↓
REVIEW
↓
PUBLISHED
↓
ARCHIVED

This matters more than it may look.

Imagine importing 50 articles.

You don't want them immediately public.

They should arrive as:

DRAFT

An admin edits one.

Then:

Submit for review

Now it becomes:

REVIEW

You preview it exactly as visitors would see it.

Then:

Publish

Only then should Google and public users be able to access it.

6. Preview is very important

Your current public service deliberately does this:

if (!article || article.status !== "PUBLISHED") return null;

That's good for visitors.

But it means you also need a separate secure admin preview mechanism.

For example:

/admin/articles/abc123/preview

An administrator could see:

DRAFT
REVIEW
PUBLISHED

through that route.

But public users requesting:

/crypto/guides/foo

should only see:

PUBLISHED

This protects unfinished content.

It also prevents Google accidentally crawling unfinished drafts.

7. The article renderer needs refactoring

Your Guide page currently does something like:

dangerouslySetInnerHTML={{
  __html: contentHtml
}}

and your News page similarly directly outputs:

dangerouslySetInnerHTML={{
  __html: article.content
}}

This has two problems.

First: sanitisation must be guaranteed.

Second: plain HTML cannot easily render your application components.

You want something much more powerful.

For example:

<h2>Top exchanges for Australian users</h2>

<p>...</p>

{{provider-comparison:coinspot,kraken,independent-reserve}}

<h2>What about fees?</h2>

<p>...</p>

Your renderer sees:

{{provider-comparison:...}}

and renders your real React comparison component.

That is much better than storing an enormous HTML table.

8. Why storing comparison data directly inside article HTML is a bad idea

Suppose today you write:

CoinSpot fee is X.

And you put that directly in Article HTML.

Later your Provider database changes.

Now:

ProviderFee

says one thing, but your article says something else.

You now have two versions of the truth.

Instead, for structured facts, the article should say something like:

{{provider-comparison:coinspot,kraken}}

Your renderer then pulls the latest data from:

Provider
ProviderFee
ProviderFeature
ProviderFact
ProviderRegulation

So your architecture becomes:

ARTICLE
editorial explanation
        ↓

EMBED
provider-comparison
        ↓

PROVIDER DATABASE
actual current structured data

This is one of the strongest parts of the architecture you're moving toward.

9. This is particularly useful for SEO

Imagine your article:

Best Crypto Exchanges in Australia in 2026

It could contain:

Introduction

Key takeaways

How we compared exchanges

Best exchanges overview

[REAL PROVIDER COMPARISON COMPONENT]

CoinSpot analysis

Kraken analysis

Independent Reserve analysis

[REAL FEE COMPARISON]

Security considerations

Which is easier for beginners?

Risks

FAQ

Sources

This is substantially more useful than writing 2,000 words of generic SEO content.

And because the comparison component is server-rendered, Google can potentially see meaningful content in the HTML rather than a blank client-side widget.

10. Your provider relationships are already a very valuable feature

You already have this architecture:

Article
   │
   ├── ArticleProvider
   │
   ├── ArticleCryptoAsset
   │
   ├── ArticleTag
   │
   ├── ArticleSource
   │
   └── ArticleRelated

This is very strong for internal linking.

For example:

Article:
"CoinSpot vs Kraken"

Provider relationships:
CoinSpot → COMPARED
Kraken → COMPARED

Then your system can automatically know that this article should appear on:

/crypto/exchanges/coinspot

and:

/crypto/exchanges/kraken

And potentially:

/compare/coinspot-vs-kraken

You should not manually enter those article links into each Provider page.

The database relationship should drive it.

11. The exchange page can become much richer

Today an exchange profile might contain:

Overview
Fees
Features
Pros & limitations
Regulation
Supported assets

After the Article CMS is complete, it can also automatically show:

Guides
How to Buy Bitcoin With CoinSpot
CoinSpot Fees Explained
Comparisons
CoinSpot vs Kraken
CoinSpot vs Independent Reserve
News
Recent CoinSpot updates

That creates a powerful content cluster.

Conceptually:

                  CoinSpot
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      Guide      Comparison      News
        ↓            ↓            ↓
 Bitcoin guide   CoinSpot vs   New feature
                 Kraken        announcement

This helps users navigate, and it gives search engines a much clearer understanding of how your site topics connect.

12. Your comparison pages get the same benefit

Suppose:

/compare/coinspot-vs-kraken

already contains factual comparison data.

The page should not necessarily contain 4,000 words of editorial content itself.

Instead it could have:

Comparison table
Fees
Features
Regulation

and then:

Want a deeper explanation?

Read: CoinSpot vs Kraken: Which is better for Australian beginners?

The article can provide:

methodology
interpretations
beginner explanations
advantages
disadvantages
use-case discussion
detailed sources

While the comparison page remains focused on structured facts.

That's cleaner than duplicating huge blocks of content.

13. Affiliate monetisation becomes much more effective

Right now affiliate redirects exist separately from content.

That's good.

After the CMS is complete, an article can safely contain something like:

{{affiliate-cta:coinspot}}

But instead of the article storing:

https://affiliate-network.com/abc123...

it uses your existing internal redirect:

/go/coinspot

Your affiliate service decides:

Is the partnership ACTIVE?

Is the AffiliateLink active?

What approved URL should be used?

Then it records the click.

This gives you:

Article
   ↓
Affiliate CTA
   ↓
/go/coinspot
   ↓
AffiliateLink
   ↓
Partner

That's much safer commercially.

14. You can also know which articles generate revenue

Because your existing click model contains fields such as:

sourcePage
placement
campaign

you could eventually know:

Article:
best-crypto-exchanges-australia

CTA:
CoinSpot

Clicks:
347

Conversions:
12

Then you can understand which content actually produces business results.

That's much better than only measuring traffic.

15. Affiliate and editorial data must remain separate

There is an important rule here.

Your article may say:

1. Exchange A
2. Exchange B
3. Exchange C

But that ranking should not automatically become:

highest affiliate commission first

Your existing architecture already helps because:

Provider domain

and:

Affiliate domain

are separate.

Keep that separation.

Think of it as:

Provider
= facts

Article
= editorial interpretation

Affiliate
= commercial relationship

Never:

Affiliate commission
        ↓
 determines factual ranking

That will protect both the quality of the site and your credibility.

16. The CMS should encourage quality instead of just storing HTML

The new admin page shouldn't just contain:

Title
Content
Save

That would waste most of the schema you've already built.

I would design something like this:

ARTICLE EDITOR

┌─────────────────────────────────────┐
│ BASIC INFORMATION                   │
│ Title                               │
│ Slug                                │
│ Article Type                        │
│ Category                            │
│ Excerpt                             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CONTENT                             │
│ Rich HTML editor                    │
│ Insert component                    │
│ Insert image                        │
│ Insert video                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ KEY TAKEAWAYS                       │
│ + Add takeaway                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ RELATIONSHIPS                       │
│ Providers                           │
│ Crypto assets                       │
│ Related guides                      │
│ Tags                                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SOURCES                             │
│ Label                               │
│ URL                                 │
│ Source type                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SEO                                 │
│ SEO title                           │
│ Description                         │
│ Search intent                       │
│ Canonical                           │
│ Noindex                             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PUBLISHING                          │
│ Draft                               │
│ Review                              │
│ Published                           │
│ Preview                             │
└─────────────────────────────────────┘

That's a real editorial CMS.

17. I would add an SEO/editorial assistant panel

Not an artificial:

SEO score: 97/100

because that tends to encourage bad optimisation.

Instead show useful warnings.

For example:

✓ SEO title provided
✓ Meta description provided
✓ 5 sources
✓ Featured image
✓ 4 key takeaways
✓ Related providers configured

⚠ No reviewer
⚠ Article hasn't been reviewed recently
⚠ Featured image missing alt text
⚠ No related beginner guide
⚠ Affiliate CTA exists but disclosure disabled

That's much more useful to an editor.

18. Your articles also need better trust signals

For finance and crypto especially, an article should ideally show something like:

Written by
Huy Vo

Reviewed by
Editor / qualified reviewer

Published
11 September 2026

Last reviewed
11 September 2026

Then:

Sources
1. ASIC
2. Exchange official fee schedule
3. AUSTRAC
4. Exchange support documentation

That is much stronger than an anonymous blog post.

You already have:

author
reviewer
lastReviewedAt
sources

so you're partway there.

19. There is also a concrete timestamp problem

I found a code/schema mismatch worth fixing immediately.

Your Guide page uses:

article.updatedAt

and your News page also uses:

article.updatedAt

for metadata such as:

dateModified

But the Article schema you supplied doesn't define:

createdAt
updatedAt

Your admin service even contains:

// orderBy: { updatedAt: "desc" }, // [TODO] Turn off for now

That's a sign this mismatch has already surfaced elsewhere.

I would add:

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

That gives you two different concepts:

updatedAt
= technically modified in database

lastReviewedAt
= editor meaningfully reviewed the financial content

You want both.

For example, changing an SEO title might update:

updatedAt

but shouldn't necessarily imply the article's financial information was checked again.

20. The importer then needs to catch up with the CMS

Right now you have a reasonably sophisticated import architecture.

That's good because it means once the Article model improves, you don't need two content systems.

Both of these workflows:

Admin CMS

and:

Article importer

should eventually feed into:

SAME ARTICLE DOMAIN

Meaning:

                  ┌── Admin Editor
                  │
Article domain ←──┤
                  │
                  └── Import Script

Not:

AdminArticle
ImportedArticle

or two incompatible formats.

21. What should happen when you import an article

Suppose you upload:

best-crypto-exchanges-australia.md

with:

title: 5 Best Crypto Exchanges in Australia in 2026
articleType: GUIDE

providers:
  - coinspot
  - kraken
  - independent-reserve

searchIntent: COMPARISON

and content:

<h2>Our top exchanges</h2>

{{provider-comparison:coinspot,kraken,independent-reserve}}

The importer should:

parse
   ↓
validate
   ↓
sanitize
   ↓
validate provider slugs
   ↓
validate embeds
   ↓
create relations
   ↓
save DRAFT

Then the article appears in:

/admin/articles

where you can edit and preview it.

That's a very useful workflow for you because AI-generated draft articles can eventually be imported into the CMS but still require editorial review before publication.

22. Article components are probably the most valuable future feature

You specifically asked for an article to display actual application components.

I think this could become one of the strongest aspects of your site.

Instead of writing:

CoinSpot has feature X, Kraken has Y...

you could embed:

Provider comparison
{{provider-comparison:coinspot,kraken}}
Current fees
{{provider-fees:coinspot}}
Exchange card
{{provider-card:kraken}}
Bitcoin information
{{crypto-asset:bitcoin}}
Affiliate CTA
{{affiliate-cta:coinspot}}
Related guides
{{related-guides}}

And later perhaps:

{{provider-regulation:coinspot}}

This means the article becomes a combination of:

EDITORIAL CONTENT
+
LIVE STRUCTURED DATA

That is much harder for a generic affiliate site to reproduce.

23. The security issue here is important

I would not let your admin enter:

<ProviderComparison providers={...} />

and execute it.

And I would not allow arbitrary:

<script>

or random:

<iframe>

either.

Instead:

Approved block type
+
validated configuration

For example:

{
  "type": "PROVIDER_COMPARISON",
  "providers": [
    "coinspot",
    "kraken"
  ]
}

The renderer knows exactly what component is permitted.

This gives you:

no arbitrary code execution
predictable rendering
server rendering
easier imports
easier migration
component reuse
safer admin experience
24. There is another benefit: old articles stay fresher

Consider an article written today:

Kraken vs CoinSpot fees.

If you manually write every fee into HTML, six months later you may need to inspect 100 articles.

But if the comparison portion is:

{{provider-comparison:coinspot,kraken}}

and the underlying ProviderFee data is kept up to date, all relevant articles automatically show updated structured data.

You still need to review the surrounding editorial prose, of course.

But it dramatically reduces duplication.

25. This is why I consider the Article CMS the next highest-priority feature

Think of everything you've already built as pieces of an engine:

Provider database        ✓
Crypto assets            ✓
Comparison engine        ✓
Affiliate redirects      ✓
SEO infrastructure       ✓
Guide template           ✓
Related content logic    ✓
Sources                   ✓
Admin authentication     ✓
Article relationships    ✓

But your content production interface is:

Article editor            ✗
Article editing           ✗
Review workflow           ✗
Preview                   ✗
Publishing actions        ✗
Embed editor              ✗
Relationship editor       ✗
SEO editing UI            ✗

That's why the system feels architecturally advanced but cannot yet fully deliver the business goal.

26. What I would build first

I would not try to build the entire advanced CMS in one enormous change.

I would divide it into roughly five implementation blocks:

1/ Fix the Article domain first. Add createdAt/updatedAt, REVIEW, and a real ArticleType; fix Guide/News route isolation; improve article service queries. This gives you a correct foundation.

2. Build real admin CRUD. Implement /admin/articles/new, /admin/articles/[id], server-side create/update, provider/asset/tag/source relationships, Draft/Review/Published actions, and secure Preview.

3. Create the shared ArticleRenderer. Sanitized HTML, heading IDs, images, videos, tables, and controlled embeds. Both public content and admin preview should use this renderer.

4. Add dynamic article components. Start with the highest-value blocks: PROVIDER_COMPARISON, PROVIDER_CARD, PROVIDER_FEES, and AFFILIATE_CTA. Then add others as real needs arise.

5. Finish distribution and importer integration. Exchange pages surface their related articles; comparison pages surface relevant analysis; the importer gets all new fields and embed validation; sitemap/metadata/revalidation logic is updated.

After these five steps, your site changes from primarily a comparison/data website into a much more complete:

Australian trading and crypto information platform + comparison engine + content publication system + affiliate acquisition funnel.

And importantly, you already have much of the difficult underlying relational structure. The next work is mostly about connecting those systems into one coherent publishing workflow, rather than starting over.

If I were sequencing Claude work, I would make the first Claude prompt only handle Block 1 + Block 2—schema/domain fixes and the complete admin editor—rather than asking it to implement every advanced embed and SEO capability in a single huge pass. That will make the changes much easier to review and significantly reduce the chance Claude damages the working provider/comparison/affiliate features.