"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "./AuthStatus";
import HeaderLogo from "./HeaderLogo";
import { NAV_ITEMS, type NavColumn, type NavItem, type NavLink } from "@/lib/nav/config";
import { NavIcon, type NavIconName } from "./NavIcon";
import { ResearchNavigatorSearch } from "@/components/search/ResearchNavigatorSearch";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function findNavItem(label: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.label === label);
}

function NavigatorLink({ link, pathname, compact = false }: { link: NavLink; pathname: string | null; compact?: boolean }) {
  const active = isActive(pathname, link.href);
  return (
    <Link
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      className={`group flex min-w-0 items-center gap-2.5 rounded-xl transition-colors ${compact ? "px-2.5 py-2" : "px-3 py-2.5"} ${
        active
          ? "bg-gold/10 text-navy ring-gold/25 ring-1"
          : "text-muted hover:bg-panel-secondary hover:text-navy focus-visible:bg-panel-secondary"
      }`}
    >
      {link.icon && <NavIcon name={link.icon} />}
      <span className="min-w-0 text-sm font-medium leading-snug">{link.label}</span>
      <span aria-hidden="true" className="text-muted/70 ml-auto shrink-0 text-sm">→</span>
    </Link>
  );
}

function SectionHeading({ icon, children }: { icon: NavIconName; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <NavIcon name={icon} />
      <h2 className="font-display text-navy text-lg font-bold">{children}</h2>
    </div>
  );
}

function GuideColumn({ column, pathname }: { column: NavColumn; pathname: string | null }) {
  return (
    <div>
      <div className="text-gold mb-1 px-2.5 text-[10px] font-extrabold tracking-[0.12em] uppercase">{column.heading}</div>
      <div className="space-y-0.5">
        {column.links.map((link) => <NavigatorLink key={link.href} link={link} pathname={pathname} compact />)}
        {column.footerLink && (
          <Link href={column.footerLink.href} aria-current={pathname === column.footerLink.href ? "page" : undefined}
            className="text-gold hover:text-navy focus-visible:text-navy block px-2.5 py-2 text-xs font-semibold transition-colors">
            {column.footerLink.label} →
          </Link>
        )}
      </div>
    </div>
  );
}

function ExploreMarkets({ pathname }: { pathname: string | null }) {
  const shareTrading = findNavItem("Share Trading");
  const cryptoExchanges = findNavItem("Crypto Exchanges");
  const news = findNavItem("News");
  return (
    <section aria-labelledby="research-explore-markets" className="border-border bg-panel rounded-2xl border p-3 shadow-sm sm:p-4">
      <h2 id="research-explore-markets" className="text-muted mb-3 text-[11px] font-extrabold tracking-[0.14em] uppercase">Explore markets</h2>
      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {shareTrading?.href && <NavigatorLink link={{ label: shareTrading.label, href: shareTrading.href, icon: "grid" }} pathname={pathname} />}
        {cryptoExchanges?.href && <NavigatorLink link={{ label: cryptoExchanges.label, href: cryptoExchanges.href, icon: "coin" }} pathname={pathname} />}
      </div>
      {news?.href && <div className="mt-2"><NavigatorLink link={{ label: news.label, href: news.href, icon: "book" }} pathname={pathname} /></div>}
    </section>
  );
}

