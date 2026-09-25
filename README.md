# Trading Guide

Australian trading education, research, provider comparison, and affiliate platform.

Built with:

- Next.js 16 — App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma
- PostgreSQL
- Auth.js v5

The implementation follows:

- `docs/IMPLEMENTATION-PLAN.md`
- `docs/ROADMAP.md`

---

## 1. Project Status

### Phase 1 — Public Foundation

Complete.

Includes:

- Design system and global theme tokens
- Header
- Footer
- Mobile navigation
- Homepage
- `/crypto`
- `/methodology`
- `/news`
- Real Next.js `<Link>` navigation
- Responsive animated mobile drawer
- Self-hosted typography using `next/font`

### Later Phases

The project also contains working foundations for:

- Authentication and admin access
- Article CMS
- Provider domain
- Provider Offering domain
- Crypto exchange research
- Comparison engine
- Affiliate partnerships
- Affiliate engagements
- Affiliate events
- `/go/[offering]` outbound redirect
- SEO infrastructure
- Provider verification
- Seed-data validation
- Production validation

All dynamic App Router routes follow the Next.js 16 async `params` convention:

```ts
params: Promise<{ slug: string }>;
```

and await `params` before use.

---

# 2. Architecture

## Provider and Offering Identity

The project separates the company from the product/service being compared.

```text
Provider
    │
    └── ProviderOffering
```

### Provider

Represents the external organisation or commercial entity.

Examples:

```text
CoinSpot
eToro
Kraken
CMC Markets
```

### ProviderOffering

Represents the actual product or service presented to users.

For example:

```text
eToro
├── eToro Share Trading
└── eToro Crypto
```

Public product pages, comparison URLs, selectors, SEO URLs, and affiliate destinations should use **Offering identity**.

---

## Affiliate Architecture

The affiliate domain is Offering-centric.

```text
Provider
   │
   ├── ProviderOffering
   │        │
   │        └── AffiliateEngagement
   │
   └── AffiliatePartnership
            │
            └── AffiliateEngagement
                     │
                     └── AffiliateEvent
```

### AffiliatePartnership

Represents the commercial relationship between Trading Guide and a Provider.

### AffiliateEngagement

Represents the commercial promotion of a specific Provider Offering.

It owns Offering-specific information such as:

- destination URL
- commission configuration
- campaign reference
- validity period
- engagement status

### AffiliateEvent

Represents an actual interaction with an Affiliate Engagement, such as an outbound redirect.

### Affiliate redirect

Canonical affiliate URLs use:

```text
/go/{offeringSlug}
```

Example:

```text
/go/coinspot
/go/kraken
/go/etoro-crypto
```

The route resolves a stored active `AffiliateEngagement`.

It never redirects to a destination supplied by the visitor.

---

# 3. Design System

The visual design uses a light cream, navy, and gold theme inspired by the supplied DomainEmpire reference.

Primary tokens are defined in:

```text
src/app/globals.css
```

### Colours

```css
--color-background: #f5f2ea;
--color-panel: white;
--color-navy: /* primary text/buttons */;
--color-gold: /* accent */;
```

### Typography

**Display / headlines**

```text
Source Serif 4
```

**Body**

```text
Inter
```

**Eyebrows / badges**

```text
IBM Plex Mono
```

Eyebrows use uppercase text, wide letter spacing, and the reference-style dot treatment.

### Components

Buttons use pill styling:

```text
rounded-full
```

Cards generally use:

```text
rounded-2xl
white background
soft border
subtle shadow
```

---

# 4. Repository Structure

Important areas:

```text
src/
├── app/
│   ├── admin/
│   ├── crypto/
│   ├── compare/
│   ├── go/
│   │   └── [offering]/
│   ├── methodology/
│   └── news/
│
├── components/
│
└── lib/
    ├── auth/
    ├── affiliates/
    ├── crypto-exchanges/
    ├── providers/
    └── repository.ts

prisma/
├── schema.prisma
├── migrations/
├── seed.ts
└── seeds/

docs/
```

`src/lib/repository.ts` provides the generic data-access foundation used by application services.

Administrative access is protected at multiple levels, including:

```text
src/proxy.ts
src/lib/auth/require-admin.ts
```

---

# 5. Requirements

Before starting, install:

- Node.js
- npm
- PostgreSQL, or access to a hosted PostgreSQL database
- Docker Desktop if using the local Docker database

Hosted PostgreSQL services such as Neon may also be used.

---

# 6. Local Database Setup

## Option A — Docker

Start Docker Desktop and run:

```bash
docker run --name trading-guide-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=trading-guide \
  -p 5432:5432 \
  -v trading_pgdata:/var/lib/postgresql/data \
  -d postgres:16-alpine
```

Then configure `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/trading-guide"
```

> Keep the Docker password and the password in `DATABASE_URL` consistent.

## Option B — Hosted PostgreSQL

You may instead use a hosted PostgreSQL database such as Neon.

Set the appropriate connection strings in `.env`.

Never commit production credentials to Git.

---

# 7. First-Time Project Setup

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Configure the required environment variables.

Then validate and generate Prisma:

```bash
npx prisma validate
npx prisma generate
```

Check migration state:

```bash
npx prisma migrate status
```

Apply the existing migrations:

```bash
npx prisma migrate deploy
```

Seed the database:

```bash
npm run db:seed
```

Start development:

```bash
npm run dev
```

---

# 8. Development Workflow

For normal development:

```bash
npm run dev
```

Before committing significant changes, run:

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm test
npm run lint
npm run format:check
npm run build
```

---

# 9. Prisma Workflow

## Important Rule

Prisma has two different workflows:

```text
Creating a new migration
        vs
Applying an existing migration
```

Do not confuse them.

---

## 9.1 When `schema.prisma` Has NOT Changed

You normally do not need to create a migration.

Run:

```bash
npx prisma generate
npx prisma validate
```

---

## 9.2 When Pulling Code That Already Contains a Migration

If the new source already contains the corresponding migration under:

```text
prisma/migrations/
```

**do not create another migration for the same schema change.**

Run:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate status
```

Then apply the included migration:

```bash
npx prisma migrate deploy
```

Verify:

```bash
npx prisma migrate status
```

Then seed if required:

```bash
npm run db:seed
```

---

## 9.3 When Creating a New Prisma Schema Change

When you intentionally modify:

```text
prisma/schema.prisma
```

first format and validate it:

```bash
npx prisma format
npx prisma validate
```

Then create a development migration:

```bash
npx prisma migrate dev --name <meaningful-migration-name>
```

Example:

```bash
npx prisma migrate dev --name add_affiliate_engagement_campaign
```

This should create something similar to:

```text
prisma/migrations/
└── 20260926120000_add_affiliate_engagement_campaign/
    └── migration.sql
```

Review the generated SQL before committing it.

Then:

```bash
npx prisma generate
npx prisma migrate status
```

Run the relevant validation and seed commands:

```bash
npm run check:seed-data
npm run check:providers
npm run db:seed
```

Finally:

```bash
npx tsc --noEmit
npm test
npm run lint
npm run build
```

Commit both:

```text
prisma/schema.prisma
prisma/migrations/<new-migration>/migration.sql
```

Do not commit a schema change without its required migration.

---

# 10. Prisma Command Reference

### Generate Prisma Client

```bash
npx prisma generate
```

Run this after changing or pulling a changed Prisma schema.

### Validate Prisma Schema

```bash
npx prisma validate
```

### Format Prisma Schema

```bash
npx prisma format
```

### Check Migration Status

```bash
npx prisma migrate status
```

### Create a New Development Migration

```bash
npx prisma migrate dev --name <migration-name>
```

Use this when **you are creating a new schema change**.

### Apply Existing Migrations

```bash
npx prisma migrate deploy
```

Use this for an existing migration, especially against production.

### Seed Database

```bash
npm run db:seed
```

---

# 11. Do Not Use `prisma db push` for Normal Development

The project maintains explicit Prisma migration history.

Prefer:

```text
Development:
schema change
    ↓
prisma migrate dev
    ↓
migration committed

Production:
committed migration
    ↓
prisma migrate deploy
```

Avoid using:

```bash
npx prisma db push
```

as a replacement for proper migrations.

---

# 12. Seed Data

Seed data is stored under:

```text
prisma/seeds/
```

Before seeding, validate it:

```bash
npm run check:seed-data
```

Provider research can also be checked with:

```bash
npm run check:providers
```

Then seed:

```bash
npm run db:seed
```

For an existing production database, do not blindly seed after every deployment.

First confirm that the seed operation is appropriate for the release and will not overwrite production-managed data.

---

# 13. Database Validation

Useful commands:

```bash
npm run db:review:migrations
npm run db:status
npm run db:inspect:production
```

For production migration deployment:

```bash
npm run db:deploy
```

or directly:

```bash
npx prisma migrate deploy
```

---

# 14. Testing

## Standard Validation

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm test
npm run lint
npm run format:check
npm run build
```

## Release Validation

Run the project-specific data checks:

```bash
npm run check:seed-data
npm run check:providers
npm run validate:release
```

---

# 15. Recommended Pre-Commit Check

For significant changes:

```bash
npx prisma validate
npx prisma generate

npm run check:seed-data
npm run check:providers

npx tsc --noEmit
npm test
npm run lint
npm run format:check
npm run build
```

---

# 16. Production Deployment

Production should **apply committed migrations**, not create migrations.

Do not run:

```bash
npx prisma migrate dev
```

against production.

Instead:

```bash
npm ci

npx prisma generate
npx prisma validate

npm run db:review:migrations
npx prisma migrate status
npx prisma migrate deploy
npx prisma migrate status

npm run check:seed-data
npm run check:providers
npm run validate:release

npx tsc --noEmit
npm test
npm run lint
npm run format:check
npm run build

npm run check:production
```

Seed production only when the release intentionally requires it:

```bash
npm run db:seed
```

---

# 17. Production Release Checklist

Before releasing:

```text
[ ] Production environment variables configured
[ ] Production database connection verified
[ ] Prisma schema validates
[ ] Prisma Client generated
[ ] Migration SQL reviewed
[ ] Pending migrations deployed
[ ] Migration status clean
[ ] Seed data validated
[ ] Provider verification passes
[ ] TypeScript passes
[ ] Tests pass
[ ] ESLint passes
[ ] Formatting passes
[ ] Next.js production build passes
[ ] Production checks pass
[ ] Release validation passes
```

Run:

```bash
npm run check:production
npm run validate:release
```

---

# 18. Authentication

Authentication uses Auth.js v5.

The application includes admin protection through:

```text
src/proxy.ts
src/lib/auth/require-admin.ts
```

Configure the required authentication provider and environment variables before using authentication in production.

Administrative users can be managed through the appropriate database/admin workflow.

---

# 19. Currently Incomplete / Planned Work

Refer to `docs/ROADMAP.md` for the authoritative roadmap.

Areas that may still require further implementation include:

- Article authoring/editor workflow
- Media management/upload
- Expanded Provider administration
- Expanded Affiliate Partnership administration
- Expanded Affiliate Engagement administration
- Affiliate Event reporting
- Additional structured data
- Additional verified Australian provider research

Keep this section aligned with the actual implementation as milestones are completed.

---

# 20. Important Project Rules

### Provider vs Offering

```text
Provider = organisation
ProviderOffering = product/service
```

Do not use Provider identity where Offering identity is required.

### Affiliate ownership

```text
AffiliatePartnership = Provider-level commercial relationship
AffiliateEngagement  = Offering-level promotion
AffiliateEvent       = observed interaction
```

### Affiliate redirects

Use:

```text
/go/{offeringSlug}
```

Do not introduce Provider-based affiliate redirect identity.

### Research independence

Commercial relationships must not determine:

- research conclusions
- ratings
- rankings
- comparison results
- provider verification
- editorial conclusions

Affiliate configuration controls commercial destinations and tracking—not research outcomes.

---

# 21. Quick Command Cheat Sheet

### Start Development

```bash
npm install
npx prisma generate
npm run dev
```

### New Database

```bash
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

### Existing Migration Arrived With New Code

```bash
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
npx prisma migrate status
```

### Create a New Schema Migration

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

### Validate Before Commit

```bash
npm run check:seed-data
npm run check:providers
npx tsc --noEmit
npm test
npm run lint
npm run format:check
npm run build
```

### Production

```bash
npm ci
npx prisma generate
npx prisma validate
npx prisma migrate status
npx prisma migrate deploy
npm run validate:release
npm run build
npm run check:production
```

---

# Trading Guide

Learn first. Compare clearly. Make informed decisions.
