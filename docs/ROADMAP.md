# Roadmap & Scaffold Status

This tracks exactly what's implemented in this scaffold vs. what's still a stub, phase by phase.
Cross-reference with `docs/IMPLEMENTATION-PLAN.md` for the full rationale behind each decision.

Legend: ✅ done in this scaffold · 🟡 stub/placeholder (compiles, no real logic) · ⬜ not started

---

## Phase 0 — Existing Project Audit
**Status: N/A (no existing project supplied — this is a greenfield scaffold).**
If you're dropping this into an existing codebase instead of starting fresh, run the audit checklist in `docs/IMPLEMENTATION-PLAN.md` §1 before merging anything here.

## Phase 1 — Public Foundation
- ✅ Design tokens (`globals.css` `@theme`, Tailwind v4) matching the reference palette
- ✅ `Header`, `Footer`, `MobileNav` — real Next.js `<Link>` routing, no hash routing
- ✅ Four top-level shells: `/crypto`, `/compare`, `/methodology`, `/news`
- ✅ Homepage
- ✅ Mobile drawer: animated slide-in panel with overlay, scroll lock, route-change auto-close, keyboard-accessible toggle
- ✅ Typography licensing decision: Source Serif 4 (display) + Inter (sans), both self-hosted via `next/font/google` — no unlicensed Georgia fallback, no runtime font request

**Phase 1 status: complete.**

## Phase 2 — Authentication + Admin Foundation
- ✅ Prisma `User`/`Role` model + Auth.js (NextAuth v5) adapter models (`Account`, `Session`, `VerificationToken`)
- ✅ `src/middleware.ts` — server-side `/admin/*` protection (redirects unauthenticated → `/login`, non-admin → `/403`)
- ✅ `requireAdmin()` helper for guarding server actions/mutations independently of the middleware
- ✅ Admin shell (`AdminSidebar`, `AdminHeader`, `/admin` dashboard with real DB-backed counts)
- 🟡 `src/lib/auth/config.ts` has no real provider wired in — add Google/email/credentials before this is usable
- 🟡 `/login` page has no actual sign-in form yet

## Phase 3 — Article CMS
- ✅ `Article`, `ArticleTag`, `ArticleSource`, `ArticleProvider`, `ArticleCryptoAsset` models
- ✅ `lib/articles/service.ts` — `getPublishedArticles`, `getArticleBySlug`, `getAdminArticles`
- ✅ Public rendering at `/crypto/guides/[slug]` and `/news/[slug]`, both refusing to render non-`PUBLISHED` articles
- ✅ `/admin/articles` list view (real data, honest empty state)
- 🟡 `/admin/articles/new` and `/admin/articles/[id]` are placeholders — no editor, no `createArticle()`/`updateArticle()`/`publishArticle()` server actions yet
- ⬜ Markdown/MDX editor decision + implementation (see IMPLEMENTATION-PLAN §6 design notes)
- 🟡 File-based import workflow (`npm run import:article`, see `docs/article-publishing-format.md`) — Phase 1 only: scanning, shared `.md`/`.txt` parsing, Zod validation, Markdown→sanitized-HTML conversion, and `--dry-run` reporting are implemented (`src/lib/articles/import/`, `scripts/import-articles.ts`). **No database writes or file movement yet** — that's Phase 2/3 of `src/lib/articles/import/`.
- ⬜ Media integration

## Phase 4 — Provider Domain
- ✅ `Provider`, `ProviderFact`, `ProviderFee`, `ProviderFeature`, `ProviderSource` models with full provenance fields
- ✅ `ProviderProsCon` model (this change) — sourced pros/limitations, same provenance shape (`sourceUrl`, `verificationStatus`, `verifiedAt`) as every other Provider fact, migration at `prisma/migrations/20260911050000_provider_profile_phase2/`
- ✅ `lib/providers/service.ts` — `getProviderBySlug()` now includes `prosCons`; added `getRelatedContentForProvider()` (guides/news via the existing `ArticleProvider` join, split by `Article.category`, same convention `/crypto/guides` and `/news` already use)
- ✅ `lib/providers/features.ts` (this change) — groups the existing flat `ProviderFeature` list into `products` / `deposits` / `security` by `ProviderFeatureType`, so the profile page can render honest per-section cards without a schema change or duplicated data
- ✅ `/crypto/exchanges` list + `/crypto/exchanges/[slug]` profile page (facts + fees rendered with verification badges)
- ✅ Profile page (this change) — added **Products & trading**, **Deposits & withdrawals**, and **Security** sections (grouped `ProviderFeature` rows via `features.ts`), a **Pros & limitations** section (`components/providers/ProviderProsCons.tsx`, each item individually sourced/verification-badged), and **Related guides** / **Related news** sections (`components/guide/RelatedGuides.tsx` reused + new `components/providers/RelatedNews.tsx`) — closes the IMPLEMENTATION-PLAN §4 profile-layout gap
- ✅ Seed script creates three providers; two now carry **real, sourced Australian data**:
  - **CoinSpot** — fees, AUD deposit/withdrawal methods, OTC desk, and AUSTRAC/ASIC regulatory status verified directly against `coinspot.com.au/fees` and CoinSpot's own Zendesk support articles (official sources, marked `VERIFIED`); coin-count and a few UX claims sourced from reputable third-party reviews and left `UNVERIFIED` rather than upgraded on secondhand reporting.
  - **Independent Reserve** — added as a second real AU exchange (Sydney-hosted infrastructure and API access confirmed via its official FAQ, `VERIFIED`; tiered maker/taker fee schedule, coin count, ownership and AFSL-exemption status sourced from third-party reviews/Forbes Advisor and left `UNVERIFIED`).
  - **Kraken** remains the original `UNVERIFIED` placeholder — real AU-specific sourcing for it is still outstanding.
  - All of the above were checked 11 Sep 2026. Australia's crypto licensing regime changed materially in 2026 (AUSTRAC's expanded VASP scope from 31 March 2026; ASIC's AFSL "no-action" deadline of 30 June 2026 under the Digital Assets Framework) — re-verify regulatory facts on a short cycle, don't treat this seed as done-once.
