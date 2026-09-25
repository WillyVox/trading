# Affiliate Partnership, Engagement and Event architecture

## Business meaning

- **Provider** — the external organisation.
- **AffiliatePartnership** — Trading Guide's commercial agreement with that Provider.
- **ProviderOffering** — the Provider product/service Trading Guide researches and compares.
- **AffiliateEngagement** — the Offering-specific commercial configuration under a Partnership. It owns the destination URL and Offering-specific commission terms.
- **AffiliateEvent** — an observed outbound action through an Engagement. It is an occurrence, not configuration.

## Invariants

1. An Engagement's Offering must belong to the same Provider as its Partnership.
2. `/go/{offeringSlug}` uses `ProviderOffering.slug` as its only commercial redirect identity.
3. Only ACTIVE Engagements under live Partnerships and inside their validity window may redirect.
4. Affiliate destinations are stored server-side and must be HTTPS.
5. Affiliate state never determines research ranking, verification status, or whether an Offering exists.
6. Affiliate Events are append-only observations linked to an Engagement.

## Data model

`Provider -> AffiliatePartnership -> AffiliateEngagement -> AffiliateEvent`

`Provider -> ProviderOffering -> AffiliateEngagement`

Commercial configuration is therefore explicit at the Offering level while the agreement remains owned by the Provider relationship.
