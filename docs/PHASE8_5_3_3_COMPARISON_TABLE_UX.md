# Phase 8.5.3.3 — Comparison table UX

## Scope

Implements the approved Option E hybrid in two iterations without changing comparison facts, fee rules, provider ordering, or canonical comparison URLs.

### Iteration 1 — research-first table

- Provider columns now have useful minimum widths rather than being squeezed to fit six across.
- Provider identity/header is compact and sticky; the row-label column remains sticky.
- `View details` is the primary research action; `Visit provider` is secondary.
- Verification copy is explicit (`Data verified`, `Data not yet verified`, `Data review due`) and includes a clarification that verification is Trading Guide research status, not endorsement.
- Wide tables expose a scroll cue and right-edge fade.
- Missing/null comparison evidence is rendered as `? Not yet confirmed`, never as a dash that could be mistaken for a researched negative.
- Explicit positive/negative values are rendered as `✓ Available` / `— Not available` where the shared comparison model provides those states.
- Mobile cards use the same research-first CTA and unknown-data semantics.

### Iteration 2 — focused comparison mode

The all-provider share-trading and crypto comparison hubs now default to `All platforms/exchanges` and expose `Choose platforms/exchanges`. The focused mode reuses the existing CompareSelector and canonical 2–4 provider URLs; it does not create a second comparison engine or client-side copy of provider facts.

## Deliberate constraints

- No ranking, winner, recommendation, or commercial ordering was introduced.
- Provider order remains the service-provided deterministic order.
- No new Prisma/database query was introduced.
- Comparison detail routes retain their existing selector and remove/add behavior.
- Missing evidence remains distinct from false/unavailable.
