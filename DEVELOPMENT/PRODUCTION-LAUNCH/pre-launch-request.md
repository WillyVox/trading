# TRADING GUIDE — FINAL PRODUCTION READINESS, COMPLIANCE, UX, SEO & LAUNCH REMEDIATION

## ROLE

Act as the combined senior team responsible for taking this application from its current state to a genuinely production-ready Australian financial-information and comparison platform.

Operate simultaneously as a:

- Principal software architect
- Senior Next.js / React / TypeScript engineer
- Prisma/PostgreSQL architect
- Security engineer
- DevOps/release engineer
- Australian fintech product owner
- Financial-services compliance analyst
- Australian consumer-law compliance analyst
- Privacy/compliance analyst
- Affiliate/commercial-disclosure specialist
- Technical SEO architect
- Google Search specialist
- Accessibility engineer
- WCAG 2.2 specialist
- UX/UI lead
- Mobile UX specialist
- Content strategist
- Editorial standards lead
- Data-quality/research lead
- QA engineer

The product is:

# Trading Guide

An Australian educational, research and comparison website covering:

- share trading platforms
- brokers
- cryptocurrency exchanges
- trading/investing education
- platform comparisons
- provider research
- market-related educational/news content
- affiliate/referral monetisation

The primary audience is Australian consumers, especially beginners.

---

# 1. MISSION

Your task is NOT to perform a superficial audit.

Your task is to:

1. inspect the COMPLETE supplied repository;
2. understand every public and important private/admin surface;
3. identify every material production-readiness gap;
4. research current authoritative requirements;
5. produce a remediation plan;
6. STOP for my approval;
7. only after approval, implement the remediation;
8. test the application thoroughly;
9. re-audit the result;
10. produce a final launch-readiness report.

The desired outcome is a clean, trustworthy, fast, accessible, maintainable and useful Australian financial comparison and education product.

---

# 2. ABSOLUTE RULE — DO NOT START CODING

For your FIRST RESPONSE:

DO NOT modify code.

DO NOT create migrations.

DO NOT rewrite content.

DO NOT redesign pages.

DO NOT refactor files.

First perform the complete audit described below.

I must approve the remediation plan before implementation.

---

# 3. DO NOT MAKE FALSE GUARANTEES

Do not claim:

- guaranteed legal compliance;
- guaranteed Google rankings;
- guaranteed traffic;
- guaranteed revenue;
- guaranteed zero complaints;
- guaranteed security;
- guaranteed accessibility;
- guaranteed regulatory approval.

Instead:

- implement requirements supported by authoritative sources;
- identify unresolved questions;
- classify uncertainty;
- treat material unresolved compliance issues as RELEASE BLOCKERS;
- never invent a legal conclusion merely to make the application launchable.

If something cannot be established from authoritative material, say so.

Do not silently guess.

---

# 4. START BY MAPPING THE ENTIRE APPLICATION

Inspect the complete repository.

Create a route inventory covering EVERY:

- public page
- dynamic page
- comparison page
- provider profile
- guide
- news page
- methodology page
- disclosure page
- legal page
- authentication page
- redirect
- API route
- admin page

For each public route determine:

- purpose
- target user
- search intent
- primary CTA
- data source
- SEO metadata
- canonical
- index/noindex status
- structured data
- breadcrumb
- internal links
- affiliate content
- financial claims
- regulatory claims
- source provenance
- verification status
- mobile behaviour
- accessibility
- usefulness
- duplication risk
- content quality
- launch status

Produce a ROUTE AUDIT MATRIX.

Do not sample five pages.

Audit the complete route architecture.

For dynamic templates, audit the template plus representative real records.

---

# 5. CURRENT KNOWN SURFACES TO VERIFY

The repository currently appears to contain areas similar to:

/

/share-trading
/share-trading/[slug]
/share-trading/compare
/share-trading/compare/[slug]

/crypto
/crypto/[slug]
/crypto/exchanges
/crypto/exchanges/[slug]
/crypto/exchanges/compare
/crypto/exchanges/compare/[slug]

/guides
/guides/[slug]
static guides

/news
/news/[slug]

/methodology
/methodology/comparisons
/methodology/editorial-policy

/affiliate-disclosure
/how-we-get-paid
/privacy
/terms

/login
/register

/admin/...

/go/[partner]

Verify the actual repository.

Do not trust this list if the source differs.

---

# 6. IDENTIFY ALL RELEASE BLOCKERS

Search the entire repository for:

TODO
FIXME
HACK
XXX
placeholder
draft
temporary
mock
dummy
sample
hardcoded
LEGAL REVIEW REQUIRED
CONTENT-GAPS
not configured
example.com
localhost
unfinished
coming soon

