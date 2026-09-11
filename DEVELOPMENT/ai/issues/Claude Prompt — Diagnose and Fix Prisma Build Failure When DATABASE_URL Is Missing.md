# ROLE

Act as a **Senior Staff Software Engineer, Next.js 16 architect, Prisma/PostgreSQL specialist, deployment engineer, and reliability engineer**.

You are working directly inside my existing project.

Do **not** treat this as a greenfield application and do not make a superficial fix.

I have a production/build failure that needs to be investigated thoroughly and fixed at the architectural root cause.

---

# ERROR

During:

```bash
npm run build
```

Next.js fails while building `/compare`:

```text
Validation Error Count: 1
at <unknown> (--> schema.prisma:7)
at async Object.paginate (src/lib/repository.ts:38:30)
at async i (src/app/compare/page.tsx:15:21)

36 | const page = args.page ?? 1;
37 | const pageSize = args.pageSize ?? 20;
> 38 | const [items, total] = await Promise.all([
     |                              ^
39 |   delegate.findMany({
40 |     where: args.where,
41 |     orderBy: args.orderBy, {

clientVersion: '5.22.0',
errorCode: undefined,
digest: '3280245710'
}

Export encountered an error on /compare/page: /compare, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
Error: Command "npm run build" exited with 1
```

The Prisma schema datasource appears approximately like:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The failure appears to occur because `/compare` is evaluated during the build, which eventually performs a Prisma query through:

```text
src/app/compare/page.tsx
        ↓
service/repository
        ↓
repository.paginate()
        ↓
Prisma findMany/count
        ↓
Prisma datasource validation
```

My suspicion is that:

```text
DATABASE_URL
```

is missing or unavailable in the build environment.

However, **do not assume this is definitely the only cause**.

Inspect the actual repository and prove the root cause.

---

# PRIMARY PRODUCT REQUIREMENT

The application should support the following case:

> If no database configuration/database is provided for a particular build/runtime environment, the application should degrade gracefully instead of causing the entire Next.js build to fail.

In particular:

```text
npm run build
```

should not fail merely because public data pages such as:

```text
/compare
```

cannot access a configured database.

Instead, where appropriate, the page should render a safe fallback such as:

```text
empty comparison state
"No providers are currently available"
fallback/static content
```

depending on the existing design.

This must be implemented deliberately and safely.

---

# 1. FIRST — REPRODUCE AND FIND THE REAL ROOT CAUSE

Before changing code, thoroughly inspect:

```text
prisma/schema.prisma

src/lib/prisma.ts
src/lib/db/*
src/lib/repository.ts

src/app/compare/page.tsx
src/app/compare/[slug]/page.tsx

src/lib/providers/
src/lib/compare/

package.json
next.config.*
.env*
README
deployment configuration
```

Also search for all direct and indirect usages of:

```text
DATABASE_URL
PrismaClient
prisma.*
paginate()
```

Determine:

1. Is `DATABASE_URL` undefined?
2. Is it present but malformed?
3. Is Prisma instantiated successfully but failing only when queried?
4. Does the error happen during module import or query execution?
5. Is `/compare` being statically prerendered during `next build`?
6. Which exact function triggers the first Prisma query?
7. Are other routes vulnerable to exactly the same problem?
8. Does `prisma generate` work without `DATABASE_URL`?
9. Is the failure specific to build time, runtime, or both?

Show evidence from the code before deciding on the solution.

---

# 2. DO NOT FIX ONLY `/compare`

The stack trace exposes:

```text
src/app/compare/page.tsx
```

but this could merely be the first affected route.

Audit the entire application for database-dependent public routes.

Examples may include:

```text
/
/compare
/compare/[slug]
/crypto/exchanges
/crypto/exchanges/[slug]
/news
/news/[slug]
/crypto/guides
/crypto/guides/[slug]
sitemap
metadata generation
related content
homepage sections
```

Identify which ones are evaluated during build and which ones perform database access.

Do not patch `/compare` while leaving the next route to fail immediately afterward.

---

# 3. REQUIRED BEHAVIOUR

We need an explicit concept of:

```text
database configured
```

versus:

```text
database unavailable/not configured
```

If the database is intentionally absent:

### Public read-only functionality

Where safe and appropriate:

```text
return empty/fallback content
do not crash the build
do not crash the entire website
```

For example:

```ts
{
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  pageCount: 0
}
```

may be reasonable for a paginated provider listing.

But do not blindly return that from every database error.

---

