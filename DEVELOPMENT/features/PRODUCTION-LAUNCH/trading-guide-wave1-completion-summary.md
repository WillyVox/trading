# Trading Guide — Wave 1 Remediation: Complete

Everything in the "wave 1" table from Pass 2 is done, verified, and packaged in `trading-guide-wave1-changes.zip` (12 files, same relative paths as your repo — copy over the top of your working copy). Nothing else in the repo was touched.

## What changed

**`src/lib/config/business.ts`** — populated with your confirmed values: legal name `TradingGuide.com.au`, ABN `54347400601`, address `254N North Rocks Rd, North Rocks, NSW 2151`, and `tradingguide@outlook.com.au` for support/privacy/complaints (all three fields, per your instruction — easy to split into separate addresses later if you set them up). `acn`/`afsl`/`authorisedRepresentativeNumber` are still left unset, correctly — none of those were confirmed.

**`src/components/layout/Footer.tsx`** — no logic changes; it already handled populated `businessIdentity` fields correctly, so your legal name/ABN/address now render there automatically. Just updated a stale comment.

**`src/app/terms/page.tsx`** — jurisdiction section no longer flagged as a placeholder guess (NSW is confirmed); contact email now resolves to your real address; last-updated bumped to today. The "not yet reviewed by a lawyer" notice **stays** — I didn't touch the liability-limitation or financial-advice-framing sections, since those need actual legal drafting, not a data fill-in, and I'm not qualified to sign off on them.

**`src/app/privacy/page.tsx`** — same pattern: privacy-contact placeholder resolved, last-updated bumped. Two things are still explicitly open and un-fabricated: which countries/providers process your data (§4 — needs your hosting/DB/email provider names) and whether you're a formal APP entity under the Privacy Act (§7 — depends on turnover, not something code can determine).

**`src/app/how-we-get-paid/page.tsx`** — `EFFECTIVE_DATE` set to "September 2026"; comment updated to reflect the BTC Markets fix below.

**`src/app/affiliate-disclosure/page.tsx`** — the literal rendered `[TODO]` under the H1 is now a real intro sentence; contact email resolved.

**`prisma/seeds/affiliate-links/btc-markets.ts`** — `active: true` → `active: false`. It now matches every other placeholder partner and the disclosure pages' claim that no commercial relationship is currently live.

**`prisma/seeds/lib/seed-affiliate-links.ts`** — added a guard: seeding now **throws** if a link is marked `active: true` against a partnership that isn't `APPROVED` or `ACTIVE` status. This is the fix for the actual bug class (not just the one instance) — a future placeholder partner can't silently go live the same way BTC Markets did.

**`docs/CONTENT-GAPS.md`** — recreated. Tracks what's resolved vs. still open across all five files above, in one place, as the source of truth they all reference.

**`docs/ROADMAP.md`** — corrected the stale "ASIC no-action deadline 30 June 2026" to the actual current date (30 September 2026, extended 25 June 2026), and added a pointer to reconcile the Kraken sourcing note against your 17 Sept re-verification pass.

**`eslint.config.mjs`** + **`package.json`** — this is the one item that went beyond a pure content/identity fix, but it was blocking verification of everything else: `next lint` doesn't exist in Next 16, so I pointed the `lint` script at `eslint .` directly, and replaced the `FlatCompat` bridge in `eslint.config.mjs` (which was crashing with a circular-JSON error) with `eslint-config-next`'s own native flat-config export, which this version already ships. **Verified working** — ran it, it now executes cleanly instead of crashing.

## One real consequence of fixing lint: it found real problems

Now that lint actually runs, it surfaces **32 errors and 6 warnings**, none of which I've touched:

- Unescaped quote/apostrophe characters in JSX text (10 files) — `react/no-unescaped-entities`
- Six `<a>` tags that should be Next's `<Link>` for internal navigation (`guides/simple-steps-to-buy-cryptocurrency`, `guides/what-you-need-to-start-trading`)
- **Two genuine React issues**, not style nitpicks: `MobileNav.tsx` and `NavMenuItem.tsx` both call `setState` synchronously inside a `useEffect`, which the linter (correctly) flags as a cascading-render risk
- A handful of unused `eslint-disable` comments and one anonymous default export

I didn't fix any of these — they're outside what you approved for wave 1, and the two `useEffect` issues in particular deserve a proper look rather than a rushed patch. Full list is in the earlier Pass 2 doc's terminal output; happy to make this "wave 2" if you want.

## Verification run just now

- `npm test` — 7/7 pass
- `npx eslint <every file I touched>` — clean, no errors
- `npx eslint .` (whole repo, with the fix applied) — runs successfully (previously crashed), surfaces the 32 pre-existing issues above
- Grep for `[Month/Year]`, `[support email...]`, `[privacy email...]` in the four legal pages — none left

I still couldn't get a clean `npm run build` or full `tsc --noEmit` in this sandbox (blocked on `binaries.prisma.sh` and `fonts.googleapis.com`, both outside its network allowlist) — that needs re-running wherever you actually build this.

## What's still open (unchanged from Pass 1/2, not part of wave 1)

- Lawyer review of Terms/Privacy/How We Get Paid/Affiliate Disclosure — still not done, by design
- Privacy §4 (data processors/countries) and §7 (APP-entity status) — need info only you can supply
- The 32 newly-surfaced lint findings above
- Accessibility, rendered mobile/desktop UX, full security pass, full content-quality read, competitor benchmarking — all still not audited

Let me know if you want the lint fixes as wave 2, want to keep working through the unaudited sections, or want to hand off the lawyer-review items and come back to code once those land.
