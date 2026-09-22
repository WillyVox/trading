# Security notes

What the application does today, what it deliberately doesn't, and what has to
be handled outside the code. Keep this in step with the code; if a control
below changes, change it here.

## Sign-in and sessions

- Passwords are hashed with scrypt (N=2^16, r=8, p=2), one of the equivalent
  configurations in the OWASP Password Storage Cheat Sheet (minimum there is
  N=2^17, r=8, p=1). Parameters are stored with each hash
  (`scrypt$N$r$p$salt$hash`). Older `salt:hash` values still verify and are
  upgraded on the user's next successful sign-in.
- Length policy is 8-128 characters. There is **no breached-password or
  strength check** and **no email verification** yet.
- Sign-ins are throttled in the credentials provider's `authorize()` (so the
  form and a direct POST to `/api/auth/callback/credentials` are both covered):
  5 failures per email and 20 per network address in 15 minutes. Registration
  is limited to 5 attempts per address per hour. Counters live in the
  `RateLimitHit` table (HMAC-hashed identifiers, pruned after 24 hours).
- Trade-off: an attacker can lock a specific email for up to 15 minutes by
  failing attempts against it.
- Per-address limits rely on `x-forwarded-for` being set by the platform
  (Vercel overwrites it). Behind a proxy that only appends, the left-most
  value is spoofable; per-email limits still apply. When no address is
  available the per-address limit is skipped, never shared.
- Sessions are JWTs carrying the role from sign-in. `requireAdmin()` re-reads
  the role from the database, so demoting or deleting an admin takes effect on
  the next admin request. `src/proxy.ts` only does the coarse redirect from the
  token.

## Affiliate redirects (`/go/[partner]`)

- Redirects only to the stored `approvedUrl`, and only if it is https, the link
  is active **and** its partnership status is APPROVED or ACTIVE
  (`src/lib/affiliates/status.ts`). The same rule is enforced by the seed
  script and the admin actions; links created against a non-live partnership
  start switched off.
- `?placement=` is accepted only as a short identifier; the referrer is reduced
  to origin + path; prefetches and obvious bots aren't recorded. A failure to
  record a click is logged and the redirect still happens.
- A script with a browser User-Agent can still inflate click counts and write
  to the database. There is deliberately no per-request database rate limit
  here (it would double the writes). Production therefore requires the
  host/WAF control documented in `docs/EDGE-RATE-LIMITING.md`. The release
  checker requires an explicit deployment attestation after those rules have
  been tested.

## Response headers

`next.config.mjs` sets `X-Content-Type-Options`, `X-Frame-Options: DENY`,
`Referrer-Policy`, `Permissions-Policy` everywhere, plus (production only)
`Strict-Transport-Security` and a **Report-Only** Content-Security-Policy.

The CSP is report-only until real traffic has been watched: violations are
written to the server log by `/api/csp-report`. To enforce it, review those
logs, then change the header name to `Content-Security-Policy` and add
`frame-ancestors 'none'`. It allows inline scripts/styles because Next.js
needs them and there is no nonce pipeline (nonces force every page to render
dynamically). Restricting `img-src` needs a decision on remote images inside
article bodies.

## Article HTML

One shared sanitizer policy (`src/lib/articles/sanitize.ts`) is applied when
content is written and again when it is rendered. Video embeds are limited to
YouTube (nocookie) and Vimeo with validated IDs. `sanitize-xss.test.ts` holds
the adversarial cases.

## Deployment security controls

- Edge rate limiting for `/go/*` and authentication traffic is a required
  production control. Configure and verify it using
  `docs/EDGE-RATE-LIMITING.md`, then set `EDGE_RATE_LIMITING_CONFIGURED=true`
  in the production environment. This is intentionally not implemented with
  the database-backed application limiter because doing so would add a write
  to every affiliate redirect and would still allow abusive traffic to reach
  the application.

## Known gaps / to do outside the code

- Breached-password check and email verification (needs an email provider,
  which the privacy page also depends on).
- Enforce the CSP after a review period.
- Secrets: `AUTH_SECRET` (or `NEXTAUTH_SECRET`) must be set in production; it is
  also used to hash rate-limit identifiers.
