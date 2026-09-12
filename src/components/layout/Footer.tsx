import Link from "next/link";
import { footerLinks } from "@/lib/config/footer";
import { businessIdentity } from "@/lib/config/business";

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
      <div className="h-1 bg-gold" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/" className="font-display text-lg font-extrabold">
              Aus<span className="text-gold">Market</span>
            </Link>
            <p className="mt-1 text-xs text-background/60">
              Independent Australian crypto exchange research
            </p>
          </div>

          {/* legalName/abn/businessAddress are unset until real values are
              supplied (src/lib/config/business.ts) -- never fabricate them.
              This renders just the trading name until then. */}
          <div className="text-right text-xs leading-relaxed text-background/70">
            <p>
              {"\u00A9"} {YEAR} {businessIdentity.legalName ?? "AusMarket Crypto"}
              {businessIdentity.abn ? ` \u00B7 ABN ${businessIdentity.abn}` : null}
            </p>
            {businessIdentity.businessAddress ? <p>{businessIdentity.businessAddress}</p> : null}
          </div>
        </div>

        <div className="my-6 border-t border-background/15" />

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-center text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className="text-background/85 transition-colors hover:text-gold-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="my-6 border-t border-background/15" />

        {/* TODO(content-gap): this paragraph is a draft, not reviewed legal
            copy -- see docs/CONTENT-GAPS.md "Footer trust paragraph". */}
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-background/60">
          AusMarket is an independent comparison and research service {"\u2014"} we don&apos;t hold
          an Australian Financial Services Licence and don&apos;t provide financial advice. We may
          earn a commission when you use a provider link on this site; this doesn&apos;t affect the
          alphabetical order providers appear in. We don&apos;t compare every provider available in
          Australia, and provider fees, features and regulatory status can change {"\u2014"} always
          verify directly with the provider. Crypto assets are volatile and can lose value.
        </p>
      </div>
    </footer>
  );
}