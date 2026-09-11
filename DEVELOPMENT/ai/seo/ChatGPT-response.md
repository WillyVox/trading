# Block 2 assessment

The important distinction is:

Your core Article CRUD/publishing workflow is now largely implemented, but I would not call Block 2 completely finished or production-ready yet.

Your original Block 2 expectation included not only create/edit/publish actions, but also a useful article-management list with filtering/actions and a complete editorial workflow. The more detailed requirement also expected the admin list to expose fields, filters, and actions such as Edit, Preview, Publish, Review, and Archive.

What is already good

createArticle() is properly implemented. It requires admin authorization, validates the submitted data, sanitizes HTML, checks slug uniqueness, creates tags/sources/provider relationships/assets/related articles, and importantly forces every new article to DRAFT.

updateArticle() is also implemented and synchronizes most of the Article relationships in a transaction. That is better than a superficial CRUD implementation.

Preview exists at:

/admin/articles/[id]/preview

and it independently requires admin authorization. It also sets noindex, and the project comments indicate no-store is applied through the proxy. Draft, Review, Published, and Archived content can therefore be previewed without exposing them publicly.

The status workflow is substantially implemented:

DRAFT
  ↓
REVIEW
  ↓
PUBLISHED
  ↓
ARCHIVED

You currently have:

submitArticleForReview()
moveArticleBackToDraft()
publishArticle()
unpublishArticle()
archiveArticle()
restoreArticleFromArchive()

This is actually more complete than the three operations you mentioned.

Publishing is sensibly restricted:

REVIEW → PUBLISHED

rather than allowing an article to jump directly from Draft to Published. That matches the editorial workflow we originally discussed. The original requirement expected these server-side transitions with independent authorization and validation.

Archiving also works from:

DRAFT
REVIEW
PUBLISHED

and restoring an archived article goes back to Draft rather than directly to Published. I like that design.

So, specifically for your three questions:

Requirement	Current state
Create article	✅ Implemented well
Archive article	✅ Implemented well
Publish article	✅ Implemented, correctly requires REVIEW first

However, several things prevent me from saying Block 2 = 100% complete.

The biggest remaining Block 2 problem: /admin/articles is still too primitive

Your service layer already supports:

getAdminArticles({
  page,
  pageSize,
  status,
  articleType,
  category,
  search
})

and your repository already returns:

{
  items,
  total,
  page,
  pageSize,
  pageCount
}

So the backend is actually ready for pagination.

But the current:

/admin/articles

page ignores nearly all of it.

It currently essentially displays:

Title | Status

and that's it.

It does not currently expose:

Article type
Author
Updated date
Published date
Category
pagination
status filter
type filter
category filter
search
Preview action
Submit for review
Publish
Archive
Restore

That means the editor page is ahead of the article-management dashboard.

And that becomes even more important with the Moderator/Admin workflow you now want.

There is also a migration problem I would fix now

This one is important before production.

Your migration:

20260911013557_create_article

contains Prisma's own warning that it adds:

articleType
updatedAt

as required columns without defaults.

The generated migration itself says this is not possible when Article already contains rows.

Yet your design document originally described a safer migration:

1. Add nullable articleType
2. Backfill existing articles
3. Verify them
4. Make articleType NOT NULL

That safer backfill approach is the correct one.

Your schema comment even refers to:

20260911071500_article_domain_foundation

but that migration does not exist in the archive I inspected.

So I would not deploy the current migration sequence to a production database containing existing articles until this is reconciled.

Another smaller issue: incorrect admin revalidation path

Inside revalidateArticlePaths() I found:

revalidatePath(`/admin/articles/${opts.after.slug}`);

but your admin edit route is:

/admin/articles/[id]

not:

/admin/articles/[slug]

The code itself comments that it is a harmless no-op.

It probably won't break the application because this page is dynamically reading the data anyway, but it should be corrected rather than knowingly kept as a no-op.

The helper should know the Article ID and revalidate:

revalidatePath(`/admin/articles/${id}`);
Automated tests are another gap

Your current test command only targets:

src/lib/articles/import/__test__/*.test.ts

I do not see serious tests covering the new administrative lifecycle.

Before declaring this phase finished, I would want tests around:

Create → DRAFT
DRAFT → REVIEW
REVIEW → PUBLISHED
PUBLISHED → DRAFT
DRAFT/REVIEW/PUBLISHED → ARCHIVED
ARCHIVED → DRAFT

DRAFT cannot publish directly
ARCHIVED cannot publish directly
non-admin cannot execute actions
duplicate slug fails
malicious HTML gets sanitized
public cannot see DRAFT
public cannot see REVIEW
GUIDE cannot resolve through /news
NEWS cannot resolve through /crypto/guides

The previous requirements explicitly called for public access/status and routing tests too.

My current Block 2 rating

I would put it at approximately:

Core editor + lifecycle: ~90%

Entire Block 2 including management UX, migrations and verification: ~75–80%

I would finish the migration fix, admin article-list management UI, pagination/filtering/actions, better error feedback, and lifecycle tests before calling Block 2 complete.
