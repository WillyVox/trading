import Link from "next/link";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { Badge } from "@/components/ui/Badge";
import {
  formatProductType,
  formatAccountType,
  custodyTypeCopy,
} from "@/lib/offerings/labels";
import type { OfferingListItem } from "@/lib/offerings/service";
import { VisitSite } from "@/components/affiliate/VisitSite";

/**
 * Dense row layout for /share-trading (Option B from the redesign mockup,
 * chosen over the wider card grid). Deliberately only surfaces facts the
 * Offering domain actually has today -- markets, products, custody,
 * account types, verification status, and `website` -- rather than fee /
 * minimum-trade / star-rating fields that don't exist on ProviderOffering
 * yet (see docs/ROADMAP.md: Milestone 1 excludes OfferingFee, and
 * src/lib/seo/schema.ts's "no fake Review/AggregateRating" rule).
 */
export function OfferingListCard({ offering }: { offering: OfferingListItem }) {
  const marketCodes = offering.markets.map((m) => m.market.code);
  const visibleMarkets = marketCodes.slice(0, 3);
  const extraMarketCount = marketCodes.length - visibleMarkets.length;

  // "Home market" custody is what most visitors care about first (how are
  // *my* ASX shares held), so an ASX row -- when present -- takes priority
  // over an arbitrary first entry; international custody differences are
  // still covered on the full profile page.
  const primaryCustody =
    offering.custody.find((c) => c.market?.code === "ASX") ??
    offering.custody[0] ??
    null;

  const productLabels = offering.products.map((p) =>
    formatProductType(p.productType)
  );
  const accountTypeLabels = offering.accountTypes.map((a) =>
    formatAccountType(a.accountType)
  );

  return (
    <div className="border-border bg-panel hover:border-gold-soft grid grid-cols-1 items-center gap-4 rounded-2xl border p-5 transition-colors md:grid-cols-[auto_1.3fr_1.5fr_auto] md:gap-6">
      {/* Identity */}
      <div className="flex min-w-0 items-center gap-3">
        <ProviderLogo logo={offering.logo} name={offering.name} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-navy truncate text-base font-bold">
              {offering.name}
            </h2>
            <VerificationBadge status={offering.verificationStatus} />
          </div>
          <p className="text-muted mt-0.5 truncate text-xs">
            A {offering.provider.name} product
          </p>
        </div>
      </div>

      {/* Markets / custody / account types */}
      <div className="flex flex-wrap gap-1.5">
        {visibleMarkets.map((code) => (
          <Badge key={code} tone="blue">
            {code}
          </Badge>
        ))}
        {extraMarketCount > 0 && <Badge tone="blue">+{extraMarketCount}</Badge>}
        {primaryCustody && (
          <Badge tone="green">
            {custodyTypeCopy(primaryCustody.custodyType).label}
          </Badge>
        )}
        {accountTypeLabels.map((label) => (
          <Badge key={label} tone="gold">
            {label}
          </Badge>
        ))}
      </div>

      {/* Products */}
      <div className="flex flex-wrap content-start gap-1.5">
        {productLabels.length === 0 && (
          <span className="text-muted text-xs">No product data yet</span>
        )}
        {productLabels.map((label) => (
          <span
            key={label}
            className="border-border bg-panel-secondary text-text rounded-md border px-2 py-0.5 text-xs font-semibold"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-row items-center gap-3 md:flex-col md:items-end">
        <VisitSite
          partnerSlug={offering.slug}
          href={offering.website ?? ""}
          placement="share-trading"
        />
        <Link
          href={`/share-trading/${offering.slug}`}
          className="text-navy text-xs font-semibold whitespace-nowrap hover:underline"
        >
          Full profile →
        </Link>
      </div>
    </div>
  );
}