Classify every finding:

P0 — LAUNCH BLOCKER
P1 — must fix before launch
P2 — strongly recommended
P3 — post-launch improvement

Do not mechanically treat harmless input placeholders as defects.

Interpret context.

Examples of P0/P1 candidates include:

- unfinished legal pages;
- placeholder dates;
- missing business identity;
- missing contact information;
- fake or unsupported claims;
- stale provider fees;
- broken affiliate redirects;
- missing disclosure;
- insecure authentication;
- incorrect canonical URLs;
- production localhost URLs;
- indexable admin pages;
- broken mobile UI;
- inaccessible essential controls;
- misleading regulatory wording;
- broken forms;
- failed builds;
- runtime exceptions.

---

# 7. AUSTRALIAN FINANCIAL-SERVICES REVIEW

Research CURRENT authoritative Australian requirements.

Prefer primary sources.

At minimum investigate relevant current material from:

- ASIC
- Federal Register of Legislation
- Treasury where applicable
- AUSTRAC
- ACCC
- OAIC
- ACMA
- ASX where relevant
- Moneysmart where useful for consumer framing

Do not rely on old assumptions.

The regulatory environment is changing.

Specifically verify CURRENT 2026/2027 digital-asset transitional arrangements and commencement dates.

---

# 8. FINANCIAL ADVICE BOUNDARY

Review the ENTIRE application for the distinction between:

- factual information;
- educational information;
- general financial product advice;
- personal advice;
- recommendation;
- ranking;
- promotional claims;
- comparison;
- affiliate marketing.

Search page copy and components for language such as:

best
recommended
we recommend
right for you
perfect for
you should
suitable for you
ideal for
safe
trusted
secure
risk-free
cheapest
winner
top pick
our pick

Do not blindly replace words.

Determine their context.

Identify any functionality or copy that may move the product from factual/educational comparison toward financial product advice.

Do not assume a footer disclaimer cures substantive conduct.

Report findings before implementation.

---

# 9. ASIC ADVERTISING / MISLEADING-CONDUCT REVIEW

Review against current ASIC guidance, including relevant principles in RG 234 and current digital-asset guidance.

Audit:

- headlines
- provider cards
- comparison tables
- fee claims
- "$0" claims
- "free" claims
- risk warnings
- qualifications
- footnotes
- affiliate CTAs
- crypto descriptions
- regulatory descriptions
- custody claims
- CHESS claims
- security claims
- provider pros/cons
- review language

A headline must not become misleading because the qualification is hidden several sections below.

Material conditions should appear close to the claim.

Example:

"$0 brokerage"

must not be displayed without material eligibility/condition context where conditions exist.

---

# 10. CRYPTO REGULATORY REVIEW

Review current Australian crypto regulation carefully.

Distinguish:

- AUSTRAC registration
- ASIC regulation
- AFSL
- authorised representative status
- financial product status
- custody
- exchange/platform operation
- derivatives
- digital asset platform reforms

NEVER imply:

AUSTRAC registered = ASIC regulated

or:

AUSTRAC registered = government approved

or:

AFSL relationship = every service offered by the brand is licensed under that AFSL.

Regulatory scope must be represented accurately.

Review current transitional arrangements and the Digital Assets Framework implementation timetable.

---

# 11. AUSTRALIAN CONSUMER LAW

Review ACCC guidance and Australian Consumer Law implications.

Audit:

- misleading/deceptive representations;
- fake urgency;
- price representations;
- "$0"/"free";
- rankings;
- ratings;
- reviews;
- sponsored placements;
- affiliate relationships;
- provider endorsements;
- claims of independence;
- claims of government/regulator affiliation;
- testimonials if any;
- comparisons.

Commercial relationships must be clearly disclosed where relevant.

Do not make the disclosure deliberately obscure.

---

# 12. AFFILIATE COMPLIANCE

Trace the entire commercial flow:

Provider
→ AffiliatePartnership
→ AffiliateProgram
→ AffiliateLink
→ CTA
→ /go/[partner]
→ click record
→ approved destination

Verify:

- inactive partners cannot accidentally monetize;
- only approved URLs can be used;
- redirect validation;
- open redirect protection;
- click attribution;
- disclosure placement;
- sponsored/affiliate labelling;
- commercial relationship representation;
- no commission-driven ranking;
- no misleading CTA;
- broken referral parameters;
- privacy implications;
- analytics implications.

Search specifically for TODO comments in affiliate components and seeds.

Resolve them properly during implementation.

Do NOT merely delete the comments.

---

# 13. BUSINESS IDENTITY

Determine what information the site requires from configuration to publish credible legal/trust pages.

Inspect existing business configuration.

Identify missing:

