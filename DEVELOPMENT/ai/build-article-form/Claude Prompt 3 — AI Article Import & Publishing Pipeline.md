# ROLE

Act as a Senior Next.js Engineer, CMS Architect, Prisma/PostgreSQL Engineer, Content Operations Engineer, Technical SEO Engineer, Admin UX Designer, and application security engineer.

I want to make publishing AI-assisted crypto guides **extremely fast without sacrificing editorial quality, SEO integrity, security or data structure**.

Build an efficient Article Publishing Pipeline into my existing Admin system.

Current Admin architecture should remain approximately:

```text
Dashboard
Articles
Affiliates
Media
Settings
```

Guide/content publishing belongs under:

```text
Admin → Articles
```

Do not create a separate disconnected CMS unless clearly justified.

---

# PRIMARY OBJECTIVE

I want this workflow:

```text
Research topic
    ↓
Generate article with Claude/AI
    ↓
Export structured article
    ↓
Import into Admin
    ↓
Automatic validation/parsing
    ↓
SEO + source + relationship checks
    ↓
Preview
    ↓
Human review
    ↓
Publish
    ↓
Revalidate page + sitemap
```

I want importing an article to take minutes rather than manually rebuilding it inside the CMS.

---

# 1. AUDIT FIRST

Inspect:

```text
Prisma Article model
Admin Articles pages
article editor
article renderer
SEO fields
Provider relationships
Affiliate relationships
categories
tags
media
authentication
Role.ADMIN
Server Actions
Route Handlers
existing upload support
```

Reuse what already exists.

STOP after audit before implementation.

---

# 2. DEFINE A STRUCTURED ARTICLE FORMAT

Create a strict portable format for AI-generated articles.

Preferred options:

```text
Markdown + YAML frontmatter
```

or

```text
MDX + frontmatter
```

or a structured JSON import format.

Evaluate the existing project first.

For MVP I prefer the simplest secure and maintainable approach.

Example conceptual frontmatter:

```yaml
title: "How to Trade Crypto: Beginner Guide"
slug: "how-to-trade-crypto"
excerpt: "..."
category: "Crypto Trading"

status: "DRAFT"

region:
  type: "GLOBAL"
  countries: []

seo:
  title: "How to Trade Crypto: Beginner Guide | Brand"
  description: "..."
  index: true

authors:
  - "..."

tags:
  - crypto-trading
  - beginners

relatedGuides:
  - crypto-trading-fees
  - market-vs-limit-orders

relatedProviders:
  - kraken
  - binance

sources:
  - label: "..."
    url: "..."

affiliatePlacements:
  - providerSlug: "kraken"
    placement: "ARTICLE_FOOTER"
```

This is conceptual.

Adapt it to the existing schema.

---

# 3. CREATE A SINGLE AI ARTICLE CONTRACT

Create documentation such as:

```text
docs/article-import-format.md
```

Claude and other AI tools should generate articles according to exactly this contract.

This contract should define:

```text
required fields
optional fields
allowed status
allowed category
valid slug
region format
SEO fields
sources
related articles
related providers
affiliate placement suggestions
content syntax
supported blocks
```

This prevents malformed AI output.

---

# 4. DO NOT LET AI PUBLISH DIRECTLY

Initial AI imports must always become:

```text
DRAFT
```

even if the imported document claims:

```text
PUBLISHED
```

Publishing must require an authenticated ADMIN action.

This is mandatory.

---

# 5. ADMIN IMPORT EXPERIENCE

Add:

```text
/admin/articles/import
```

or an equivalent flow inside Articles.

Support:

```text
paste Markdown
upload .md
upload .mdx if supported
upload .txt where useful
paste structured JSON if useful
```

Do not add file formats that cannot be handled reliably.

---

# 6. IMPORT FLOW

User:

```text
Upload / paste
```

Server:

```text
validate authentication
validate ADMIN
validate file size
validate extension
validate content
parse frontmatter
sanitize content
validate schema
resolve relationships
create DRAFT
```

Then redirect to:

```text
/admin/articles/[id]
```

for review.

---

# 7. VALIDATION WITH ZOD

Use an explicit validation schema.

Example conceptual checks:

```text
title required
slug valid
content required
category valid
URLs valid
provider slugs valid
related guide slugs valid
country codes valid
SEO title reasonable
meta description reasonable
source URLs valid
```

