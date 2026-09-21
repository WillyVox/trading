# Production-readiness review of the latest Trading Guide source

I reviewed the latest `Archive(9).zip` against the production-readiness checklist you supplied. I treated the checklist as the acceptance criteria: complete route review, Australian financial-services boundaries, consumer law, privacy, affiliate compliance, provider data, SEO, accessibility, security, CMS, deployment, testing and launch gates. 

I also checked current ASIC, ACCC, Google and W3C material because several of these requirements are time-sensitive.

## Executive assessment

**Trading Guide has progressed substantially, but this version is NOT READY FOR PRODUCTION yet.**

The positive part is that this is no longer a prototype. The repository now has a coherent financial-data architecture, separate crypto and share-trading domains, structured offerings, comparison engines, provider provenance, an article CMS, authentication/admin controls, affiliate infrastructure, XSS sanitisation tests, rate limiting, CSP reporting, security headers, dynamic sitemap generation, canonical metadata, JSON-LD, and a much better seed architecture.

Your core architecture is increasingly aligned with what I think Trading Guide should become:

**LEARN → RESEARCH → COMPARE → VERIFY → optionally visit provider**

and:

**SOURCE → FACT → VERIFICATION → HUMAN EXPLANATION**

That second chain can become one of your strongest differentiators.

But I found several things that I would regard as **launch blockers**, not polish issues.

| Area                     | Status     | Assessment                                                       |
| ------------------------ | ---------- | ---------------------------------------------------------------- |
| Product architecture     | READY      | Strong foundation                                                |
| Share trading            | NEEDS WORK | Architecture good; breadth/content still immature                |
| Crypto                   | NEEDS WORK | Much further developed                                           |
| Provider/offering model  | READY      | Major improvement                                                |
| Comparison architecture  | NEEDS WORK | Correct direction, UX/content needs further work                 |
| Beginner education       | NEEDS WORK | Good intention; insufficient depth/coverage                      |
| CMS                      | NEEDS WORK | Strong implementation, needs full production workflow validation |
| Legal/compliance         | BLOCKER    | Draft legal pages and unresolved advice/privacy issues           |
| Privacy                  | BLOCKER    | Infrastructure/subprocessor facts unresolved                     |
| Affiliate system         | NEEDS WORK | Good separation, but activation/referral workflow unfinished     |
| SEO technical foundation | NEEDS WORK | Mostly good; at least one serious route/indexing problem         |
| Google content strategy  | NEEDS WORK | Needs stronger trust/entity/content architecture                 |
| Accessibility            | NEEDS WORK | Improvements present; full WCAG validation not demonstrated      |
| Mobile                   | NEEDS WORK | Source looks responsive; not sufficiently runtime-validated      |
| Security                 | NEEDS WORK | Considerably improved                                            |
| Database                 | READY      | Good enough foundation; don't redesign again now                 |
| Seed system              | NEEDS WORK | Much improved; needs clean execution/data verification           |
| Analytics                | BLOCKER    | No complete launch measurement loop demonstrated                 |
| Observability            | NEEDS WORK | CSP reporting exists; production monitoring incomplete           |
| Deployment               | BLOCKER    | Clean install/build/test/start not demonstrated                  |

Your checklist correctly says that compiling, having metadata, or having disclaimers does **not** make the product finished; the whole chain from verified research through deployment and monitoring has to work. 

---

# What has improved significantly

The latest code is much healthier than the versions we reviewed previously.

### 1. ProviderOffering was the correct architectural decision

Your schema now distinguishes the company/brand from the service being compared. You have structured concepts around:

* `Provider`
* `ProviderOffering`
* `Market`
* `OfferingMarket`
* `OfferingProduct`
* `OfferingFeature`
* `OfferingProsCon`
* `OfferingCryptoAsset`
* `OfferingCustody`
* `OfferingAccountType`
* `OfferingFee`
* `OfferingFeeTier`

That gives you a realistic foundation for representing CMC Markets → CMC Invest, Stake → Stake AUS/Wall St, crypto exchanges, and eventually multi-product providers.

I would **stop redesigning this area for now**. Make the product work on top of it.

### 2. Share trading is now a real domain

You now have:

```text
/share-trading
/share-trading/[slug]
/share-trading/compare
/share-trading/compare/[slug]
```

and separate:

```text
src/lib/share-trading/
    comparison.ts
    labels.ts
    service.ts
```

This is much cleaner than trying to force crypto and brokers through one generic comparison implementation.

### 3. Security work has materially improved

The repository contains:

* Auth.js/Prisma authentication
* ADMIN authorization in `proxy.ts`
* password hashing and rehashing
* login throttling
* IP handling
* rate-limit tests
* affiliate input tests
* article sanitisation
* adversarial XSS tests
* CSP report endpoint
* security headers
* HSTS in production
* clickjacking protection
* MIME-sniffing protection
* referrer policy
* permissions policy
* draft article previews with `no-store`

That's a meaningful improvement.

### 4. SEO engineering has improved

You have centralized:

```text
src/lib/seo/config.ts
src/lib/seo/metadata...
src/lib/seo/schema...
src/lib/seo/sitemap-entries.ts
```

and importantly, production no longer silently falls back to:

```text
http://localhost:3000
```

for canonical/sitemap URLs.

That's exactly the kind of production guard I want.

### 5. You resisted programmatic SEO temptation

Your sitemap explicitly avoids indexing every arbitrary comparison permutation.

That is a good decision.

Google's current guidance continues to emphasize useful, original, people-first material rather than pages primarily created to capture search traffic. ([Google for Developers][1]) Google also removed its FAQ rich-result documentation in June 2026, so chasing old FAQ-schema tactics is not a useful SEO strategy. ([Google for Developers][2])

---

# P0 — launch blockers

## 1. Your public legal pages literally tell visitors they are unfinished

This is the clearest blocker.

`/terms` renders:

> “This page is a working draft and has not yet been reviewed by a lawyer.”

It also contains source comments explicitly saying:

```text
LEGAL REVIEW REQUIRED
do not ship this section as-is
```

`/privacy` similarly identifies itself as draft and publicly contains:

> “LEGAL/COMPLIANCE REVIEW REQUIRED.”

Your methodology/comparison/editorial and commercial disclosure source files also retain draft status.

Your own `CONTENT-GAPS.md` acknowledges this.

That cannot be your launch state.

There is an important nuance, however: I would **not** blindly follow the old checklist statement that a solicitor must sign everything. You told me you don't want another lawyer-review cycle. The more important substantive question is whether the actual conduct of the site crosses licensing/advice boundaries and whether the legal representations accurately describe what you do.

ASIC states that factual information can be provided without an AFS licence, while financial product advice can trigger licensing/authorization obligations; personal advice involves considering—or reasonably appearing to consider—a person's objectives, financial situation or needs. ([ASIC][3])

Therefore the safest product design is not “write a bigger disclaimer.” It is:

**design Trading Guide so the core product remains factual research and education.**

That means avoiding personalised platform recommendations such as:

> Tell us your age, salary, goals and portfolio and we'll tell you which broker is right for you.

That's much more important than footer wording.

---

# 2. Privacy cannot be finalized until deployment architecture is known

Your privacy page correctly admits that it doesn't yet know the actual hosting/database processing arrangements.

Before launch we need the actual production chain, for example:

```text
Browser
   ↓
Vercel
   ↓
Supabase/PostgreSQL
   ↓
Email service?
   ↓
Analytics?
   ↓
Error monitoring?
   ↓
Affiliate destinations
```

Then privacy wording must describe reality.

Your checklist explicitly requires privacy claims to be derived from actual registration, sessions, affiliate clicks, IP/logging, analytics, cookies, hosting, database, email, embeds and monitoring. 

Don't write the privacy policy first and later configure infrastructure that contradicts it.

---

# 3. `/compare` appears to be a broken legacy route

This is an important concrete bug I found.

Your current application architecture has moved comparison into:

```text
/crypto/exchanges/compare
/share-trading/compare
```

but `sitemap-entries.ts` still includes:

```ts
"/compare"
```

and I found links pointing to `/compare`, including the crypto area and footer/navigation configuration.

Yet the current route inventory contains **no `src/app/compare/page.tsx`**.

That means you are potentially:

