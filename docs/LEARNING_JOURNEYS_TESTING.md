# Learning Journeys testing

## Fast release check

Run before every learning-journey change:

```bash
npm run check:learning
```

This dependency-free check verifies the learning implementation files exist, configured lesson/practice routes resolve to App Router pages, lesson URLs remain unique, browser-local progress primitives remain present, and both learning hubs remain in the sitemap source.

## Unit tests

After dependencies are installed:

```bash
npm run test:learning
```

Coverage includes journey identity/order invariants, configured route existence, previous/next boundaries, new-learner state, percentage calculations, resume behavior, stale lesson IDs and fully completed paths.

## Existing release checks

```bash
npm run check:seo:release
npm run check:internal-links
npm run check:guide-breadcrumbs
```

## Browser QA

Test both `/learn/share-trading` and `/learn/crypto` at 320, 375, 430, 768, 1024 and 1440px widths. Verify Start/Continue/Review labels, lesson card wrapping, keyboard focus, progress updates after marking a lesson complete, undo, refresh persistence, homepage Continue Learning, and a fresh/private browser with no stored progress.

For analytics, use GA4 DebugView in a non-production test session and verify `learning_path_started`, `learning_path_resumed`, `learning_lesson_selected`, `lesson_completed`, `lesson_completion_undone`, `next_lesson_clicked`, and `learning_path_completed`. Confirm event parameters contain journey/lesson identifiers only and no calculator inputs, email addresses or other personal/financial values.
