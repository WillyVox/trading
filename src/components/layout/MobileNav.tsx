"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "./AuthStatus";
import HeaderLogo from "./HeaderLogo";
import {
  NAV_ITEMS,
  type NavColumn,
  type NavItem,
  type NavLink,
} from "@/lib/nav/config";
import { NavIcon, type NavIconName } from "./NavIcon";

/** Exact match for "/", startsWith for everything else — otherwise "/" would match every route. */
function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function findNavItem(label: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.label === label);
}

function MobileLink({
  link,
  pathname,
  compact = false,
}: {
  link: NavLink;
  pathname: string | null;
  compact?: boolean;
}) {
  const active = isActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      className={`group flex min-w-0 items-center gap-2.5 rounded-xl transition-colors ${
        compact ? "px-2.5 py-2" : "px-3 py-2.5"
      } ${
        active
          ? "bg-gold/10 text-navy ring-gold/25 ring-1"
          : "text-muted hover:bg-panel-secondary hover:text-navy focus-visible:bg-panel-secondary"
      }`}
    >
      {link.icon && <NavIcon name={link.icon} />}
      <span className="min-w-0 text-sm leading-snug font-medium">
        {link.label}
      </span>
      <span
        aria-hidden="true"
        className="text-muted/70 ml-auto shrink-0 text-sm"
      >
        →
      </span>
    </Link>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon: NavIconName;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <NavIcon name={icon} />
      <h2 className="font-display text-navy text-lg font-bold">{children}</h2>
    </div>
  );
}

