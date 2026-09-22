# Phase 10.3 — Production Database & Deployment Safety

This phase separates development seeding from production lifecycle operations.

Added: `db:deploy`, `db:status`, `db:review:migrations`, `db:inspect:production`, and guarded `db:bootstrap:production`.

## Key finding

The existing catalogue seed is not a safe recurring production sync because crypto/share seeders use `deleteMany` + recreate for child data. This can replace IDs and verification metadata. The production bootstrap therefore refuses non-empty databases and requires explicit backup/bootstrap attestations.

Historical migrations contain destructive SQL (legacy drops). The review command reports them for target-state-aware human review; it does not pretend every historical DROP is automatically unsafe.

This phase does not claim the production DB, backups, restore test, migration deployment or bootstrap have actually been performed.
