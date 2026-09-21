# Content Gaps

Single tracker for outstanding legal/trust-page content referenced from
`src/lib/config/business.ts`, `src/app/terms/page.tsx`,
`src/app/privacy/page.tsx`, `src/app/how-we-get-paid/page.tsx`, and
`src/app/affiliate-disclosure/page.tsx`. This file previously existed but
was missing from the repository archive audited 2026-09-21 — recreated
from what those five files reference, plus what surfaced in that audit.

Convention: ✅ resolved · 🟡 partially resolved / needs follow-up · ⬜ open,
no owner decision yet.

## Business identity (`src/lib/config/business.ts`)

- ✅ Legal name — **TradingGuide.com.au** (confirmed by owner 2026-09-21)
- ✅ ABN — **54347400601** (confirmed by owner 2026-09-21)
- ✅ Business address — **254N North Rocks Rd, North Rocks, NSW 2151** (confirmed by owner 2026-09-21)
- ✅ Support / privacy / complaints email — **tradingguide@outlook.com.au**, used for all three fields by owner instruction (confirmed 2026-09-21). Split into dedicated addresses later if that becomes useful — the field structure already supports it.
- ⬜ ACN — not confirmed, left unset. Do not assume the business is incorporated; confirm with the owner if/when relevant.
- ⬜ AFSL / authorised-representative number — not confirmed, left unset. Only set these if Trading Guide (or its operator) genuinely holds an AFSL or operates as an authorised representative — do not assume based on any other provider's status.

## Terms of Use (`src/app/terms/page.tsx`)

- ✅ Governing-law jurisdiction — **NSW**, confirmed by owner 2026-09-21 (previously a placeholder guess)
- ✅ Contact email — resolved via `businessIdentity.supportEmail`
- ⬜ **Lawyer review required** — page still carries the "working draft, not reviewed by a lawyer" notice. Two sections specifically flagged for legal drafting review:
  - §4 Financial information disclaimer — confirm the factual/educational framing holds up against the site's actual and planned features (this is the financial-advice-boundary question from the original audit brief §8, not yet independently re-audited)
  - §8 Limitation of liability — exact wording needs a lawyer

## Privacy Policy (`src/app/privacy/page.tsx`)

- ✅ Contact email — resolved via `businessIdentity.privacyEmail`
- ⬜ §4 Sharing and overseas disclosure — needs the actual hosting/database provider names and which countries process/store data. Not resolved in this pass; needs the provider's own infra details (hosting platform, DB host, email provider) supplied by the owner or confirmed from deployment config.
- ⬜ §7 APP-entity status — whether Trading Guide is a formal APP entity under the Privacy Act (vs. qualifying for the small-business exemption) depends on turnover and business activities. Genuinely cannot be determined from the codebase; needs an owner/accountant decision, not a code fix.
- ⬜ **Lawyer review required** — page still carries the draft notice; not lifted by this pass.

## How We Get Paid (`src/app/how-we-get-paid/page.tsx`)

- ✅ `EFFECTIVE_DATE` — set to **September 2026**
- ✅ Underlying claim ("no active commercial relationship exists") — verified true again after fixing the BTC Markets seed (`active: true` → `false`, see below); `prisma/seeds/lib/seed-affiliate-links.ts` now throws if a non-approved partnership is ever seeded `active: true`, so this claim shouldn't silently go stale again.
- ⬜ **Lawyer review required** — not lifted.

## Affiliate Disclosure (`src/app/affiliate-disclosure/page.tsx`)

- ✅ Intro paragraph — was a literal rendered `[TODO]`, replaced with real copy
- ✅ Contact email — resolved via `businessIdentity.supportEmail`
- ⬜ Link to a real `/contact` page once one exists — no such route currently exists; out of scope for this pass (adding a `/contact` or `/corrections` mechanism was flagged as a broader open item in the original audit, Pass 1 §20)
- ⬜ **Lawyer review required** — not lifted.

## Footer trust paragraph (`src/components/layout/Footer.tsx`)

- ⬜ Still a draft, not reviewed by a lawyer. Content itself (AFSL disclaimer, self-funded status, commission language) reads consistently with the other four pages above as of this pass, but hasn't had independent legal sign-off either.

## Cross-cutting

