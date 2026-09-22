# Phase 8.5.3.4 — Mobile Navigation Research Navigator

## Scope

Replaces the previous narrow accordion drawer with the approved Option D full-screen research navigator.

## Behaviour

- Header uses a standard hamburger icon with an accessible `Open site navigation` label.
- Opening the menu creates a full-viewport modal navigation surface rather than leaving a blurred strip of the page visible.
- Guide, comparison and tool destinations are visible immediately; there are no parent accordions to expand.
- Information architecture is grouped by user intent: **Learn**, **Compare**, **Calculate**, then **Explore markets** and **Account**.
- Existing `NAV_ITEMS` remains the source of truth for destinations; mobile navigation does not duplicate route strings for submenu content.
- The current route uses `aria-current="page"` and a non-colour-only visual treatment.
- Menu locks background scrolling, closes on Escape and route change, traps focus while open, and restores focus to the hamburger trigger when closed.
- Safe-area bottom padding is retained for mobile devices.

## Accessibility rationale

The full-screen surface behaves as a modal dialog: focus moves inside it when opened, keyboard focus remains inside until close, Escape closes it, and focus returns to the invoking button. The navigation itself remains semantic links inside a `nav` landmark rather than using application-menu roles.

## Responsive behaviour

- Narrow phones: single-column research cards and tool links.
- Wider phones: Learn/Compare cards form a two-column grid; Calculate spans the full width and tool groups can use two columns.
- The navigation content scrolls independently within the viewport.

## Deliberate choices

- No accordion/disclosure interaction remains in mobile navigation.
- No database reads or new runtime data dependencies were added.
- No provider recommendations, rankings or affiliate-promoted navigation was introduced.
- Account/admin controls remain visually secondary at the bottom.
