# Phase 10.11.1 — Guide breadcrumb consistency

All `/guides/[slug]` detail pages now use the canonical breadcrumb hierarchy:

`Home > Guides > Article title`

The dynamic CMS guide route previously inserted `Crypto` before `Guides`, while static research guides already used the desired hierarchy. Category/taxonomy remains available through the guide hero eyebrow and article metadata; it is no longer mixed into the URL breadcrumb hierarchy.

The same `trail` continues to power both visible breadcrumbs and BreadcrumbList JSON-LD, so UI and structured data remain aligned.
