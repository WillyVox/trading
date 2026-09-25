# TradingGuide Production Readiness Review

## Verdict

**I would not launch this version publicly yet.**

It is much closer to a production product than an early prototype, and
the overall direction is strong. But I found several **launch
blockers**, particularly around legal/compliance content, affiliate
behavior, remaining legacy architecture, production configuration, and
testing.

My assessment:

- **Technically launchable for a private/staging deployment:** Yes
- **Ready to actively promote to Australian consumers and monetize:**
  Not yet

The good news is that I don't think you need another major rewrite. I
would do a focused **Production Readiness Phase** before launch.

---

## 1. 🔴 Blocker: Legal/compliance pages are not ready

This is the most important issue I found.

Your Privacy page contains:

```ts
/**
 * Content status: DRAFT ONLY
 */
```

and renders language such as:

```text
This page is a working draft and has not yet been reviewed by a lawyer.
```

Your Terms contain unresolved legal-review notes, and your Affiliate
Disclosure contains a visible `[TODO]`.

Your business identity is also currently effectively empty:

```ts
export const businessIdentity: BusinessIdentity = {};
```

So important details such as the following are not fully configured:

- Legal entity
- Trading name
- ABN/ACN where applicable
- Support email
- Privacy contact
- Complaints contact
- Business address where applicable
- Applicable jurisdiction

### Before public launch

Resolve:

- Legal operator
- Trading/business name
- ABN if applicable
- Contact email
- Privacy contact
- Complaints process/contact
- Applicable jurisdiction
- Privacy obligations
- Affiliate disclosure
- Financial-information/advice positioning
- Terms
- Liability wording

Given this is an Australian financial comparison site, I would have an
Australian financial-services lawyer review the final consumer-facing
setup rather than rely solely on generated legal text.

---

## 2. 🔴 Blocker: Affiliate implementation and disclosure contradict each other

Your Affiliate Disclosure says, in effect, that TradingGuide is
currently self-funded and does not receive affiliate compensation.

However, current seed data contains affiliate records marked:

```ts
active: true;
```

for providers including examples such as:

- CoinSpot
- CoinJar
- Kraken
- Swyftx
- BTC Markets
- Independent Reserve

There are also comments indicating those values should not necessarily
be active by default.

This means documentation and seed reality have drifted apart.

### Recommended invariant

```text
No agreement
      ↓
No affiliate redirect

Actual approved partnership
      ↓
AffiliateProgram ACTIVE
      ↓
AffiliateLink ACTIVE
      ↓
/go/provider
      ↓
tracking
      ↓
approved partner URL
```

The seed default should normally be:

```ts
active: false;
```

unless you actually have the corresponding commercial relationship.

---

## 3. 🔴 The `/go/[offering]` infrastructure itself is good

This is one of the better pieces I found.

You correctly retrieve an active affiliate link and return a 404 when
one does not exist:

```ts
const link = await getActiveAffiliateLink(partner);

if (!link) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
```

You redirect only to the stored approved URL rather than accepting
arbitrary redirect destinations.

You also record useful attribution information such as:

- Source page
- Placement
- Campaign
- Timestamp

That is a solid foundation.

### Remaining cleanup

There are UI comments such as:

```ts
// [TODO] should append our referred Id here
```

The actual partner referral identifier should generally already be
represented in the stored approved affiliate URL rather than being
dynamically invented by UI components.

---

## 4. 🔴 Remaining legacy architecture should be eliminated

The uploaded project still contains pieces such as:

```text
src/lib/compare/types.ts

src/lib/providers/compare.ts
src/lib/providers/features.ts

components/compare/CompareCardGrid.tsx

components/providers/ProviderFeatureSection.tsx
components/providers/ProviderProsCons.tsx
```

There are also active imports of generic comparison abstractions such
as:

```ts
ComparisonSection;
ComparisonSubject;
```

This means the project is not yet fully aligned with the architecture we
designed.

### Prisma also retains legacy Provider product structures

The schema still contains legacy concepts such as:

```prisma
enum ProviderFeeType
enum FeeValueType
enum ProviderFeatureType
enum ProviderProsConsType
```

and models such as:

```prisma
model ProviderFee
model ProviderFeature
model ProviderProsCon
model ProviderAsset
```

while `Provider` still owns product-level relations.

The intended architecture is:

