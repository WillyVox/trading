# Phase 2.6 — Calculator data verification

Implemented 22 September 2026.

## Purpose

Keep brokerage estimates available only when the structured fee rule is backed by a current official source, while making reverification an editorial/admin task rather than a code deployment.

## Lifecycle

Each `OfferingFee` can now carry `verificationStatus`, `verifiedAt`, `reviewDueAt`, `verifiedByUserId`, and `sourceUrl`. The brokerage eligibility layer requires VERIFIED status, a valid official HTTPS source, a current verification/review date, and a structurally calculable rule.

The admin page at `/admin/pricing-verification` lists active brokerage rules, official sources, last verification and review due dates. An admin can mark a rule verified (refreshing the 45-day review window) or stale. Public calculator paths are revalidated after either action.

## Current official-source verification

CMC Invest Standard ASX pricing is represented as conditional $0 for the first eligible buy under A$1,000 per security per day, excluding margin-loan-settled trades, with the fallback of the greater of A$11 or 0.10% for other buys/sells.

Interactive Brokers Australia Fixed ASX pricing is represented as 0.08% of trade value with an A$6 minimum, exclusive of GST; the calculator adds 10% GST. Tiered IBKR pricing remains out of scope because it requires monthly-volume and third-party-fee inputs.

## Operational note

After deploying this migration, run the share-trading seed once (or use the admin verification page for existing records). Existing database rows do not change merely because seed source files changed.
