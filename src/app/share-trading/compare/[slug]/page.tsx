import { permanentRedirect } from "next/navigation";

export default async function LegacyShareTradingComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/compare/trading-platforms/${encodeURIComponent(slug)}`);
}