```text
Provider
=
organisation/company

ProviderOffering
=
product/service being compared
```

I recommend removing the remaining legacy Provider product models before
accumulating production data.

Doing this now is relatively cheap. Doing it after months of production
data becomes a much larger migration project.

---

## 5. 🟠 `ProviderFact` still needs cleanup

`ProviderFact` can still contain information that really belongs to a
specific product.

For a multi-product provider such as eToro, a fact like:

```text
AUD support: yes
```

is ambiguous because the provider can have:

- Share Trading
- Crypto
- CFD
- Forex

### Recommended classification

```text
FACT
 ↓
Is this about the company?
 ├── YES → ProviderFact
 │
 └── NO
      ↓
 Is there a structured Offering field?
 ├── YES → structured data
 └── NO
      ↓
 Is it a feature?
 ├── YES → OfferingFeature
 └── NO → OfferingFact if genuinely necessary
```

Prefer typed structured data over creating a generic dumping ground.

---

## 6. 🟠 Authentication needs production hardening

The existing architecture has good foundations:

- Credentials authentication
- Hashed passwords
- JWT sessions
- Roles
- Admin route protection
- `no-store` on draft article previews

Before launch, perform a dedicated security review covering:

- Password policy
- Rate limiting
- Login brute-force protection
- Registration abuse
- Session configuration
- Authentication secrets
- CSRF behavior
- Admin action authorization
- Server-action authorization
- Password reset
- Email verification
- Account enumeration
- Security headers
- Dependency vulnerabilities

Your Next configuration is currently very minimal. Consider production
headers such as:

- Content Security Policy
- `X-Content-Type-Options`
- Referrer Policy
- Permissions Policy

These should be tailored to your actual embedded content, analytics and
hosting environment.

---

## 7. 🟠 Question whether public registration is needed yet

The public application exposes:

```text
/register
/login
```

But the current consumer value of having an account appears limited.

Ask:

> What does a registered user get that an anonymous user does not?

If there is no meaningful answer yet, I would disable public
registration for the initial launch.

Every authentication feature adds:

- Security surface
- Privacy obligations
- User data
- Support burden
- Password management
- Database records
- Abuse potential

without necessarily adding product value.

Keep admin authentication.

Bring consumer accounts back when there are meaningful features such as:

- Saved comparisons
- Watchlists
- Fee alerts
- Saved providers
- Newsletter preferences
- Data-change alerts

---

## 8. 🟠 Automated testing is too thin

The application contains critical behavior around:

- Authentication
- Authorization
- Article publishing
- Affiliate redirects
- Affiliate tracking
- Comparison
- Fees
- Sitemap
- SEO
- Data verification
- Admin operations

but automated coverage is currently limited.

### Unit tests

Add tests for:

- Fee formatting
- Comparison builders
- Slug parsing
- Metadata
- Affiliate selection
- Article validation
- Sanitization

### Integration tests

Add tests for:

- Crypto exchange queries
- Share-trading queries
- Affiliate redirects
- Article publishing
- Auth role checks
- Sitemap generation

### E2E tests

At minimum:

```text
Homepage loads
Crypto catalog loads
Crypto profile loads
Crypto comparison works
Share-trading catalog loads
Share profile loads
Share comparison works
Article loads
Admin cannot be accessed anonymously
Admin can publish
Affiliate redirect behaves correctly
404 behaves correctly
```

Playwright would be a good fit for the E2E layer.

---

## 9. 🟠 Update the lint workflow

The project uses modern Next.js/ESLint infrastructure, but the lint
script should be aligned with the current setup.

Prefer:

```json
"lint": "eslint ."
```

and make linting part of the CI release gate.

---

## 10. 🟠 Require a repeatable production build gate

A static source review is not proof that an application is
production-ready.

Before launch, CI should run something like:

```bash
npm ci

npx prisma validate
npx prisma generate

npm run lint
npm run format:check
npm test

npx tsc --noEmit

npm run build
```

Every command should pass automatically before production deployment.

---

## 11. 🟢 SEO foundation is strong

There is a lot to like in the existing implementation.

You have centralized:

- Site identity
- Canonical generation
- Metadata
- Open Graph
- Twitter cards
- Robots
- Sitemap
- JSON-LD
- Breadcrumbs

Production-domain handling is thoughtful: missing production URL
configuration fails rather than silently producing localhost canonical
URLs.

