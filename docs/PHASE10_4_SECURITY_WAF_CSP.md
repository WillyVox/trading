# Phase 10.4 — Security, WAF & CSP deployment readiness

The repository now has a read-only production header verifier: `PRODUCTION_VERIFY_URL=https://... npm run verify:security:production`.

It verifies HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy and an **enforcing** CSP with the core anti-injection/clickjacking directives. It also checks `/api/health` does not return a server error. It does not set attestation variables.

## WAF

Deploy the rules in `docs/EDGE-RATE-LIMITING.md`. Cloudflare's current rate-limiting model uses a match expression, characteristics, period, requests-per-period and mitigation duration. Test each rule safely and confirm blocked requests do not reach the origin before setting `EDGE_RATE_LIMITING_CONFIGURED=true`.

## CSP

Keep Report-Only while exercising public pages, authentication, admin/editor, article images, YouTube/Vimeo embeds and affiliate redirects. Review `/api/csp-report` output. Fix legitimate violations, then test with `CSP_ENFORCED_AND_VERIFIED=true` in staging. Only after the enforcing header is observed and workflows still function should the production attestation be set.

The source intentionally does not auto-attest either external control.
