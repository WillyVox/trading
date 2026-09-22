# Phase 10 — Production launch remediation

This phase reduces code-addressable launch blockers without converting external/manual obligations into fake automated passes.

## Completed in this pass

- Corrected the confirmed business address mismatch to `254N North Rocks Rd, North Rocks, NSW 2151`.
- Added `/contact` for corrections, privacy, complaints and commercial enquiries; linked it from the affiliate disclosure and footer; added it to the sitemap.
- Replaced stale admin copy that described the rich article editor as a plain textarea.
- Made the footer funding disclosure launch-state-safe: it no longer promises the site earns no commission; it links to `/how-we-get-paid` for the current commercial state.
- Added `.env.production.example` containing names/placeholders only, never real credentials.
- Added a production database migration/backup runbook.
- Strengthened `check:production` so external legal, CSP and WAF controls are explicit attestations rather than warnings that can be overlooked.

## Still external/manual

The source code cannot truthfully complete these items:

1. Final legal approval of Terms/Privacy and confirmation of privacy-provider/overseas-processing details.
2. Deployment and live verification of edge/WAF rate limits.
3. Observation of CSP reports, correction of legitimate violations, and verified switch to enforcing CSP.
4. Production secrets, database provisioning, backup/restore verification and deployment-environment configuration.
5. Real-device, keyboard and assistive-technology smoke testing.

Only set the corresponding production attestations after the action has actually happened.
