import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";
import { LiveEvidenceUnavailable } from "@/components/data/LiveEvidenceUnavailable";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { cryptoFundingEvidenceRows } from "@/lib/guides/topic-evidence";
import { CryptoFundingEvidence } from "@/components/guide/TopicEvidencePanels";

const config = PHASE_9_3_GUIDES["crypto-exchange-funding-australia"];
export const metadata = buildMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  type: "article",
  publishedTime: "2026-09-22",
  modifiedTime: "2026-09-22",
  authors: ["Trading Guide Editorial Team"],
});
export const revalidate = 3600;
export default async function Page() {
  const evidenceResult = await safeDatabaseQuery(
    "guide.cryptoFundingEvidenceRows",
    () => cryptoFundingEvidenceRows()
  );
  const rows = evidenceResult.ok ? evidenceResult.data : [];
  return (
    <ResearchGuidePage
      config={config}
      evidence={
        !evidenceResult.ok ? (
          <LiveEvidenceUnavailable />
        ) : (
          <CryptoFundingEvidence rows={rows} />
        )
      }
    />
  );
}
