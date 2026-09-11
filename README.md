# AusMarket Crypto

Next.js 16 (App Router) + React 19 + Tailwind v4 + Prisma (Postgres) + Auth.js
v5 scaffold, built against `docs/IMPLEMENTATION-PLAN.md` and `docs/ROADMAP.md`.

## Theme

Light cream + navy + gold theme, matching the DomainEmpire.com reference
screenshot supplied later in the project (replaces the original dark
`index.html` palette). Key tokens in `src/app/globals.css`:

- `--color-background` (`#f5f2ea` cream), `--color-panel` (white cards),
  `--color-navy` (primary text/buttons), `--color-gold` (accent)
- Display font: Playfair Display (bold/black weights) for headlines
- Body font: Inter
- Eyebrow/badge font: IBM Plex Mono (uppercase, wide tracking, dot bullet —
  matching the reference's "● DOMAIN SPECIALISTS SINCE 1997" pill)
- Buttons are pill-shaped (`rounded-full`) via `src/components/ui/Button.tsx`
- Cards are `rounded-2xl` white panels with a soft border and shadow

## Status

Phase 1 (Public Foundation) is complete: design tokens, `Header` / `Footer` /
`MobileNav` (real Next `<Link>` routing, no hash routing), the four top-level
shells (`/crypto`, `/compare`, `/methodology`, `/news`), homepage, a fully
functional animated mobile drawer, and a resolved typography decision
(Source Serif 4 + Inter, self-hosted via `next/font`, replacing the
reference's unlicensed Georgia placeholder).

Phases 2–6 are in place as a working skeleton (auth/admin shell, article CMS
reads, provider domain, comparison engine, affiliate domain incl.
`/go/[partner]` redirect). All dynamic routes use Next 16's async `params`
(`params: Promise<{...}>`, awaited before use).

This has **not** been `npm install`'d or build-tested in this environment (no
network access to npm here) — do that first before relying on it. Note
`next-auth@5.0.0-beta.25` and `@auth/prisma-adapter` compatibility with React
19 / Next 16 should be double-checked against their release notes at install
time, since both are still beta.

## Setup
0. Start Docker desktop
 ```Bash
docker run --name trading-online-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=trading-online \
  -p 5432:5432 \
  -v trading_pgdata:/var/lib/postgresql/data \
  -d postgres:16-alpine
```
Or use a local Postgres install, or a free hosted one (Supabase, Neon, Railway) if you'd rather not run Docker.

Then in .env in the project root
  `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trading-online"`
1. `npm install`
2. `cp .env.example .env` and point `DATABASE_URL` at a real Postgres instance
3. `npm run db:migrate`
4. `npm run db:seed`
5. Wire a real Auth.js provider in `src/lib/auth/config.ts`, then promote a
   user to `ADMIN` via `prisma studio` or a script
6. `npm run dev`
7. `npx prisma generate && npx prisma validate`
8. `npm test`
9. `npx tsc --noEmit`
10. `npm run build`

When migrate failed
`npx prisma migrate dev`

## What's stubbed (matches ROADMAP.md)

- Article editor (`/admin/articles/new`, `/admin/articles/[id]`) — no
  create/update/publish server actions yet
- Media upload
- Provider Admin UI (Phase 9 — seed-only by design)
- Affiliate partner/link/click CRUD in `/admin/affiliates/*`
- JSON-LD structured data
- Real Australian provider data — seed data is explicitly placeholder

## Architecture notes

- `src/lib/repository.ts` — generic data-access layer; `articles`,
  `providers`, and `affiliates` services all build on it rather than calling
  Prisma directly.
- `src/middleware.ts` + `src/lib/auth/require-admin.ts` — two independent
  layers of admin protection (route-level and mutation-level).
- `/go/[partner]` only ever redirects to a stored `approvedUrl` on an
  `ACTIVE` `AffiliateLink` row — never to a user-supplied URL.
