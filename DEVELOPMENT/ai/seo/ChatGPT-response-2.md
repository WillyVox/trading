# Your next phase is a good architectural move

What you're describing now is no longer merely an Article CRUD feature.

You're moving toward a proper editorial workflow system:

EDITOR/MODERATOR
      │
      │ creates
      ▼
    DRAFT
      │
      │ submit
      ▼
 UNDER REVIEW
      │
      │ ADMIN reviews
      │
      ├──────────────► ARCHIVED
      │
      ▼
  PUBLISHED
      │
      │ scheduledAt reached
      ▼
PUBLICLY VISIBLE

There are several design decisions I recommend making carefully before Claude writes any code.

1. I would reconsider the name MODERATE

The enum should not be:

MODERATE

because that is a verb.

If you want that product concept, use:

enum Role {
  USER
  MODERATOR
  ADMIN
}

However, given what this user actually does, I think EDITOR is semantically better.

They:

create articles;
edit their articles;
prepare content;
submit articles for review.

They do not really "moderate" content.

So I would lean toward:

enum Role {
  USER
  EDITOR
  ADMIN
}

Then:

USER
ordinary visitor/account

EDITOR
content creator

ADMIN
reviewer/publisher/site administrator

But this is a naming choice Claude should evaluate rather than changing blindly.

2. author and reviewer can no longer just be text fields

This becomes one of the most important database changes.

Currently you have:

author   String?
reviewer String?

That's fine when they're display labels.

But your new requirement says:

Moderator sees their own articles.

and:

Admin sees articles assigned to them as reviewer.

You cannot reliably implement those requirements with:

author = "Huy Vo"

because that's not an identity.

You need real relations.

Conceptually:

model Article {
  ...

  authorUserId   String?
  reviewerUserId String?

  authorUser User? @relation(...)
  reviewerUser User? @relation(...)
}

Then you can query:

where: {
  authorUserId: session.user.id
}

for "My articles".

And:

where: {
  reviewerUserId: session.user.id,
  status: "REVIEW"
}

for:

Assigned to me for review.

I would probably retain your existing:

author
reviewer

strings temporarily for backwards compatibility and external authors rather than deleting them immediately.

3. Define permissions centrally

Do not put permission logic only in buttons.

For example, hiding the Publish button from an Editor does not secure:

publishArticle()

The server action itself must refuse the request.

I would introduce a central policy layer conceptually like:

canCreateArticle(user)
canEditArticle(user, article)
canSubmitForReview(user, article)
canPublishArticle(user, article)
canArchiveArticle(user, article)
canPreviewArticle(user, article)
canAssignReviewer(user, article)

Then both UI and server actions consume the same business rules.

For example:

EDITOR
Create own article           YES
Edit own DRAFT               YES
Preview own articles         YES
Submit own DRAFT             YES
Publish                      NO
Archive REVIEW               NO
Publish REVIEW               NO
Edit another editor's work   NO

I would probably allow:

Archive own DRAFT            YES

and optionally:

Withdraw REVIEW → DRAFT      YES

if nobody has published it yet.

ADMIN
Create                       YES
Edit                         YES
Review                       YES
Assign reviewer              YES
Return to draft              YES
Publish                      YES
Archive                      YES
Restore                      YES
See all articles             YES

This deserves an explicit permission matrix before implementation.

4. Your scheduled publication requirement is better than using a cron job

Your new requirement is:

Article is public only if:

status = PUBLISHED
AND
current time >= scheduled time

I like this approach.

You don't actually need a job that changes:

REVIEW → PUBLISHED

at the scheduled time.

Instead, Admin can approve it:

status = PUBLISHED
scheduledAt = tomorrow 09:00

But the public visibility predicate becomes:

status === "PUBLISHED" &&
(
  scheduledAt === null ||
  scheduledAt <= now
)

Before 9 AM:

PUBLISHED
but not publicly visible

After 9 AM:

PUBLISHED
and publicly visible

This avoids requiring cron infrastructure.

But this rule must be centralized

It cannot only be applied to:

/news/[slug]

because otherwise the article could leak through:

/news
/crypto/guides
sitemap
related guides
exchange pages
comparison pages
search

