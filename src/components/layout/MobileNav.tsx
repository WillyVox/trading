"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "./AuthStatus";
import { NAV_ITEMS, type NavLink } from "@/lib/nav/config";
import { NavIcon } from "./NavIcon";

/** A flattened mobile-accordion entry: either a real link, or a
 *  non-interactive column-heading label used when an item's dropdown is
 *  defined as multi-column `columns` (e.g. "Guides") rather than a flat
 *  `children` list. */
type MobileNavEntry = NavLink | { heading: string };

/** Exact match for "/", startsWith for everything else — otherwise "/" would match every route. */
function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  // Which top-level accordion item (by label) is expanded — hover dropdowns
  // (NavMenuItem, desktop) don't translate to touch, so items with
  // `children` get an expand/collapse section here instead.
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on route change. This is "adjusting state when a value changes":
  // compare against the previous pathname during render and reset there,
  // instead of a useEffect that calls setState after the render has already
  // committed (which costs an extra render pass and is flagged by
  // react-hooks/set-state-in-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setExpandedLabel(null);
  }

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Dialog behaviour while open: move focus into the drawer, keep Tab inside
  // it, close on Escape, and hand focus back to the Menu button afterwards.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    closeRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!drawerRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      toggle?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="border-border bg-panel-secondary text-navy rounded-full border px-3.5 py-2 text-sm font-medium"
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`bg-navy-dark/40 fixed inset-0 z-30 backdrop-blur-sm transition-opacity duration-200 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        // Off-screen when closed: `inert` removes its links from the tab order
        // and the accessibility tree, so keyboard and screen-reader users
        // can't land on invisible controls.
        inert={!open}
        className={`border-border bg-panel fixed inset-y-0 right-0 z-40 flex w-72 max-w-[80vw] transform flex-col border-l shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between p-6 pb-0">
          <span className="font-display text-navy text-lg font-bold">Menu</span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="border-border text-muted hover:text-navy rounded-full border px-2 py-1 text-sm"
          >
            ✕
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              // Hover dropdowns (NavMenuItem, desktop) don't translate to
              // touch, so items with `children` or `columns` get an
              // expand/collapse section here instead. A `columns` item
              // (e.g. "Guides") is flattened into one list, with each
              // column's heading shown as a small non-interactive group
              // label so the grouping isn't lost on mobile.
              const children: MobileNavEntry[] =
                item.children ??
                (item.columns
                  ? [
                      ...item.columns.flatMap((column) => [
                        { heading: column.heading },
                        ...column.links,
                        ...(column.footerLink ? [column.footerLink] : []),
                      ]),
                      ...(item.footerLink ? [item.footerLink] : []),
                    ]
                  : []);

              if (children.length === 0) {
                const href = item.href ?? "#";
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-panel-secondary text-navy"
                        : "text-muted hover:bg-panel-secondary hover:text-navy"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              const expanded = expandedLabel === item.label;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setExpandedLabel(expanded ? null : item.label)
                    }
                    className="text-muted hover:bg-panel-secondary hover:text-navy flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors"
                  >
                    {item.label}
                    <svg
                      aria-hidden
                      viewBox="0 0 12 12"
                      className={`h-3 w-3 shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
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
                  </button>
                  {expanded && (
                    <div className="border-border mt-1 ml-3 flex flex-col gap-1 border-l pl-3">
                      {children.map((child) =>
                        "heading" in child ? (
                          <div
                            key={child.heading}
                            className="text-muted mt-2 px-3 text-[11px] font-bold tracking-wider uppercase first:mt-0"
                          >
                            {child.heading}
                          </div>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                              isActive(pathname, child.href)
                                ? "bg-panel-secondary text-navy"
                                : "text-muted hover:bg-panel-secondary hover:text-navy"
                            }`}
                          >
                            {child.icon && <NavIcon name={child.icon} />}
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="border-border mt-6 border-t pt-4">
            <AuthStatus variant="mobile" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
