import { permanentRedirect } from "next/navigation";

export default async function LegacyCryptoExchangeComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/compare/crypto-exchanges/${encodeURIComponent(slug)}`);
}