function GuideColumn({
  column,
  pathname,
}: {
  column: NavColumn;
  pathname: string | null;
}) {
  return (
    <div>
      <div className="text-gold mb-1 px-2.5 text-[10px] font-extrabold tracking-[0.12em] uppercase">
        {column.heading}
      </div>
      <div className="space-y-0.5">
        {column.links.map((link) => (
          <MobileLink key={link.href} link={link} pathname={pathname} compact />
        ))}
        {column.footerLink && (
          <Link
            href={column.footerLink.href}
            aria-current={
              pathname === column.footerLink.href ? "page" : undefined
            }
            className="text-gold hover:text-navy focus-visible:text-navy block px-2.5 py-2 text-xs font-semibold transition-colors"
          >
            {column.footerLink.label} →
          </Link>
        )}
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const guides = findNavItem("Guides");
  const compares = findNavItem("Compares");
  const tools = findNavItem("Tools");
  const shareTrading = findNavItem("Share Trading");
  const cryptoExchanges = findNavItem("Crypto Exchanges");
  const news = findNavItem("News");

  // Close the full-screen navigator after a route change.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // The menu is a modal navigation surface: background content must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Move focus into the full-screen dialog, trap Tab while it is open,
  // support Escape, then restore focus to the hamburger trigger on close.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    closeRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      } else if (!dialogRef.current.contains(active)) {
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

  const compareLinks =
    compares?.columns?.flatMap((column) => column.links) ?? [];
  const toolColumns = tools?.columns ?? [];

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-site-navigation"
        aria-haspopup="dialog"
        aria-label="Open site navigation"
        onClick={() => setOpen(true)}
        className="border-border bg-panel text-navy hover:bg-panel-secondary focus-visible:ring-gold flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        ref={dialogRef}
        id="mobile-site-navigation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        inert={!open}
        className={`bg-background fixed inset-0 z-50 flex min-h-dvh flex-col transition-[opacity,visibility] duration-150 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="border-border bg-panel shrink-0 border-b">
          <div className="mx-auto flex h-[72px] max-w-3xl items-center justify-between px-4">
            <HeaderLogo />
            <button
              ref={closeRef}
              type="button"
              aria-label="Close site navigation"
              onClick={() => setOpen(false)}
              className="border-border bg-panel text-muted hover:bg-panel-secondary hover:text-navy focus-visible:ring-gold flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
          }}
        >
          <nav
            aria-labelledby="mobile-nav-title"
            className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8"
          >
            <div className="mb-6">
              <p className="text-gold text-[11px] font-extrabold tracking-[0.14em] uppercase">
                Explore
              </p>
              <h1
                id="mobile-nav-title"
                className="font-display text-navy mt-1 text-2xl font-bold"
              >
                Trading Guide
              </h1>
              <p className="text-muted mt-1 text-sm">
                Learn, compare and calculate without digging through menus.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2">
              {/* LEARN — all guide submenus are visible immediately. */}
              <section className="border-border bg-panel rounded-2xl border p-3 shadow-sm min-[430px]:col-span-1">
                <SectionHeading icon="book">Learn</SectionHeading>
                <div className="space-y-4">
                  {guides?.columns?.map((column) => (
                    <GuideColumn
                      key={column.heading}
                      column={column}
                      pathname={pathname}
                    />
                  ))}
                </div>
                {guides?.footerLink && (
                  <Link
                    href={guides.footerLink.href}
                    className="border-border text-navy hover:bg-panel-secondary mt-3 flex items-center justify-between border-t px-2.5 pt-3 text-sm font-bold transition-colors"
                  >
                    <span>
                      {guides.footerLink.label.replace(/\s*→\s*$/, "")}
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </section>

              {/* COMPARE — no accordion; every comparison destination is one tap away. */}
              <section className="border-border bg-panel rounded-2xl border p-3 shadow-sm min-[430px]:col-span-1">
                <SectionHeading icon="scale">Compare</SectionHeading>
                <div className="space-y-1">
                  {compareLinks.map((link) => (
                    <MobileLink
                      key={link.href}
                      link={link}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </section>

              {/* CALCULATE gets full width because it contains the largest destination set. */}
              <section className="border-border bg-panel rounded-2xl border p-3 shadow-sm min-[430px]:col-span-2 sm:p-4">
                <SectionHeading icon="calc">Calculate</SectionHeading>
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 min-[430px]:grid-cols-2">
                  {toolColumns.map((column) => (
                    <div key={column.heading}>
                      <div className="text-gold mb-1 px-2.5 text-[10px] font-extrabold tracking-[0.12em] uppercase">
                        {column.heading}
                      </div>
                      <div className="space-y-0.5">
                        {column.links.map((link) => (
                          <MobileLink
                            key={link.href}
                            link={link}
                            pathname={pathname}
                            compact
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {tools?.footerLink && (
                  <Link
                    href={tools.footerLink.href}
                    className="border-border text-navy hover:bg-panel-secondary mt-3 flex items-center justify-between border-t px-2.5 pt-3 text-sm font-bold transition-colors"
                  >
                    <span>
                      {tools.footerLink.label.replace(/\s*→\s*$/, "")}
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </section>
            </div>

            <section className="mt-6" aria-labelledby="mobile-explore-markets">
              <h2
                id="mobile-explore-markets"
                className="text-muted mb-3 text-[11px] font-extrabold tracking-[0.14em] uppercase"
              >
                Explore markets
              </h2>
              <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                {shareTrading?.href && (
                  <MobileLink
                    link={{
                      label: shareTrading.label,
                      href: shareTrading.href,
                      icon: "grid",
                    }}
                    pathname={pathname}
                  />
                )}
                {cryptoExchanges?.href && (
                  <MobileLink
                    link={{
                      label: cryptoExchanges.label,
                      href: cryptoExchanges.href,
                      icon: "coin",
                    }}
                    pathname={pathname}
                  />
                )}
              </div>
              {news?.href && (
                <div className="mt-3">
                  <MobileLink
                    link={{ label: news.label, href: news.href, icon: "book" }}
                    pathname={pathname}
                  />
                </div>
              )}
            </section>

            <div className="border-border mt-7 border-t pt-5">
              <p className="text-muted mb-3 px-1 text-[11px] font-extrabold tracking-[0.14em] uppercase">
                Account
              </p>
              <AuthStatus variant="mobile" onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
