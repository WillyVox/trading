import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description: "AusMarket's editorial standards for accuracy, sourcing, and review.",
  path: "/methodology/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-navy">Editorial Policy</h1>
      <p className="mt-4 text-muted">Our editorial standards for accuracy, sourcing, and review.</p>
    </div>
  );
}
