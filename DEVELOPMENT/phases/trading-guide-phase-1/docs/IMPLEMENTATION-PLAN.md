# Crypto Affiliate Comparison Platform — Implementation Plan

**Status:** Draft planning document, based on the master prompt and the `index.html` design reference only. No existing codebase was supplied. Sections marked **[NEEDS CODEBASE AUDIT]** must be revisited once the real repo (`package.json`, Prisma schema, routes, auth config) is available — do not treat this plan's assumptions there as final.

---

## 0. Open Question Before Anything Else

The `index.html` reference is a general multi-asset "AusMarket" platform (Markets / Stocks / Forex / Crypto / News / Calendar / Compare / Research / Methodology), but the master prompt specifies a **crypto-only** MVP with exactly four public nav items (Crypto / Compare / Methodology / News). Confirm which is correct before Phase 1 UI work begins:

- **Option A:** Build strictly to the master prompt's crypto-only MVP scope; treat Markets/Stocks/Forex/Calendar as out of scope for now (recommended — matches the written brief).
- **Option B:** The site is actually a broader multi-asset intelligence platform with crypto as the flagship vertical; the master prompt's IA needs to be widened to match the reference.

Everything below assumes **Option A**, since that's what the master prompt states explicitly. Also note: all dummy data in the reference (Coinbase/Kraken/Gemini, FCA, "UK") is UK-jurisdiction placeholder content and must not leak into an Australian-targeted product.

---

## 1. Phase 0 — Existing Project Audit **[NEEDS CODEBASE AUDIT]**

Before any code changes, inspect and report on:

- `package.json` (framework versions, Next.js version, React version, existing dependencies)
- Next.js routing style (App Router vs Pages Router)
- Prisma schema — existing models, especially any User, Role, Article/Post, Provider/Broker, Affiliate-related models
- PostgreSQL connection/config
- Existing auth (NextAuth? custom? session strategy?)
- Existing Tailwind config / design tokens
- Existing component library and conventions
- Current SEO setup (metadata API usage, sitemap, robots)
- Lint/typecheck/build health (`npm run lint`, `typecheck`, `build`)
- Dead code / duplicated logic

**Output of this phase:** existing architecture summary, reusable parts, risks, and a confirmed list of files expected to change in Phase 1. Do not proceed past this without seeing the actual repo.

---

## 2. Public Information Architecture

```
/
/crypto
/crypto/[slug]                      (e.g. /crypto/bitcoin)
/crypto/guides
/crypto/guides/[slug]
/crypto/exchanges
/crypto/exchanges/[slug]
/crypto/categories/[slug]

/compare
/compare/crypto-exchanges
/compare/[slug]
/compare/[providerA]-vs-[providerB]

/news
/news/[slug]
/news/category/[slug]

/methodology
/methodology/comparisons
/methodology/editorial-policy
/methodology/affiliate-disclosure

/go/[partnerSlug]                    (server-side affiliate redirect, route handler)

/sitemap.xml
/robots.txt
```

**Decision needed:** educational articles live under `/crypto/guides/[slug]`, not a separate `/articles/[slug]` tree — one canonical location avoids duplicate URLs and split SEO equity. Revisit only if editorial content clearly outgrows the crypto namespace (e.g. broader non-crypto content strategy later).

---

## 3. Admin Information Architecture

```
/admin                          (dashboard)
/admin/articles
/admin/articles/new
/admin/articles/[id]
/admin/affiliates
/admin/affiliates/partners
/admin/affiliates/links
/admin/affiliates/clicks
/admin/media
/admin/settings
```

Provider Admin (`/admin/providers`, `/admin/providers/new`, `/admin/providers/[id]`) is deliberately deferred to Phase 9 — Providers are seeded/managed directly against the database in earlier phases so the public product (exchange profiles, comparisons) can ship before a provider-editing UI exists.

Nav stays flat and small for MVP: **Dashboard, Articles, Affiliates, Media, Settings** (Providers added later without restructuring).

---

## 4. Data Model (Prisma) — Conceptual, to Reconcile Against Existing Schema

Three domains, kept structurally separate, connected only via explicit join/relation models:

### Article domain
```
Article
  id, title, slug, excerpt, content, status (ArticleStatus),
  author, reviewer, category, tags[], seoTitle, seoDescription,
  canonicalUrl, featuredImage, publishedAt, scheduledAt, updatedAt,
  sources[], affiliateDisclosureRequired, noIndex

ArticleProvider (join table: Article <-> Provider)
  articleId, providerId, relationshipType (MENTIONED | COMPARED | FEATURED)

ArticleSource
ArticleTag
```

### Provider domain (factual, no commercial data)
```
Provider
  id, name, slug, logo, website, description, providerType,
  jurisdictions[], regulatoryInfo, supportedProducts[], supportedMarkets[],
  supportedAssets[], features[], securityInfo, mobileApp, apiSupport,
  verificationStatus, lastVerifiedAt

ProviderFact   (value, source, sourceUrl, sourceType, jurisdiction, verifiedAt, verificationStatus, notes)
ProviderFee
ProviderFeature
ProviderSource
```