The sitemap is also database-aware and uses revalidation rather than
forcing unnecessary database work during the build.

This is a good SEO foundation.

---

## 12. 🟢 Robots handling is sensible

The application appropriately excludes areas such as:

```text
/admin
/go/
/login
/403
```

while allowing the public content site to be crawled.

If public registration remains, consider excluding `/register` as well.

---

## 13. 🟢 Content architecture is promising

The site already has a sensible structure around:

```text
/guides
/news

/crypto
/crypto/exchanges
/crypto/exchanges/[slug]
/crypto/exchanges/compare

/share-trading
/share-trading/[slug]
/share-trading/compare

/methodology
/methodology/comparisons
/methodology/editorial-policy

/affiliate-disclosure
/how-we-get-paid
/privacy
/terms
```

This supports a healthy acquisition journey:

```text
Google / Social
       ↓
Guide
       ↓
Platform page
       ↓
Comparison
       ↓
Provider
```

rather than making every page a thin affiliate landing page.

---

## 14. 🟠 Simplify static vs dynamic editorial content

The project currently has both dynamic article routes and several
hardcoded guide routes.

That is not inherently wrong, but since you have built a proper Article
CMS, I would decide on one long-term editorial workflow.

My preference:

```text
Editorial content
     ↓
Article CMS
     ↓
Guide / News / Educational article

Structured product data
     ↓
Database + application code
     ↓
Comparison/profile pages
```

This keeps editorial publishing separate from structured financial
product data.

---

## 15. 🔴 Remove visible TODOs before indexing

Consumer-facing production pages should not contain:

```text
[TODO]

[Month/Year]

[support email not yet configured]

working draft

not yet reviewed by a lawyer
```

Add an automated release check that searches consumer-facing files for
patterns such as:

```text
[TODO]
TODO(content-gap)
[Month/Year]
not yet configured
DRAFT ONLY
LEGAL REVIEW REQUIRED
placeholder guess
```

and fails the production build when appropriate.

---

## 16. 🟠 Add production observability

Before promotion, add:

- Error monitoring
- Uptime monitoring
- Structured application logs
- 404 monitoring
- Affiliate redirect failure monitoring
- Database health monitoring
- Deployment alerts

For TradingGuide specifically, also monitor:

- Broken provider URLs
- Stale fee data
- Failed affiliate redirects
- Missing source URLs
- STALE verification records
- Comparison pages with insufficient data

These product-specific checks may be more valuable than generic
infrastructure monitoring alone.

---

## 17. Build a stale-data system before scaling

A financial comparison website has a special problem:

> A page that works technically but displays an old fee may be worse
> than a page that is temporarily unavailable.

You already have useful fields such as:

```text
verificationStatus
verifiedAt
lastVerifiedAt
sourceUrl
```

Turn them into an operational workflow.

For example:

```text
VERIFIED
< 30 days
      ↓
✓ Recently verified

30–90 days
      ↓
Review due

> 90 days
      ↓
STALE
      ↓
admin alert
      ↓
potential user warning
```

The actual periods should vary by field. Fees should generally be
reviewed more frequently than corporate-history facts.

An admin dashboard could eventually show:

```text
DATA HEALTH

12 offerings verified
3 reviews due
1 stale fee
2 broken sources
4 unverified facts
```

This could become an important competitive advantage.

---

## 18. Avoid fake completeness

This is especially important for crypto.

If a provider supports hundreds of crypto assets but the seed contains
only:

```text
BTC
ETH
SOL
```

do not display:

> 3 supported cryptocurrencies

unless those really are the only supported assets.

Instead use language such as:

> Examples currently tracked in our database: BTC, ETH, SOL

until coverage is complete.

Apply the same principle to:

- Markets
- Features
- Account types
- Fees

Absence from your database should not automatically mean "unavailable."

Use explicit `UNKNOWN` states where appropriate.

---

## 19. Make seeds genuinely multi-offering friendly

Providers such as eToro demonstrate why this matters.

The architecture needs to support:

```text
Provider
eToro
     │
     ├── SHARE_TRADING
     ├── CRYPTO_EXCHANGE
     ├── CFD_TRADING
     └── FOREX_TRADING
```

Before expanding aggressively, finish making the seed system support one
Provider with multiple Offerings without duplicating corporate identity
and regulatory information.

---