- ⬜ Still to do before public launch: real sourcing for Kraken (or drop it in favour of a third genuinely AU-first exchange, e.g. Swyftx/CoinJar/Coinstash, following the same pattern), and an admin UI to edit these facts without touching the seed script (tracked in Phase 9).

## Phase 5 — Comparison Engine
- ✅ `/compare` index (provider list + new `CompareSelector` to pick 2+ exchanges without hand-typing a slug), `/compare/[slug]` (now parses **any number** of `-vs-` segments, not just pairs), and `/compare/crypto-exchanges` (this change — dedicated, always-complete route)
- ✅ Comparison data pulled live from the Provider domain, not duplicated — `lib/providers/compare.ts` (this change) builds Facts/Fees/Products & trading/Deposits & withdrawals/Security rows from `getProvidersBySlugs()`'s live query, reusing the same `featureGroup()` split the exchange profile page uses so the two views never disagree
- ✅ Real comparison table (this change) — `components/compare/CompareTable.tsx` renders one column per provider with actual facts/fees/features (not just names), horizontally scrollable so it supports any number of providers
- ✅ Mobile-card fallback (this change) — `components/compare/CompareMobileCards.tsx`, one stacked card per provider, same rows, shown below the `md` breakpoint while `CompareTable` is hidden
- ✅ 3+-way comparison UI (this change) — `/compare/[slug]` and `canonicalCompareSlugMulti()` in `lib/seo/canonical.ts` generalized from exactly two providers to any number; a mistyped or non-existent slug still 404s correctly rather than rendering a soft "not found" 200 (kept from the Phase 0 hardening)
- ✅ `/compare/crypto-exchanges` dedicated route (this change) — always includes every `CRYPTO_EXCHANGE` provider with no combinatorial URL to mistype, so unlike `/compare/[slug]` it's indexed (added to `sitemap.ts` via `staticEntries()`)
- ⬜ `/compare/[slug]` indexing policy for arbitrary provider combinations is still an open SEO decision, deliberately left `noIndex: true` pending Phase 8 review rather than indexing every possible pair/triple

## Phase 6 — Affiliate Domain
- ✅ Full schema: `AffiliatePartnership`, `AffiliateProgram`, `AffiliateLink`, `AffiliateClick`, `AffiliateConversion` (no separate `AffiliatePlacement` model — placement is a string field on `AffiliateLink`/`AffiliateClick` instead; see IMPLEMENTATION-PLAN §4 vs. the actual schema)
- ✅ `lib/affiliates/service.ts` — `getActiveAffiliateLink`, `getActiveAffiliateLinksForProviderSlugs`, `recordAffiliateClick`, plus (this change) the admin read queries `getPartnershipsAdmin`, `getProvidersForPartnershipForm`, `getPartnershipsForLinkForm`, `getAffiliateLinksAdmin`, `getAffiliateClicksAdmin`
- ✅ `/go/[partner]` route handler — redirects only to a stored `approvedUrl` on an ACTIVE link, 404s otherwise, records a click first (open-redirect-safe by construction)
- ✅ `AffiliateCTA` + `AffiliateDisclosure` components
- ✅ `AffiliateCTA` wired into the exchange profile page (`/crypto/exchanges/[slug]`), conditional on a real `getActiveAffiliateLink()` lookup, and into `RelatedProviders` on the guide template — both gated on a real ACTIVE link, never fabricated. (This change also fixed the exchange profile page rendering the CTA with `showDisclosure={false}` and no other disclosure on the page — it now shows its own, matching the one-CTA vs. shared-section-disclosure convention `RelatedProviders` already used.)
- ✅ `/admin/affiliates/partners`, `/links`, `/clicks` (this change) — real CRUD/read views, not placeholders:
  - `/admin/affiliates` — overview with partnership/link/click counts linking into the three tabs
  - `/admin/affiliates/partners` — list + create `AffiliatePartnership` (`lib/affiliates/actions.ts#createPartnership`), inline status update (`updatePartnershipStatus`)
  - `/admin/affiliates/links` — list + create `AffiliateLink` under an APPROVED/ACTIVE partnership (`createAffiliateLink`, reuses or creates the backing `AffiliateProgram` in a transaction), activate/deactivate toggle (`toggleAffiliateLinkActive`); `approvedUrl` is validated as a real `https://` URL before it's stored, since it's the only place `/go/[partner]`'s redirect target is ever set
  - `/admin/affiliates/clicks` — paginated, read-only click log (`AffiliateClick` is an append-only record written by `/go/[partner]`, never edited from the admin UI)
  - Every mutation in `lib/affiliates/actions.ts` calls `requireAdmin()` itself, independent of the `/admin` layout guard, per the Phase 10 cross-cutting rule
  - Ending/pausing a partnership only changes its own status — it never deletes an `AffiliateLink` or touches the `Provider` row; a link's own `active` flag is what controls whether `getActiveAffiliateLink()` returns it publicly

