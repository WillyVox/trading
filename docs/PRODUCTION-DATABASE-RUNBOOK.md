# Production database runbook

Production is not a disposable seed environment. Provider research, verification history, affiliate operations and user data must survive application releases.

## Release path

1. Take or verify a recoverable production backup/snapshot.
2. Review pending Prisma migrations in source control.
3. Run `npx prisma migrate deploy` against the production database. Do not run `prisma migrate dev` in production.
4. Do **not** run the general development seed automatically. Apply reference/provider-data changes through a reviewed, idempotent production data operation.
5. Run the health check and public smoke tests after migration.
6. Verify admin access and one representative read path for providers, articles and pricing.

## Failure rule

If migration or smoke verification fails, stop the release. Do not reset the production database. Restore/roll back using the database provider's tested recovery procedure and reconcile the failed migration before retrying.

## Required before first launch

- [ ] Production database created with TLS/SSL as required by the provider.
- [ ] Automated backups enabled and retention understood.
- [ ] A restore has been tested outside production.
- [ ] `DATABASE_URL` is stored only in the deployment secret store.
- [ ] Pending migrations reviewed.
- [ ] Initial reference-data bootstrap reviewed separately from user/operational data.
