import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { PHASE_9_3_GUIDES } from "@/lib/guides/phase9-3-guides";
import { buildMetadata } from "@/lib/seo/metadata";

const config = PHASE_9_3_GUIDES["austrac-crypto-registration"];
export const metadata = buildMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  type: "article",
  publishedTime: "2026-09-22",
  modifiedTime: "2026-09-22",
  authors: ["Editorial Team"],
});
export default function Page() {
  return <ResearchGuidePage config={config} />;
}
