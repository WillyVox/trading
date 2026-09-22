import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { custodyEvidenceRows } from "@/lib/guides/topic-evidence";
import { CustodyEvidence } from "@/components/guide/TopicEvidencePanels";
import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

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
  const evidenceResult = await publicDatabaseRead(
    "guideEvidence.chess-vs-custody",
    custodyEvidenceRows
  );
  const rows = evidenceResult.ok ? evidenceResult.data : [];
  return (
    <ResearchGuidePage
      config={config}
      evidence={
        evidenceResult.ok ? (
          <CustodyEvidence rows={rows} />
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
