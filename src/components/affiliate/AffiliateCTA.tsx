import { AffiliateDisclosure } from "./AffiliateDisclosure";

export function AffiliateCTA({
  offeringSlug,
  providerName,
  variant = "default",
  showDisclosure = false,
  isNewTab = true,
  placement,
}: {
  offeringSlug: string;
  providerName: string;
  /**
   * "default" — bordered panel, own label ("Visit {providerName}"). Use
   * wherever the CTA stands alone (e.g. one card per provider).
   * "compact" — no border/panel, tighter padding, meant to sit inline next
   * to a logo/name row (e.g. a provider profile hero). Label defaults to
   * "Visit site" since naming the provider right next to its own logo is
   * redundant.
   */
  variant?: "default" | "compact";
  /** Set false when the caller renders one shared AffiliateDisclosure for a whole section (e.g. several provider cards, or another AffiliateCTA lower on the same page) instead of per-card. */
  showDisclosure?: boolean;
  isNewTab?: boolean;
  /** Tags this click's placement in the admin click report (e.g.
   * "compare", "profile-hero") independently of whatever default
   * placement is stored on the AffiliateEngagement record -- see the
   * ?placement override in src/app/go/[offering]/route.ts. Omit to fall
   * back to the engagement metadata. */
  placement?: string;
}) {
  const label = variant === "compact" ? "Visit site" : `Visit ${providerName}`;
  const href = placement
    ? `/go/${offeringSlug}?placement=${encodeURIComponent(placement)}`
    : `/go/${offeringSlug}`; // referral params live in AffiliateEngagement.destinationUrl, not appended here

  const link = (
    <a
      target={isNewTab ? "_blank" : "_self"}
      // "sponsored" tells Google this is a paid/affiliate link (Google's
      // link-qualification guidance) -- robots.txt disallowing /go/ stops
      // crawling it, but rel is what discloses the commercial
      // relationship on links that do get seen. "noopener" alone (not
      // "noreferrer") keeps the tab-hijack protection without stripping
      // the Referer header that /go/[offering]/route.ts reads for
      // AffiliateEvent.sourcePage -- noreferrer was silently zeroing out
      // click attribution.
      rel={isNewTab ? "sponsored noopener" : "sponsored"}
      href={href}
      className="bg-navy text-background hover:bg-navy-dark inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
    >
      {label}
    </a>
  );

  if (variant === "compact") {
    return (
      <>
        {link}
        {showDisclosure && <AffiliateDisclosure />}
      </>
    );
  }

  return (
    <div className="border-gold-soft bg-panel-secondary mt-6 rounded-2xl border p-4">
      {link}
      {showDisclosure && <AffiliateDisclosure />}
    </div>
  );
}
