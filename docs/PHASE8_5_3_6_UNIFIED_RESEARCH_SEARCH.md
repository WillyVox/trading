# Phase 8.5.3.6 — Unified Research Navigator Search

Adds a shared search surface to the desktop Quick access and mobile Research Navigator.

## Sources

- Static flagship guides from `STATIC_GUIDES`.
- Static tools from the shared `NAV_ITEMS` configuration.
- Published, indexable CMS GUIDE and NEWS records from PostgreSQL.

The public result type is Guide / Article / News / Tool. `STATIC` vs `DATABASE` is retained internally only and is not exposed as a user-facing content taxonomy.

## Resilience

The API uses `safeDatabaseQuery`. A recognised database outage returns matching static guides/tools plus `partial: true`; it does not return a false successful empty result and does not make the Research Navigator unavailable. Unexpected/configuration/programming errors still throw.

## Relevance

V1 ranking is deterministic and intentionally simple: exact title, title prefix, title containment, keywords/tags, category, then description. Affiliate/commercial state is not a ranking input. Results are deduplicated by canonical app href.

## UX

- Search appears immediately below the Research Navigator introduction on mobile and desktop.
- Two characters trigger a debounced request.
- Results are grouped by content type.
- Clearing the query restores the normal navigator.
- The result area announces changes and exposes database degradation as partial results.

A semantic search input plus ordinary result links is used instead of forcing rich linked results into ARIA `option` elements. WAI-ARIA APG notes that listbox options do not provide an accessible way to contain interactive links. Browser/assistive-technology testing is still required before production accessibility claims.