# 4. IMPORTANT — DISTINGUISH "NO DATABASE CONFIGURATION" FROM "DATABASE IS BROKEN"

This distinction is extremely important.

I do NOT want code equivalent to:

```ts
try {
  return await prisma.provider.findMany();
} catch {
  return [];
}
```

everywhere.

That would hide genuine production problems including:

```text
database outage
bad migration
invalid SQL
schema mismatch
permission problem
timeout
Prisma programming bug
```

Instead distinguish:

```text
Database deliberately not configured
```

from:

```text
Database expected/configured but failing
```

Recommended principle:

### Database not configured

Graceful fallback may be acceptable.

### DATABASE_URL exists, but Prisma/query fails

Normally:

```text
log clearly
throw/error
surface monitoring signal
```

rather than silently pretending the database is empty.

Design this distinction explicitly.

---

# 5. INTRODUCE A CENTRAL DATABASE AVAILABILITY CHECK

Investigate creating one small shared utility.

Conceptually something like:

```ts
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
```

Potentially with more validation if appropriate.

Do not duplicate checks like:

```ts
if (!process.env.DATABASE_URL)
```

through dozens of files.

Recommend the best location based on existing project conventions, for example:

```text
src/lib/db/config.ts
```

or another existing DB module.

---

# 6. BE CAREFUL WITH MODULE-LEVEL PRISMA INITIALIZATION

Inspect how `PrismaClient` is instantiated.

For example, if there is currently:

```ts
export const prisma = new PrismaClient();
```

determine whether merely importing this module is safe when:

```text
DATABASE_URL
```

is missing.

If Prisma only validates the datasource when the first query executes, document that.

If import-time initialization itself can become a problem, design accordingly.

Do not introduce complicated lazy proxy abstractions unless necessary.

---

# 7. WHERE SHOULD FALLBACK LOGIC LIVE?

Evaluate these possible architectures.

## Option A — Page-level check

```ts
if (!isDatabaseConfigured()) {
  return <EmptyCompareState />;
}
```

Advantages:

```text
simple
explicit
```

Problems:

```text
duplicates DB awareness across UI pages
easy for future pages to forget
```

---

## Option B — Service/repository-level fallback

Example:

```ts
getProviders(...)
```

knows that missing DB configuration means:

```text
empty result
```

Advantages:

```text
UI remains database-agnostic
centralized
reusable
```

Potential problem:

```text
generic repository may not know the correct fallback semantics
```

---

## Option C — Domain-specific service fallback

For example:

```ts
getProviderList(...)
```

checks DB configuration and returns a domain-appropriate result.

Generic:

```text
repository.paginate()
```

does NOT silently swallow missing DB situations.

This may be safer because different domains may need different fallback behaviour.

Evaluate these approaches against the actual codebase.

Give me your recommendation before implementing it.

My current preference is:

> Keep generic repository behaviour strict, and implement graceful fallback at the domain/service boundary where fallback semantics are understood.

But challenge this if the existing architecture suggests a cleaner solution.

---

# 8. DO NOT MAKE `repository.paginate()` SWALLOW EVERYTHING

The current stack shows:

```text
src/lib/repository.ts:38
```

Do not automatically change it into:

```ts
try {
   ...
} catch {
   return emptyPage;
}
```

unless you can prove that is the right abstraction.

A generic repository cannot safely know whether:

```text
empty DB result
```

and:

```text
database error
```

mean the same thing.

Usually they do not.

If repository changes are needed, explain why.

---

# 9. BUILD-TIME VS RUNTIME BEHAVIOUR

Study how Next.js 16 handles the affected routes in this project.

Determine whether `/compare` currently becomes:

```text
static/prerendered
dynamic
ISR
```

during build.

Inspect whether things such as:

```ts
export const dynamic = "force-dynamic";
export const revalidate = ...
```

already exist.

Do NOT add:

```ts
export const dynamic = "force-dynamic";
```

just to make the build pass without considering runtime behaviour.

Making the route dynamic may simply move the same Prisma failure from:

```text
build time
```

to:

```text
first visitor request
```

which does not satisfy the fallback requirement.

Explain whether dynamic rendering is useful here or unrelated to the actual root fix.

---

# 10. DO NOT USE A FAKE DATABASE URL AS THE MAIN SOLUTION

I do not want a hack like:

```env
DATABASE_URL=postgresql://fake:fake@localhost:5432/fake
```

merely to satisfy Prisma schema validation.

That would likely turn:

```text
missing configuration
```

into:

```text
connection refused
```

later.