### Affiliate domain (commercial relationship only)
```
AffiliatePartnership (Provider -> partnership; status: PROSPECT|APPLIED|APPROVED|ACTIVE|PAUSED|REJECTED|ENDED)
AffiliateProgram
AffiliateLink        (approved tracking URL, placement, campaign, active flag)
AffiliateCampaign
AffiliateClick        (timestamp, sourcePage, placement, campaign, link)
AffiliateConversion   (future — never fabricated)

AffiliatePlacement    (Article/Provider/Compare -> which surface a CTA appears on:
                        ARTICLE_INLINE | ARTICLE_SIDEBAR | ARTICLE_FOOTER |
                        PROVIDER_PROFILE | COMPARE_TABLE | COMPARE_SUMMARY | HOMEPAGE)
```

### Shared/auth
```
User (existing — extend, don't duplicate)
Role: USER | ADMIN
```

**Enums to add:** `ArticleStatus`, `VerificationStatus`, `CommissionType`, `ContentLabel`, `AffiliatePartnerStatus`, `ArticleProviderRelationship`.

**Hard rule carried from the master prompt:** a Provider must be fully functional (profile page, comparisons, article mentions) with zero rows in any Affiliate table. Deleting/ending an affiliate partnership must never delete or hide the Provider.

**[NEEDS CODEBASE AUDIT]** — reconcile against whatever Article/Provider/Affiliate-shaped models already exist; do not create redundant models if something usable is already there.

---

## 5. Component Architecture (adapt to existing conventions)

```
components/
  layout/      Header, Footer, MobileNavigation, Breadcrumbs
  crypto/      CryptoCard, CryptoGrid, CryptoHero
  providers/   ProviderCard, ProviderLogo, ProviderFacts, ProviderFees, ProviderSources, ProviderCTA
  compare/     CompareSelector, CompareTable, CompareRow, CompareMobileCards
  content/     ArticleCard, ArticleGrid, ArticleHeader, ArticleRenderer, RelatedArticles, SourceList
  affiliate/   AffiliateCTA, AffiliateDisclosure, AffiliateLink
  trust/       VerificationBadge, SourceBadge, LastVerified
  admin/       AdminShell, AdminSidebar, AdminHeader, DashboardCard, ArticleEditor, ArticleTable,
               AffiliatePartnerTable, AffiliateLinkTable
  seo/         JsonLd
  ui/          Button, Badge, Card, Tabs, Search
```

The `trust/` components (VerificationBadge, SourceBadge, LastVerified) are the one piece of the `index.html` reference worth lifting almost directly — its fact/evidence pattern (source, jurisdiction, verified date, status tag) already expresses this well visually.

---

## 6. Design System Tokens (derived from reference, Australian-generic copy)

```css
--background: #071019;
--panel: #0d1823;
--panel-secondary: #111f2d;
--border: #223243;
--text: #f4f1e8;
--muted: #9aa8b6;
--gold: #d6b46a;      /* accent, used sparingly */
--green: #48c995;     /* verified / positive */
--red: #ef7777;       /* warnings / negative */
--blue: #70a8ff;      /* informational */
```

Typography: serif/editorial display font for H1/H2 (reference used Georgia — evaluate a licensed equivalent via `next/font`), clean sans-serif for UI/body (reference used Inter). Convert into Tailwind tokens (`bg-background`, `bg-panel`, `text-muted`, etc.) rather than repeating hex values in components.

