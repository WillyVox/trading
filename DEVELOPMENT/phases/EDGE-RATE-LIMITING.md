# Edge rate limiting — production deployment

Trading Guide uses database-backed throttling for failed sign-ins and registrations, but high-volume abuse should be rejected **before it reaches Next.js or PostgreSQL**. In particular, `/go/*` records affiliate clicks and is intentionally not given a database-backed per-request limiter.

This document is the production control for that gap. Do not set `EDGE_RATE_LIMITING_CONFIGURED=true` until the deployed rules have been tested and return HTTP 429 (or the provider's equivalent challenge/block response).

## Required policies

Start with these conservative limits and tune them from production telemetry. They are abuse ceilings, not business rules.

| Surface             | Match                         | Suggested per-client ceiling | Action                          |
| ------------------- | ----------------------------- | ---------------------------: | ------------------------------- |
| Affiliate redirects | path starts with `/go/`       |     30 requests / 60 seconds | block/rate-limit for 10 minutes |
| Auth callback/API   | path starts with `/api/auth/` |     30 requests / 60 seconds | block/rate-limit for 15 minutes |
| Registration        | path equals `/register`       |     10 requests / 60 seconds | block/rate-limit for 15 minutes |

Keep the existing application-level auth throttles. The edge rule is defense in depth and protects application/database capacity; the application limiter still provides the account-aware rules that a generic WAF cannot.

Do not rate-limit normal static assets or broad page traffic with these low thresholds. Do not key the rule globally: use the provider's per-client/IP characteristic so one visitor cannot exhaust the allowance for everyone.

## Option A — Vercel Firewall

If the production domain terminates at Vercel, create WAF rate-limiting rules in the Vercel Firewall for the three matches above. Use the path as the condition, rate limit by client IP, and use the suggested windows/mitigation durations. Vercel's WAF supports conditions such as path and IP and supports rate-limiting actions.

After deployment, verify from a non-production test path/rule first or temporarily use a very low threshold on a staging deployment. Confirm that excess requests are stopped at the firewall and do not create application/database work.

## Option B — Cloudflare WAF

If Cloudflare proxies the production domain, create Rate Limiting Rules under **Security → Security rules → Rate limiting rules**. Cloudflare rules define a matching expression, counting characteristics, period, request threshold and mitigation duration. Use client IP as the characteristic.

Example path expressions:

```text
starts_with(http.request.uri.path, "/go/")
starts_with(http.request.uri.path, "/api/auth/")
http.request.uri.path eq "/register"
```

If your Cloudflare plan supports request-method matching, scope the auth/registration rules to the mutating methods that reach the origin. Otherwise a path-only rule is acceptable, but use a ceiling that will not interfere with ordinary navigation.

## Verification checklist

1. Deploy the rules to staging or production with a safe test strategy.
2. Confirm ordinary browsing, sign-in and affiliate redirects still work.
3. Exceed each configured threshold from one test client.
4. Confirm the edge returns `429 Too Many Requests` or the configured challenge/block response.
5. Confirm blocked `/go/*` requests do **not** add affiliate-click rows.
6. Confirm blocked auth requests do **not** reach the NextAuth handler.
7. Review firewall analytics/logs for false positives.
8. Set the production environment variable:

```text
EDGE_RATE_LIMITING_CONFIGURED=true
```

9. Re-run `npm run check:production`.

## Why this remains a deployment control

A source-code-only flag cannot prove a CDN/WAF rule exists. The release checker therefore fails closed until the operator explicitly attests that the external control has been deployed and verified. This avoids the previous misleading warning while also avoiding a false claim that application code can configure whichever edge provider ultimately fronts the site.