before its scheduled time.

I strongly recommend something conceptually like:

buildPublicArticleWhere(now)

that always generates:

{
  status: "PUBLISHED",
  OR: [
    { scheduledAt: null },
    { scheduledAt: { lte: now } }
  ]
}

and every public Article query uses it.

This should be one of Claude's highest-priority design concerns.

5. Scheduled publishing has a caching concern too

Even with the correct database condition, consider this:

scheduledAt = 9:00 AM

A page is requested at:

8:59 AM

and Next.js caches the result.

At:

9:01 AM

the database condition is now true—but if Next serves an old cached result, the article might still appear unavailable.

Therefore Claude should inspect your actual Next.js 16 caching strategy and ensure time-based visibility can change without requiring someone to edit the article.

I would specifically ask Claude to investigate this rather than assuming database filtering alone solves it.

6. Don't add SCHEDULED to ArticleStatus yet

Given your exact rule, I don't think you need:

SCHEDULED

as another database status.

Keep:

DRAFT
REVIEW
PUBLISHED
ARCHIVED

Then derive a display state:

PUBLISHED + scheduledAt > now
= Scheduled

PUBLISHED + scheduledAt <= now
= Live

So your Admin table might show:

Status        Publication
PUBLISHED     Scheduled for 14 Sep 2026, 09:00

rather than creating another complicated state transition.

7. Article views: start simple

For your immediate requirement, I would add:

viewCount Int @default(0)

to Article.

But do not increment it inside generateMetadata() or arbitrary Article database lookups.

Those functions may run independently of an actual human reading the page.

I would introduce one controlled view-tracking path.

For example:

Visitor opens article
       ↓
Article successfully renders
       ↓
small client ViewTracker executes
       ↓
POST /api/articles/[id]/view
       ↓
server validates article is publicly visible
       ↓
Article.update({
  viewCount: { increment: 1 }
})

This has a few advantages.

Admin Preview doesn't increment views.

Metadata generation doesn't increment views.

404 attempts don't increment views.

Draft articles can't get public views.

Database increments are atomic.

Later, if you need real analytics like:

unique visitors
traffic sources
daily views
conversion rates

then introduce a dedicated analytics/event model.

I would not build a large ArticleView table right now just to show "1,482 views".

8. Public pages should display both author and views

For example:

Written by Huy Vo
Updated 11 Sep 2026
1,428 views

GuideHeader already displays author-related information, so extend that existing component.

News currently does not display this information even though metadata receives article.author.

That should be normalized across the public Article templates.

9. Moderator/Editor dashboard structure

I would not literally put four enormous tables one underneath another.

For usability and performance, I'd make them four tabs/sections:

My Articles

[ Draft 12 ]
[ Under Review 4 ]
[ Published 28 ]
[ Archived 3 ]

Selecting one tab gives a paginated table.

That still fulfills your "four sections" requirement but avoids querying/rendering four 20-row tables simultaneously.

Use URL state such as:

/editor/articles?status=DRAFT&page=2

That gives refreshable/shareable navigation.

10. Admin dashboard

Admins could have the same "My Articles" interface plus:

Assigned to me
All articles

Conceptually:

Admin Articles

MY ARTICLES
Draft | Under Review | Published | Archived

REVIEW
Assigned to me

ADMINISTRATION
All articles

Assigned to me should probably primarily show:

reviewerUserId = currentUser.id
status = REVIEW

while All Articles supports broader filters:

status
author
reviewer
type
category
search
scheduled/live

This gives you a genuinely useful editorial queue.

11. Every table should share one table component

Don't build:

DraftTable
ReviewTable
PublishedTable
ArchivedTable
AssignedTable
AllArticlesTable

as six almost-identical implementations.

I'd prefer something like:

<ArticleManagementTable
  scope="mine"
  status="DRAFT"
  ...
/>

or a reusable server-side query + display component.

Columns can vary by context.

Common:

Title
Type
Status
Author
Updated

Published adds:

Published
Views

Review adds:

Reviewer
Submitted

And the final column becomes:

Actions
12. Action column should come from permissions, not status alone

This is subtle but important.

