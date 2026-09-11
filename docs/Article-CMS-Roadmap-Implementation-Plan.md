# Article CMS — Roadmap & Implementation Plan

Answers to the two requirement docs, plus a concrete 5-block plan grounded in
what's actually in `trading-online.zip` (checked against
`prisma/schema.prisma`, `src/lib/articles/*`, `src/app/admin/articles/*`,
`src/app/news`/`src/app/crypto/guides`, and the importer).

---

## Answers to the questions raised in Req1/Req2

These aren't rhetorical — they're decisions the plan below depends on.

1. **Is the `updatedAt` bug real?** Yes. `Article` in `prisma/schema.prisma`
   has no `createdAt`/`updatedAt`, but both Guide and News pages read
   `article.updatedAt` for `modifiedTime`, and `service.ts` has a commented-out
   `orderBy: { updatedAt: "desc" }`. This is a live bug, not a hypothetical.
2. **Is Guide/News route collision real?** Yes. Both `/news/[slug]` and
   `/crypto/guides/[slug]` call the same `getArticleBySlug(slug)`, which only
   checks `status === "PUBLISHED"` — nothing prevents a `category: "guide"`
   article resolving under `/news/*` or vice versa.
3. **Do `/admin/articles/new` and `/admin/articles/[id]` exist?** Only as
   static placeholder text — no form, no server action, confirmed by reading
   both files.
4. **Is there an HTML sanitizer available?** Yes — `sanitize-html` and
   `marked` are already in `package.json` but **not used anywhere** in the
   article render path. Both Guide and News currently do
   `dangerouslySetInnerHTML={{ __html: article.content }}` on raw DB content
   with zero sanitization. This is a real stored-XSS surface today, not a
   theoretical one, since imported/admin content already reaches these pages.
5. **ArticleType vs category** — recommend the minimal `NEWS | GUIDE` enum
   first (Req2 explicitly allows starting there), not the full six-value enum,
   to keep Block 1 small and reviewable. Expand later without a migration
   drama since it's additive to the enum.
6. **Author/reviewer as a structured model?** Not in this pass. `author` /
   `reviewer` stay as strings. Introducing `AuthorProfile` is real scope
   (Req2 §13 flags this itself as optional) and isn't load-bearing for the
   five blocks requested — flagged as a fast-follow, not blocking.
7. **ArticleFaq, ArticleEmbed as separate tables, expanded ArticleSource?**
   `ArticleEmbed` — yes, needed for Block 4 (see design below). `ArticleFaq`
   and expanded `ArticleSource` — deferred; nothing in the five requested
   blocks depends on them, and adding them now would bloat Block 1's
   migration beyond "correct foundation."
8. **Scheduling (`scheduledAt`)** — no background job runner exists in this
   codebase (no queue, no cron infra visible). Per Req2 §45, we leave
   `scheduledAt` as manual/advisory only and document explicitly that nothing
   auto-publishes from it, rather than faking automation.

---

## Grounding: what's actually broken/missing today

| Area | File | Status |
|---|---|---|
| `createdAt`/`updatedAt` | `prisma/schema.prisma` (`Article`) | Missing, but read in `crypto/guides/[slug]/page.tsx` and `news/[slug]/page.tsx` |
| `ArticleStatus` | schema | `DRAFT \| PUBLISHED \| ARCHIVED` — no `REVIEW` |
| Article type | schema | Only a free-text `category` column |
| Route isolation | `service.ts::getArticleBySlug` | No type filter at all |
| Admin create/edit | `admin/articles/new`, `admin/articles/[id]` | Literal placeholder text, no form/action |
| HTML sanitization | `news/[slug]/page.tsx`, `crypto/guides/[slug]/page.tsx` | Raw `dangerouslySetInnerHTML`, no `sanitize-html` usage despite it being installed |
| Embeds | — | Don't exist at all — `content.ts` only does heading-ID injection |
| Importer | `import/importer.ts` | Solid two-pass/idempotent/DRAFT-only design; doesn't know about type, review, or embeds yet |
| Admin auth pattern | `lib/auth/require-admin.ts` | `requireAdmin()` exists and is already the convention for mutations — reuse it, don't reinvent |

---

## Block 1 — Fix the Article domain (foundation)

