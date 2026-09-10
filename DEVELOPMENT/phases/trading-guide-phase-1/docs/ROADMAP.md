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
- ⬜ File upload/import workflow (.md/.mdx/.txt)
- ⬜ Media integration

## Phase 4 — Provider Domain
- ✅ `Provider`, `ProviderFact`, `ProviderFee`, `ProviderFeature`, `ProviderSource` models with full provenance fields
- ✅ `lib/providers/service.ts`
- ✅ `/crypto/exchanges` list + `/crypto/exchanges/[slug]` profile page (facts + fees rendered with verification badges)
- ✅ Seed script creates two clearly-labeled placeholder providers
- 🟡 Profile page covers facts/fees only — products, security info, deposit/withdrawal methods, pros/limitations, related guides/news sections from IMPLEMENTATION-PLAN §4 are not laid out yet
- ⬜ Real, sourced Australian provider data (seed data is explicitly placeholder — do not publish as-is)

## Phase 5 — Comparison Engine
- ✅ `/compare` index + `/compare/[slug]` (supports `a-vs-b` slug parsing)
- ✅ Comparison data pulled live from the Provider domain, not duplicated
- 🟡 Table is a simple two-column card layout — no mobile-card fallback pattern, no 3+-way comparison UI, no `/compare/crypto-exchanges` dedicated route yet

## Phase 6 — Affiliate Domain
- ✅ Full schema: `AffiliatePartnership`, `AffiliateProgram`, `AffiliateLink`, `AffiliatePlacement`, `AffiliateClick`, `AffiliateConversion`
- ✅ `lib/affiliates/service.ts` — `getActiveAffiliateLink`, `recordAffiliateClick`
- ✅ `/go/[partner]` route handler — redirects only to a stored `approvedUrl` on an ACTIVE link, 404s otherwise, records a click first (open-redirect-safe by construction)
- ✅ `AffiliateCTA` + `AffiliateDisclosure` components
- 🟡 Nothing in the UI currently calls `getActiveAffiliateLink` to conditionally render `AffiliateCTA` on a provider profile — that wiring is the next concrete step
- ⬜ `/admin/affiliates/partners`, `/links`, `/clicks` are placeholders — no CRUD yet

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