You said:

depends on status, last column should display available action if eligible for logged user.

Exactly.

Eligibility depends on:

role
+
ownership
+
review assignment
+
status

not only status.

Example:

DRAFT

For its Editor:

Edit
Preview
Submit for review
Archive

For another Editor:

nothing

For Admin:

Edit
Preview
Archive

For:

REVIEW

Author:

Preview
possibly Withdraw

Assigned Admin:

Preview
Edit
Return to draft
Publish
Archive

That logic belongs in your authorization policy, with the table merely rendering permitted actions.

13. Pagination should be server-side

You already have the right low-level utility.

Your repository supports:

page
pageSize
total
pageCount

So reuse it.

Do not fetch every Article then paginate in React.

For Editor:

where: {
  authorUserId: user.id,
  status: ...
}

For assigned review:

where: {
  reviewerUserId: user.id,
  status: "REVIEW"
}

For all:

where: dynamicFilters

Then apply:

skip
take

at the database layer.

Claude prompt I recommend

This time I recommend not asking Claude to implement immediately. The role/ownership/reviewer/scheduling/view architecture affects authentication, authorization, public queries, database schema, dashboards, caching and analytics.

Have Claude audit and design it first.

ROLE

Act as a Senior Staff Software Engineer, Next.js 16 architect, Prisma/PostgreSQL architect, authentication/authorization specialist, CMS/editorial-workflow architect, security reviewer, and product engineer.

You are working inside my existing Australian trading/crypto platform.

This is NOT a greenfield project.

The project already has a functioning Article CMS and Article domain.

For this task I do NOT want you to immediately start coding.

First deeply inspect the current implementation, understand what has already been built, identify issues/risks, challenge my requirements where appropriate, propose better approaches where useful, and produce a detailed implementation roadmap and technical design.

Do not modify files yet.

1. CURRENT IMPLEMENTATION TO AUDIT

Before making recommendations, inspect at minimum:

prisma/schema.prisma
prisma/migrations/

src/lib/auth/
src/lib/articles/
src/lib/repository.ts

src/app/admin/
src/app/admin/articles/

src/components/admin/article/

src/app/news/
src/app/crypto/guides/

src/components/guide/

src/proxy.ts

docs/ROADMAP.md
docs/IMPLEMENTATION-PLAN.md
docs/Article-CMS-Roadmap-Implementation-Plan.md

package.json

Also inspect any other files involved in:

NextAuth session roles
Article queries
public Article visibility
sitemap
related articles
provider/exchange article sections
comparison page article sections
article caching/revalidation

Do not infer architecture from filenames alone.

Read the actual implementation.

2. FIRST AUDIT WHETHER ARTICLE CMS BLOCK 2 IS ACTUALLY COMPLETE

The project has recently implemented the Article admin form.

Verify the real implementation rather than assuming it works.

Specifically audit:

createArticle
updateArticle
preview
submitArticleForReview
moveArticleBackToDraft
publishArticle
unpublishArticle
archiveArticle
restoreArticleFromArchive

Verify:

authorization
validation
HTML sanitization
transactions
relationship syncing
slug uniqueness
status-transition protection
publishedAt behaviour
cache revalidation
public-route protection
preview protection

Also inspect /admin/articles.

Check whether it really fulfills the previous Block 2 requirements for:

pagination
filters
search
management columns
row-level actions
status-specific actions

Report every missing or partially implemented item.

3. IMPORTANT MIGRATION AUDIT

Pay particular attention to the Article-domain migrations.

I have noticed that a migration appears to add required:

articleType
updatedAt

columns to Article without a nullable/backfill stage.

Its generated warning indicates this may fail when Article already contains rows.

At the same time, project documentation appears to describe a safer:

nullable
→ backfill
→ NOT NULL

migration strategy.

Audit the actual migration history and current database schema assumptions.

Tell me:

whether migrations are safe for a populated database;
whether schema comments reference migrations that do not exist;
whether migration files and documentation disagree;
exactly how you recommend repairing this safely before further schema changes.

Do not use prisma db push as the solution.

Do not reset or destroy existing data.

4. NEW PRODUCT REQUIREMENT

