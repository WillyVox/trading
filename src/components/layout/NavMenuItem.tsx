"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav/config";

/**
 * One top-level header menu entry, desktop variant. Renders a plain link
 * when the item has no `children`; renders a button that reveals a
 * dropdown panel of links when it does. This is the generic building
 * block Header.tsx maps NAV_ITEMS over — adding a new top-level item with
 * or without a dropdown never requires touching this component, only
 * src/lib/nav/config.ts.
 *
 * Accessibility / interaction:
 * - opens on click (not hover-only) so it behaves the same on trackpad,
 *   mouse, and touch-with-a-pointer;
 * - aria-expanded/aria-haspopup on the trigger, role="menu"/"menuitem" on
 *   the panel and links;
 * - closes on Escape, on a pointerdown outside the item, and on route
 *   change (so navigating via a dropdown link doesn't leave it stuck open
 *   behind the new page).
 */
export function NavMenuItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
  const hasDropdown = children.length > 0;

  if (!hasDropdown) {
    return (
      <Link href={item.href ?? "#"} className="text-sm font-medium text-navy/80 transition-colors hover:text-navy">
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-navy/80 transition-colors hover:text-navy"
      >
        {item.label}
        <svg aria-hidden viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        role="menu"
        aria-label={item.label}
        className={`absolute left-0 top-full z-30 mt-3 w-64 rounded-2xl border border-border bg-panel p-2 shadow-lg transition-all duration-150 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            role="menuitem"
            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-navy/80 transition-colors hover:bg-panel-secondary hover:text-navy"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