- business/operator name
- registered business name if applicable
- ABN where intended/appropriate
- contact email
- privacy contact
- support contact
- Australian address requirements if applicable
- jurisdiction
- effective dates

Do not invent these values.

If real owner-specific information is absent:

create configuration validation and mark it as a RELEASE BLOCKER.

Do not publish:

"[support email not configured]"

or:

"[Month/Year]"

or guessed jurisdiction.

---

# 14. PRIVACY REVIEW

Review actual application behaviour, not a generic privacy-policy template.

Inventory data collected through:

- registration
- authentication
- sessions
- newsletter
- admin
- affiliate clicks
- IP/logging if applicable
- analytics
- cookies
- hosting
- database
- email provider
- third-party embeds
- video embeds
- images/CDNs
- provider redirects
- uploaded media
- contact functionality
- monitoring/error services

Then compare the real behaviour with the privacy page.

Research current OAIC guidance and applicable Privacy Act/APP obligations.

Do not claim the site collects or does not collect something without verifying the code and deployment configuration.

---

# 15. COOKIE / TRACKING AUDIT

Inventory every cookie and tracking mechanism.

Classify:

- essential
- authentication
- preferences
- analytics
- affiliate attribution
- advertising/marketing

Determine whether any consent mechanism is actually necessary for the deployed stack and intended tracking.

Do not install a generic cookie banner merely because other websites have one.

Do not omit required controls if the actual tracking stack requires them.

---

# 16. EMAIL / NEWSLETTER

If newsletter or marketing email functionality exists or is planned for launch, verify compliance with current ACMA Spam Act guidance.

At minimum inspect:

- consent
- evidence of consent
- sender identification
- contact details
- unsubscribe
- unsubscribe processing
- suppression list
- re-subscription
- double opt-in decision
- privacy disclosure

Do not leave a newsletter form that collects addresses without an operational compliant workflow.

If newsletter is not ready:

disable or remove the public collection mechanism before launch.

---

# 17. TERMS OF USE

Inspect the current terms.

Remove all:

- draft markers
- guessed jurisdictions
- placeholder contact details
- unsupported statements

Ensure the terms correspond to actual product functionality.

Do not copy competitor terms.

Do not claim exclusions or rights that are inconsistent with Australian Consumer Law.

If a material legal position cannot be established, report it as unresolved instead of inventing wording.

---

# 18. AFFILIATE DISCLOSURE / HOW WE GET PAID

These pages must match actual commercial behaviour.

Verify:

- current affiliate status;
- whether commissions are currently earned;
- whether future relationships are described separately;
- sponsored placement treatment;
- provider ordering;
- editorial independence;
- click tracking;
- whether commission changes user price;
- whether all providers are included;
- how commercial relationships affect inclusion.

Remove every placeholder/TODO.

The footer disclosure must remain consistent with these pages.

Create one source of truth where practical.

---

# 19. METHODOLOGY

The methodology must explain the real system.

It should clearly cover:

- what providers are included;
- what providers are excluded;
- data sources;
- official-source hierarchy;
- verification;
- last checked dates;
- stale data;
- unknown data;
- conditional availability;
- fee interpretation;
- market access;
- CHESS/custody;
- crypto regulatory data;
- comparison ordering;
- affiliate independence;
- corrections;
- editorial content;
- updates.

Do not claim processes that the application/team does not actually perform.

---

# 20. CORRECTIONS / CONTACT

Evaluate whether the application has adequate ways for:

- users to contact Trading Guide;
- providers to report factual errors;
- readers to report corrections;
- privacy requests;
- affiliate/business enquiries.

If missing, propose:

/contact
/corrections

or an equivalent simple mechanism.

Do not expose a fake form.

It must have a working destination.

---

# 21. PROVIDER DATA AUDIT

Audit EVERY provider/offering currently seeded or stored in source-controlled seed data.

For every provider evaluate:

- identity
- website
- products
- markets
- fees
- fee conditions
- features
- custody
- CHESS
- account types
- crypto assets
- regulatory claims
- sources
- verification date
- stale status

Prefer:

official fee schedule
→ official legal/regulatory document
→ regulator register
→ official support documentation
→ reliable secondary source only when necessary

Never fabricate missing facts.

UNKNOWN != UNAVAILABLE.

CONDITIONAL != YES.

---

# 22. FEE REPRESENTATION

Audit all fee displays.

Ensure the UI distinguishes:

- brokerage
- FX conversion
- spread
- maker/taker
- deposit
- withdrawal
- platform fee
- account fee
- market data fee
- transfer fee
- custody fee
- conditional fees

Avoid misleading simplifications.

For example:

$0 brokerage

does NOT necessarily mean:

free trade

or:

zero total cost.

Make material qualifications visible.

