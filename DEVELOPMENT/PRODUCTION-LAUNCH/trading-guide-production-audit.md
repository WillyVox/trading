# Trading Guide — Production Readiness Audit (Pass 1)

**Scope note (read first):** This pass is a static-code audit of the supplied repository — file-by-file inspection of routes, config, legal pages, affiliate flow, SEO config, and the Prisma schema, plus a full-repo grep for known blocker markers. It does **not** yet include: a live `npm run build`/lint/test run, a rendered-browser accessibility pass, a rendered mobile-viewport pass, external regulatory research against current ASIC/AUSTRAC/OAIC/ACCC sources, or a line-by-line read of every guide's prose. Those are called out below as **NOT YET AUDITED** rather than guessed at. Per your Section 3, I'd rather tell you a section is incomplete than invent a conclusion.

No code has been modified. This is the audit only — waiting for your approval before any remediation.

---

## Executive assessment

The engineering foundation is unusually disciplined for a pre-launch project: the codebase already anticipates most of the traps this brief warns about. `businessIdentity` fields are deliberately left blank rather than fabricated; the SEO domain resolver **fails the build** rather than silently falling back to `localhost` in production; `/go/[partner]` redirects only to a DB-stored `approvedUrl` (no open-redirect surface); `robots.ts` disallows `/admin`, `/go/`, `/login`, `/403`; every legal page (`/terms`, `/privacy`, `/how-we-get-paid`, `/affiliate-disclosure`) is explicitly self-labelled as an unreviewed draft with a visible on-page warning, rather than being quietly published as if final.

That said, this is genuinely **not production-ready**, and the gaps are exactly the kind that are easy to miss because the code _looks_ finished:

- All four legal/trust pages are drafts with real placeholder text still live on the public site (`[support email not yet configured]`, `[Month/Year]`, `[TODO]`).
- One finding is a real discrepancy, not just an unfilled placeholder: `how-we-get-paid/page.tsx` states in its own code comment that _"every AffiliateLink in the seed data is active: false"_ — but `prisma/seeds/affiliate-links/btc-markets.ts` seeds `active: true` for a `PROSPECT`-status placeholder partnership, with its own `[TODO]` admitting the default is wrong. The seed script (`seed-affiliate-links.ts`) writes `active` straight through to the DB with no guard. In practice this link points at BTC Markets' plain homepage with `commissionType: NONE`, so no money or false "sponsored" badge is at stake today — but the disclosure copy's factual claim would be false the moment this seed runs, and nothing in the code prevents a future placeholder partner from being seeded `active: true` by the same pattern.
- `docs/CONTENT-GAPS.md` is referenced by name from inside five different files (`business.ts`, `terms/page.tsx`, `privacy/page.tsx`, `how-we-get-paid/page.tsx`, `affiliate-disclosure/page.tsx`) as the canonical tracker for these gaps — **the file does not exist in the supplied repository.** Either it was left out of the archive or was never committed; either way, the single source of truth these pages point to is currently a dead reference.
- Real, sourced provider data exists for CoinSpot and Independent Reserve; Kraken is flagged in `docs/ROADMAP.md` as still an unverified placeholder as of the last update. `docs/data-correction/` shows a genuine re-verification pass was done 2026-09-17 — worth confirming that superseded the ROADMAP note before launch.
- Accessibility, full security (auth/CSRF/XSS sanitisation), performance, and rendered mobile UX have not been exercised yet in this pass — see the NOT YET AUDITED markers throughout.

None of this is a reason the project is in bad shape — the guardrails already in the code are exactly what a careful build looks like mid-flight. It's a reason it isn't launchable _yet_.

---

## Production readiness scorecard