We now want to introduce a second content-management role below ADMIN.

The working name is currently:

MODERATOR

but I am open to a better role name such as:

EDITOR
AUTHOR
CONTENT_EDITOR

Evaluate the naming based on what the user actually does.

This role will primarily:

create articles;
edit their own draft articles;
preview their articles;
submit articles for review;
see the progress/status of their own articles.

They will NOT be allowed to independently publish content.

ADMIN remains the final reviewer/publisher.

5. PROPOSE A CLEAR ROLE MODEL

The current roles appear to be:

USER
ADMIN

We need something conceptually like:

USER
EDITOR/MODERATOR
ADMIN

Before proposing implementation, define exactly what each role means.

I want a permission matrix covering at least:

create article
edit own draft
edit own review article
edit own published article
edit another user's article
preview own article
preview any article

submit for review
withdraw from review
return to draft

assign reviewer
change reviewer

publish
unpublish
archive
restore

view own article dashboard
view assigned-review articles
view all database articles

Do not rely on UI hiding for security.

Every server action/mutation must enforce its own authorization.

6. CENTRALIZE AUTHORIZATION

Investigate whether we should introduce a reusable Article authorization/policy layer.

For example, conceptually:

canCreateArticle(...)
canEditArticle(...)
canPreviewArticle(...)
canSubmitForReview(...)
canPublishArticle(...)
canArchiveArticle(...)
canAssignReviewer(...)

The exact API is up to you.

The key requirement is:

Server-side business permissions must have one coherent source of truth.

Do not duplicate slightly different permission rules in:

dashboard UI
article editor
server actions
API routes
preview routes

Explain the recommended design.

7. ARTICLE OWNERSHIP

This is a major requirement.

Editors/Moderators need to see:

their own articles

Therefore a free-text field such as:

author String?

is not sufficient for authorization or ownership.

Study the current User and Article models and propose a proper relation.

For example, evaluate something conceptually like:

authorUserId String?
authorUser   User? @relation(...)

Do not blindly implement this exact schema.

Determine the best relation names and migration strategy.

8. REVIEWER ASSIGNMENT

Admins need a dashboard section containing:

Articles assigned to me as Reviewer

The current:

reviewer String?

cannot safely represent user assignment.

Evaluate adding something conceptually like:

reviewerUserId String?
reviewerUser   User? @relation(...)

Questions to answer:

Who can assign a reviewer?
Can only ADMIN users be reviewers?
Can an article enter REVIEW without a reviewer?
Should submitting an article auto-assign a reviewer?
Should it enter an unassigned review queue?
Can reviewer assignment change?
Should reassignment be audited later?
What should happen if the reviewer account is removed?

Keep the first implementation practical.

Do not build an enterprise workflow engine.

9. BACKWARD COMPATIBILITY FOR author / reviewer

Do not automatically delete:

author
reviewer

without investigating existing data/imports/public rendering.

They may still be useful for:

legacy articles
external contributors
display bylines
imported content

Evaluate whether we should temporarily support both:

authorUserId
author

reviewerUserId
reviewer

with a clear source-of-truth/fallback strategy.

For example:

authorUser.name
fallback author string

Explain your recommendation.

10. REQUIRED STATUS WORKFLOW

The core status enum should probably remain:

DRAFT
REVIEW
PUBLISHED
ARCHIVED

Do not add another state merely because a UI label would be convenient.

Design allowed transitions separately for EDITOR/MODERATOR and ADMIN.

A likely workflow is:

EDITOR

create
  ↓
DRAFT
  ↓
submit
  ↓
REVIEW

Then:

ADMIN

REVIEW
  ├── return to DRAFT
  ├── ARCHIVE
  └── PUBLISH

But review the product requirements and recommend any important missing transition.

For example, evaluate whether an author should be allowed to:

REVIEW → DRAFT

to withdraw a submission.

Do not introduce unnecessary transitions.

11. PUBLISHED ARTICLE VISIBILITY RULE

This requirement is critical.

An Article must be publicly accessible only when BOTH are true:

status == PUBLISHED

AND

scheduledAt is null
OR
currentTime >= scheduledAt

Meaning:

PUBLISHED + no scheduledAt
= visible immediately

PUBLISHED + scheduledAt in future
= approved but NOT publicly visible

PUBLISHED + scheduledAt in past
= publicly visible

I prefer this over adding a SCHEDULED ArticleStatus unless you find a compelling architectural reason otherwise.

Evaluate this carefully.

12. CENTRALIZE THE PUBLICATION PREDICATE

Do not fix scheduled visibility only in:

/news/[slug]
/crypto/guides/[slug]

That would be incomplete.

Audit every place where an Article becomes publicly discoverable.

Examples may include:

News listing
Guide listing
Article detail
sitemap
related guides
related news
exchange/provider pages
comparison pages
crypto asset pages
search
homepage sections
SEO structured data
internal recommendations

Design one reusable publication predicate/helper such as conceptually:

publicArticleWhere(now)

that guarantees:

PUBLISHED
+
scheduledAt <= now or null

Every public query should use the same rule.

No future-scheduled article may leak through another query.

13. NEXT.JS CACHING + SCHEDULED VISIBILITY

Study the actual Next.js 16 caching behaviour in this project.

This is important.

Imagine:

scheduledAt = 09:00

At:

08:59

the article correctly resolves as unavailable.

At:

09:01

the database condition is now true.

But if the route/list/query result is cached indefinitely, the article might remain invisible.

Determine how the current project caches:

article detail pages
article list pages
sitemap
related-content queries

Recommend the simplest reliable solution.

Possible solutions might involve:

dynamic request-time query
appropriate revalidation period
cache tags
scheduled invalidation mechanism

but do not blindly pick one.

Explain the tradeoffs.

14. DEFINE publishedAt VS scheduledAt

Clarify timestamp semantics.

We currently have:

publishedAt
scheduledAt
createdAt
updatedAt
lastReviewedAt

Define what each means.

In particular determine what publishedAt should mean when:

ADMIN presses Publish at 1 September

scheduledAt = 5 September

Possible interpretations:

publishedAt = approval time

or:

publishedAt = actual public-live time

Recommend one consistent semantic.

Make sure SEO:

datePublished

reflects the correct meaning.

15. PUBLIC ARTICLE AUTHOR

Public Article pages must clearly display the author.

Examples:

/news/[slug]
/crypto/guides/[slug]

Audit what currently happens.

Guide currently has a richer header than News.

Design a consistent approach so both content types show appropriate author information.

If authorUserId exists, display the user profile/display name.

Fallback to the legacy author string when appropriate.

Do not expose private User fields.

16. ARTICLE VIEW COUNT

We want public articles to display a view count such as:

1,428 views

The number should also appear in published-article management tables.

Study and recommend the simplest safe implementation.

At minimum evaluate adding:

viewCount Int @default(0)

to Article.

But do not increment viewCount from arbitrary data-fetch functions or metadata generation.

A page can be fetched multiple times internally by Next.js.

17. VIEW TRACKING DESIGN

Evaluate a flow similar to:

visitor successfully renders public article
          ↓
ViewTracker
          ↓
POST route/controlled server endpoint
          ↓
verify Article is publicly visible
          ↓
atomic DB increment

Determine whether this is appropriate for the current architecture.

Requirements:

Draft preview must NOT increment views.
Review preview must NOT increment views.
Archived articles must not increment views.
Future-scheduled Published articles must not increment views.
Metadata generation must not increment views.
Failed/404 requests must not increment views.
Increment must be atomic.
Never use viewCount = viewCount + 1 after separately reading it.
Avoid collecting unnecessary personal information.
Do not store raw IP addresses merely for this feature.

Discuss whether the initial metric should mean:

page views

or:

unique visitors

My initial preference is simple page views, not a full analytics system.

Do not over-engineer an ArticleView event warehouse unless there is a clear reason.

18. VIEW COUNT ABUSE / ACCURACY

Discuss limitations of simple view counting:

refreshes
bots
prefetching
multiple browser tabs
scripted requests

Recommend an appropriate MVP protection level for this project.

The displayed number does not need Google-Analytics-grade accuracy.

However it should not accidentally double-count because:

