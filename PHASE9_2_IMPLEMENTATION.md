# Phase 9.2 — Search-Intent Content Map & High-Authority Guide Expansion

## Goal

Turn Phase 9.1's topic clusters into an editorial publishing roadmap without creating thin programmatic pages.

## Implemented

- Added `src/lib/seo/content-opportunities.ts` as a 50-opportunity editorial registry.
- Every opportunity has a cluster, priority, format, search intent, rationale, evidence requirements and the product surfaces it should support.
- Priorities are deliberately `BUILD_NOW`, `BUILD_NEXT`, `LATER`, and `DO_NOT_BUILD`.
- Existing curated comparison URLs are deepened instead of creating duplicate SEO URLs.
- Explicitly rejected: every-provider pair generation, city doorway pages, unsupported "best overall" winners, price-prediction SEO, personalized platform picks and mass-produced daily SEO pages.
- Added regression tests that protect the 50-item plan, URL uniqueness, evidence requirements and do-not-build guardrails.

## Build-now editorial queue

### Share trading
1. Brokerage fees in Australia
2. CHESS sponsorship vs custody
3. FX fees when buying US shares
4. Fractional shares in Australia
5. Share-trading fees checklist
6. What is a HIN?

### Crypto
1. Crypto exchange fees in Australia
2. What AUSTRAC/VASP registration means and does not mean
3. Crypto spreads vs trading fees
4. Crypto withdrawal/network fees
5. Crypto exchange custody
6. AUD funding methods and fees

### Cross-market / trust
1. The real cost of a trade
2. Strengthen the existing methodology page around verification

These are briefs, not auto-published pages. Each must be researched and editor-reviewed before an indexable URL is created.

## Research basis checked 22 Sep 2026

- Google Search Central: people-first/non-commodity content and normal SEO best practices remain the recommended basis for Search and generative AI features; FAQ rich results were removed in 2026.
- Moneysmart: current share guidance explicitly identifies brokerage, platform and FX costs; its September 2026 fractional-share guidance highlights ownership, fees and transfer implications.
- AUSTRAC: the public VASP register is now available and is appropriate evidence for registration status. Registration should not be presented as a general endorsement or a guarantee about investment risk.

## Publishing rule

A content opportunity does not become an indexable page merely because it exists in the registry. Publication requires: current evidence, useful original explanation, internal links to the relevant tool/provider/comparison surface, metadata, sources, editorial review and a decision that the page adds information not already served better by an existing URL.
