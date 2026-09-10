import { AffiliateDisclosure } from "./AffiliateDisclosure";

export function AffiliateCTA({ partnerSlug, providerName }: { partnerSlug: string; providerName: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-gold-soft bg-panel-secondary p-4">
      <a
        href={`/go/${partnerSlug}`}
        className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-background hover:bg-navy-dark"
      >
        Visit {providerName}
      </a>
      <AffiliateDisclosure />
    </div>
  );
}
