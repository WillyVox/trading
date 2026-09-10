import Link from "next/link";
import { AuthStatus } from "./AuthStatus";
import { MobileNav } from "./MobileNav";

const NAV = [
  { href: "/crypto", label: "Crypto" },
  { href: "/compare", label: "Compare" },
  { href: "/methodology", label: "Methodology" },
  { href: "/news", label: "News" },
];

// Deliberately NOT async / no auth() call here. Header is rendered from the
// root layout on every route, including statically-generated content pages
// (/crypto/guides/[slug], /news/[slug], /compare/*). Reading the session
// server-side here would force those pages to opt out of static rendering.
// AuthStatus fetches the session client-side instead (see AuthProvider /
// SessionProvider in layout.tsx) so this component — and everything else —
// stays static.
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-navy bg-panel">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-7 px-4">
        <Link href="/" className="flex items-baseline gap-1 font-display text-xl font-extrabold text-navy">
          Aus<span className="text-gold">Market</span>
          <span className="ml-2 hidden font-sans text-sm font-normal text-muted sm:inline">— crypto</span>
        </Link>
        <nav className="hidden flex-1 gap-6 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-navy/80 transition-colors hover:text-navy">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Desktop auth area — hidden on mobile, where MobileNav's drawer covers it instead. */}
          <div className="hidden md:block">
            <AuthStatus variant="desktop" />
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
