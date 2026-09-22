import "server-only";

import { STATIC_GUIDES } from "@/lib/guides/static-guides";
import { NAV_ITEMS } from "@/lib/nav/config";
import type { SearchDocument } from "./types";

function toolDocuments(): SearchDocument[] {
  const tools = NAV_ITEMS.find((item) => item.label === "Tools");
  const links = tools?.columns?.flatMap((column) =>
    column.links.map((link) => ({ link, category: column.heading })),
  ) ?? [];

  return links.map(({ link, category }) => ({
    id: `tool:${link.href}`,
    title: link.label,
    description: `${category} from Trading Guide.`,
    href: link.href,
    type: "TOOL" as const,
    category,
    keywords: [category, "calculator", "fees", "costs"],
    source: "STATIC" as const,
  }));
}

export function getStaticSearchDocuments(): SearchDocument[] {
  const guides: SearchDocument[] = STATIC_GUIDES.map((guide) => ({
    id: `guide:${guide.slug}`,
    title: guide.title,
    description: guide.excerpt,
    href: `/guides/${guide.slug}`,
    type: "GUIDE",
    category: guide.category,
    keywords: [guide.category],
    source: "STATIC",
    publishedAt: guide.publishedAt,
  }));

  return [...guides, ...toolDocuments()];
}
