# Production environment and deployment runbook

## Required environment

Configure secrets separately for Vercel Preview and Production. Do not put real values in `.env`, source control, `NEXT_PUBLIC_*`, or documentation.

Required for Production:

- `DATABASE_URL` — runtime PostgreSQL connection.
- `DIRECT_URL` — direct PostgreSQL connection for Prisma migrations.
- `AUTH_SECRET` — high-entropy secret, at least 32 characters.
- `NEXT_PUBLIC_SITE_URL=https://tradingguide.com.au`.
- `NEXTAUTH_URL=https://tradingguide.com.au` while the application still consumes this compatibility variable.
- GA variables if analytics is enabled.
- Release attestations only after their corresponding checks are actually complete.

`NEXT_PUBLIC_*` values are public and are embedded in browser JavaScript at build time. Never use that prefix for database credentials, auth secrets, API secrets or private tokens.

## Database deployment

Production uses `prisma migrate deploy`, never `prisma migrate dev`.

This repository must contain committed Prisma migration directories before first production deployment. If the production database already exists but migration history was lost/not committed, do **not** generate an arbitrary replacement migration and run it against production. Reconstruct/baseline the migration history against a disposable copy first, compare it with the live schema, take and test a backup, then use Prisma's supported migration-resolution workflow as appropriate.

Before every production schema change:

1. `npm run db:review:migrations`
2. Verify a current database backup and restore procedure.
3. `npm run db:status` against the intended target.
4. Review generated SQL, especially destructive findings.
5. `npm run db:deploy` during the controlled deployment.
6. Run `npm run db:inspect:production` and application smoke tests.

## Vercel environments

Keep Preview and Production variables separate. Preview should use a non-production database where possible. Environment-variable changes require a new deployment to affect built output/public variables.

Before promotion:

1. Run `npm run validate:code` with dependencies installed.
2. Run `npm run launch:gate` with the Production-equivalent environment.
3. Deploy a production candidate/preview and inspect CSP report-only violations.
4. After CSP is clean, set `CSP_ENFORCED_AND_VERIFIED=true`, redeploy and run `PRODUCTION_VERIFY_URL=https://... npm run verify:security:production`.
5. Verify edge rate limiting separately and only then attest `EDGE_RATE_LIMITING_CONFIGURED=true`.
