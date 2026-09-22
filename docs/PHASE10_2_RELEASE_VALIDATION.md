# Phase 10.2 — Release validation and source remediation

This phase keeps the production gate fail-closed and adds repeatable validation commands.

## Commands

- `npm run validate:code` runs Prisma validation/generation, ESLint, TypeScript, tests, Prettier check, and the Next.js production build. It stops at the first failure.
- `npm run validate:release` first runs the complete code validation, then runs `check:production`. It cannot pass unless both code quality and the external production attestations/environment are satisfied.

There is intentionally no `--skip-production`, `SKIP_PRODUCTION_CHECK`, or equivalent bypass.

## Source remediation in this phase

- Removed stale commented-out article textarea markup after the rich editor replacement.
- Replaced admin editorial examples such as “5 Best Crypto Exchanges” / “top picks” with neutral comparison language so the CMS does not nudge editors toward unsupported winner/ranking content.
- Retained deliberate content-opportunity records that explicitly document ranking/winner titles as patterns to avoid.

## Validation environment

Dependency installation was attempted in the execution environment but did not complete within the available runtime. Therefore Prisma, ESLint, TypeScript, tests, Prettier and Next.js build are not claimed as passing in this artifact. Run `npm ci` followed by `npm run validate:release` in CI or a normal development machine with the production environment supplied.
