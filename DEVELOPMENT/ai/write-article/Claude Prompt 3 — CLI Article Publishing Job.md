# ROLE

Act as a Senior Next.js Engineer, Node.js/TypeScript Engineer, Prisma/PostgreSQL Architect, CMS Engineer, Content Pipeline Architect, Technical SEO Engineer, and application security engineer.

I want you to build a **file-based article import/publishing job** into my existing Next.js project.

I do NOT want the primary workflow to be an Admin upload screen.

Instead I want a developer workflow like this:

```bash
npm run import:article
```

The command should scan article files from:

```text
/publish_article
```

at the project root.

Example:

```text
project-root/
├── publish_article/
│   ├── how-to-trade-crypto.md
│   ├── how-to-buy-bitcoin-australia.md
│   ├── binance-trading-guide.txt
│   └── processed/
├── prisma/
├── src/
├── package.json
└── ...
```

The script should:

```text
read files
    ↓
parse article metadata + content
    ↓
validate
    ↓
resolve DB relationships
    ↓
create/update Article records
    ↓
report success/failure
    ↓
move successful files into processed/
```

The system must be safe, deterministic and reusable.

---

# 1. AUDIT THE EXISTING PROJECT FIRST

Before changing code, inspect:

```text
package.json
prisma/schema.prisma
existing Article models
ArticleProvider
Provider
Affiliate models
existing article repositories/services
src/lib/articles/
Admin article pages
existing article rendering
SEO fields
categories
tags
authentication
existing scripts
tsconfig
ESLint
```

Reuse existing architecture.

Do not create duplicate Article models or duplicate publishing logic.

If article repository/service functions already exist, the CLI should call those rather than talking directly to Prisma everywhere.

---

# 2. DESIRED COMMAND

Add:

```bash
npm run import:article
```

to `package.json`.

It should execute a TypeScript script.

Possible implementation:

```text
scripts/import-articles.ts
```

or:

```text
src/scripts/import-articles.ts
```

Choose whichever fits the existing repository.

Use the existing TypeScript/runtime setup.

Do not add unnecessary runtime dependencies.

If a runner is required, evaluate whether the project already uses:

```text
tsx
ts-node
```

Prefer existing tooling.

---

# 3. INPUT DIRECTORY

The command must scan:

```text
/publish_article
```

from the repository root.

Supported initial formats:

```text
.md
.txt
```

Ignore:

```text
.DS_Store
hidden files
directories
unsupported extensions
processed/
failed/
```

Potential structure:

```text
publish_article/
├── article-one.md
├── article-two.md
├── article-three.txt
├── processed/
└── failed/
```

Automatically create `processed/` and `failed/` if appropriate.

---

# 4. ARTICLE FORMAT

For `.md` files, use Markdown with YAML frontmatter.

Example:

```md
---
title: "How to Trade Crypto: A Beginner Guide"
slug: "how-to-trade-crypto"

excerpt: "Learn how crypto trading works, including exchanges, order types, fees and major risks."

category: "Crypto Trading"

tags:
  - crypto-trading
  - beginners
  - exchanges

region: "GLOBAL"

seoTitle: "How to Trade Crypto: Beginner Guide"
seoDescription: "Learn how crypto trading works, how exchanges operate, common order types, fees and key risks."

author: "Editorial Team"

relatedProviders:
  - kraken
  - binance

relatedGuides:
  - crypto-trading-fees
  - market-vs-limit-orders

sources:
  - label: "Example Source"
    url: "https://example.com"

affiliateProviders:
  - kraken

status: "DRAFT"
---

# How to Trade Crypto

Article content here...
```

This example is conceptual.

Adapt field names exactly to the existing Prisma schema.

---

# 5. TXT FORMAT

Support `.txt` files as well.

For TXT, choose one reliable format.

Preferred option:

```text
YAML-style frontmatter
+
plain text / Markdown body
```

For example:

```text
---
title: How to Buy Bitcoin in Australia
slug: how-to-buy-bitcoin-australia
category: Bitcoin
region: AU
---

# How to Buy Bitcoin in Australia

...
```

Treat the article body as Markdown unless the existing renderer requires another format.

Do not invent two totally different parsing systems for `.md` and `.txt`.

They should go through the same parser after reading the file.

---

# 6. SINGLE ARTICLE CONTRACT