* linking users to a 404;
* putting a nonexistent URL in the sitemap;
* wasting crawler requests;
* creating a poor internal-link graph;
* damaging trust.

This should be P0/P1.

I would create an intentional comparison hub:

```text
/compare
```

rather than redirect it.

For example:

> Compare trading platforms
> Choose what you want to compare.

Then two large options:

**Share trading platforms**
Brokerage, CHESS, FX, international markets, account types.

**Crypto exchanges**
Trading fees, deposits, withdrawals, assets, security features.

That creates a useful SEO/navigation hub rather than a redirect.

---

# 4. Clean production validation has not been demonstrated

This ZIP does not contain `node_modules`, so I cannot truthfully certify:

```bash
npm ci
npx prisma validate
npx prisma generate
npm run lint
npx tsc --noEmit
npm test
npm run format:check
npm run build
npm start
```

Your own documentation still marks local execution as outstanding.

Given the errors you've been fixing with me today—ESLint `any`, Auth.js JWT typing, sanitizer tests—this gate matters.

Do not deploy until all of those pass from a **clean checkout**.

---

# 5. Production analytics/monitoring isn't complete enough

For the business you're trying to build, launching without measurement would be a major mistake.

At minimum I want visibility into:

```text
Google impression
       ↓
landing page
       ↓
guide/platform profile
       ↓
comparison start
       ↓
comparison completion
       ↓
provider outbound click
```

You should also know:

* indexed pages;
* Google queries;
* CTR;
* organic landing pages;
* 404s;
* runtime errors;
* affiliate redirect failures;
* Core Web Vitals;
* returning users.

Without this, “SEO perfection” becomes guesswork.

---

# P1 — important before launch

## Homepage still behaves too much like a crypto site

This remains one of the clearest product inconsistencies.

The hero says:

> share trading and cryptocurrency

which is good.

But the primary CTA is:

> Explore crypto exchanges

“How this site works” sends provider research to:

```text
/crypto/exchanges
```

and comparison to:

```text
/crypto/exchanges/compare
```

“Featured providers” is populated exclusively through:

```ts
getFeaturedCryptoExchanges(3)
```

So the headline says:

> Trading Guide

but the product journey says:

> Crypto Guide.

I would redesign the homepage journey to:

```text
Understand investing before choosing a platform

             ↓

┌────────────────────┬────────────────────┐
│ Share trading      │ Crypto             │
│ Learn → Research   │ Learn → Research   │
│ → Compare          │ → Compare          │
└────────────────────┴────────────────────┘

             ↓

Beginner learning paths

             ↓

Platform research

             ↓

How we verify information

             ↓

Latest useful guides
```

This is probably the highest-value UX change remaining.

---

# Your positioning should change slightly

The current heading:

> “Three steps to a platform you trust.”

is too strong.

You verify information. You cannot establish that a platform deserves an individual's trust merely by comparing public facts.

I'd prefer:

> **Three steps to understand a platform.**

or:

> **Research a platform before you choose.**

That is more defensible and actually fits your brand better.

---

# The financial-advice boundary needs a product-level audit

This deserves special attention.

ASIC's current guidance says factual information is objectively ascertainable information, while financial product advice can require AFS licensing/authorization. ([ASIC][4])

Your product should therefore favor questions like:

> Does CMC Invest support CHESS?

> What does CommSec charge for a $5,000 ASX trade?

> Which markets does Stake provide access to?

> What is the difference between CHESS and custodial ownership?

over:

> Which broker should I use?

> What's the best broker for me?

> Based on my income and goals, where should I invest?

Your database and current comparison architecture are actually well suited to this factual approach.

Keep it.

---

# Advertising and affiliate wording needs stricter controls

ASIC reissued RG 234 on 9 June 2026. It applies to promoters and publishers of advertising relating to financial products/services and focuses on false or misleading representations and misleading/deceptive conduct. ([ASIC][5])

This matters especially when you eventually activate affiliate relationships.

A card must never reduce:

> $0 brokerage on the first buy under $1,000 per security per day

to simply:

> **FREE TRADING**

Likewise:

> 0% brokerage

does not mean:

> zero cost

because FX, spread, platform or other costs may remain.

