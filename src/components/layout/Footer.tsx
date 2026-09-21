import Link from "next/link";
import { footerLinks } from "@/lib/config/footer";
import { businessIdentity } from "@/lib/config/business";
import { siteConfig } from "@/lib/seo/config";
import TradingGuideLogoWhite from "./LogoWhite";

// Computed once per server render. On a statically-generated page this
// bakes in the build year rather than the visitor's current year -- fine
// for a footer copyright line (same tradeoff every SSG site makes), but
// worth knowing if a build sits unrebuilt across a New Year's Eve.
const YEAR = new Date().getFullYear();

/**
 * Global footer. Server component -- no hooks, no client JS -- so it never
 * forces the pages that render it (Guide/News/Compare, all statically
 * generated) to opt out of static rendering. See Header.tsx for the same
 * rule applied to auth state.
 *
 * Layout is the 4-zone pattern agreed 2026-09-12: identity + copyright ->
 * divider -> flat link menu -> divider -> compact trust paragraph. See
 * docs/CONTENT-GAPS.md for what the trust paragraph and linked pages still
 * need before this can be considered final.
 */
export function Footer() {
  return (
    <footer className="bg-navy-dark text-background">
      <div className="bg-gold h-1" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/" className="font-display text-lg font-extrabold">
              {/* Aus<span className="text-gold">Market</span> */}
              <TradingGuideLogoWhite />
            </Link>
            <p className="text-background/60 mt-1 text-xs">
              Independent trading research — online share trading and cryptocurrency
            </p>
          </div>

          {/* legalName/abn/businessAddress confirmed 2026-09-21
              (src/lib/config/business.ts) and render here automatically;
              this block still degrades to just the trading name if any of
              them are ever unset again -- never fabricate a fallback. */}
          <div className="text-background/70 text-right text-xs leading-relaxed">
            <p>
              {"\u00A9"} {YEAR}{" "}
              {businessIdentity.legalName ?? siteConfig.shortName}
              {businessIdentity.abn
                ? ` \u00B7 ABN ${businessIdentity.abn}`
                : null}
            </p>
            {businessIdentity.businessAddress ? (
              <p>{businessIdentity.businessAddress}</p>
            ) : null}
          </div>
        </div>

        <div className="border-background/15 my-6 border-t" />

        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-center text-sm"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className="text-background/85 hover:text-gold-soft transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-background/15 my-6 border-t" />

        {/* TODO(content-gap): this paragraph is a draft, not reviewed legal
            copy -- see docs/CONTENT-GAPS.md "Footer trust paragraph". */}
        <p className="text-background/60 mx-auto max-w-3xl text-center text-xs leading-relaxed">
          Trading Guide is an independent comparison and research service{" "}
          {"\u2014"} we don&apos;t hold an Australian Financial Services Licence
          and don&apos;t provide financial advice. We&apos;re currently 100%
          self-funded and don&apos;t earn commissions from providers; in future
          we may earn a commission when you use a provider link on this site, at
          no extra cost to you and without affecting the alphabetical order
          providers appear in. We don&apos;t compare every provider available in
          Australia, and provider fees, features and regulatory status can
          change {"\u2014"} always verify directly with the provider. All
          investing carries risk, including the risk of losing your entire
          investment; crypto assets are typically more volatile than listed
          shares.
        </p>
      </div>
    </footer>
  );
}
