# Phase 10.7 — Search & navigation release QA

Added unit coverage for search relevance, URL deduplication and empty-query behaviour. Existing API design already limits queries, searches only `PUBLISHED` + non-`noIndex` DB articles, returns `Cache-Control: no-store`, and degrades to static results when the DB is temporarily unavailable.

Manual production QA must cover desktop Quick Access and mobile hamburger, focus entry/restore, Escape, body scroll lock, static + DB mixed results, draft/noIndex exclusion, DB outage/recovery, rapid typing/abort, no-result state, result navigation and 320–430px widths.
