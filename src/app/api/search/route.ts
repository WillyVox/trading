import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeDatabaseQuery } from "@/lib/data/safe-database-query";
import { getStaticSearchDocuments } from "@/lib/search/static-index";
import { rankSearchDocuments } from "@/lib/search/rank";
import type { SearchDocument, SearchResponse } from "@/lib/search/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 120);
  if (query.length < 2) {
    return NextResponse.json<SearchResponse>({ query, results: [], database: "available", partial: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const staticDocuments = getStaticSearchDocuments();
  const databaseResult = await safeDatabaseQuery("search.published-articles", () =>
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        noIndex: false,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { tags: { some: { tag: { contains: query, mode: "insensitive" } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        articleType: true,
        publishedAt: true,
        tags: { select: { tag: true } },
      },
      take: 30,
    }),
  );

  const databaseDocuments: SearchDocument[] = databaseResult.ok
    ? databaseResult.data.map((article) => ({
        id: `article:${article.id}`,
        title: article.title,
        description: article.excerpt ?? "Trading Guide editorial content.",
        href: article.articleType === "NEWS" ? `/news/${article.slug}` : `/guides/${article.slug}`,
        type: article.articleType === "NEWS" ? "NEWS" : "ARTICLE",
        category: article.category,
        keywords: article.tags.map((tag) => tag.tag),
        source: "DATABASE",
        publishedAt: article.publishedAt?.toISOString() ?? null,
      }))
    : [];

  const response: SearchResponse = {
    query,
    results: rankSearchDocuments([...staticDocuments, ...databaseDocuments], query),
    database: databaseResult.ok ? "available" : "unavailable",
    partial: !databaseResult.ok,
  };
  return NextResponse.json(response, { headers: { "Cache-Control": "no-store" } });
}