| Area                             | Status                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Product / IA                     | NEEDS WORK                                                                                                                                    |
| Share trading                    | NEEDS WORK (provider data verification not independently re-checked this pass)                                                                |
| Crypto                           | NEEDS WORK (Kraken sourcing unresolved per ROADMAP; confirm against Sep-17 re-verification)                                                   |
| Provider data                    | NEEDS WORK                                                                                                                                    |
| Comparison                       | READY (architecture) — domain-owned compare routes per Sept 2026 refactor, not re-audited page-by-page this pass                              |
| Content                          | NOT YET AUDITED (prose quality)                                                                                                               |
| Legal / compliance               | **BLOCKER**                                                                                                                                   |
| Privacy                          | **BLOCKER**                                                                                                                                   |
| Affiliate                        | NEEDS WORK                                                                                                                                    |
| SEO (technical)                  | NEEDS WORK — robots/sitemap/domain-resolution look sound; metadata not exhaustively checked per template                                      |
| Google Search / content guidance | NOT YET AUDITED                                                                                                                               |
| Accessibility                    | NOT YET AUDITED                                                                                                                               |
| Mobile                           | NOT YET AUDITED (no rendered viewport testing done yet)                                                                                       |
| Desktop                          | NOT YET AUDITED                                                                                                                               |
| Performance                      | NOT YET AUDITED                                                                                                                               |
| Security                         | NEEDS WORK (redirect handling and robots look sound; auth/CSRF/XSS sanitisation not yet exercised)                                            |
| Database                         | READY (schema is coherent, provenance-first design; migrations not diffed against production target)                                          |
| Admin                            | NEEDS WORK — per `docs/ROADMAP.md`, `/admin/articles/new` and `/admin/articles/[id]` are still placeholders with no editor or publish actions |
| CMS                              | NEEDS WORK (same as above)                                                                                                                    |
| Analytics                        | NOT YET AUDITED                                                                                                                               |
| Deployment                       | NEEDS WORK — no build/lint/test run executed yet this pass                                                                                    |

---

## P0 launch blockers (confirmed this pass)

1. **Four public legal/trust pages are live drafts.** `/terms`, `/privacy`, `/how-we-get-paid`, `/affiliate-disclosure` all carry an on-page "working draft, not reviewed by a lawyer" notice and contain literal placeholder tokens (`[support email not yet configured]`, `[privacy email not yet configured — see CONTENT-GAPS.md]`, `[Month/Year]`, `[TODO]`). Cannot launch with these live as-is.
2. **`docs/CONTENT-GAPS.md` does not exist**, despite being the single named tracker for the above gaps in five separate files. Either recover it or rebuild it as part of remediation — right now there is no authoritative list of what's outstanding.
3. **Business identity is entirely unset** (`businessIdentity = {}` in `src/lib/config/business.ts`): no legal name, ABN/ACN, address, support/privacy/complaints email. This is correctly _not fabricated_ in code, but it means the legal pages cannot be completed, and consumer-facing trust pages currently show no operator identity at all.
4. **Affiliate disclosure copy is contradicted by seed data.** `how-we-get-paid/page.tsx` asserts no seed link is `active: true`; `btc-markets.ts` sets `active: true` on a `PROSPECT` partnership. Low real-world monetisation risk today (no tracking URL, `commissionType: NONE`), but the page's factual claim is false the moment `db:seed` runs, and the underlying seed pattern has no guard against a real placeholder partner going live as `active: true` by accident later.
5. **Governing-law jurisdiction in Terms is an admitted guess** ("NSW, based on the site's Sydney context elsewhere in this project") rather than the operator's actual registered location — flagged in-code, correctly not silently published as settled fact, but blocks launch until resolved.

## P1 pre-launch issues (confirmed this pass)

- `/admin/articles/new` and `/admin/articles/[id]` are non-functional placeholders per `docs/ROADMAP.md` — no article can currently be created or edited through the admin UI (only via the file-import script, which itself is Phase-1-only: no DB writes yet per the same doc). Confirm current state hasn't moved past this before relying on it.
- Kraken's provider profile is flagged unverified in `docs/ROADMAP.md`; `docs/data-correction/provider-data-reverification-2026-09-17.md` and the accompanying verified-JSON set suggest a later pass addressed this — needs reconciling so the ROADMAP reflects current truth (stale docs are their own maintenance risk, per your Section 39/66).
- `seed-affiliate-links.ts` has no validation preventing a `PROSPECT`/placeholder partnership from being written `active: true` — worth adding a guard (e.g. `active` can only be true when `partnershipStatus` is a real signed-agreement state) so this class of bug can't recur.
- `VisitSite.tsx` carries its own `[TODO]` about appending a referral ID to outbound partner links — currently outbound links don't carry attribution beyond the internal `AffiliateClick` record, which matters once real commission tracking goes live.
- `AGENTS.md`/`CLAUDE.md` reference a Next.js "agent rules" block that is auto-regenerated by `next dev` and instructs reading `node_modules/next/dist/docs/` before writing code against this Next.js version — worth confirming this doesn't fight with your own standing instruction (noted in project memory) to research/analyse before code changes; it's additive, not contradictory, but flag it so it isn't missed mid-implementation.

