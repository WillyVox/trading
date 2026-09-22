import type { SearchDocument } from "./types";

function normalize(value: string): string {
  return value.toLocaleLowerCase("en-AU").replace(/[^a-z0-9]+/g, " ").trim();
}

export function scoreSearchDocument(document: SearchDocument, rawQuery: string): number {
  const query = normalize(rawQuery);
  if (!query) return 0;
  const title = normalize(document.title);
  const description = normalize(document.description);
  const category = normalize(document.category ?? "");
  const keywords = normalize((document.keywords ?? []).join(" "));
  const terms = query.split(" ").filter(Boolean);

  let score = 0;
  if (title === query) score += 120;
  if (title.startsWith(query)) score += 80;
  if (title.includes(query)) score += 55;
  if (keywords.includes(query)) score += 35;
  if (category.includes(query)) score += 25;
  if (description.includes(query)) score += 15;

  for (const term of terms) {
    if (title.includes(term)) score += 12;
    if (keywords.includes(term)) score += 7;
    if (category.includes(term)) score += 5;
    if (description.includes(term)) score += 2;
  }
  return score;
}

export function rankSearchDocuments(documents: SearchDocument[], query: string, limit = 12): SearchDocument[] {
  const seen = new Set<string>();
  return documents
    .map((document) => ({ document, score: scoreSearchDocument(document, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title, "en-AU"))
    .filter(({ document }) => {
      if (seen.has(document.href)) return false;
      seen.add(document.href);
      return true;
    })
    .slice(0, limit)
    .map(({ document }) => document);
}
