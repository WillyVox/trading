"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "./AuthStatus";
import { NAV_ITEMS } from "@/lib/nav/config";

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

  // Close on route change and lock body scroll while open.
  useEffect(() => {
    setOpen(false);
    setExpandedLabel(null);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-border bg-panel-secondary px-3.5 py-2 text-sm font-medium text-navy"
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-navy-dark/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-40 w-72 max-w-[80vw] transform border-l border-border bg-panel p-6 shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-navy">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-full border border-border px-2 py-1 text-sm text-muted hover:text-navy"
          >
            ✕
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const children = item.children ?? [];

            if (children.length === 0) {
              const href = item.href ?? "#";
              const active = isActive(pathname, href);
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-panel-secondary text-navy" : "text-muted hover:bg-panel-secondary hover:text-navy"
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
                  onClick={() => setExpandedLabel(expanded ? null : item.label)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-panel-secondary hover:text-navy"
                >
                  {item.label}
                  <svg
                    aria-hidden
                    viewBox="0 0 12 12"
                    className={`h-3 w-3 shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
                  >
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {expanded && (
                  <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                    {children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                          isActive(pathname, child.href)
                            ? "bg-panel-secondary text-navy"
                            : "text-muted hover:bg-panel-secondary hover:text-navy"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-border pt-4">
          <AuthStatus variant="mobile" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