## P2 and below

- Not yet enumerated in this pass — accessibility, performance, and full content-quality findings will surface a P2 list once those sections are actually exercised (see NOT YET AUDITED below). I'd rather hand you a real P2 list from evidence than a padded one from assumption.

---

## Regulatory / compliance findings

**NOT YET AUDITED against current authoritative sources.** Sections 7–11 of your brief (ASIC RG 234, AUSTRAC VASP scope, the Digital Assets Framework transitional timetable, ACCC/ACL guidance, OAIC/Privacy Act obligations) require live research against current regulator material — I have not run that research in this pass and won't fabricate citations or commencement dates. `docs/ROADMAP.md` itself references "AUSTRAC's expanded VASP scope from 31 March 2026" and "ASIC's AFSL 'no-action' deadline of 30 June 2026" as of an 11 Sep 2026 note — these need to be re-verified against current primary sources before anything in Terms/Privacy/crypto regulatory copy is finalised, since the brief itself flags this regime as actively changing. I'll do this as an explicit next step once you confirm you want it folded into this same pass or run separately.

---

## What I checked vs what's still open

**Checked this pass (code-level, confirmed by reading the files):**

- Full public + admin route inventory (matches your Section 5 list closely — see file tree below)
- Repo-wide grep for TODO/FIXME/placeholder/draft/localhost/etc., with every hit triaged, not just counted
- `businessIdentity`, `siteConfig`/domain resolution, `footerLinks` — all handle missing data safely, no fabrication
- All four legal/trust pages, read in full
- `/go/[partner]` redirect handler and `robots.ts` — sound against open-redirect and indexation of private surfaces
- Affiliate seed data (all 6 providers) and the seeding driver that writes it to the DB
- `prisma/schema.prisma` model/enum inventory (Provider/Offering split matches the target architecture in project memory)
- `docs/ROADMAP.md`, `docs/data-correction/` verification records, `package.json` scripts

**Not yet done — needs a dedicated pass before this can be called complete:**

- `npm run build` / `lint` / `test` executed and results recorded verbatim (your Section 63 explicitly forbids claiming "build passes" without running it)
- Rendered accessibility review (keyboard, screen-reader-oriented, contrast) — static code can't confirm this
- Rendered mobile/tablet/desktop viewport testing
- Full security pass: auth/session config, CSRF posture, TipTap/`sanitize-html` XSS testing, security headers
- Live regulatory research (Section 7–11)
- Full content-quality read of every guide/article against your Section 24–26 standard
- Competitor benchmarking research (Section 53)
- Complete per-route SEO metadata audit (titles/canonicals/OG per template, not just the config that feeds them)

---

## File-by-file remediation plan

Held back until the above gaps are closed enough to make it accurate — a remediation plan built on an incomplete audit risks missing real work or inventing unnecessary work. Happy to produce it now with those caveats marked, or after the next pass — your call.

---

## Decisions required from you

1. **Do you want me to proceed with the remaining "not yet audited" sections now** (build/lint/test run, live regulatory research, rendered accessibility/mobile pass, full content read) **before producing the remediation plan and file-by-file changes** — or would you rather see the remediation plan drafted against what's confirmed so far, with open items flagged, and fill in the rest in parallel?
   Yes

2. **Business identity**: none of legal name, ABN/ACN, address, or support/privacy/complaints emails exist anywhere in the repo. These can't be inferred or guessed — I need the real values (or an explicit "not applicable, here's why") before Terms/Privacy/footer can be finalised.

Legal name: TradingGuide.com.au
ABN: 54347400601
Addess: 254N North Rocks Rd, North Rocks, NSW, 2151
Email: tradingguide@outlook.com.au

3. **Governing-law jurisdiction**: confirm the operator's actual registered state/territory (Terms currently guesses NSW).

NSW

4. **BTC Markets affiliate seed**: given it currently just points at their plain homepage with no commission, do you want it seeded `active: false` (matching the disclosure page's claim and every other placeholder partner) until a real agreement exists, or is there a reason it's intentionally different?
   Yes

5. **`docs/CONTENT-GAPS.md`**: confirm whether this existed and was simply left out of the upload, or needs to be recreated from scratch — several files depend on it as their source of truth.
   Yes, this existed and was simply left out of the upload

I'll stop here per your Section 68/3 and wait for direction on (1) before going further.
