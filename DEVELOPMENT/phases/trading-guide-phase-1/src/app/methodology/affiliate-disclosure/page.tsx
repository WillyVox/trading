import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description: "How AusMarket's affiliate relationships work and why they never influence editorial rankings.",
  path: "/methodology/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-navy">Affiliate Disclosure</h1>
      <p className="mt-4 text-muted">
        AusMarket may receive a commission when you sign up with a provider through our links.
        This never influences editorial rankings or comparison order.
      </p>
    </div>
  );
}
