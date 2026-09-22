import { LiveEvidencePanel } from "@/components/guide/LiveEvidencePanel";
import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { brokerageWorkedExamples } from "@/lib/guides/live-evidence";
import { buildMetadata } from "@/lib/seo/metadata";

const config = PHASE_9_3_GUIDES["brokerage-fees-australia"];
export const metadata = buildMetadata({ title: config.title, description: config.description, path: config.path, type: "article", publishedTime: "2026-09-22", modifiedTime: "2026-09-22", authors: ["Trading Guide Editorial Team"] });
export const revalidate = 3600;

export default async function Page() {
  const rows = await brokerageWorkedExamples();
  return <ResearchGuidePage config={config} evidence={<LiveEvidencePanel
    title="Worked ASX brokerage examples from verified provider rules"
    description="These examples are calculated at request/revalidation time from the same structured OfferingFee records used by Trading Guide's brokerage calculator. They model a standard online ASX buy that is not a first-buy concession and is not margin-loan settled."
    columns={["A$500 trade", "A$1,000 trade", "A$5,000 trade"]}
    rows={rows}
    note="Illustrative brokerage only. The table deliberately excludes rules that are stale, unverified or do not match the stated scenario. Other costs can apply. Conditional concessions, account plans and non-ASX markets can produce different results."
  />} />;
}
