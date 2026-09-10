import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Comparison Methodology",
  description: "How AusMarket builds comparison tables from verified provider facts.",
  path: "/methodology/comparisons",
});

export default function ComparisonMethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-navy">Comparison Methodology</h1>
      <p className="mt-4 text-muted">Explains how comparison tables are built from verified provider facts.</p>
    </div>
  );
}
