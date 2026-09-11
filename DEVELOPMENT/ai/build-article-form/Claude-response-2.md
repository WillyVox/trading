Remaining steps for Block 2

1. Fix revalidatePath bug in actions.ts
Small, isolated, no dependencies. revalidateArticlePaths() currently does revalidatePath(\/admin/articles/${opts.after.slug}`)against a route that's actually/admin/articles/[id]. Change it to take and use the article id`. Five-minute fix, but worth doing before the list page work touches the same file's surrounding logic.

2. Rebuild /admin/articles into a real management view
This is the bulk of the remaining work. Nothing new needs inventing on the backend — getAdminArticles() already accepts status/articleType/category/search/page/pageSize, getAdminArticleCategories() already exists for the filter dropdown, and articleRepository.paginate() already returns { items, total, page, pageSize, pageCount }. The work is entirely UI:

Filter controls: status, article type, category (populated from getAdminArticleCategories()), free-text search — as URL search params so the view is linkable/bookmarkable, read server-side in the page component.
Table columns: Title, Type, Status (badge, reusing the same tone mapping PublishingPanel already has), Category, Updated, Published.
Pagination controls using page/pageCount.
Row actions: Edit (link, exists), Preview (link, exists), and the relevant status-transition button(s) per row — reusing the exact same server actions PublishingPanel already calls (submitArticleForReview, publishArticle, etc.), not new logic. Each row shows only the actions valid for its current status.
Empty state per filter combination (not just "no articles yet" globally).

3. Pure-logic tests (no DB required, run today via existing tsx --test setup)

Status-transition legality: every valid transition succeeds, every invalid jump (DRAFT→PUBLISHED, ARCHIVED→PUBLISHED, etc.) is rejected — this can be tested by extracting the from/to legality check in transitionStatus() into a small pure function if it isn't already trivially testable in isolation.
validateArticleForm edge cases: missing required fields, bad slug, invalid articleType, oversized fields.
sanitizeArticleContent: confirms <script>, inline event handlers, javascript: URLs, disallowed tags are stripped, allowed tags/attributes survive.
Guide/News route isolation logic from Block 1 (getPublishedArticleBySlugAndType's status+type gate), as a pure check if separable from the Prisma call.

4. Document the DB-integration-test gap (a short note in docs/, not code)
Things like non-admin rejection, duplicate-slug races, and public DRAFT/REVIEW invisibility genuinely need a real database to test honestly — no test-DB infra exists yet (no docker-compose, no .env.example). I'd rather name this gap explicitly than claim coverage that isn't real.

5. Re-verify: npm test, npm run build, npm run lint (and npx prisma validate/generate on your end, since this sandbox can't reach the Prisma binary host).

Step 2 is the one with real size to it — everything else is small and mechanical. Let me know when you want me to start executing, and in what order (I'd default to 1 → 2 → 3 → 4 → 5 as listed, since 2 is self-contained once 1 is done and doesn't block on the tests).