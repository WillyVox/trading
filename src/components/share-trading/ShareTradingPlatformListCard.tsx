import Link from "next/link";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { Badge } from "@/components/ui/Badge";
import { Explain } from "@/components/explain/Explain";
import {
  formatProductType,
  formatAccountType,
  custodyTypeCopy,
  custodyTermKey,
  pickHeadlineFee,
  formatHeadlineFee,
} from "@/lib/share-trading/labels";
import type { ShareTradingPlatformListItem } from "@/lib/share-trading/service";
import { VisitSite } from "@/components/affiliate/VisitSite";

/**
 * Dense row layout for /share-trading (Option B from the redesign mockup,
 * chosen over the wider card grid). Surfaces markets, products, custody,
 * account types, verification status, `website`, and — since Phase 2 — a
 * headline ASX brokerage figure. Still deliberately no star rating or
 * AggregateRating: that's a real absence, not a layout omission (see
 * src/lib/seo/schema.ts's "no fake Review/AggregateRating" rule).
 */
export function ShareTradingPlatformListCard({
  offering,
  hasActiveAffiliate = false,
}: {
  offering: ShareTradingPlatformListItem;
  hasActiveAffiliate?: boolean;
}) {
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
  const primaryCustodyTerm = primaryCustody
    ? custodyTermKey(primaryCustody.custodyType)
    : null;

  // Same "home market first" reasoning as primaryCustody above: ASX
  // brokerage is the one number almost every visitor is comparing on,
  // regardless of what other markets an offering covers. Promotional fees
  // are excluded here too (see buildFeeRows in offerings/compare.ts) --
  // a chip is even less room than a compare row to add the "conditions
  // apply" context a promo needs, so it stays a profile-page detail.
  const asxBrokerageFees = offering.fees.filter(
    (f) =>
      !f.isPromotional &&
      f.feeCategory === "BROKERAGE" &&
      f.market?.code === "ASX"
  );
  const headlineFee = pickHeadlineFee(asxBrokerageFees);
  const headline = headlineFee ? formatHeadlineFee(headlineFee) : null;

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
          <span className="inline-flex items-center">
            <Badge tone="green">
              {custodyTypeCopy(primaryCustody.custodyType).label}
            </Badge>
            {primaryCustodyTerm && (
              <Explain
                term={primaryCustodyTerm}
                scope={`${offering.slug}-list`}
              />
            )}
          </span>
        )}
        {accountTypeLabels.map((label) => (
          <Badge key={label} tone="gold">
            {label}
          </Badge>
        ))}
      </div>

      {/* Products (+ headline brokerage fee) */}
      <div className="flex flex-col gap-1.5">
        {headline && (
          <p className="text-navy text-xs font-semibold">
            AU brokerage {headline.value}
            {headline.hasCaveat && (
              <span className="text-muted font-normal">
                {" "}
                * tiered by trade value, see profile
              </span>
            )}
          </p>
        )}
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
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 md:justify-end">
        <Link
          href={`/share-trading/${offering.slug}`}
          className="text-navy focus-visible:outline-navy inline-flex min-h-11 shrink-0 items-center text-xs font-semibold whitespace-nowrap hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          View profile{" "}
          <span className="ml-1" aria-hidden="true">
            →
          </span>
        </Link>
        <VisitSite
          providerSlug={offering.provider.slug}
          offeringSlug={offering.slug}
          officialWebsite={offering.website}
          hasActiveAffiliate={hasActiveAffiliate}
          placement="share-trading-browse"
          className="min-w-[9.5rem]"
        />
      </div>
    </div>
  );
}
