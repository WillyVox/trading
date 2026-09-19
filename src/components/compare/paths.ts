import type { CompareSubject } from "./types";

export function comparisonHrefWithout(
  basePath: string,
  subjects: CompareSubject[],
  slugToRemove: string
): string {
  const remaining = subjects
    .map((s) => s.slug)
    .filter((slug) => slug !== slugToRemove);
  return `${basePath}/${remaining.join("-vs-")}`;
}
