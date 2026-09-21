/**
 * Small line icon shown before a link's label in the header's mega-menu
 * (NavMenuItem) and the mobile accordion (MobileNav) — "style A" from the
 * approved mockup: a rounded tile tinted with the site's gold accent,
 * filling solid gold with a white icon on hover/focus via the parent
 * link's `group` class.
 *
 * Purely decorative labelling for a link that already has visible text,
 * so the icon itself is `aria-hidden` — screen readers only get the link
 * label, never the icon name.
 *
 * Icon choice lives on each NavLink via `icon?: NavIconName` (see
 * src/lib/nav/config.ts) rather than being inferred from the label, so
 * adding a new link is a one-line, explicit choice.
 */
export type NavIconName =
  | "book"
  | "check"
  | "grad"
  | "flag"
  | "userplus"
  | "coin"
  | "wallet"
  | "star"
  | "scale"
  | "grid"
  | "calc"
  | "fx"
  | "repeat"
  | "shield"
  | "updown";

// 18x18 viewBox line-icon paths, one per NavIconName above.
const PATHS: Record<NavIconName, string> = {
  book: "M3 3h6a2 2 0 0 1 2 2v13a1.5 1.5 0 0 0-1.5-1.5H3V3ZM17 3h-6a2 2 0 0 0-2 2v13a1.5 1.5 0 0 1 1.5-1.5H17V3Z",
  check: "M2 9.5 6 13l10-9",
  grad: "M2 6.5 9 3l7 3.5-7 3.5-7-3.5Zm0 4.2 7 3.3 7-3.3M2 6.5v4",
  flag: "M4 15V2m0 1.5h9l-2 3 2 3H4",
  userplus:
    "M8 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6c.5-3 2.5-4.7 5-4.7s4.5 1.7 5 4.7M14 5v4m2-2h-4",
  coin: "M9 15.5c3.6 0 6.5-2.9 6.5-6.5S12.6 2.5 9 2.5 2.5 5.4 2.5 9 5.4 15.5 9 15.5Zm0-9.5v6M6.8 6.7h3.5a1.4 1.4 0 0 1 0 2.8H7.7a1.4 1.4 0 0 0 0 2.8h3.5",
  wallet:
    "M2.5 5.5A1.5 1.5 0 0 1 4 4h9a1.5 1.5 0 0 1 1.5 1.5V13A1.5 1.5 0 0 1 13 14.5H4A1.5 1.5 0 0 1 2.5 13V5.5Zm10 3.5h2v3h-2a1.5 1.5 0 0 1 0-3Z",
  star: "m9 2.5 2 4.2 4.5.6-3.3 3.2.8 4.5L9 12.8l-4 2.2.8-4.5L2.5 7.3l4.5-.6L9 2.5Z",
  scale:
    "M9 2v13.5M5 15.5h8M9 4 4 5.5m5-1.5 5 1.5M2 5.5l2-3.3 2 3.3-2 3.5-2-3.5Zm10 0 2-3.3 2 3.3-2 3.5-2-3.5Z",
  grid: "M2.5 2.5h5.5v5.5H2.5V2.5Zm7.5 0h5.5v5.5H10V2.5Zm-7.5 7.5h5.5v5.5H2.5V10Zm7.5 0h5.5v5.5H10V10Z",
  calc: "M3.5 2.5h11v13h-11v-13Zm0 3.5h11M6 9h.01M9 9h.01M12 9h.01M6 12h.01M9 12h.01M12 12v2.5",
  fx: "M2 6h9l-2.5-2.5M16 12H7l2.5 2.5",
  repeat:
    "M14.5 5H6a3.5 3.5 0 0 0-3.5 3.5V9M3.5 13H12a3.5 3.5 0 0 0 3.5-3.5V9m-2-4 2 2-2 2m-7 6-2-2 2-2",
  shield:
    "M9 2 3 4.3v4.2c0 4 2.6 6.7 6 8 3.4-1.3 6-4 6-8V4.3L9 2Zm-2.3 6.4L8 9.8l3-3.6",
  updown: "M5 3v10m0 0L2.5 10.5M5 13l2.5-2.5M13 15V5m0 0L10.5 7.5M13 5l2.5 2.5",
};

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <span
      aria-hidden="true"
      className="bg-gold/10 text-gold group-hover:bg-gold flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:text-white"
    >
      <svg
        viewBox="0 0 18 18"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={PATHS[name]} />
      </svg>
    </span>
  );
}
