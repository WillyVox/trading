// import { AuthStatus } from "./AuthStatus";
import { MobileNav } from "./MobileNav";
import { NavMenuItem } from "./NavMenuItem";
import HeaderLogo from "./HeaderLogo";
import { NAV_ITEMS } from "@/lib/nav/config";

// Deliberately NOT async / no auth() call here. Header is rendered from the
// root layout on every route, including statically-generated content pages
// (/guides/[slug], /news/[slug], /compare/*). Reading the session
// server-side here would force those pages to opt out of static rendering.
// AuthStatus fetches the session client-side instead (see AuthProvider /
// SessionProvider in layout.tsx) so this component — and everything else —
// stays static.
export function Header() {
  return (
    <header className="border-navy bg-panel sticky top-0 z-20 border-b-2">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-7 px-4">
        <div className="shrink-0">
          <HeaderLogo />
        </div>

        {/* Desktop navigation */}
        <div className="hidden min-w-0 flex-1 items-center md:flex">
          <nav className="hidden flex-1 items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavMenuItem key={item.label} item={item} />
            ))}
          </nav>
        </div>

        {/* Mobile navigation */}
        <div className="flex shrink-0 items-center gap-3 md:ml-auto">
          {/* Desktop auth area — hidden on mobile, where MobileNav's drawer covers it instead. */}
          {/* <div className="hidden md:block">
            <AuthStatus variant="desktop" />
          </div> */}

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

<div className="flex w-full min-w-0 items-center">
  {/* Logo */}
  <div className="shrink-0">{/* logo */}</div>

  {/* Desktop navigation */}
  <div className="hidden min-w-0 flex-1 items-center md:flex">
    {/* desktop nav */}
  </div>

  {/* Mobile navigation */}
  <div className="ml-auto flex shrink-0 items-center gap-3 md:hidden">
    <MobileNav />
  </div>
</div>;