- ⬜ None of the "Lawyer review required" items above can be closed by code changes — they need an actual solicitor's sign-off before the site can be considered legally launch-ready, per the original audit brief's Section 3 ("do not silently guess" / "never invent a legal conclusion merely to make the application launchable").
- ⬜ Regulatory copy across the site (guides, methodology, legal pages) should be spot-checked against the ASIC no-action deadline extension (30 June 2026 → 30 September 2026, effective 25 June 2026) — a targeted repo-wide search turned up no other stale reference to the old date as of 2026-09-21, but this wasn't an exhaustive content read.

## Engineering follow-ups (wave 2, 2026-09-21)

Not content gaps, but tracked here so there is one place to look.

- ✅ `react/no-unescaped-entities` — 21 characters across 7 files escaped (`&apos;` / `&quot;`).
- ✅ Internal `<a href>` → `next/link` `<Link>` in the guide templates and `AffiliateDisclosure` (including the `href={CONSTANT}` variants the lint rule can't see).
- ✅ **Bug fixed while doing the above:** in `share-trading-for-beginners` the "5 simple steps to buy cryptocurrency" link used `getStaticGuideArticleImage()` as its `href`, so it pointed at an image file rather than the guide. It now uses `getStaticGuideArticleHref()`.
- ✅ `react-hooks/set-state-in-effect` — `MobileNav` and `NavMenuItem` now reset on route change during render instead of in an effect.
- ✅ Mobile drawer accessibility: focus moves into the drawer on open and returns to the Menu button on close, Tab is trapped inside, Escape closes, the drawer is `inert` while closed (no invisible tab stops), and it has an accessible name.
- ✅ `eslint-config-next/typescript` enabled; `any` removed or justified: typed `session.user.role` via `src/types/next-auth.d.ts` (replaces six casts, including the admin role check in `proxy.ts` and `require-admin.ts`), `Article` typing for `paginate()` consumers, a justified file-level disable for the generic Prisma-delegate constraint in `lib/repository.ts`.
- ✅ Dead code removed: unused imports (`AffiliateCTA` ×2, `Breadcrumbs`, `Link` in `Header`), `VALUE_FLAGS` in `promote-admin.ts`, and an unused `getCryptoExchanges()` query (plus derived `comparableProviders`) on every exchange profile render.
- ✅ `JsonLd` now escapes `<` in the serialized JSON so a value containing `</script>` cannot terminate the tag.
- ✅ `postcss.config.mjs` default export named (`import/no-anonymous-default-export`).
- 🟡 **Needs a local run** — none of the above could be executed in the authoring sandbox (no `node_modules`, no registry): `npm run lint` (target: 0 errors), `npx tsc --noEmit`, `npm run build`, `npm test`, `npm run format:check`.
- ⬜ Exchange profile page: the section-level `AffiliateCTA` is commented out (`crypto/exchanges/[slug]/page.tsx`) and only `VisitSite` renders. Decide whether the disclosure-bearing CTA should come back; if so, restore the import.
- ⬜ `CompareSelector` on the exchange profile is commented out; if re-enabled, use `getCryptoExchangeSelectorOptions()`, not `getCryptoExchanges()`.
- ⬜ `ArticleForm` help text still says the content editor is "deliberately a plain textarea for now", but `ArticleRichEditor` is rendered directly below it. Update the copy.
- ⬜ `[TODO]` in `AffiliateCTA.tsx` / `VisitSite.tsx`: append a referral ID to outbound partner URLs once a real agreement exists.
- ⬜ `@eslint/eslintrc` is no longer imported anywhere — remove with `npm uninstall @eslint/eslintrc` (updates the lockfile too).
- ⬜ Rich-editor image `align` attribute is cast rather than typed; augment the TipTap Image extension's attribute types to remove the cast.

### Corrections to the Pass 1 audit (2026-09-21)

- The admin article editor is **not** a placeholder — Pass 1 relied on a stale ROADMAP. Still needs end-to-end verification against a database.
- Kraken's provider seed **does** reflect the 2026-09-17 re-verification; only the ROADMAP note was stale (now corrected).
- ROADMAP also still referred to `src/middleware.ts` (now `src/proxy.ts`) and an empty JSON-LD folder; both corrected.