## 20. Your biggest product advantage

The strongest part of TradingGuide is not currently the number of
providers.

It is the combination of:

```text
structured data
+
official sources
+
verification dates
+
beginner explanations
+
comparison
+
educational content
```

Lean heavily into that.

Rather than trying to beat large competitors on page count, aim to make
every important data point understandable and traceable.

For example:

```text
US brokerage

US$3

Verified
18 Sep 2026

Official source ↗

How this fee works
```

The message should be:

> You do not need to trust TradingGuide blindly. You can see where the
> information came from.

---

# Recommended Launch Plan

## Gate 1 --- Production blockers

Do this first:

```text
□ Finalize business identity
□ Obtain legal/compliance review
□ Finalize Terms
□ Finalize Privacy
□ Finalize affiliate disclosure
□ Remove every visible TODO/placeholder
□ Disable fake/non-contracted affiliate links
□ Fix affiliate active-state enforcement
□ Decide whether public registration is necessary
□ Configure production environment variables
□ Add appropriate security headers
```

**Do not actively promote the public product before this gate passes.**

---

## Gate 2 --- Architecture and data cleanup

```text
□ Finish removing legacy lib/compare
□ Remove Provider comparison adapters
□ Remove ProviderFee
□ Remove ProviderFeature
□ Remove ProviderAsset
□ Remove ProviderProsCon
□ Remove corresponding legacy enums
□ Complete ProviderFact classification
□ Verify every catalog query uses ProviderOffering
□ Make seeds support one Provider → many Offerings
□ Remove stale comments referring to the old architecture
```

I strongly prefer doing this before launch because schema cleanup is
still relatively inexpensive.

---

## Gate 3 --- Quality gate

```text
□ ESLint passes
□ Prettier check passes
□ Prisma validate passes
□ Prisma generate passes
□ TypeScript passes
□ Unit tests pass
□ Integration tests pass
□ Playwright smoke tests pass
□ Production Next build passes
□ Fresh database migration tested
□ Production seed tested
□ 404/500 behavior tested
□ Mobile QA completed
□ Safari QA completed
□ Chrome QA completed
```

Configure CI so production deployments cannot bypass these checks.

---

## Gate 4 --- Soft launch

Do not immediately push large amounts of traffic.

Start with:

```text
Production
    ↓
Search Console
    ↓
Submit sitemap
    ↓
Monitor indexing
    ↓
Test real mobile devices
    ↓
Check all provider links
    ↓
Check canonical URLs
    ↓
Check structured data
    ↓
Monitor errors
    ↓
Invite 10–30 real users
    ↓
Collect usability feedback
```

Use the first week or two to discover real production problems before
scaling SEO/social acquisition.

---

# What I Would Not Delay Launch For

You do **not** need all of these before launch:

```text
50 providers
500 articles
AI recommendations
Mobile apps
Portfolio tracking
Advanced personalization
CFD comparison
Forex comparison
100 calculators
```

I would rather launch an excellent:

```text
Crypto exchanges
+
Share-trading platforms
+
5–10 excellent guides
+
2 genuinely useful tools/comparisons
```

than a shallow financial portal attempting to cover everything.

---

# Recommended Launch Threshold

```text
                 TRADINGGUIDE
                      │
       ┌──────────────┼──────────────┐
       │              │              │
    TRUST          PRODUCT        ENGINEERING
       │              │              │
 Legal final     Accurate data     CI green
 Sources         Useful compare    Security
 Disclosure      Good mobile       Monitoring
 Identity        No fake claims    Backups
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                  SOFT LAUNCH
                      ↓
                Validate users
                      ↓
              SEO + Social launch
                      ↓
             Affiliate expansion
```

## Bottom Line

**Product quality is approaching launch readiness, and the SEO/content
foundation is good.**

The biggest remaining risks are:

1.  **Legal/compliance readiness**
2.  **Affiliate-state accuracy and disclosure**
3.  **Remaining legacy Provider/comparison architecture**
4.  **Insufficient automated testing**
5.  **Production security and observability**
6.  **Data freshness and completeness semantics**

If this were my release, I would spend the next development cycle on
**production readiness rather than adding more providers, eToro, more
articles, or new features**.

Once the four gates above pass, soft-launch the focused product, observe
how real Australian users behave, fix issues, and then begin scaling
SEO, social content and affiliate partnerships.
