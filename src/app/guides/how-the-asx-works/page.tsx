import { ResearchGuidePage } from "@/components/guide/ResearchGuidePage";
import { LEARNING_FOUNDATION_GUIDES } from "@/lib/guides/learning-foundation-guides";
import { buildMetadata } from "@/lib/seo/metadata";
const config = LEARNING_FOUNDATION_GUIDES["how-the-asx-works"];
export const metadata = buildMetadata({
  title: config.title,
  description: config.description,
  path: config.path,
  type: "article",
  publishedTime: "2026-09-24",
  modifiedTime: "2026-09-24",
  authors: ["Trading Guide Editorial Team"],
});
export default function Page() {
  return <ResearchGuidePage config={config} />;
}