function ResearchNavigatorContent({ titleId }: { titleId: string }) {
  const pathname = usePathname();
  const guides = findNavItem("Guides");
  const compares = findNavItem("Compares");
  const tools = findNavItem("Tools");
  const compareLinks = compares?.columns?.flatMap((column) => column.links) ?? [];
  const toolColumns = tools?.columns ?? [];

  return (
    <nav aria-labelledby={titleId} className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-5 lg:mb-6">
        <p className="text-gold text-[11px] font-extrabold tracking-[0.14em] uppercase">Explore</p>
        <h1 id={titleId} className="font-display text-navy mt-1 text-2xl font-bold lg:text-3xl">Trading Guide</h1>
        <p className="text-muted mt-1 text-sm lg:text-base">Learn, compare and calculate without digging through menus.</p>
      </div>

      <ResearchNavigatorSearch />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
        <section className="border-border bg-panel rounded-2xl border p-3 shadow-sm sm:p-4">
          <SectionHeading icon="book">Learn</SectionHeading>
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-5 lg:space-y-0 xl:grid-cols-3">
            {guides?.columns?.map((column) => <GuideColumn key={column.heading} column={column} pathname={pathname} />)}
          </div>
          {guides?.footerLink && (
            <Link href={guides.footerLink.href} className="border-border text-navy hover:bg-panel-secondary mt-3 flex items-center justify-between border-t px-2.5 pt-3 text-sm font-bold transition-colors">
              <span>{guides.footerLink.label.replace(/\s*→\s*$/, "")}</span><span aria-hidden="true">→</span>
            </Link>
          )}
        </section>

        <div className="grid gap-4 lg:gap-5">
          <section className="border-border bg-panel rounded-2xl border p-3 shadow-sm sm:p-4">
            <SectionHeading icon="scale">Compare</SectionHeading>
            <div className="space-y-1">{compareLinks.map((link) => <NavigatorLink key={link.href} link={link} pathname={pathname} />)}</div>
          </section>
          <div className="hidden lg:block"><ExploreMarkets pathname={pathname} /></div>
        </div>

        <section className="border-border bg-panel rounded-2xl border p-3 shadow-sm sm:p-4 lg:col-span-2">
          <SectionHeading icon="calc">Calculate</SectionHeading>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 min-[430px]:grid-cols-2">
            {toolColumns.map((column) => (
              <div key={column.heading}>
                <div className="text-gold mb-1 px-2.5 text-[10px] font-extrabold tracking-[0.12em] uppercase">{column.heading}</div>
                <div className="space-y-0.5">{column.links.map((link) => <NavigatorLink key={link.href} link={link} pathname={pathname} compact />)}</div>
              </div>
            ))}
          </div>
          {tools?.footerLink && (
            <Link href={tools.footerLink.href} className="border-border text-navy hover:bg-panel-secondary mt-3 flex items-center justify-between border-t px-2.5 pt-3 text-sm font-bold transition-colors">
              <span>{tools.footerLink.label.replace(/\s*→\s*$/, "")}</span><span aria-hidden="true">→</span>
            </Link>
          )}
        </section>
      </div>

      <div className="mt-4 lg:hidden"><ExploreMarkets pathname={pathname} /></div>

      <div className="border-border mt-7 border-t pt-5">
        <p className="text-muted mb-3 px-1 text-[11px] font-extrabold tracking-[0.14em] uppercase">Account</p>
        <AuthStatus variant="mobile" />
      </div>
    </nav>
  );
}

function ResearchNavigator({ trigger }: { trigger: "mobile" | "desktop" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reactId = useId().replace(/:/g, "");
  const dialogId = `${trigger}-research-navigation-${reactId}`;
  const titleId = `${dialogId}-title`;

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = triggerRef.current;
    closeRef.current?.focus({ preventScroll: true });
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
      else if (!dialogRef.current.contains(active)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); opener?.focus(); };
  }, [open]);

  const mobile = trigger === "mobile";
  return (
    <div className={mobile ? "lg:hidden" : "hidden lg:block"}>
      <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={dialogId} aria-haspopup="dialog"
        aria-label={mobile ? "Open site navigation" : "Open quick access navigation"} onClick={() => setOpen(true)}
        className={mobile
          ? "border-border bg-panel text-navy hover:bg-panel-secondary focus-visible:ring-gold flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
          : "border-border bg-panel text-navy hover:bg-panel-secondary focus-visible:ring-gold flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"}>
        {mobile ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        ) : (
          <>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>
            <span className="hidden xl:inline">Quick access</span>
          </>
        )}
      </button>

      <div ref={dialogRef} id={dialogId} role="dialog" aria-modal="true" aria-labelledby={titleId} inert={!open}
        className={`bg-background fixed inset-0 z-50 flex min-h-dvh flex-col transition-[opacity,visibility] duration-150 ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="border-border bg-panel shrink-0 border-b">
          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <HeaderLogo />
            <button ref={closeRef} type="button" aria-label="Close quick access navigation" onClick={() => setOpen(false)}
              className="border-border bg-panel text-muted hover:bg-panel-secondary hover:text-navy focus-visible:ring-gold flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}>
          <ResearchNavigatorContent titleId={titleId} />
        </div>
      </div>
    </div>
  );
}

export function MobileNav() { return <ResearchNavigator trigger="mobile" />; }
export function DesktopQuickAccess() { return <ResearchNavigator trigger="desktop" />; }