If Prisma tooling requires a URL for some build operation, explain that separately.

But application runtime/build behaviour should have a real fallback architecture.

---

# 11. CHECK VERCEL / DEPLOYMENT BEHAVIOUR

If this application is deployed on Vercel or another platform, distinguish:

```text
Build Environment Variables
Preview Environment Variables
Production Environment Variables
Development Environment Variables
```

Do not assume a locally available `.env` automatically exists during cloud builds.

Explain what environment variables are genuinely required.

The desired design is still:

```text
DATABASE_URL missing intentionally
→ build succeeds with fallback
```

where the application supports that mode.

---

# 12. PRISMA GENERATE VS DATABASE QUERY

Clarify the lifecycle.

For example:

```text
npm install
  ↓
postinstall
  ↓
prisma generate
```

versus:

```text
next build
  ↓
server component prerender
  ↓
Prisma query
```

Determine exactly which phase is failing.

The error stack strongly suggests a query during prerender, but verify it.

---

# 13. LOGGING

When DB configuration is intentionally missing, produce a useful but non-noisy server-side signal.

For example:

```text
[database] DATABASE_URL is not configured; provider queries are using fallback data.
```

Avoid logging the actual database connection string.

Avoid repeating the same warning hundreds of times.

Consider whether a dev/build-only warning or once-per-process warning is appropriate.

---

# 14. FALLBACK UX FOR `/compare`

If there is no database, `/compare` should not render a broken application.

Inspect its current UI.

Recommend an appropriate fallback such as:

```text
Compare trading platforms

Provider data is not currently available.
```

or perhaps simply the existing empty-result UI.

Do not lie by saying:

```text
There are no providers
```

if the actual situation is:

```text
provider database is unavailable/not configured
```

Determine whether users need to see a technical availability message or whether a neutral fallback is preferable.

Keep production UX professional.

---

# 15. SEO CONSIDERATION

Think about how DB-less fallback pages interact with SEO.

If `/compare` normally contains rich comparison/provider content but build output contains an empty fallback, make sure we are not unintentionally generating a permanently cached empty SEO page.

Study whether:

```text
metadata
sitemap
static generation
cache
```

could freeze fallback content.

Explain your recommendation.

---

# 16. SITEMAP

Audit sitemap generation carefully.

A very common related failure is:

```text
sitemap.ts
→ Prisma query
→ DATABASE_URL missing
→ build fails
```

If dynamic Article/Provider URLs require the database:

```text
DB configured
→ include them

DB not configured
→ safely omit those dynamic entries
```

while retaining static URLs.

Do not let sitemap generation crash the deployment.

---

# 17. METADATA

Audit:

```text
generateMetadata()
```

functions.

A metadata function should not unexpectedly make the build fail because the DB is intentionally unavailable.

Reuse the same domain fallback policy.

Do not duplicate DB calls unnecessarily between:

```text
page()
generateMetadata()
```

where an existing architecture can avoid it.

---

# 18. STATIC FALLBACK DATA

Check whether the project already contains:

```text
seed/static provider data
fallback provider definitions
fixtures
```

If reliable static provider data already exists and is designed for production fallback, consider whether it should be reused.

But do NOT silently duplicate database data into a second source of truth merely to avoid this error.

Prefer:

```text
empty/degraded mode
```

unless the project already has an intentional static fallback architecture.

---

# 19. DATABASE MODE CONCEPT

Evaluate whether the project benefits from a clearly documented concept like:

```text
Database mode:
ENABLED
DISABLED
```

This does NOT necessarily require a new environment variable.

It may simply be derived from:

```text
DATABASE_URL
```

But if an explicit configuration flag would avoid ambiguity, explain the tradeoff.

Do not add configuration complexity without justification.

---

# 20. IMPORTANT FAILURE SEMANTICS

I want this distinction:

```text
DATABASE_URL absent
```

Expected optional mode:

```text
graceful fallback
```

But:

```text
DATABASE_URL present
Prisma cannot connect
```

should NOT silently become:

```text
[]
```

because that hides an operational outage.

Possible desired behavior:

```ts
if (!isDatabaseConfigured()) {
  return EMPTY_PROVIDER_PAGE;
}

return repository.paginate(...);
```

Then a real DB failure still throws.

This pattern is only illustrative.

Choose the best implementation after inspecting the repository.

---

# 21. TYPES

If returning empty paginated responses, preserve the exact existing types.

Do not weaken:

```text
PaginatedResult<T>
```

into:

```text
any
```

or introduce nullable chaos.