generateMetadata()
React server rendering
Next prefetch

causes multiple internal calls.

19. EDITOR/MODERATOR DASHBOARD

The Editor/Moderator needs a dashboard showing their own content.

I want four logical sections:

Draft
Under Review
Published
Archived

Evaluate whether the best UI is:

four separate full tables

or:

four tabs/status sections with counts + one paginated table

I currently prefer tabs because rendering four paginated tables simultaneously seems wasteful.

Propose the best UX.

Example:

My Articles

Draft (12)
Under Review (4)
Published (28)
Archived (3)
20. EDITOR/MODERATOR ARTICLE SCOPE

Every query must use real ownership.

Conceptually:

authorUserId = session.user.id

Do NOT use:

author text == session.user.name

for ownership.

An Editor must not be able to manipulate the URL or server action payload to edit another author's Article.

Audit every relevant read/write route.

21. ADMIN DASHBOARD

Admin should have everything the Editor/Moderator has for their own articles:

My Drafts
My Under Review
My Published
My Archived

plus two additional scopes:

Assigned to Me
All Articles
Assigned to Me

Primarily articles where:

reviewerUserId = current ADMIN user

Usually focused on:

status = REVIEW

but discuss whether other assigned statuses should remain visible for history.

All Articles

Admin can access all Article records.

Support useful filtering such as:

status
article type
author
reviewer
category
publication state
search

Do not load every article in the database.

22. PAGINATION

Every article-management table must use real server/database pagination.

Reuse the existing repository pagination architecture where appropriate.

Do not:

fetch 10,000 articles
then slice the array in React

Pagination needs:

page
pageSize
total
pageCount

Use URL query parameters so pagination survives reload/navigation.

Examples:

/editor/articles?status=DRAFT&page=2

/admin/articles?scope=assigned&page=3

/admin/articles?scope=all&status=PUBLISHED&page=2

Choose clean URL semantics.

23. COUNTS FOR TABS

If dashboard tabs display:

Draft (12)
Under Review (4)
Published (28)
Archived (3)

do not derive counts from only the currently paginated 20 rows.

Use proper DB counts.

Evaluate doing counts efficiently, potentially in parallel.

24. ARTICLE TABLE DESIGN

Propose a reusable Article management table instead of six duplicated tables.

Common columns may include:

Title
Type
Status
Author
Reviewer
Updated
Published/Scheduled
Views
Actions

But do not show irrelevant columns in every scope.

Examples:

Draft
Title
Type
Updated
Actions
Under Review
Title
Author
Reviewer
Submitted/Updated
Actions
Published
Title
Type
Published
Views
Actions
Archived
Title
Type
Archived/Updated
Actions

Determine whether an archivedAt timestamp is needed or whether updatedAt is sufficient.

Do not add fields without explaining their real use.

25. ROW ACTIONS

The final column of every table must show only actions the logged-in user is actually permitted to perform.

This depends on:

role
ownership
review assignment
article status

not just status.

Examples to evaluate:

Editor + own DRAFT
Edit
Preview
Submit for review
Archive
Editor + own REVIEW
Preview
possibly Withdraw to draft
Editor + own PUBLISHED
Preview/View live
Admin + REVIEW
Edit
Preview
Assign/reassign reviewer
Return to draft
Publish
Archive
Admin + PUBLISHED
View
Edit
Unpublish
Archive
ARCHIVED
Preview
Restore

These examples are suggestions, not requirements.

Produce the final permission/action matrix before coding.

26. ARTICLE REVIEW ASSIGNMENT UI

Propose where reviewer assignment should happen.

Possibilities:

Article editor
Review queue
Submit-for-review flow
Admin table row

I do not want reviewer assignment to feel cumbersome.

One possible workflow:

Editor submits article
        ↓
status = REVIEW
reviewerUserId = null
        ↓
Admin sees it in review queue
        ↓
Admin assigns themselves or another Admin

Evaluate whether this is better than requiring an assignment before submission.

27. REVIEWER UX

When an ADMIN opens an assigned REVIEW article, the UI should make the context obvious:

Submitted by
Assigned reviewer
Current status
Last updated
Preview
Return to author
Publish
Archive

