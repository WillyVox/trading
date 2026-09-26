import { LiveEvidencePanel } from "@/components/guide/LiveEvidencePanel";
import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { cryptoWorkedExamples } from "@/lib/guides/live-evidence";
import { buildMetadata } from "@/lib/seo/metadata";
import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

const config = PHASE_9_3_GUIDES["crypto-exchange-fees-australia"];
export const metadata = buildMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  type: "article",
  publishedTime: "2026-09-22",
  modifiedTime: "2026-09-22",
  authors: ["Editorial Team"],
});
export const revalidate = 3600;

export default async function Page() {
  const evidenceResult = await publicDatabaseRead(
    "guideEvidence.crypto-exchange-fees-australia",
    cryptoWorkedExamples
  );
  const rows = evidenceResult.ok ? evidenceResult.data : [];
  return (
    <ResearchGuidePage
      config={config}
      evidence={
        evidenceResult.ok ? (
          <LiveEvidencePanel
            title="A$1,000 crypto fee examples from verified provider rules"
            description="The same structured fee engine used by Trading Guide's crypto calculator powers these examples. Execution paths stay separate: instant-buy, general trading, maker and taker rules are not treated as equivalent. Tiered examples use A$1,000 transaction value and the base 30-day-volume tier."
            columns={["Illustrative fee", "Execution path"]}
            rows={rows}
            note="Illustrative explicit fees only. Spreads, asset prices, network fees, payment-method charges and other variable costs are not silently treated as zero. Tier qualification currencies can differ from the transaction currency; check the rule and official source before relying on an estimate."
          />
        ) : (
          <DataUnavailable
            compact
            title="Live provider evidence is temporarily unavailable"
          >
            The guide remains available, but its database-backed evidence panel
            could not be loaded right now.
          </DataUnavailable>
        )
      }
    />
  );
}