Your structured fee architecture is heading toward solving exactly this problem.

---

# Affiliate architecture: good design, unfinished business process

I like the separation between factual provider data and affiliate relationships.

Keep:

```text
Provider/Offering data
       │
       │ independent
       ↓
Comparison engine

AffiliatePartnership
AffiliateProgram
AffiliateLink
       ↓
/go/[partner]
```

Do **not** put:

```text
commission amount
```

inside ranking logic.

Your checklist explicitly requires inactive partners not to monetize accidentally, approved destinations, redirect protection, clear disclosure and no commission-driven ranking. 

Your current `CONTENT-GAPS.md` still notes that actual referral identifiers will need to be added when real agreements exist. That's fine before partnerships exist, but the activation workflow should be tested before the first partnership goes live.

ACCC also warns that failing to disclose commercial relationships that affect reviews/ratings may constitute misleading conduct. ([ACCC][6])

---

# Crypto regulatory content requires ongoing verification

This is especially important right now.

ASIC extended its sector-wide digital-asset no-action position to **30 September 2026** for relevant businesses transitioning toward licensing arrangements. ([ASIC][7])

Since today is 21 September 2026, that is **nine days away**.

Any article whose headline/body describes that deadline is unusually time-sensitive.

I would put a regulatory content rule into the CMS:

```text
REGULATORY / FEE / PRODUCT CLAIM
          ↓
verifiedAt
          ↓
reviewDueAt
          ↓
STALE
          ↓
warning / editorial queue
```

This would be much more valuable than merely adding more articles.

---

# A real corrections mechanism is still missing

You already identified this in your checklist: readers/providers need a way to report factual errors, privacy concerns and corrections. 

I recommend adding:

```text
/about
/contact
/corrections
/authors/[slug]
```

before serious SEO expansion.

For a financial/YMYL site, these aren't filler pages.

They establish:

**Who operates this?
Who writes this?
How are facts checked?
How can errors be corrected?
How does the business make money?**

Google specifically recommends thinking about the **Who, How and Why** behind content and calls out stronger trust expectations around YMYL topics. ([Google for Developers][1])

---

# SEO: your next problem is not metadata

I would **not spend another development cycle tweaking title tags**.

The technical SEO foundation is already decent.

Your next SEO gains are more likely to come from **content architecture, topical authority, original data, internal links and trust**.

The strategy I recommend is:

```text
                TRADING GUIDE
                     │
       ┌─────────────┴─────────────┐
       │                           │
 SHARE TRADING                   CRYPTO
       │                           │
   beginner hub                beginner hub
       │                           │
 ┌─────┼──────┐             ┌─────┼──────┐
 fees CHESS  US shares     fees custody security
       │                           │
 platform profiles          exchange profiles
       │                           │
 comparisons                 comparisons
```

Then guides link **into the tools**, and tools link **back to explanations**.

That creates a learning graph instead of an SEO article warehouse.

---

# Your beginner strategy should become the primary moat

Finder already compares 30+ share-trading platforms and provides fees, asset classes, comparisons, ratings and educational material. ([finder.com.au][8]) Canstar exposes CHESS sponsorship, brokerage, FX, market access, platform features, research and account-management information, with fact-checking and methodology. ([Canstar][9])

Trying to beat them simply by having:

> more comparison rows

is unlikely to be enough.

Your opportunity is different.

### Trading Guide should explain every important comparison dimension.

For example:

**CHESS sponsored — Yes**

Then directly underneath:

> **What does this mean?**
> Australian shares are recorded against your Holder Identification Number (HIN), rather than being held through a custodian on your behalf.

**FX conversion — 0.55%**

> **What does this mean?**
> If you convert A$1,000 to another currency, a 0.55% conversion fee is roughly A$5.50 before considering other costs.

**US brokerage — US$0**

> **Watch for other costs**
> Zero brokerage doesn't necessarily mean the trade costs nothing. Currency conversion and other charges can still apply.

That is useful.

And it aligns with Moneysmart's beginner framing: understand how an investment works, how you could gain or lose money, fees, risks and whether you understand it before proceeding. ([Moneysmart][10])

---

# Build beginner tools, not only articles