Create documentation:

```text
docs/article-publishing-format.md
```

This document must define exactly what AI tools should generate.

Include:

```text
required fields
optional fields
frontmatter format
body format
allowed statuses
allowed regions
allowed tags/categories
related provider format
related guide format
source format
SEO fields
filename recommendations
```

The goal is that I can tell Claude:

```text
Generate this article using our publishing format
```

and save the result directly into:

```text
/publish_article
```

---

# 7. SAFE DEFAULT STATUS

IMPORTANT:

Every new imported article should default to:

```text
DRAFT
```

Even if status is omitted.

Do NOT automatically publish newly generated AI content.

If input says:

```yaml
status: PUBLISHED
```

the script should either:

```text
ignore it and use DRAFT
```

OR require an explicit command-line flag.

Recommended:

```bash
npm run import:article
```

→ always imports as DRAFT.

Future optional command:

```bash
npm run import:article -- --publish
```

may permit publishing, but only if explicitly implemented and protected by validation.

For MVP, DRAFT-only import is preferred.

---

# 8. PARSER

Create one reusable parser.

Potential architecture:

```text
src/lib/articles/import/
    parser.ts
    schema.ts
    importer.ts
    relationships.ts
```

or similar.

Pipeline:

```text
read file
    ↓
parse frontmatter
    ↓
parse body
    ↓
normalize
    ↓
validate
    ↓
ArticleImportPayload
```

Do not mix file-system operations with content validation unnecessarily.

---

# 9. VALIDATION

Use strong validation.

Prefer existing Zod setup if the project already uses Zod.

Validate:

```text
title
slug
excerpt
content
category
tags
region
SEO title
SEO description
source URLs
provider slugs
related article slugs
status
```

Required minimum:

```text
title
slug
content
```

Potential validation rules:

```text
slug lowercase
slug URL-safe
no duplicate slug
valid URLs
no empty content
no invalid region
no malformed frontmatter
```

Do not silently accept malformed values.

---

# 10. SLUG HANDLING

Slug must be deterministic.

If provided:

```yaml
slug: how-to-trade-crypto
```

validate and use it.

If omitted, optionally generate from title.

However, prefer requiring a slug for predictable SEO URLs.

Reject malformed values such as:

```text
How To Trade Crypto!!!
/crypto/guides/test
?article=123
```

Expected:

```text
how-to-trade-crypto
```

---

# 11. CREATE VS UPDATE

The import command must be idempotent.

Use article slug as the natural lookup key.

Flow:

```text
slug not found
    ↓
CREATE article

slug found
    ↓
UPDATE article
```

Do NOT create duplicate articles every time the command runs.

Display whether each operation was:

```text
CREATED
UPDATED
SKIPPED
FAILED
```

---

# 12. UPDATE SAFETY

Be careful when updating existing published articles.

Default behavior should NOT accidentally:

```text
unpublish an existing article
replace metadata with null
delete relationships
destroy publication history
```

Design safe merge semantics.

For example:

```text
only update fields represented in the import file
```

or another explicit rule.

Document the behavior clearly.

---

# 13. ARTICLE RELATIONSHIPS

If input includes:

```yaml
relatedProviders:
  - kraken
  - binance
```

resolve by:

```text
Provider.slug
```

through the Provider repository/service.

If provider exists:

```text
create/update ArticleProvider relationship
```

If not:

```text
WARNING: Provider "binance" not found
```

Do NOT automatically create a Provider from an article import.

Provider creation belongs to the Provider domain.

---

# 14. RELATED GUIDES

Input:

```yaml
relatedGuides:
  - crypto-trading-fees
  - how-crypto-exchanges-work
```

Resolve using Article slug.

If a related article is not yet in the DB:

```text
warn
```

Do not fail the entire article unless architecture requires it.

Possible output:

```text
WARN how-to-trade-crypto:
related article "crypto-trading-fees" does not exist
```

---

# 15. RELATIONSHIP ORDERING ISSUE

Articles may reference articles being imported in the same batch.

Example:

```text
article-a.md → article-b
article-b.md → article-a
```

Do not fail simply because one is processed first.

Use a two-pass import if appropriate:

```text
PASS 1
create/update core Article records

PASS 2
resolve Article relationships
Provider relationships
Affiliate placement suggestions
```

This is strongly preferred for batch imports.