**New patterns not in the reference that need designing:** fee comparison tables, multi-section provider profile layout, 3+-way comparison table with mobile card fallback, affiliate CTA + disclosure component (visually distinct from editorial content per section 82's principle — never let commission influence look like editorial ranking).

---

## 7. Phased Implementation Roadmap

Each phase ends with: lint → typecheck → tests → build → fix regressions → summarize changed files → explain DB migrations → explain manual verification steps → **stop for approval** before the next phase.

### Phase 0 — Audit (see Section 1 above)
**Goal:** Understand existing project before touching it. **Output:** architecture summary, risks, Phase 1 file list.

### Phase 1 — Public Foundation
**Goal:** Header, footer, responsive nav (real Next.js routes, no hash routing), design system tokens, and the four top-level shells (`/crypto`, `/compare`, `/methodology`, `/news`) with placeholder/static content only.
**DB changes:** none required yet.
**Validation:** all four routes render, nav is keyboard-navigable and collapses to a drawer on mobile, no console/hydration errors.

### Phase 2 — Authentication + Admin Foundation
**Goal:** `Role.USER` / `Role.ADMIN` enforced server-side; `/admin` shell with Dashboard/Articles/Affiliates/Media/Settings nav (empty states only).
**DB changes:** extend User with Role if not already present.
**Validation:** non-admin users get a 403 on `/admin/*` at the server layer, not just a hidden link.

### Phase 3 — Article CMS
**Goal:** Article model, admin CRUD (create/upload/edit/preview/publish/unpublish/archive), SEO fields, categories/tags, media integration, related-providers/related-crypto linking, sources. Published articles render on public routes via a shared renderer (same renderer for admin preview and public page).
**DB changes:** `Article`, `ArticleProvider`, `ArticleTag`, `ArticleSource`, `ArticleStatus` enum.
**Validation:** create → draft → preview → publish → visible at `/crypto/guides/[slug]` or `/news/[slug]`; unpublished content returns 404/noindex to the public.

### Phase 4 — Provider Domain
**Goal:** Structured, database-backed provider data (no hard-coded provider names in components). Build `/crypto/exchanges` and `/crypto/exchanges/[slug]` with full profile layout (facts, fees, products, security, regulatory info, sources, verification date). No Provider Admin UI yet — seed via migration/script.
**DB changes:** `Provider`, `ProviderFact`, `ProviderFee`, `ProviderFeature`, `ProviderSource`, `VerificationStatus` enum.
**Validation:** at least 2–3 real (or clearly-labeled placeholder) Australian providers render correctly with unverified/variable states shown honestly, not guessed.

### Phase 5 — Comparison Engine
**Goal:** `/compare`, `/compare/crypto-exchanges`, `/compare/[slug]`, `/compare/[a]-vs-[b]`, all sourced from the Provider domain — no data duplicated into compare-specific tables.
**Validation:** comparison table degrades to stacked cards on mobile; changing a Provider fact updates the comparison without code changes.

### Phase 6 — Affiliate Domain
**Goal:** `AffiliatePartnership`, `AffiliateProgram`, `AffiliateLink`, `AffiliateCampaign`, `AffiliateClick` as a fully separate domain; `/admin/affiliates/*`; `/go/[partnerSlug]` server-side redirect that validates against an approved-URL allowlist (never redirects to arbitrary user-supplied URLs) and records a click before redirecting.
**DB changes:** affiliate tables + `AffiliatePartnerStatus`, `CommissionType` enums.
**Validation:** a Provider with an ACTIVE partnership shows a "Visit Provider" CTA + disclosure; ending the partnership removes the CTA but the Provider profile and comparisons remain fully intact.

### Phase 7 — Affiliate Analytics
**Goal:** Aggregated (not raw-event-by-default) reporting by partner/article/provider/comparison/placement/campaign/date. Prepare schema for future conversion/revenue import — never fabricate numbers in the meantime.
**Validation:** dashboard numbers trace back to real `AffiliateClick` rows; zero-data states say "No data yet," not `0` dressed up as a trend.

### Phase 8 — SEO Growth
**Goal:** Content clusters, internal linking engine, structured data (JSON-LD), sitemap generation, category pages, canonical rules, basic search (Postgres full-text is sufficient initially) across Crypto/Provider/Guide/News/Comparison content types.

### Phase 9 — Provider Admin
**Goal:** `/admin/providers`, `/admin/providers/new`, `/admin/providers/[id]` — non-developer editing of provider facts/fees/features without changing the underlying schema from Phase 4.

### Phase 10 — Production Hardening
**Goal:** Security review, authorization re-check, upload validation, open-redirect prevention on `/go/[partner]`, SEO audit, mobile/accessibility pass, DB indexes, broken-link check, full `lint`/`typecheck`/`test`/`build` pass.

---

## 8. Cross-Cutting Rules (apply in every phase)

- Article, Provider, and Affiliate stay structurally separate; if one model/service starts doing all three jobs, refactor before continuing.
- Every admin mutation independently authenticates + authorizes server-side — a protected page is not the same as a protected mutation.
- Never fabricate live prices, provider fees, regulatory status, affiliate partnerships, or conversion/revenue data. Show "unverified"/"not applicable" instead of guessing.
- No hard-coded provider names/fees in JSX — always through the Provider service/repository layer.
- Affiliate commission must never influence editorial ranking or comparison ordering.
- Prefer Server Components/Server Actions; use `"use client"` only where interactivity requires it.
- Design every page for both desktop and mobile before calling a phase done.

---

## 9. Compliance / Trust Risks to Flag for Review

- Affiliate disclosure language and placement (AU consumer law expectations for sponsored/affiliate content).
- Whether displayed provider fee/regulatory information constitutes financial advice — copy should stay descriptive/comparative, not prescriptive ("best," "guaranteed," "safest" are already correctly avoided in the reference and must stay that way).
- Data retention/PII handling for affiliate click tracking (IP/session-level data, if any).
- Accuracy lifecycle: what triggers a provider fact being marked "Stale" and who is responsible for re-verification.

---

## 10. Immediate Next Step

Run **Phase 0** against the real repository once it's available, and resolve the Section 0 scope question (crypto-only vs. multi-asset brand) before any Phase 1 UI work begins.
