import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { fractionalEvidenceRows } from "@/lib/guides/topic-evidence";
import { FractionalEvidence } from "@/components/guide/TopicEvidencePanels";
import { DataUnavailable } from "@/components/data/DataUnavailable";
import { publicDatabaseRead } from "@/lib/data/public-read";

const config = PHASE_9_3_GUIDES["fractional-shares-australia"];
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
    "guideEvidence.fractional-shares-australia",
    fractionalEvidenceRows
  );
  const rows = evidenceResult.ok ? evidenceResult.data : [];
  return (
    <ResearchGuidePage
      config={config}
      evidence={
        evidenceResult.ok ? (
          <FractionalEvidence rows={rows} />
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