Validation should produce useful Admin errors.

Do not silently ignore malformed fields.

---

# 8. RELATIONSHIP RESOLUTION

If imported frontmatter contains:

```yaml
relatedProviders:
  - kraken
  - binance
```

resolve those slugs to actual Provider records.

If a provider does not exist:

```text
show warning
do not fabricate Provider
```

Similarly:

```yaml
relatedGuides:
  - market-vs-limit-orders
```

must resolve to actual Articles.

Missing relationships should be warnings or errors depending on importance.

---

# 9. AFFILIATE PLACEMENT RESOLUTION

AI may SUGGEST:

```yaml
affiliatePlacements:
  - providerSlug: "kraken"
    placement: "ARTICLE_FOOTER"
```

but AI must never supply the final external affiliate URL.

The server must resolve:

```text
Provider
    ↓
active AffiliatePartnership
    ↓
active AffiliateProgram
    ↓
active AffiliateLink
```

If unavailable:

```text
do not create affiliate placement
```

or mark the suggestion unresolved for Admin review.

This ensures AI cannot inject arbitrary affiliate destinations.

---

# 10. SOURCE VALIDATION

Import sources as structured data.

For example:

```yaml
sources:
  - label: "Kraken fee schedule"
    url: "..."
    sourceType: "OFFICIAL_PROVIDER"
```

Validate URL syntax.

Optionally detect duplicates.

Do not automatically claim the source proves a statement.

Admin review remains necessary.

---

# 11. ARTICLE PREVIEW

Preview must use the exact same renderer as the public Guide page.

Do NOT maintain two separate content renderers.

The preview should show:

```text
article
TOC
sources
related guides
provider cards
affiliate placements
metadata preview
```

but remain:

```text
noindex
private/admin
```

---

# 12. SEO PREVIEW

Admin should preview:

```text
SEO title
meta description
canonical
slug
Open Graph
indexation
```

Add SEO-readiness warnings, for example:

```text
✓ title
✓ description
✓ canonical
✓ H1
✓ article schema data
✓ sources
✓ related guide

⚠ no featured image
⚠ provider reference unresolved
```

Do not call it “Google rank score.”

---

# 13. CONTENT QUALITY CHECK

Before publication run deterministic checks such as:

```text
title exists
content substantial
H1/H2 structure valid
no duplicate slug
no broken internal relationship
no invalid source URL
no draft links
canonical valid
featured image alt
author exists
date exists
```

Also allow editorial warnings:

```text
no sources
no related content
very short article
possible duplicate topic
```

Do not automatically block publishing merely because an arbitrary word-count target is not met.

---

# 14. DUPLICATE / CANNIBALIZATION WARNING

Before creating a new Article, compare:

```text
slug
title
topic
related tags
```

against existing published/draft articles.

If possible, add a simple similarity check.

Warn:

```text
Possible existing article:
"Crypto Trading for Beginners"
```

Do not silently create duplicate SEO pages.

---

# 15. ARTICLE BATCH IMPORT

After single-import workflow is reliable, support batch import.

Example:

```text
.zip containing .md files
```

or multiple-file selection.

Flow:

```text
20 files
 ↓
validate individually
 ↓
show import report
 ↓
18 valid
2 errors
 ↓
create valid entries as DRAFT
```

Never bulk publish automatically.

---

# 16. IMPORT REPORT

Show:

```text
Imported
Warnings
Failed
Duplicate
Unresolved relationships
Missing providers
Invalid URLs
```

Example:

```text
20 received
17 imported
2 possible duplicates
1 invalid
5 unresolved provider references
```

---

# 17. BULK EDITING

Admin Articles dashboard should eventually support:

```text
bulk category
bulk tag
bulk reviewer
bulk review status
bulk archive
```

Be cautious with bulk publish.

Require explicit review/confirmation.

---

# 18. PUBLISH FLOW

Publishing should:

```text
authenticate
authorize ADMIN
validate
save
set publishedAt when appropriate
update meaningful updatedAt
revalidate article
revalidate guide hub
revalidate categories
revalidate related pages if necessary
refresh sitemap where architecture requires
```

Do not trigger a full-site rebuild unnecessarily.

---

# 19. CONTENT STATUS

Use the existing status enum if available.

Conceptually:

```text
DRAFT
REVIEW
SCHEDULED
PUBLISHED
ARCHIVED
```

AI import:

```text
always → DRAFT
```

Recommended workflow:

```text
DRAFT
  ↓
REVIEW
  ↓
PUBLISHED
```

---

# 20. REGIONAL VARIANT MANAGEMENT

Admin should make it obvious whether an article is:

```text
GLOBAL
AU
UK
US
NZ
SG
```

or linked to a parent/global article.

Do not make editors duplicate an entire article merely to change metadata.

If genuine regional variants are needed, make their relationship explicit.

Example:

```text
Global:
How to Choose a Crypto Exchange

AU variant:
How to Choose a Crypto Exchange in Australia
```

The AU variant should contain genuinely Australian information.

---

# 21. HREFLANG / CANONICAL INTEGRATION

Publishing regional variants should automatically feed the SEO engine.

Conceptually:

```text
Article regional relationships
       ↓
SEO service
       ↓
canonical
hreflang
x-default
sitemap
```

Do not allow editors to manually create contradictory hreflang relationships without validation.

---

# 22. AI PROMPT EXPORT

In Admin, consider adding:

```text
Copy Article Generation Prompt
```

The generated prompt can automatically include:

```text
site editorial rules
article import schema
topic
target region
related provider slugs
related guide slugs
available categories
source requirements
```

This lets me copy one prompt into Claude and receive a correctly structured import document.

Do NOT implement external AI APIs initially unless explicitly requested.

---

# 23. FUTURE AI API ARCHITECTURE

Design the service boundaries so later we could support:

```text
Admin topic
    ↓
AI API
    ↓
draft generation
    ↓
DRAFT article
```

but do not implement automated bulk generation or publishing now.

Keep AI provider integration separate from Article domain logic.

---

# 24. SECURITY

Treat imported AI content as untrusted input.

Protect against:

```text
raw script tags
malicious HTML
unsafe embeds
javascript URLs
unexpected iframe
unsafe MDX execution
path manipulation
open redirects
huge files
```

If using MDX, carefully evaluate security implications.

Plain Markdown may be safer for the MVP.

---

# 25. RECOMMENDED FILE ARCHITECTURE

Evaluate something similar to:

```text
src/lib/articles/
    import.ts
    validation.ts
    parser.ts
    repository.ts
    relationships.ts
    publishing.ts

src/lib/seo/
    ...

src/app/admin/articles/import/
    page.tsx
    actions.ts
```

Follow existing project conventions.

---

# 26. CLI IMPORT — OPTIONAL

Because I am a developer, also evaluate a local workflow:

```bash
npm run article:import ./content/article.md
```

This can be useful for development.

But it must use the same:

```text
parser
validation
Article service
```

as Admin import.

Do not create two separate publishing implementations.

---

# 27. ARTICLE FILES FOR VERSION CONTROL — EVALUATE

Evaluate whether:

```text
content/*.md
```

should be the canonical source,

OR whether:

```text
PostgreSQL Article
```

should be canonical.

Given the current Admin CMS architecture, I likely want PostgreSQL as the source of truth.

Recommend the best approach based on the existing project.

Avoid maintaining competing sources of truth.

---

# 28. FIRST RESPONSE

Do NOT code.

Return:

## A. Existing Article Architecture

## B. Current Admin Workflow

## C. Recommended AI Import Format

## D. Example Article File

## E. Validation Schema

## F. Relationship Resolution Strategy

## G. Affiliate Placement Resolution

## H. Regional Variant Architecture

## I. SEO Integration

## J. Security Risks

## K. Batch Import Strategy

## L. Database Changes

## M. Exact File Plan

## N. Implementation Phases

Then STOP.

Wait for:

```text
IMPLEMENT ARTICLE PIPELINE PHASE 1
```

---

# FINAL OBJECTIVE

Make this workflow possible:

```text
Claude generates article.md
        ↓
I upload article.md
        ↓
Admin validates everything
        ↓
Article appears as DRAFT
        ↓
I review it
        ↓
Publish
        ↓
SEO metadata generated
        ↓
Related guides generated/resolved
        ↓
Relevant providers displayed
        ↓
Active affiliate links resolved safely
        ↓
Google can discover a high-quality page
```

The system should optimize for **speed of editorial operations without turning the website into an uncontrolled AI publishing system**.