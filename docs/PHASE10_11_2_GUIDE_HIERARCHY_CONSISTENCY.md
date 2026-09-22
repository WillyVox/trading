# Phase 10.11.2 — Guide hierarchy consistency

All guide detail implementations now share `guideBreadcrumbTrail(title, path)`, producing:

`Home > Guides > Article title`

This includes legacy hand-built guides, share-trading route-group guides, `ResearchGuidePage`, and dynamic CMS `/guides/[slug]` articles. Category/taxonomy remains in the hero rather than the breadcrumb hierarchy.

`npm run check:guide-breadcrumbs` prevents guide detail pages from bypassing the shared helper and is included in `npm run launch:gate`.
