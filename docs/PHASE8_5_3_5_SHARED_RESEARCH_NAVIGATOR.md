# Phase 8.5.3.5 — Shared Research Navigator

## Goal
Use one research-navigation content model and responsive surface for both mobile and desktop.

## Behaviour
- Mobile keeps the hamburger trigger and opens the full-screen Research Navigator.
- Desktop keeps the normal visible global navigation and adds a Quick access launcher.
- At `lg` widths the launcher is an accessible grid icon; at `xl` it displays `Quick access` text as well, avoiding header crowding.
- Both triggers open the same `ResearchNavigatorContent`; links continue to come from `NAV_ITEMS`.
- No accordions are introduced. Learn, Compare and Calculate destinations remain immediately visible.
- Desktop uses a wider, constrained content canvas and places Explore markets beneath Compare to avoid an unnecessarily empty right column.

## Accessibility
The dialog traps focus while open, closes with Escape, restores focus to its opener, locks background scrolling, uses semantic navigation/links, and preserves `aria-current` on exact current-page links.

## Scope
No routes, database reads, provider data, comparison behaviour, or navigation destinations were changed.
