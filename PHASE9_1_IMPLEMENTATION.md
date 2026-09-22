# Phase 9.1 — Content Depth & Search-Intent Clusters

Implemented a deliberate internal-linking and learning-path layer that connects education, tools, provider research and curated comparisons without generating large numbers of thin SEO pages.

## Added

- `/guides/share-trading` — indexable share-trading learning/research hub.
- `/guides/crypto` — indexable crypto-exchange learning/research hub.
- `src/lib/seo/topic-clusters.ts` — single registry for topic-cluster navigation.
- `TopicClusterLinks` — reusable contextual internal-link component.
- Topic paths on provider profiles, provider indexes, curated comparison pages and the tools section.
- Learning-path entry cards on `/guides`.
- Both cluster hubs in the sitemap.
- Regression tests for cluster completeness, URL uniqueness and descriptive content.

## SEO principles

- Internal links are visible to users and use descriptive labels; no hidden SEO-only link blocks.
- The cluster hubs add navigational value and explanatory context rather than duplicating provider facts.
- Provider facts remain in the structured data layer; the hubs point to the live profiles/tools/comparisons instead of copying fee claims.
- Arbitrary provider-pair pages remain noindex; this phase does not increase the curated comparison registry.
- No FAQ rich-result work was added. Google removed FAQ rich-result documentation in 2026.
- Existing BreadcrumbList markup is retained for the new hubs.

## Research basis

The implementation follows current Google Search guidance emphasizing people-first content, descriptive internal links, coherent site hierarchy and visible user-facing content. It deliberately avoids generating pages solely to increase indexable URL count.

## Validation

Run locally:

```bash
npx prisma generate
npx prisma validate
npm test
npx tsc --noEmit
npm run lint
npm run format:check
npm run build
npm run check:production
```

The implementation environment did not contain a complete installed Next.js toolchain, so the full validation pipeline was not claimed as passed here.
