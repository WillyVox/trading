# Phase 10.6 — SEO, crawl & index validation

Added `npm run check:seo:release` for source-level invariants: robots/sitemap/404 presence, private/utility route exclusions, sitemap runtime resilience and production canonical URL configuration.

Production still requires live verification after deployment: `/robots.txt`, `/sitemap.xml`, representative canonicals, 404/noindex behaviour, redirect chains, and Search Console submission. Dynamic comparison pairs remain intentionally excluded unless curated/substantive; this phase does not broaden indexed comparison URLs.