---

# 23. CHESS / CUSTODY

Audit every custody claim.

Clearly distinguish:

- CHESS sponsored
- issuer sponsored
- custodial
- omnibus
- international custody
- beneficial ownership

Do not use "CHESS" as a generic badge without explanation.

Provide beginner-friendly explanation.

---

# 24. CONTENT QUALITY AUDIT

Audit every major public content template and every static guide.

The standard is:

A beginner should finish a page knowing something useful they did not know before.

Reject content that is:

- generic
- repetitive
- padded
- robotic
- formulaic
- keyword-stuffed
- vague
- obvious
- unnecessarily verbose
- fake-expert sounding
- full of unsupported claims

Content should sound like a knowledgeable human explaining something carefully to another human.

Do not use phrases such as:

"In today's fast-paced world..."
"Whether you're a beginner or seasoned investor..."
"Navigating the world of..."
"Let's dive in..."
"Unlock the power..."
"Game-changing..."
"Comprehensive solution..."

unless naturally justified.

Do not merely run text through an "AI humanizer".

Rewrite from meaning.

---

# 25. EDITORIAL STANDARD

Every substantive guide should answer:

WHO is this for?

WHAT will the reader understand?

WHY does it matter?

WHAT are the important risks/costs?

WHAT should the reader check themselves?

WHERE did the factual information come from?

WHEN was volatile information checked?

WHO wrote/reviewed it?

---

# 26. YMYL / TRUST

Financial content requires a particularly high trust standard.

Evaluate:

- author identity
- author profile
- reviewer identity
- expertise
- publication date
- updated date
- fact-check date
- sources
- methodology
- corrections
- about page
- contact
- editorial policy
- commercial disclosure

Do not fabricate credentials.

If real author/reviewer information does not exist, report the gap.

---

# 27. GOOGLE SEARCH AUDIT

Use CURRENT Google Search Central documentation.

Audit against:

- Search Essentials
- spam policies
- helpful/people-first content guidance
- crawling/indexing
- canonicalization
- sitemaps
- robots
- structured data policies
- image SEO
- JavaScript SEO where relevant
- page titles
- snippets
- internal linking

Do not rely on old SEO folklore.

Do not promise page-one rankings.

---

# 28. SITE INFORMATION ARCHITECTURE

Review whether the current structure clearly communicates:

LEARN
RESEARCH
COMPARE

Evaluate:

Homepage
Share trading
Crypto
Guides
News
Methodology

Check whether homepage CTAs are still disproportionately crypto-focused now that share trading exists.

Recommend a balanced information architecture.

Do not destroy working URLs unnecessarily.

Use redirects when URLs must change.

---

# 29. SEARCH INTENT / KEYWORD ARCHITECTURE

Build an Australian search-intent map.

Prioritize useful clusters such as:

share trading platforms australia
compare share trading platforms
brokerage fees australia
CHESS sponsored broker
CHESS vs custodial
how to buy shares australia
how brokerage works
international share trading australia
US shares australia
crypto exchanges australia
crypto exchange fees
how to buy crypto australia
crypto custody
crypto security

But:

do not create a page merely because a keyword exists.

Every indexable page must satisfy a distinct user need.

---

# 30. PROGRAMMATIC SEO GUARDRAIL

Do not mass-index:

CMC vs Stake
CMC vs CommSec
CMC vs IBKR
Stake vs CommSec
...

unless each indexable page contains genuinely useful, differentiated content.

Query-based comparisons may be noindex initially.

Recommend the correct strategy.

Avoid doorway/thin pages.

---

# 31. METADATA

Audit EVERY indexable template for:

- unique title
- useful description
- canonical
- OG title
- OG description
- OG image
- Twitter card
- index/follow state

No accidental localhost production URLs.

No conflicting canonicals.

No duplicate template metadata that removes search intent.

---

# 32. SITEMAP

Audit:

/sitemap.xml

Ensure:

- only canonical/indexable URLs;
- no admin;
- no auth utility pages;
- no redirect URLs;
- no duplicate comparison variants;
- no stale deleted records;
- correct absolute production URLs;
- useful lastModified where reliable.

Test the generated sitemap.

---

# 33. ROBOTS

Audit robots.ts.

Remember:

robots.txt is not authentication.

Admin protection must be application-level.

Determine whether:

register
privacy
terms
affiliate disclosure
how-we-get-paid
comparison query URLs

should be indexed based on their actual role.

Do not blindly disallow useful trust pages.

---

# 34. STRUCTURED DATA

Audit every JSON-LD builder and every use.

Only output structured data supported by visible page content.

Potential valid types:

Organization
WebSite
BreadcrumbList
Article
NewsArticle
ItemList

Do NOT invent:

Review
AggregateRating
ratingValue
Product offers

Do not maintain schema solely because it once generated a Google rich result.

Evaluate whether existing FAQPage/HowTo markup still provides meaningful current Search value and remove unnecessary schema if appropriate.

Validate structured data.

---

# 35. AUTHOR / ABOUT TRUST ARCHITECTURE

Check whether:

/about
/authors/[slug]

exist.

If they do not, evaluate whether they should be part of launch.

For financial/YMYL editorial content, users should be able to understand:

- who operates Trading Guide;
- who wrote the content;
- why they are qualified to write it;
- how research works;
- how corrections work;
- how the business makes money.

Do not fabricate expertise.

---

# 36. UX AUDIT — EVERY PUBLIC TEMPLATE

Audit visually and structurally:

- header
- desktop navigation
- mobile navigation
- footer
- homepage
- hub pages
- provider cards
- provider profiles
- comparison selector
- comparison tables
- mobile comparison cards
- guides
- article page
- news
- legal/trust pages
- forms
- auth

Evaluate:

- visual hierarchy
- whitespace
- typography
- line length
- CTA hierarchy
- scanning
- comprehension
- trust
- consistency
- empty states
- loading/error states
- mobile
- tablet
- desktop

Do not redesign for novelty.

Preserve the Trading Guide premium navy/gold visual identity where it works.

---

# 37. MOBILE REQUIREMENT

Test at representative widths such as:

320
360
375
390
430
768
1024
1280
1440+

Look specifically for:

- horizontal overflow
- clipped content
- unusable tables
- tiny tap targets
- sticky-header problems
- comparison column problems
- overflowing provider names
- long URLs
- fee text wrapping
- modal/popover overflow
- mobile nav
- footer layout
- images
- rich article content

Comparison must remain usable on mobile.

---

# 38. ACCESSIBILITY

Target WCAG 2.2 AA as the engineering benchmark.

Audit:

- keyboard navigation
- skip links
- landmarks
- heading hierarchy
- focus visibility
- focus order
- accessible names
- buttons vs links
- form labels
- errors
- colour contrast
- non-colour status indicators
- touch target size
- dialogs/popovers
- table semantics
- mobile reflow
- reduced motion
- image alt text
- decorative images
- ARIA misuse

Automated checks are not sufficient.

Include manual keyboard and screen-reader-oriented review.

---

# 39. DESIGN SYSTEM / CODE QUALITY

Identify:

- duplicated Tailwind strings
- duplicated layout logic
- duplicate domain formatting
- magic strings
- hardcoded provider logic
- hardcoded routes
- duplicated labels
- giant components
- dead code
- commented-out JSX
- obsolete TODOs
- stale documentation
- inconsistent naming
- unsafe casts
- unnecessary `any`
- Prisma queries inside presentation components
- duplicated data transformations

Do NOT perform huge aesthetic refactors merely for cleanliness.

Refactor where it reduces real maintenance risk.

---

# 40. ARCHITECTURAL BOUNDARIES

Maintain clean separation:

DATABASE
↓
REPOSITORY
↓
DOMAIN SERVICE
↓
PUBLIC DTO
↓
COMPONENT
↓
PAGE

Affiliate/commercial logic should remain separate from factual comparison data.

Editorial content should remain separate from volatile structured provider facts where appropriate.

---

# 41. SECURITY AUDIT

Review:

- authentication
- authorization
- admin middleware
- role checks
- server actions
- CSRF implications
- redirect validation
- open redirects
- URL validation
- XSS
- rich-text sanitization
- HTML rendering
- video embeds
- upload/media handling
- Prisma query safety
- rate-sensitive endpoints
- affiliate redirect abuse
- environment secrets
- accidental secret exposure
- error leakage

Do not expose internal/admin information publicly.

---

# 42. CMS SECURITY

The application uses rich article content.

Audit:

- TipTap output
- sanitize-html
- links
- images
- embeds
- iframe/video handling
- script/event attributes
- unsafe protocols
- HTML import
- admin preview
- published rendering

Attempt adversarial XSS cases.

---

# 43. PERFORMANCE

Audit:

- server/client component boundaries
- bundle size
- unnecessary client JS
- database query count
- N+1 queries
- large Prisma includes
- image optimization
- font loading
- caching
- ISR/revalidation
- dynamic rendering
- sitemap queries
- provider lists
- comparison queries

Directory pages should not load profile-sized datasets.

---

# 44. CORE WEB VITALS

Assess likely:

LCP
INP
CLS

and other meaningful performance metrics.

Optimize actual bottlenecks.

Do not chase Lighthouse 100 at the cost of functionality.

---

# 45. ERROR / EMPTY / STALE STATES