This is where I think Trading Guide can become genuinely memorable.

After launch stabilization, I would prioritize:

**Brokerage cost calculator**

```text
Trade amount: $2,000
Platform: CommSec
Market: ASX

Estimated brokerage: ...
Why: ...
Source: ...
Verified: ...
```

**FX cost calculator**

```text
AUD investment: $5,000
FX fee: 0.55%

Estimated conversion cost:
$27.50
```

**CHESS vs custody explainer**

Interactive visual rather than another 2,000-word article.

**Platform comparison**

Already underway.

**Fee scenario comparison**

```text
If I invest $500/month...
CMC      ...
CommSec  ...
Stake    ...
IBKR     ...
```

Only once your structured fee engine can correctly model the conditions.

These tools produce something far more defensible for SEO than hundreds of generic articles.

---

# Important concrete code issue: sanitizer logic

I noticed something worth fixing after the recent XSS test work.

`sanitize.ts` defines the correct helper:

```ts
isExternalHref()
```

which checks whether the host differs from Trading Guide.

But your current `<a>` transformation does not use it. Instead it currently does roughly:

```ts
const isExternal =
  href.startsWith("https://") ||
  href.startsWith("http://");
```

Therefore:

```text
https://tradingguide.com.au/guides/foo
```

is treated as external even though it is your own site.

Use the existing `isExternalHref(href)` helper.

This is a good example of why the clean test pass is still necessary.

---

# Accessibility

Your mobile drawer improvements are good: focus handling, Escape, focus trap, inert state and accessible naming show you're taking this seriously.

But don't declare WCAG compliance from those changes alone.

WCAG 2.2 AA requires the complete responsive page variation to satisfy A and AA requirements. ([W3C][11])

Before launch I would test at least:

```text
320
360
390
430
768
1024
1440
```

especially:

* comparison tables;
* rich articles;
* navigation;
* forms;
* TipTap output;
* provider cards;
* long fee qualifications;
* keyboard navigation;
* focus visibility;
* 200% zoom;
* validation errors.

---

# Competitor position

| Capability              | Trading Guide now         | Australian benchmark                                    | Direction                    |
| ----------------------- | ------------------------- | ------------------------------------------------------- | ---------------------------- |
| Provider breadth        | Limited                   | Finder/Canstar much broader                             | Expand after correctness     |
| Structured evidence     | Strong concept            | Often less prominent                                    | **Exploit this advantage**   |
| Beginner explanations   | Partial                   | Competitors have substantial education                  | Make this core               |
| Comparison              | Good foundation           | Mature competitors                                      | Improve usability            |
| CHESS/custody education | Emerging                  | Common competitor dimension                             | Explain better               |
| Fee modelling           | Architecturally promising | Mature comparison tables                                | Build scenario engine        |
| Authors/trust           | Incomplete                | Mature competitors expose authors/editors/fact checking | Fix before SEO scale         |
| Methodology             | Good foundation           | Established methodologies                               | Make methodology operational |
| Affiliate transparency  | Strong philosophy         | Commercial models well established                      | Preserve independence        |
| Original tools          | Limited                   | Competitors have many tools                             | Major opportunity            |
| SEO authority           | New domain                | Large incumbents                                        | Win focused topics first     |
| Data provenance         | Potential differentiator  | Variable                                                | Make it visible everywhere   |

I would **not copy Finder's scoring/ranking model**. Finder publicly uses proprietary scoring and “best” selections. ([finder.com.au][12]) Canstar likewise has ratings and awards. ([Canstar][13])

Your stronger identity is:

> **We help you understand the differences. We show the evidence. You make the decision.**

That's cleaner for the product and safer around advice boundaries.

---

# What I would do next

I would **not add another provider yet** and I would **not create another 50 SEO articles yet**.

The next production milestone should be **Launch Hardening**, in this order:

1. Fix `/compare` and every stale internal route; resolve legal/privacy/commercial public drafts and verify the factual/advice boundary; finalize actual production infrastructure and privacy disclosures; add `/about`, `/contact`, `/corrections`, and author trust architecture.
2. Run a provider-data verification pass, especially all fee/regulatory claims and crypto regulatory material; introduce explicit review/staleness workflow for volatile facts.
3. Balance the homepage between share trading and crypto; turn it into two clear beginner journeys; improve comparison explanations rather than adding more raw rows.
4. Finish technical launch gates: sanitizer issue, lint/typecheck/tests/Prisma/format/build, security checks, mobile/accessibility checks, 404/error/empty states, production env validation.
5. Configure Search Console, sitemap submission, analytics and error monitoring; then launch with a small set of **excellent** guides and tools rather than hundreds of thin pages.
6. After stable launch, expand providers and build brokerage/FX/fee-scenario tools. Then grow content around questions those tools naturally answer.

The strongest near-term content cluster I'd build is:

```text
Share trading for beginners
        │
        ├── How to buy shares in Australia
        ├── What is brokerage?
        ├── What is CHESS?
        ├── CHESS vs custodial
        ├── Market vs limit orders
        ├── How FX fees work
        ├── Buying US shares from Australia
        └── How to compare trading platforms
                    │
                    ↓
           /share-trading/compare
```

and mirror that architecture for crypto.

## Production verdict

**NOT READY FOR PRODUCTION today.**

But I would no longer describe the project as far from launch. The fundamental architecture is largely there. The remaining work is now much more about **hardening, trust, compliance boundaries, data quality, beginner usefulness, route correctness, production validation and operational readiness** than rebuilding the application.

The biggest strategic change I recommend is also the simplest:

> Don't try to become Australia's most loved finance site by having the most pages. Become the site where a beginner finally understands what the comparison table actually means.

If you execute that consistently—source-linked facts, plain-English explanations, transparent limitations, useful calculators and comparisons, visible verification and no affiliate-driven rankings—you have a much clearer reason to exist alongside Finder and Canstar.

I have not modified `Archive(9).zip`, consistent with the approval gate in your requirements. 

[1]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content?authuser=31&utm_source=chatgpt.com "Creating Helpful, Reliable, People-First Content | Google Search Central  |  Documentation  |  Google for Developers"
[2]: https://developers.google.com/search/updates?utm_source=chatgpt.com "Latest Google Search Documentation Updates | Google Search Central  |  What's new  |  Google for Developers"
[3]: https://www.asic.gov.au/regulatory-resources/financial-services/giving-financial-product-advice?utm_source=chatgpt.com "Giving financial product advice | ASIC"
[4]: https://asic.gov.au/regulatory-resources/financial-services/financial-advice/your-obligations-when-giving-financial-advice/types-of-financial-product-advice/?utm_source=chatgpt.com "Obligations when giving financial advice | ASIC"
[5]: https://www.asic.gov.au/regulatory-resources/find-a-document/regulatory-guides/rg-234-advertising-financial-products-and-services-including-credit?utm_source=chatgpt.com "RG 234 Advertising financial products and services (including credit) | ASIC"
[6]: https://www.accc.gov.au/business/advertising-and-promotions/online-reviews-for-product-and-services?utm_source=chatgpt.com "Online reviews for product and services | ACCC"
[7]: https://www.asic.gov.au/about-asic/news-centre/news-items/asic-extends-no-action-position-for-digital-asset-businesses-to-30-september-2026?utm_source=chatgpt.com "ASIC extends no-action position for digital asset businesses to 30 September 2026 | ASIC"
[8]: https://www.finder.com.au/share-trading?utm_source=chatgpt.com "Online Stock Brokers 2026: 30+ Platforms, From $0 | Finder"
[9]: https://www.canstar.com.au/online-trading/?utm_source=chatgpt.com "Compare Online Share Trading Platforms | Canstar"
[10]: https://moneysmart.gov.au/how-to-invest/choose-your-investments?utm_source=chatgpt.com "Choose your investments - Moneysmart.gov.au"
[11]: https://www.w3.org/TR/wcag/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.2"
[12]: https://www.finder.com.au/share-trading/best-chess-sponsored-brokers?utm_source=chatgpt.com "Best CHESS-Sponsored Brokers 2026: $0 Trading Fees | Finder"
[13]: https://www.canstar.com.au/star-ratings-awards/online-share-trading/?utm_source=chatgpt.com "2026 Share Trading Platform Awards | Canstar"
