import { AffiliateDisclosure } from "./AffiliateDisclosure";

export function AffiliateCTA({
  partnerSlug,
  providerName,
  variant = "default",
  showDisclosure = false,
  isNewTab = true,
}: {
  partnerSlug: string;
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
}) {
  const label = variant === "compact" ? "Visit site" : `Visit ${providerName}`;

  const link = (
    <a
      target={isNewTab ? "_blank" : "_self"}
      rel={isNewTab ? "noopener noreferrer" : undefined}
      href={`/go/${partnerSlug}`} // [TODO] should append our referred Id here to send to partner
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
