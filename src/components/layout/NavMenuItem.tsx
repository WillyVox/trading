"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav/config";

/** How long the panel stays open after the pointer/focus leaves, so
 *  crossing the small gap between trigger and panel doesn't flicker it
 *  shut. Matches the approved mockup. */
const CLOSE_DELAY_MS = 180;

/**
 * One top-level header menu entry, desktop variant. Renders a plain link
 * when the item has no `children`/`columns`; renders a link trigger that
 * reveals a dropdown panel when it does. This is the generic building
 * block Header.tsx maps NAV_ITEMS over — adding a new top-level item with
 * or without a dropdown never requires touching this component, only
 * src/lib/nav/config.ts.
 *
 * Accessibility / interaction:
 * - the trigger is a real `<Link>` with a real `href` — it navigates like
 *   any nav link, and the header now contributes a crawlable internal
 *   link to every dropdown's landing page (e.g. /crypto, /guides);
 * - opens on hover *and* on keyboard focus, with a close-delay so moving
 *   the pointer from the trigger into the panel doesn't close it — an
 *   invisible "bridge" element covers the gap between them;
 * - the panel is a grouped list of links, not an application menu, so it
 *   uses role="group" rather than role="menu"/"menuitem" (no arrow-key
 *   menu navigation is implemented, and none should be implied);
 * - still closes on Escape, on a pointerdown outside the item, and on
 *   route change (so navigating via a dropdown link doesn't leave it
 *   stuck open behind the new page).
 */
export function NavMenuItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };
  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  // Close on route change ("adjusting state when a value changes": compare
  // with the previous pathname during render rather than calling setState in
  // an effect after the render has committed). No need to cancel a pending
  // close timer here: if one is still queued it only ever calls
  // setOpen(false), and openNow() clears it before any re-open.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Cancel any queued close when the item unmounts.
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const children = item.children ?? [];
  const columns = item.columns ?? [];
  const hasDropdown = children.length > 0 || columns.length > 0;
  const isWide = columns.length > 0;
  const isWideColumns = columns.length >= 3;

  const linkClass =
    "text-navy/80 hover:bg-panel-secondary hover:text-navy block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

  if (!hasDropdown) {
    return (
      <Link
        href={item.href ?? "#"}
        className="text-navy/80 hover:text-navy text-sm font-medium transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={item.href ?? "#"}
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={openNow}
        className="text-navy/80 hover:text-navy flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        {item.label}
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 4l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* Invisible bridge so the pointer never "exits" the interactive
          region while crossing the gap between the trigger and the panel. */}
      <div className="absolute top-full left-0 h-2.5 w-full" />

      <div
        role="group"
        aria-label={item.label}
        onFocus={openNow}
        onBlur={(event) => {
          if (!containerRef.current?.contains(event.relatedTarget as Node)) {
            scheduleClose();
          }
        }}
        className={`border-border bg-panel absolute top-full left-0 z-30 mt-3 rounded-2xl border p-2 shadow-lg transition-all duration-150 ${
          isWide ? (isWideColumns ? "w-[820px] p-4" : "w-[560px] p-4") : "w-64"
        } ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {isWide ? (
          <div
            className={`grid gap-x-6 gap-y-1 ${
              isWideColumns ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {columns.map((column, index) => (
              <div
                key={column.heading}
                className={
                  index > 0 ? "border-border border-l pl-5" : undefined
                }
              >
                <div className="text-gold flex items-center gap-2 px-3 pb-2 text-[11px] font-extrabold tracking-wider uppercase">
                  <span className="bg-gold h-1.5 w-1.5 rounded-full" />
                  {column.heading}
                </div>
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            {item.footerLink && (
              <div
                className={`border-border mt-1 border-t border-dashed pt-2 ${
                  isWideColumns ? "col-span-3" : "col-span-2"
                }`}
              >
                <Link href={item.footerLink.href} className={linkClass}>
                  <b>{item.footerLink.label}</b>
                </Link>
              </div>
            )}
          </div>
        ) : (
          children.map((child) => (
            <Link key={child.href} href={child.href} className={linkClass}>
              {child.label}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