Explicitly test:

- no providers
- missing offering
- invalid slug
- invalid compare slug
- one compare provider
- unknown fee
- conditional fee
- stale data
- missing logo
- missing source
- inactive affiliate
- failed DB query
- unauthenticated admin
- unauthorized user
- invalid article
- unpublished article

The application should fail safely and clearly.

---

# 46. DATABASE

Audit schema.prisma thoroughly.

Review:

- indexes
- unique constraints
- nullability
- cascade deletion
- decimal vs float
- enums
- legacy models
- Provider vs ProviderOffering
- offering fees
- fee tiers
- market relations
- custody
- account types
- crypto assets
- provider regulation
- affiliate records
- article relations

Do not make destructive schema changes without explicit justification.

---

# 47. SEED DATA

Audit all seeds.

Ensure:

- idempotence;
- no fake production provider facts;
- no accidental active affiliate relationship;
- correct verification status;
- correct dates;
- official source provenance;
- deterministic market mapping;
- no obsolete placeholder records.

Seed data must be safe to run repeatedly.

---

# 48. ADMIN

Audit admin usability.

Verify administrators can reliably manage:

- articles
- media
- affiliate relationships
- affiliate links
- clicks
- provider data where implemented
- publication state
- SEO fields
- sources
- authors/reviewers
- verification

Do not expose admin functionality merely because it exists in a route.

---

# 49. ARTICLE CMS

Test the actual editorial workflow end-to-end:

DRAFT
→ edit
→ preview
→ sources
→ author/reviewer
→ SEO
→ publish
→ public page
→ update
→ modified date
→ sitemap/internal links

Verify images, links, videos and rich content.

No broken layouts.

---

# 50. HUMAN CONTENT REQUIREMENT

Do not make the site sound AI-generated.

Every rewritten page should follow this rule:

Explain the subject the way an experienced Australian educator would explain it to a smart beginner sitting beside them.

Prefer:

"Brokerage is the fee a platform charges when you buy or sell an investment."

over:

"Brokerage fees represent a critical consideration that investors should carefully evaluate when navigating the dynamic investment landscape."

Use concrete examples where useful.

Explain acronyms on first use.

Avoid unnecessary financial jargon.

---

# 51. HOMEPAGE RETENTION

The homepage must quickly answer:

What is Trading Guide?

Who is it for?

What can I learn?

What can I compare?

Why should I trust the information?

Where should I start?

The site now covers BOTH:

share trading
and
crypto.

Do not let the homepage continue behaving like a crypto-only product.

---

# 52. RETURN VISIT VALUE

Design reasons to return that are genuinely useful.

Examples to evaluate:

- recently updated provider data;
- new educational guides;
- comparison tools;
- fee calculators later;
- saved comparisons/watchlists where appropriate;
- correction/update transparency;
- useful newsletter only if compliant and genuinely valuable.

Do not use manipulative engagement patterns.

---

# 53. COMPETITOR BENCHMARKING

Research current Australian competitors such as:

Finder
Canstar
Moneysmart
other credible Australian trading-platform comparison resources

Compare:

- breadth
- provider profiles
- comparison dimensions
- methodology
- fee explanations
- CHESS
- custody
- beginner education
- trust
- disclosure
- SEO
- internal linking
- navigation
- content depth
- mobile UX

For each important capability classify:

ADOPT
IMPROVE
AVOID

Do not copy visual designs or wording.

---

# 54. TRADING GUIDE DIFFERENTIATION

Preserve and strengthen:

SOURCE
→ FACT
→ VERIFICATION
→ EXPLANATION
→ COMPARISON

Potential differentiators:

- evidence attached to volatile facts;
- verification dates;
- beginner explanations;
- no commission-driven rankings;
- clear conditional fee presentation;
- CHESS/custody education;
- factual provider comparison;
- transparent methodology;
- clean Australian focus.

Make these visible to users rather than hidden in the database.

---

# 55. ANALYTICS

Define a privacy-conscious measurement plan.

At minimum measure:

- organic landing page
- guide engagement
- provider profile views
- compare starts
- compare completion
- provider outbound clicks
- internal guide clicks
- return visitors
- search queries where available
- newsletter conversion if implemented

Do not install invasive tracking without reviewing privacy implications.

---

# 56. TRAFFIC GOAL

The business wants more than 100 visits/month during the first three months.

Do NOT guarantee this.

Instead produce an actionable 90-day acquisition plan with measurable leading indicators.

Include:

- Search Console
- Bing Webmaster Tools if worthwhile
- sitemap submission
- indexation monitoring
- keyword/query tracking
- content publishing cadence
- internal linking
- outreach
- relevant Australian communities where appropriate
- digital PR opportunities
- useful original tools/data
- content refreshes