Consider whether lightweight reviewer comments/notes are needed now.

My preference is NOT to build a full comments/revision system during this phase unless you identify a strong reason.

28. PUBLISHED TABLE + VIEWS

Published Article tables must contain:

Views

formatted readably:

0
327
1,428
25,713

Do not expose a raw analytics table just to show this number.

The Article management query should select only fields required by the table rather than loading:

content
sources
provider relations
crypto assets

for every row.

Performance matters.

29. PUBLIC ARTICLE UI

Published pages should display something conceptually like:

Written by Huy Vo
Published 11 Sep 2026
Last reviewed 11 Sep 2026
1,428 views

adapted appropriately for News vs Guide.

Reuse existing Guide components where practical.

Avoid duplicating formatting logic across News and Guide.

30. SECURITY

Explicitly audit the following threats:

Editor calls publishArticle directly
Editor edits another Editor's article by changing id
Editor assigns themselves as reviewer
Editor changes authorUserId in submitted FormData
Editor accesses admin-only preview
Editor accesses /admin
future-scheduled article leaks through sitemap
future-scheduled article leaks through related articles
view endpoint increments draft article
view endpoint can update arbitrary article IDs

Every one of these must be blocked server-side.

31. DON'T TRUST AUTHOR/REVIEWER IDS FROM THE FORM

For Editor-created Articles:

authorUserId

should normally come from the authenticated session, not from a hidden form input.

Likewise permissions should not trust fields like:

role=ADMIN
authorUserId=...

coming from the browser.

Explain which values are server-derived versus admin-selectable.

32. QUERY/API DESIGN

Propose a clean Article-management service API.

Something conceptually like:

getMyArticles(...)
getArticlesAssignedToReviewer(...)
getAllAdminArticles(...)
getArticleDashboardCounts(...)
getPublicArticleBySlugAndType(...)

is acceptable, but determine whether separate functions or one typed query service is cleaner.

Avoid an enormous function with dozens of optional booleans.

Avoid duplicating Prisma where clauses everywhere.

33. CENTRAL PUBLIC VISIBILITY HELPER

Strongly consider a reusable helper for:

status == PUBLISHED
AND
scheduledAt <= now or null

It should be difficult for a developer to accidentally write:

where: { status: "PUBLISHED" }

and expose scheduled content.

Explain how you will make safe behaviour the easiest/default behaviour.

34. INDEXES

Based on the actual proposed queries, evaluate database indexes.

Potential candidates may involve combinations around:

authorUserId
status

reviewerUserId
status

status
articleType
scheduledAt

publishedAt

Do not add indexes blindly.

For every index proposed, identify the query it accelerates.

35. MIGRATION PLAN

Because this project already has Articles and Users, provide a safe migration plan.

Potential additions may include:

new role enum value
authorUserId
reviewerUserId
viewCount
possibly other timestamps
indexes

Explain:

which changes are additive;
how existing articles are handled;
how existing author/reviewer strings are preserved;
whether any backfill is possible;
how to avoid production migration failure.

Again:

NO db push
NO database reset
NO destructive migration merely for convenience
36. IMPORTER IMPACT

The project also has an Article import pipeline.

Analyze how ownership changes affect imported Articles.

For example:

Who becomes authorUserId for imported articles?
Should importer keep author string only?
Should imports remain DRAFT?
Can importer ever assign reviewerUserId?
Should imported articles ever bypass review?

My preference remains:

Imported articles always remain DRAFT until a human submits/reviews/publishes them.

Preserve this safety property unless you identify a compelling reason otherwise.

37. TEST PLAN

Provide a thorough test matrix.

At minimum cover:

Roles
USER
EDITOR/MODERATOR
ADMIN
Ownership
own article
another user's article
Status
DRAFT
REVIEW
PUBLISHED
ARCHIVED
Scheduling
no scheduledAt
future scheduledAt
past scheduledAt
exact boundary
Public routes
detail
listing
sitemap
related articles
provider page
comparison page
Views
public visible article increments
draft doesn't
review doesn't
future scheduled doesn't
preview doesn't
metadata doesn't
concurrent increments remain correct
Pagination
first page
middle page
last page
invalid page
empty status
correct total/pageCount
Authorization