Create reusable helpers if useful, for example conceptually:

```ts
emptyPaginatedResult<T>(page, pageSize)
```

but only if multiple domains genuinely need it.

---

# 22. OTHER DB-DEPENDENT SERVICES

Search for patterns such as:

```ts
await prisma.
repository.paginate(
findMany(
findUnique(
count(
```

especially inside Server Components that may execute during build.

Classify each into:

```text
must-have DB
optional public DB content
admin-only
runtime-only
build-time
```

I want a list of other routes likely to fail next after `/compare` is fixed.

---

# 23. ADMIN/AUTH BEHAVIOUR WITHOUT DB

Do not necessarily try to make every feature function without a DB.

For example:

```text
admin CMS
login
article creation
publishing
```

may legitimately require the database.

The goal is NOT:

> every feature works without PostgreSQL.

The goal is:

> database-dependent optional public content should not make the entire application build/deployment fail when the database is intentionally absent.

Clearly define the supported degraded mode.

---

# 24. TESTS

Add/update tests where practical.

At minimum verify:

### No DATABASE_URL

```text
provider listing service returns fallback
pagination shape is valid
no Prisma query is attempted
```

### DATABASE_URL present

```text
normal repository path executes
```

### DATABASE_URL present but database errors

```text
error is NOT silently converted into empty data
```

### `/compare`

```text
renders valid empty/degraded state
does not throw
```

Also consider:

```text
sitemap
metadata
other statically evaluated routes
```

if affected.

---

# 25. VALIDATE THE BUILD

After the fix, run the actual available commands.

Inspect `package.json` first.

At minimum where supported:

```bash
npx prisma validate
npx prisma generate
npm test
npm run build
```

Most importantly, test:

```text
DATABASE_URL absent
```

and confirm:

```bash
npm run build
```

succeeds.

Then, if possible, test again with a valid database configuration to make sure the normal path was not broken.

Do not claim this is fixed unless the DB-less build actually succeeds.

---

# 26. ROOT-CAUSE REPORT

Before or alongside implementation, give me a concise report:

## A. Exact root cause

Example structure:

```text
/compare is statically rendered during next build
→ getProviders invokes repository.paginate
→ paginate calls Prisma
→ Prisma reads datasource
→ DATABASE_URL is absent
→ Prisma validation fails
→ prerender throws
→ Next build aborts
```

But use the actual discovered chain.

## B. Why the current architecture allowed it

Explain where graceful degradation was missing.

## C. Why your fix belongs at the chosen layer

Explain why you chose:

```text
page
service
repository
database configuration layer
```

or combination.

## D. Other routes affected

List them.

## E. Behaviour after fix

Explicitly document:

```text
DB absent
DB configured and healthy
DB configured but unhealthy
```

---

# 27. DO NOT DO THESE THINGS

Do not:

- catch every Prisma exception and return `[]`;
- hide real production DB outages;
- use `any`;
- hard-code a fake PostgreSQL connection string;
- remove the database from the project;
- duplicate provider data into arbitrary constants;
- add `force-dynamic` and declare the issue solved;
- patch only `/compare` without auditing other build-time queries;
- expose database credentials in logs;
- weaken existing repository typing;
- reset the database;
- use `prisma db push` to solve this;
- remove Prisma validation;
- ignore sitemap or metadata database access;
- treat a missing DB and a broken configured DB as equivalent.

---

# 28. PREFERRED DESIGN PRINCIPLE

I want the architecture to make this distinction clear:

```text
NO DATABASE CONFIGURED
        ↓
known degraded application mode
        ↓
safe domain-specific fallback
        ↓
build continues
```

versus:

```text
DATABASE CONFIGURED
        ↓
query attempted
        ↓
unexpected DB failure
        ↓
real error remains visible
```

That distinction is very important.

---

# 29. FINAL RESULT

Implement the smallest coherent fix that:

1. proves the actual root cause;
2. allows `npm run build` when `DATABASE_URL` is intentionally absent;
3. prevents `/compare` from crashing;
4. audits and fixes equivalent public build-time failure paths;
5. preserves normal database-backed behaviour;
6. does not hide real database failures;
7. keeps repository/service typing intact;
8. provides professional fallback UI;
9. considers sitemap, metadata and caching;
10. leaves the project buildable and tested.

After implementation, report:

```text
root cause
architecture decision
files changed
other vulnerable routes discovered
tests added/updated
commands executed
build result without DATABASE_URL
build result with DATABASE_URL if tested
remaining limitations
```