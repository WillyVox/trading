import { permanentRedirect } from "next/navigation";
import { cryptoExchangeComparisonPath } from "@/lib/crypto-exchanges/routes";

export default async function LegacyCryptoExchangeComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(cryptoExchangeComparisonPath(slug));
}