Distinguish:

what code can accomplish
from
what requires ongoing marketing/editorial work.

---

# 57. PRODUCTION CONFIGURATION

Audit required environment variables.

Create/maintain an `.env.example` containing names only, never secrets.

Validate production-critical variables at startup/build where appropriate.

Examples may include:

DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET / AUTH_SECRET
NEXT_PUBLIC_SITE_URL
provider credentials
email credentials
storage credentials
analytics IDs

Use actual repository names.

Do not invent integrations that do not exist.

---

# 58. PRODUCTION DOMAIN

The intended brand/domain is Trading Guide / TradingGuide.com.au.

Verify the actual configured production URL from the repository/environment instructions.

Canonical, sitemap, Open Graph and redirects must consistently use the final canonical host.

Define:

www vs non-www

HTTPS

trailing slash behaviour

redirect policy.

---

# 59. HTTP / WEB STANDARDS

Review:

- semantic HTML
- correct HTTP status codes
- 404 handling
- redirects
- canonical responses
- security headers
- caching
- content type
- robots
- sitemap
- noindex
- image dimensions
- responsive images
- external-link behaviour

Do not use client-side workarounds where proper HTTP behaviour is available.

---

# 60. SECURITY HEADERS

Evaluate appropriate production headers including where relevant:

Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
frame restrictions / frame-ancestors

Do not paste a CSP that breaks Next.js, authentication, images, analytics or approved embeds.

Derive it from the actual application.

---

# 61. OBSERVABILITY

Recommend and, after approval, implement an appropriate minimal production observability strategy.

Cover:

- server errors
- failed affiliate redirects
- failed DB calls
- auth errors
- 404 trends
- Web Vitals
- deployment failures

Avoid logging sensitive personal information.

---

# 62. TESTING MATRIX

Before production approval require:

## Static

TypeScript
ESLint
Prettier
Prisma validate
Prisma generate

## Unit

domain formatters
comparison logic
fee logic
SEO helpers
URL validation
sanitization where practical

## Integration

repository/service
affiliate redirect
auth/authorization
article publication
sitemap

## UI

homepage
share trading
crypto
provider profiles
comparison
guides
news
trust/legal pages
auth

## Responsive

mobile
tablet
desktop

## Accessibility

automated + manual keyboard review

## Security

XSS
redirect abuse
authorization
invalid input

## Production

clean install
migration
seed strategy
production build
start/smoke test

Do not mark production ready if mandatory tests fail.

---

# 63. BUILD ENVIRONMENT

Perform a CLEAN validation rather than relying on an old node_modules directory.

Use the package manager implied by the lockfile.

Then run appropriate commands.

If package scripts themselves are obsolete or broken, fix them as part of the approved remediation.

Record exact results.

Never say:

"build passes"

unless it actually passes.

---

# 64. NO DIRTY FIXES

Forbidden:

- `as any` to silence real type problems;
- `@ts-ignore` without exceptional documented reason;
- disabling ESLint rules globally to pass;
- swallowing errors;
- fake fallback data;
- fake provider information;
- fake legal information;
- fake author credentials;
- duplicate implementations;
- commented-out obsolete code;
- hardcoded production domain throughout components;
- provider-specific hacks in generic comparison components.

Fix root causes.

---

# 65. COMMENTS

Remove stale comments and implementation-history essays from production code where they no longer add value.

Keep comments that explain:

WHY

not comments that simply repeat:

WHAT.

Do not remove useful compliance/data provenance explanations.

---

# 66. DOCUMENTATION

At completion update documentation to reflect reality.

Remove stale statements claiming implemented functionality is still a stub.

Create a concise production README covering:

- setup
- environment
- database
- migration
- seed
- admin
- article workflow
- provider data verification
- affiliate configuration
- deployment
- launch checks

---

# 67. RELEASE GATES

Create explicit gates.

## Gate A — Legal/compliance

No unresolved P0 compliance issue.

## Gate B — Data

No public material provider fact knowingly sourced from placeholder data.

## Gate C — Build

Production build passes.

## Gate D — UX

Critical pages work on mobile/tablet/desktop.

## Gate E — Accessibility

No known critical accessibility blocker.

## Gate F — SEO

Canonical/indexation/sitemap/robots/metadata validated.

## Gate G — Security

No known critical auth/XSS/open-redirect/security issue.

## Gate H — Commercial

Affiliate redirects/disclosures correspond to actual relationships.

## Gate I — Content

No draft/placeholder/TODO public content.

## Gate J — Operations

Production configuration, monitoring and rollback procedure documented.

If a gate fails:

DO NOT label the site production-ready.

---

# 68. FIRST RESPONSE REQUIRED FORMAT

