import { LiveEvidencePanel } from "@/components/guide/LiveEvidencePanel";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";
import { LiveEvidenceUnavailable } from "@/components/data/LiveEvidenceUnavailable";
import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { cryptoWorkedExamples } from "@/lib/guides/live-evidence";
import { buildMetadata } from "@/lib/seo/metadata";

const config = PHASE_9_3_GUIDES["crypto-exchange-fees-australia"];
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
    "guide.cryptoWorkedExamples",
    () => cryptoWorkedExamples()
  );
  const rows = evidenceResult.ok ? evidenceResult.data : [];
  return (
    <ResearchGuidePage
      config={config}
      evidence={
        !evidenceResult.ok ? (
          <LiveEvidenceUnavailable />
        ) : (
          <LiveEvidencePanel
            title="A$1,000 crypto fee examples from verified provider rules"
            description="The same structured fee engine used by Trading Guide's crypto calculator powers these examples. Execution paths stay separate: instant-buy, general trading, maker and taker rules are not treated as equivalent. Tiered examples use A$1,000 transaction value and the base 30-day-volume tier."
            columns={["Illustrative fee", "Execution path"]}
            rows={rows}
            note="Illustrative explicit fees only. Spreads, asset prices, network fees, payment-method charges and other variable costs are not silently treated as zero. Tier qualification currencies can differ from the transaction currency; check the rule and official source before relying on an estimate."
          />
        )
      }
    />
  );
}