Attempt direct server-action invocation, not only UI testing.

38. PRODUCT/UX FEEDBACK

Do not simply agree with every requirement.

Before giving the roadmap, explicitly tell me:

what you think is good
what you would change
what is over-engineered
what is missing
what could become a problem later

Pay particular attention to:

role naming
author ownership
reviewer assignment
status transitions
scheduled visibility
view-count accuracy
dashboard information architecture
pagination
caching
migration safety

I want engineering judgment, not mechanical implementation.

39. REQUIRED OUTPUT — DO NOT IMPLEMENT YET

Return a design/review document with these sections:

A. Current implementation audit

Tell me exactly what is currently implemented and what is incomplete.

Include the current Article workflow.

B. Problems and risks

Rank findings:

Critical
High
Medium
Low
C. Role recommendation

Recommend:

MODERATOR
EDITOR
AUTHOR
or another name

and explain why.

D. Permission matrix

Produce a table:

Action | USER | EDITOR/MODERATOR | ADMIN

Also account for ownership and review assignment.

E. Status-transition diagram

Show every permitted transition and who can perform it.

F. Proposed Prisma changes

Show the proposed schema changes conceptually.

Do not modify the actual schema yet.

Explain every field/index.

G. Ownership/reviewer design

Explain User ↔ Article relations and legacy author/reviewer handling.

H. Scheduled-publication design

Explain:

visibility predicate
publishedAt semantics
scheduledAt semantics
caching behaviour
sitemap/list/detail behaviour
I. View-tracking design

Explain:

database field/model
client/server flow
atomic increment
accuracy limitations
privacy implications
J. Editor dashboard design

Show:

routes
tabs
counts
columns
pagination
actions
K. Admin dashboard design

Show:

My Articles
Assigned to Me
All Articles
filters
pagination
actions
L. Shared UI/component architecture

Identify reusable components rather than duplicating dashboard tables.

M. Service/query architecture

Propose functions and shared predicates.

N. Migration roadmap

Give exact safe sequencing.

O. Test strategy

Detailed enough that implementation can later be verified objectively.

P. Implementation phases

Break actual coding into small reviewable phases.

For each phase provide:

goal
files likely changed
schema changes
business rules
tests
exit criteria
risk level
Q. Open questions / decisions

Only include decisions where multiple approaches genuinely have meaningful tradeoffs.

For each one, give your recommended default.

40. IMPORTANT PRINCIPLES

Do not:

start implementation in this task;
blindly rewrite the existing Article CMS;
create a second Article system;
duplicate pagination logic;
use author names as ownership identifiers;
trust user IDs submitted from Editor forms;
rely on hidden buttons for security;
expose future-scheduled articles;
increment views from metadata generation;
store raw IP addresses just for view counts;
build a huge analytics platform for one counter;
introduce a new ArticleStatus solely for a UI label;
destroy existing Article data;
use prisma db push;
ignore existing importer behaviour;
ignore Next.js caching implications;
assume the existing migrations are safe.

Prefer:

small coherent changes
centralized permissions
centralized public visibility
real User relations
server-side authorization
database pagination
atomic view increments
safe migrations
reuse of current Article infrastructure

The objective is to evolve the existing Article CMS into a maintainable editorial workflow where content creators can safely create and submit work, administrators can review and publish it, scheduled content appears at the correct time, public pages clearly show authorship and popularity, and both Admin and Editor dashboards remain fast and understandable as the article database grows.

There is one architectural point I'd treat as non-negotiable before this next implementation: replace free-text author/reviewer as the mechanism for ownership/assignment with User relations. Your original CMS intentionally kept author/reviewer as simple strings because structured profiles weren't necessary yet. Your new dashboard and permission requirements change that assumption completely—now identity is part of authorization, not merely presentation.

The other major shift is scheduledAt: previously your design explicitly treated it as advisory because no scheduler existed. Your new requirement gives it a much better meaning: Admin can approve/publish the record now, while a centralized time predicate controls when it becomes publicly visible. That can work without a cron job, provided Claude handles caching and every public Article query consistently.