## Phase 7 — Affiliate Analytics
- ✅ `/admin/affiliates` overview reads real click counts per link
- ⬜ Aggregated reporting by article/comparison/placement/campaign/date
- ⬜ Conversion/revenue import (schema exists via `AffiliateConversion`, nothing populates it — by design)

## Phase 8 — SEO Growth
- ✅ `sitemap.ts`, `robots.ts` (dynamic, DB-backed)
- ✅ Per-article/provider `generateMetadata` with `noIndex` support
- ⬜ JSON-LD structured data components (`components/seo/JsonLd.tsx` folder exists, empty)
- ⬜ Content clusters, internal linking engine, category pages, site search

## Guide Phase 1 — Guide Article Template (this change)
**Status: implemented, pending `npm install` / `prisma migrate` / lint-typecheck-build in a real environment — this sandbox has no package registry or database access.**
- ✅ `Article` gains `keyTakeaways String[]`, `lastReviewedAt`, `searchIntent` (`ArticleSearchIntent` enum), `region`/`canonicalArticleId` self-relation, and a curated `ArticleRelated` join table — all additive, migration at `prisma/migrations/20260910090000_guide_phase_1/`
- ✅ `src/lib/articles/content.ts` — heading extraction (anchors ids for TOC) + reading-time estimate, both derived from real content, nothing fabricated
- ✅ `src/lib/articles/service.ts` — `getRelatedGuides()` (curated → category/intent → tags → recent, per the priority chain in the spec), `getNextSteps()` (only for BEGINNER/LEARN intent, only when curated), `getRegionalFamily()` for hreflang, all wrapped in React `cache()` to dedupe within a request
- ✅ `src/lib/affiliates/service.ts` — `getActiveAffiliateLinksForProviderSlugs()`, a batched lookup for the guide's provider-discovery section
- ✅ New `src/components/guide/*` — `GuideHeader`, `KeyTakeaways`, `GuideTableOfContents` (zero-JS, native `<details>`), `GuideSidebar`, `GuideSourceList`, `RelatedGuides`, `RelatedProviders` (safe non-superlative labels, affiliate CTA gated on a real ACTIVE link), `GuideNextSteps`
- ✅ `AffiliateCTA` gains an optional `showDisclosure` prop so multi-provider sections show one disclosure, not one per card
- ✅ `/crypto/guides/[slug]` rebuilt around all of the above; `generateMetadata()` emits `hreflang`/`x-default` only when real regional variants exist
- ⬜ Admin authoring UI for the new fields (`keyTakeaways`, `searchIntent`, `region`, curated `ArticleRelated` rows) — still blocked on the Phase 3 article editor not existing yet
- ⬜ No real guide content exists yet to verify the layout against beyond the seed data — do this before publishing

## Phase 9 — Provider Admin
- ⬜ Not started — Providers are seeded via `prisma/seed.ts` only, as intended for this phase

## Phase 10 — Production Hardening
- ⬜ Not started — do this last, against a real deployment target

---

## Immediate next steps, in order

1. `npm install`, copy `.env.example` → `.env`, point `DATABASE_URL` at a real Postgres instance.
2. `npm run db:migrate` to create the schema, then `npm run db:seed`.
3. Wire a real Auth.js provider in `src/lib/auth/config.ts`, promote your own user to `ADMIN` via `prisma studio` or a script.
4. Build the article editor (`/admin/articles/new`) and its server actions — this unblocks real content, which unblocks everything downstream (SEO, provider mentions, affiliate placements).
5. Wire `AffiliateCTA` into the provider profile page, conditional on `getActiveAffiliateLink()`.
6. Replace placeholder seed providers with real, sourced Australian provider data before any public deployment.