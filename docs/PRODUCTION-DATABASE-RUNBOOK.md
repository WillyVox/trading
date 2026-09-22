# Production database runbook

Production is not disposable. User accounts, articles, provider research, pricing verification, affiliate activity and operational history must survive releases.

## Rules

- Never run `prisma migrate dev`, `prisma db push`, `prisma migrate reset`, or general `npm run db:seed` on live production.
- Use `npm run db:deploy` (`prisma migrate deploy`) for production schema changes.
- Verify recoverable backup/snapshot and restore procedure before migration.
- Review pending migrations and destructive SQL.
- Stop on migration, health or smoke-test failure; never reset production.

## Why general seed is not a production updater

Provider seeders deliberately delete/recreate child fees, features, markets, custody and pros/cons. On live data this can replace IDs and verification metadata (`verifiedAt`, `reviewDueAt`, `verifiedByUserId`).

Use `db:seed` for development, guarded `db:bootstrap:production` only for the first empty production DB, and reviewed data migrations/admin workflows after launch.

## First production deployment

1. Create PostgreSQL with required TLS/SSL.
2. Enable backups; record retention.
3. Test restore outside production.
4. Store `DATABASE_URL` in secret management.
5. Run `npm run db:status`.
6. Run `npm run db:review:migrations` and review pending destructive migrations.
7. Verify launch backup/snapshot.
8. Run `npm run db:deploy`.
9. Only while DB is empty:

```bash
PRODUCTION_BACKUP_VERIFIED=true \
PRODUCTION_BOOTSTRAP_CONFIRMED=FIRST_PRODUCTION_BOOTSTRAP_ONLY \
npm run db:bootstrap:production
```

10. Run `npm run db:inspect:production`.
11. Check `/api/health`.
12. Smoke-test provider/article/pricing paths and admin access.
13. Record deployed migration and time.

## Normal release

Backup check → `db:status` → migration review → snapshot → `db:deploy` → app deploy → health/smoke tests. Do not run seed/bootstrap.

## Post-launch data changes

Prefer admin verification/editorial workflows; otherwise narrow reviewed one-off data migrations. Only introduce a general sync after it preserves verification/audit metadata. Affiliate configuration is operational data and must not become live merely because a seed changed.

## Recovery

Stop release; do not reset/push. Preserve logs, inspect Prisma migration state, use Prisma/provider recovery procedures, reconcile failure, then rerun health/smoke tests.