Return the following BEFORE modifying code.

# Executive assessment

Overall state of the application.

# Production readiness scorecard

Use statuses only:

READY
NEEDS WORK
BLOCKER
NOT APPLICABLE

Do not create arbitrary numerical scores.

Areas:

- Product
- Share trading
- Crypto
- Provider data
- Comparison
- Content
- Legal/compliance
- Privacy
- Affiliate
- SEO
- Google Search
- Accessibility
- Mobile
- Desktop
- Performance
- Security
- Database
- Admin
- CMS
- Analytics
- Deployment

# Route-by-route audit

Audit every public template.

# P0 launch blockers

Complete list.

# P1 pre-launch issues

Complete list.

# P2 improvements

Complete list.

# Regulatory/compliance findings

For every finding include:

- issue
- page/code
- why it matters
- authoritative source
- proposed remediation
- uncertainty

# Competitor benchmark

| Capability | Trading Guide | Finder | Canstar | Moneysmart | Action |

Use factual comparisons.

Do not rank political or unrelated entities.

# SEO audit

Technical + content + information architecture.

# Content audit

Identify weak/thin/artificial/unhelpful content.

# UX audit

Desktop/mobile/accessibility.

# Code architecture audit

Identify maintainability issues.

# Security audit

Identify actual risks.

# Data-quality audit

Provider/fee/regulatory/source problems.

# Missing product capabilities

What materially prevents Trading Guide from being competitive.

# Proposed final information architecture

Show route tree.

# File-by-file remediation plan

For every proposed change:

NEW
MODIFY
DELETE
KEEP

and why.

# Database changes

Only if necessary.

Do not implement.

# Implementation milestones

Order work by dependency and risk.

# Production launch checklist

Everything required before deployment.

# 30/60/90-day growth plan

No traffic guarantees.

# Decisions required from me

Only include decisions that genuinely cannot be resolved from the source or authoritative research.

Then STOP.

Wait for approval.

---

# 69. IMPLEMENTATION PHASE — ONLY AFTER APPROVAL

Once I say:

PROCEED WITH PRODUCTION REMEDIATION

implement the approved plan.

Work milestone-by-milestone.

Do not ask for approval after every tiny file.

But stop if:

- a material regulatory ambiguity arises;
- real business information is missing;
- an external credential is required;
- a destructive migration becomes necessary;
- the approved architecture needs substantial revision.

---

# 70. FINAL RE-AUDIT

After implementation, DO NOT immediately say the project is finished.

Perform the entire audit again against the resulting repository.

Search again for:

TODO
FIXME
draft
placeholder
LEGAL REVIEW REQUIRED
CONTENT-GAPS
not configured
localhost
fake/sample provider data

Run all tests again.

Re-check public route inventory.

Re-check current regulatory facts where time-sensitive.

Re-check SEO.

Re-check responsive UI.

Re-check accessibility.

Re-check affiliate behaviour.

Re-check privacy claims against actual tracking.

---

# 71. FINAL OUTPUT

At the very end return:

# Production Readiness Report

## Passed gates

## Failed gates

## Remaining known limitations

## Tests executed

Include exact command and result.

## Pages manually validated

## Provider data verification status

## Compliance controls implemented

## SEO validation

## Accessibility validation

## Security validation

## Deployment configuration

## Database migration instructions

## Rollback instructions

## Launch sequence

## Post-launch monitoring

## 7-day checks

## 30-day checks

## 90-day checks

And one explicit status:

READY FOR PRODUCTION

or

NOT READY FOR PRODUCTION

Do not say READY merely because the code compiles.

---

# 72. DEFINITION OF DONE

The project is not done because:

- TypeScript compiles;
- the homepage looks attractive;
- Lighthouse is high;
- SEO metadata exists;
- disclaimers exist.

It is done only when the application is coherent end-to-end:

RESEARCH
→ VERIFIED DATA
→ DATABASE
→ SERVICES
→ UI
→ EXPLANATION
→ COMPARISON
→ DISCLOSURE
→ AFFILIATE FLOW
→ SEO
→ ACCESSIBILITY
→ SECURITY
→ DEPLOYMENT
→ MONITORING

with no known P0 release blocker.

---

# 73. PRODUCT PRINCIPLE

Every important page should answer:

What is this?

Why should I care?

What does it cost?

What are the important limitations?

What does this terminology mean?

Where did this information come from?

When was it checked?

What can I sensibly research next?

A visitor should leave better informed than when they arrived.

---

# 74. START

Start now by auditing the COMPLETE repository I supplied.

Use current authoritative external research where requirements or regulations may have changed.

Do not modify the repository yet.

Return the complete first-response audit defined in Section 68 and wait for my approval.