---

# 16. AFFILIATE RELATIONSHIPS

VERY IMPORTANT.

Article import must not store arbitrary affiliate URLs from AI-generated files.

The input may contain:

```yaml
affiliateProviders:
  - kraken
```

This only means:

```text
this article may display Kraken as a contextual affiliate placement
```

The importer/server should resolve:

```text
Provider
    ↓
AffiliatePartnership
    ↓
AffiliateProgram
    ↓
AffiliateLink
```

using existing DB records.

If no active affiliate relationship exists:

```text
do not fabricate one
do not create random URL
do not fail article import
show warning
```

Example:

```text
WARN:
Kraken requested as affiliate placement,
but no ACTIVE affiliate link exists.
Placement was not created.
```

---

# 17. AFFILIATE URL SECURITY

Never accept this:

```yaml
affiliateUrl: "https://random-site.com/ref=..."
```

from AI article files as a trusted destination.

Affiliate URLs must come from the existing Affiliate domain/database.

The article file may reference:

```text
providerSlug
placementType
```

but NOT define the authoritative external destination.

---

# 18. SOURCES

Articles should support structured sources.

Example:

```yaml
sources:
  - label: "Kraken Spot Crypto Fee Schedule"
    url: "https://..."
    type: "OFFICIAL_PROVIDER"

  - label: "Australian regulator"
    url: "https://..."
    type: "REGULATOR"
```

Validate:

```text
URL syntax
label
optional source type
```

Store using the existing Article source model if one exists.

If no appropriate source model exists, propose one before implementing.

---

# 19. REGIONAL SEO DATA

Support regional metadata.

Initial values:

```text
GLOBAL
AU
US
UK
NZ
SG
```

But inspect existing architecture first.

Example:

```yaml
region: AU
```

For Australian article:

```text
How to Buy Bitcoin in Australia
```

Regional data should integrate with the SEO engine.

Do NOT duplicate regional content automatically.

The file itself represents an intentional regional article.

---

# 20. SEO IMPORT

Support fields such as:

```yaml
seoTitle: "How to Buy Bitcoin in Australia"
seoDescription: "..."
```

If omitted:

the Article/SEO service should generate its normal fallback metadata.

Do not duplicate SEO logic inside the CLI.

The CLI stores data.

The existing SEO engine generates final:

```text
title
description
canonical
Open Graph
robots
structured data
```

---

# 21. CONTENT SANITIZATION

Treat imported AI content as untrusted.

Prevent:

```text
<script>
javascript:
malicious HTML
unsafe iframe
unexpected executable MDX
server-side code injection
```

If the website renderer uses Markdown:

sanitize according to existing architecture.

If MDX execution is enabled, carefully assess security before accepting AI-generated MDX.

For MVP prefer Markdown content that cannot execute arbitrary JavaScript.

---

# 22. FILE SUCCESS FLOW

After successful DB import:

move file from:

```text
publish_article/how-to-trade-crypto.md
```

to:

```text
publish_article/processed/how-to-trade-crypto.md
```

Prefer adding an import timestamp if filename collision is possible:

```text
processed/
2026-09-10T123000-how-to-trade-crypto.md
```

or use a safe collision-handling strategy.

Do not delete successful source files permanently.

---

# 23. FAILED FILE FLOW

If parsing or validation fails, either:

### Option A

Leave the file in:

```text
publish_article/
```

and print the error.

OR

### Option B

Move it to:

```text
publish_article/failed/
```

along with a clear console error.

Choose whichever provides the safest correction workflow.

My preference:

```text
validation failure
→ leave original file untouched
```

because I want to fix it and rerun easily.

---

# 24. PARTIAL FAILURES

One bad article must NOT stop the entire batch.

Example:

```text
20 files found

✓ 17 imported
✗ 2 validation failures
⚠ 1 imported with warnings
```

Continue processing remaining valid files.

At the end print a complete summary.

Return a non-zero exit code if there are failures where appropriate.

---

# 25. DRY RUN

Implement:

```bash
npm run import:article -- --dry-run
```

This should:

```text
scan
parse
validate
resolve relationships
show intended DB operations
```

but make NO database changes and move NO files.

This is extremely useful.

Example:

```text
$ npm run import:article -- --dry-run

Found 8 article files.

CREATE:
  how-to-trade-crypto

UPDATE:
  how-to-buy-bitcoin-australia

WARN:
  provider "xyz" not found

FAILED:
  article-test.md
  invalid slug

No database changes were made.
```

---

# 26. SINGLE FILE OPTION

Support optionally:

```bash
npm run import:article -- --file how-to-trade-crypto.md
```

This lets me test or republish one article.

The default without `--file` scans the whole directory.

---

# 27. VERBOSE MODE

Optional:

```bash
npm run import:article -- --verbose
```

Can show:

```text
parsed metadata
relationship resolution
DB operation
file movement
```

Do not expose secrets or credentials.

---

# 28. FORCE / UPDATE OPTIONS

Evaluate whether to support:

```bash
--create-only
--update-only
--force
```

But do NOT over-engineer the MVP.

Minimum required:

```text
default batch
--dry-run
--file
```

is sufficient.

---

# 29. LOGGING

Console output should be clear.

Example:

```text
Crypto Article Publisher
────────────────────────────────

Directory:
./publish_article

Found: 5 files

[1/5] how-to-trade-crypto.md
  ✓ parsed
  ✓ validated
  ✓ provider relationships
  ✓ CREATED
  ✓ moved → processed/

[2/5] binance-trading-guide.md
  ✓ parsed
  ✓ validated
  ⚠ affiliate provider Binance has no active link
  ✓ CREATED
  ✓ moved → processed/

[3/5] article-test.md
  ✗ FAILED
  Reason: seoDescription must be a string

────────────────────────────────

Summary

Created: 2
Updated: 2
Warnings: 1
Failed: 1
Processed: 4
```

Use simple readable logging.

Avoid requiring a large logging framework.

---

# 30. DATABASE TRANSACTIONS

Use transactions appropriately.

Each article should preferably be imported atomically:

```text
Article
ArticleProvider
sources
tags
relationships
affiliate placement references
```

If one critical operation fails:

```text
rollback that article
```

Do not roll back all other successfully imported articles unless necessary.

---

# 31. DATABASE CONNECTION

Use the existing Prisma client implementation.

Do not instantiate many PrismaClients.

Reuse:

```text
src/lib/prisma.ts
```

or equivalent if it already exists.

The script must close DB connections correctly on completion/error.

---

# 32. ENVIRONMENT SAFETY

The command will use:

```text
DATABASE_URL
```

Before running, clearly show which environment/database is targeted without exposing credentials.

For example:

```text
Environment: development
```

Avoid printing full database connection strings.

Consider refusing production execution unless explicitly acknowledged, if appropriate for the project's existing deployment strategy.

Do not invent an environment system if one already exists.

---

# 33. IDEMPOTENCY

Running:

```bash
npm run import:article
```

multiple times should not create duplicates.

Processed files are moved away.

Even if the same article is reintroduced later:

```text
slug lookup
→ update existing Article
```

should keep DB integrity.

---

# 34. SEO / CACHE INVALIDATION

After successful import/update:

if public pages depend on cached/static data, use the existing invalidation strategy.

For DRAFT imports:

normally do not revalidate public article pages unnecessarily.

If updating an already published Article:

revalidate relevant:

```text
article URL
guide hub
category pages
related page caches
sitemap if required
```

Do not trigger unnecessary full-site rebuilds.

---

# 35. PUBLISHING SHOULD REMAIN A SEPARATE ACTION

Despite the command name:

```bash
npm run import:article
```

its primary responsibility is:

```text
import article files as a record INTO THE CMS DATABASE
```

not necessarily make them publicly PUBLISHED.

---

# 36. OPTIONAL ARTICLE GENERATION WORKFLOW

The workflow I want is:

```text
Ask Claude:
"Generate article using docs/article-publishing-format.md"

        ↓

Claude returns Markdown

        ↓

Save:

import_article/how-to-trade-crypto.md

        ↓

Run:

npm run import:article -- --dry-run

        ↓

If valid:

npm run import:article

        ↓

Database

        ↓

Admin → Articles → Draft

        ↓

Review

        ↓

Publish
```

Optimize around this workflow.

---

# 37. OPTIONAL BULK AI WORKFLOW

Eventually I may generate:

```text
10–50 article files
```

and place them into:

```text
publish_article/
```

The job must handle this safely.

However:

do not automatically publish them publicly.