**Goal:** correct schema + safe queries, no UI yet. Everything downstream depends on this being right.

### Schema changes (`prisma/schema.prisma`)
```prisma
enum ArticleStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}

enum ArticleType {
  NEWS
  GUIDE
}

model Article {
  ...
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  articleType ArticleType // no default — forces an explicit migration decision, see below
  ...
  @@index([status, articleType, publishedAt])
}
```

- Migration file: `npx prisma migrate dev --name article_domain_foundation`.
- **Backfill strategy for `articleType`:** add the column nullable first,
  backfill deterministically from `category` (`category ILIKE '%guide%' →
  GUIDE`, `category ILIKE '%news%' → NEWS`), then a second migration makes it
  `NOT NULL` with a documented manual-review list for rows that didn't match
  either pattern (set to `GUIDE` as the safer default, flagged in
  `docs/article-import-format.md` for editor follow-up). No `db push`, no
  data loss — two small migrations, not one destructive one.
- No `AuthorProfile`, no `ArticleFaq`, no `ArticleEmbed` yet — that's Block 4.

### Service layer (`src/lib/articles/service.ts`)
- Add `getPublishedArticleBySlugAndType(slug, type: "NEWS" | "GUIDE")` —
  filters on `status: "PUBLISHED"` **and** `articleType`. Keep
  `getArticleBySlug` for admin/preview use only (rename usage sites so public
  routes can't accidentally call the unfiltered version).
- Re-enable `orderBy: { updatedAt: "desc" }` in `getAdminArticles` now that
  the column exists — delete the `// [TODO]` comment.

### Route fixes
- `src/app/news/[slug]/page.tsx` and `src/app/crypto/guides/[slug]/page.tsx`
  switch to `getPublishedArticleBySlugAndType(slug, "NEWS" | "GUIDE")`, `notFound()` on
  type mismatch exactly like a missing slug.

### Tests (`src/lib/articles/import/__tests__/`, matching existing convention)
- NEWS article slug 404s under `/crypto/guides/[slug]`, and vice versa.
- `getAdminArticles` returns rows ordered by `updatedAt`.

**Exit criteria:** `npx prisma validate && npx prisma generate && npm run build` all pass; existing Guide/News pages render unchanged for already-correct data; a same-slug cross-type article properly 404s.

---

## Block 2 — Real admin CRUD

**Goal:** `/admin/articles/new` and `/admin/articles/[id]` become an actual editor, per Req2 §7–§9, §43.

### Server actions (new file: `src/lib/articles/actions.ts`, alongside the existing `src/lib/affiliates/actions.ts` convention)
```
createArticle
updateArticle
submitForReview   (DRAFT -> REVIEW)
returnToDraft     (REVIEW -> DRAFT)
publishArticle    (REVIEW -> PUBLISHED, sets publishedAt if unset)
unpublishArticle  (PUBLISHED -> DRAFT)
archiveArticle    (-> ARCHIVED)
```
Every action: `await requireAdmin()` first line (matching the existing
affiliate-actions pattern), Zod-validated input, transaction for multi-table
writes (relationships), `revalidatePath` on affected public routes.

### Form (`/admin/articles/new`, `/admin/articles/[id]`)
Server Component shell + Client Component for the interactive editor,
matching Req2 §6's "Server Components by default, `"use client"` only for
interactive bits" rule. Sections, per Req2 §16:
- Basic info (title, slug w/ auto-generate + uniqueness check, articleType, category, excerpt)
- Content (HTML textarea/editor — plain textarea is fine for Block 2; a rich
  editor is explicitly Req2's Block D/renderer concern, not CRUD)
- Key takeaways (repeatable list)
- Relationships: providers (multi-select + relationship type MENTIONED/COMPARED/FEATURED), crypto assets, related guides, tags
- Sources (label/url pairs)
- SEO (seoTitle, seoDescription, canonicalUrl, noIndex)
- Publishing (status actions, `lastReviewedAt` display, timestamps)

### Slug handling
Auto-generate from title on creation, editable, uniqueness-checked server-side (`@unique` will throw — catch and surface a friendly error), warn client-side before editing an already-published slug (no redirect table yet — Req2 explicitly says don't over-engineer this).

### List page (`/admin/articles`)
Extend the existing table: columns for Type / Status / Updated / Published; filters for status and type; Edit/Preview/Publish row actions wired to the new actions.

### Testing status
**Covered — pure logic, no database required, runs today via `npm test`:**
- Status-transition legality: every legal edge in `DRAFT → REVIEW → PUBLISHED`,
  `→ ARCHIVED`, and the `ARCHIVED → DRAFT` restore path succeeds; every
  illegal jump (`DRAFT → PUBLISHED`, `ARCHIVED → PUBLISHED`,
  `ARCHIVED → REVIEW`, `PUBLISHED → REVIEW`, any status to itself) is
  rejected. See `src/lib/articles/status-transitions.ts` (the single source
  of truth `actions.ts` now defers to, rather than repeating the rule set
  per action) and `src/lib/articles/__test__/status-transitions.test.ts`.
- Guide/News route isolation (Block 1's rule): a PUBLISHED GUIDE is
  invisible when NEWS is required and vice versa; DRAFT/REVIEW/ARCHIVED
  articles are never publicly visible regardless of type. See
  `isPubliclyVisibleArticle` in the same file.
- `validateArticleForm` edge cases: missing/invalid title, slug, articleType,
  content, canonicalUrl, provider relationships, source URLs — see
  `src/lib/articles/__test__/validation.test.ts`.
- `sanitizeArticleContent`: `<script>`, inline event handlers, `javascript:`
  URLs, `<iframe>`, and disallowed attributes (`class`, `style`) are
  stripped; allowed tags/attributes and the `rel="noopener noreferrer"`
  link transform survive — see `src/lib/articles/__test__/sanitize.test.ts`.
  (Writing this test caught a real bug: `rel` was never in the `<a>`
  attribute allowlist, so sanitize-html's own filtering silently stripped
  the transform's `rel="noopener noreferrer"` right back out — fixed in
  `sanitize.ts`.)

**NOT covered — genuinely needs a database, and no test-DB infrastructure
exists yet (no docker-compose, no `.env.example`, no test-DB convention
anywhere in the repo):**
- `requireAdmin()` actually rejecting a non-admin/unauthenticated session on
  every mutation (currently exercised only by code review, not a test).
- The duplicate-slug race between `assertSlugAvailable`'s pre-check and
  Postgres's real `@unique` constraint (`withFriendlySlugConflict`) —
  needs two concurrent writes against a real database to exercise honestly.
- End-to-end `createArticle` → relationship sync (`updateArticle`'s
  tag/source/provider/asset/related-guide diffing in a transaction) against
  real rows, not just the input validation in front of it.
- Public route DRAFT/REVIEW invisibility as an actual HTTP-level 404, not
  just the `isPubliclyVisibleArticle` predicate in isolation.
- `revalidatePath` firing on the correct paths after a real mutation.

This isn't a small follow-up test file — it needs a decision on test-DB
strategy first (a local Postgres via docker-compose + a seed/reset script
per test run, or Prisma's own testing recipes, or a lighter mocking layer
in front of `prisma.article.*`). Flagging it here as a named gap rather than
claiming coverage that isn't real; do not treat "tests pass" as covering
this list until it's addressed.

**Exit criteria:** an admin can create a GUIDE article with providers/tags/sources, save DRAFT, edit it, move DRAFT→REVIEW→PUBLISHED, and see it live at `/crypto/guides/[slug]`.

---

## Block 3 — Shared `ArticleRenderer`

**Goal:** one rendering pipeline for public Guide, public News, and admin preview — replacing the two raw `dangerouslySetInnerHTML` call sites.

### `src/lib/articles/renderer.tsx` (or `render/` dir if it grows)
- Sanitize with the **already-installed** `sanitize-html` — define one
  allowlist (elements: `h2–h4, p, strong, em, ul, ol, li, a, blockquote,
  table/thead/tbody/tr/th/td, figure, figcaption, img, code, pre, hr`;
  attributes: `href, src, alt, title, class` scoped per tag; protocols:
  `http, https, mailto`; no `<script>`, no inline event handlers, no
  `javascript:` URLs) used by admin save, importer, and render — Req2 §17's
  "one policy, not three" requirement.
- Reuse `extractHeadings`/`estimateReadingMinutes` from `content.ts` rather
  than rewriting them — they already work and aren't broken.
- Split content on embed markers (see Block 4) and render each segment:
  sanitized-HTML segments via `dangerouslySetInnerHTML` on the *sanitized*
  output only, embed segments via typed React components.
- Images: wrap in `<figure>` with caption support; enforce `alt` is present
  (warn, don't block, per the SEO panel philosophy in Req2 §12).
- Video: dedicated component (not raw iframe) validating provider is
  `YOUTUBE | VIMEO` and constructing the embed URL itself — never trust a
  stored iframe string.

### Wire-up
- `GuidePage` and `NewsPage` both call `<ArticleRenderer article={article} />`
  instead of raw `dangerouslySetInnerHTML`.
- New `/admin/articles/[id]/preview` route: `requireAdmin()`, fetches by
  `id` (not slug/type — this is the one place that legitimately needs
  the unfiltered `getArticleBySlug`-equivalent lookup), renders through the
  *same* `ArticleRenderer`, sets `noindex` + `Cache-Control: no-store`.

**Exit criteria:** DRAFT/REVIEW articles are visible only at the preview
route; malicious HTML pasted into the admin editor is stripped on save (not
just at render time — sanitize on write too, so the DB never holds raw
script tags); Guide and News visually match their pre-refactor output for
existing safe content.

---

## Block 4 — Dynamic article components (embeds)

**Goal:** `{{provider-comparison:...}}`-style controlled blocks, per Req2 §20–§23.

### Schema addition
```prisma
enum ArticleEmbedType {
  PROVIDER_COMPARISON
  PROVIDER_CARD
  PROVIDER_FEES
  AFFILIATE_CTA
}

model ArticleEmbed {
  id          String            @id @default(cuid())
  articleId   String
  embedType   ArticleEmbedType
  config      Json              // e.g. { "providerSlugs": ["coinspot","kraken"] }
  position    Int               @default(0)
  article     Article           @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@index([articleId])
}
```
Content keeps the human-editable marker syntax
(`{{provider-comparison:coinspot,kraken}}`); the renderer parses markers,
validates each against `Provider`/`AffiliateLink` at render time (not by
trusting `ArticleEmbed.config` blindly — that table exists primarily so the
admin "insert block" UI and the SEO panel's "broken embed reference" warning
have something structured to read/write, per Req2 §21/§58). Keep this
minimal: don't build a drag-and-drop block picker in this pass — a simple
"Insert block → pick type → pick providers from a searchable select" control
that writes the marker text is enough (Req2 §58 explicitly permits this).

### The four embeds, each reusing existing data/components — never duplicating facts:
- `PROVIDER_COMPARISON` → reuses whatever comparison component already
  backs `/compare/[slug]`, fed `Provider` + `ProviderFee`/`ProviderFeature`.
- `PROVIDER_CARD` → reuses the exchange-profile summary component.
- `PROVIDER_FEES` → reuses `ProviderFee` query, same formatting as the
  provider page.
- `AFFILIATE_CTA` → resolves `Provider.slug` → `AffiliateLink` via
  `getActiveAffiliateLinksForProviderSlugs` (already exists in
  `affiliates/service.ts`) → renders a CTA linking to `/go/[partner]`
  (already exists) → renders nothing if the link is inactive/missing, per
  Req2 §29. Never accepts a raw URL from embed config.

### Validation
Unknown embed type, unresolvable provider slug, or inactive affiliate link →
render nothing + log/flag for the admin SEO panel ("Article references an
unknown provider" / "Affiliate CTA exists but link is inactive") — never a
runtime crash on the public page.

**Exit criteria:** an admin can insert a live `{{provider-comparison:...}}`
block that pulls current `ProviderFee` data at render time; editing that fee
in the provider admin updates every article using the embed with no article
edit required.

---

## Block 5 — Distribution & importer integration

**Goal:** everything built in 1–4 actually surfaces where Req1/Req2 want it, and the importer stops being a second content system.

### Exchange pages (`/crypto/exchanges/[slug]`)
Add a query using the existing `ArticleProvider` relation: published articles
for this provider, ordered `FEATURED → COMPARED → MENTIONED → recency`.
Render as "Guides" / "Comparisons" / "News" sections — **only when non-empty**
(Req2 §47 explicitly forbids empty placeholder sections).

### Comparison pages (`/compare/[slug]`)
Derive relevant articles from `ArticleProvider.relationshipType = COMPARED`
matched against the comparison's provider set — no hardcoded article IDs, no
new polymorphic table (Req2 §26 explicitly asks to avoid this if the existing
relation suffices, and it does for pairwise/small-set comparisons).

### Importer (`src/lib/articles/import/*`)
- `types.ts`/`schema.ts`: extend `ArticleImportPayload` with `articleType`
  (required), `relatedProviders: {slug, relationship}[]`, `cryptoAssets:
  string[]`, `relatedGuides: string[]` — all resolved in the existing PASS 2
  (`relationships.ts`) two-pass structure, not a new import path.
- `importer.ts::buildScalarData`: add `articleType` to the scalar set;
  **status stays exactly as-is** — never included in update data, always
  forced `DRAFT` on create. This is Req2 §40's hardest requirement and the
  current code already gets it right for other fields — just extend the same
  pattern.
- Embed validation during import: same marker-parsing + provider/asset
  existence checks used by the renderer, surfaced as importer warnings
  (`docs/article-import-format.md` gets a "Approved embeds" section).
- `markdown.ts`: route `.md` through existing `marked` → sanitize (same
  policy as Block 3) → store HTML; document `.html` files get sanitize-only,
  no markdown parsing (Req2 §41).

### Sitemap / metadata / revalidation
- `src/lib/seo/sitemap-entries.ts`: filter on `status: PUBLISHED &&
  articleType` explicitly (it likely already filters on `PUBLISHED` — extend,
  don't rewrite) so REVIEW/DRAFT never leak into the sitemap.
- Revalidate on publish/unpublish/archive/relationship-change: the specific
  article's route, its provider's exchange page(s), and any comparison pages
  it's newly relevant to — not a blanket revalidation.

### Docs
Update `docs/ROADMAP.md`, `docs/IMPLEMENTATION-PLAN.md`,
`docs/article-import-format.md` with: new statuses, `articleType`, embed
syntax + approved list, sanitization policy, preview route, and the explicit
"scheduling is not automated" note from Block 1.

**Exit criteria:** the full Req2 §68 "Definition of Done" workflow (create →
draft → preview → review → publish → visible on exchange/comparison pages →
importable equivalent) works end-to-end.

---

## Sequencing note

Blocks 1 and 2 should land together as one reviewable change (schema +
domain fixes + the complete admin editor) — that's the natural review unit,
since Block 2 can't be tested without Block 1's foundation, and splitting
them further just means reviewing half-working CRUD. Blocks 3–5 are each
independently shippable after that. Validate after every block with:
```
npx prisma validate && npx prisma generate
npm test
npm run build
npm run lint
```
per Req2 §66 — don't defer this to the end.

## Explicitly out of scope for this pass (flagged, not forgotten)
- `AuthorProfile` structured model (Req2 §13) — strings stay for now.
- `ArticleFaq` structured table (Req2 §15).
- Expanded `ArticleSource` (sourceType/publisher/accessedAt) (Req2 §14).
- Article revision history (Req2 §59).
- Automated scheduled publishing (Req2 §45) — no job runner exists; `scheduledAt` remains manual/advisory and this is documented, not silently ignored.


# Block 2 — where it stands now
Item	Status
createArticle / updateArticle	Already solid (verified by reading, not just trusting the earlier review)
Status lifecycle (DRAFT→REVIEW→PUBLISHED→ARCHIVED, restore)	Already solid, now backed by one shared rule table + 21 transition tests
Preview route, admin auth	Already solid
/admin/articles list/filter/pagination/actions	Fixed this session — was title+status only, now full filters/search/pagination/row actions
revalidatePath slug/id bug	Fixed this session
Lifecycle/validation/sanitization tests	Added this session — 33 new pure-logic tests, plus caught and fixed a real rel="noopener noreferrer" sanitization bug in the process
DB-integration test gap	Documented this session, not silently claimed as covered
Migration safety	Parked at your request — the rewritten safe migration is sitting in the working copy but I haven't re-surfaced it or asked about it again