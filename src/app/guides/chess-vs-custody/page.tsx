import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { custodyEvidenceRows } from "@/lib/guides/topic-evidence";
import { CustodyEvidence } from "@/components/guide/TopicEvidencePanels";

const config = PHASE_9_3_GUIDES["chess-vs-custody"];
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
  const rows = await custodyEvidenceRows();
  return (
    <ResearchGuidePage
      config={config}
      evidence={<CustodyEvidence rows={rows} />}
    />
  );
}