Bulk generation should still become:

```text
DRAFT
```

for review.

---

# 38. RECOMMENDED ARCHITECTURE

Evaluate an implementation similar to:

```text
scripts/
└── import-articles.ts

src/lib/articles/import/
├── types.ts
├── schema.ts
├── parser.ts
├── importer.ts
├── relationships.ts
└── reporter.ts

publish_article/
├── .gitkeep
├── processed/
│   └── .gitkeep
└── failed/
    └── .gitkeep

docs/
└── article-publishing-format.md
```

Do not use this blindly.

Adapt it to the actual project.

---

# 39. GIT STRATEGY

Evaluate whether:

```text
publish_article/processed/
```

should be gitignored.

Likely:

```gitignore
publish_article/*
!publish_article/.gitkeep
```

or another safe strategy.

However, I may want article source files in Git.

Explain the tradeoff:

```text
Git-tracked article source
vs
temporary publishing inbox
```

My intended initial model is:

```text
PostgreSQL Article = source of truth

publish_article/ = temporary import inbox
```

So processed files do not need to remain committed unless useful for auditing.

---

# 40. TESTING

Add meaningful automated tests where appropriate.

Test:

```text
valid frontmatter
missing required field
invalid slug
invalid source URL
provider relationship
missing provider warning
duplicate slug update
dry run
multi-file processing
failed file does not stop batch
```

Do not write superficial tests.

---

# 41. FIRST RESPONSE REQUIRED

Do NOT modify code yet.

Return:

## A. Existing Article Architecture

Inspect my actual project.

## B. Existing Prisma Article Models

Explain what can be reused.

## C. Proposed Article File Contract

Show the exact Markdown format.

## D. Required vs Optional Fields

Provide table.

## E. CLI Architecture

Explain:

```text
npm run import:article
```

flow.

## F. Parser Architecture

Explain Markdown/TXT parsing.

## G. Validation Strategy

Explain Zod/schema validation.

## H. Create/Update Strategy

Explain slug-based idempotency.

## I. Relationship Resolution

Explain:

```text
ArticleProvider
related guides
tags
categories
sources
```

## J. Affiliate Resolution

Explain how partner suggestions are resolved without accepting arbitrary URLs.

## K. Regional SEO Integration

Explain how region metadata reaches the SEO engine.

## L. Security

Identify unsafe input concerns.

## M. Error Handling

Explain:

```text
success
warning
failure
```

behaviour.

## N. Dry Run

Show exact expected behaviour.

## O. File Movement

Explain `processed/` behaviour.

## P. Exact File Changes

Return:

```text
CREATE
MODIFY
DELETE
```

and explain every proposed file.

## Q. Example Run

Show:

```bash
npm run import:article -- --dry-run
npm run import:article
```

with example console output.

## R. Implementation Phases

Break implementation into safe phases.

Then STOP.

---

# 42. IMPLEMENTATION PHASES

Recommended:

## PHASE 1

Implement:

```text
article file contract
parser
validation
CLI scanning
dry-run
console reporting
```

No database writes yet.

After implementation run:

```text
lint
typecheck
tests
build
```

STOP.

## PHASE 2

Implement:

```text
Prisma create/update
transactions
Provider relationship resolution
Article relationship resolution
sources
```

Run checks.

STOP.

## PHASE 3

Implement:

```text
processed file movement
failure handling
single-file option
cache/revalidation integration
```

Run checks.

STOP.

## PHASE 4

Add if useful:

```text
affiliate placement resolution
regional SEO integration
additional import validation
```

Run checks.

STOP.

---

# FINAL PRINCIPLE

Build a pipeline that is:

```text
AI-friendly
developer-friendly
repeatable
idempotent
safe
fast
SEO-aware
database-driven
```

The final desired experience is:

```bash
# generate articles externally

cp *.md publish_article/

# check everything first
npm run import:article -- --dry-run

# import
npm run import:article
```

Result:

```text
AI-generated article files
        ↓
validated structured input
        ↓
Article database
        ↓
DRAFT
        ↓
Admin review
        ↓
public publication
        ↓
dynamic SEO
        ↓
related guides/providers
        ↓
contextual affiliate placements
```

Most importantly:

**Do not build a script that blindly dumps AI text into production. Build a reliable content ingestion job that converts structured article files into validated CMS records.**