import { prisma } from "@/lib/prisma";

/** Organisation-level editorial relationships only. Product catalogs live in their domain services. */
export async function getRelatedContentForProvider(
  providerId: string,
  limit = 4
) {
  const links = await prisma.articleProvider.findMany({
    where: { providerId, article: { status: "PUBLISHED", noIndex: false } },
    include: {
      article: {
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          articleType: true,
          publishedAt: true,
        },
      },
    },
    orderBy: { article: { publishedAt: "desc" } },
  });

  const guides = links
    .map((l) => l.article)
    .filter((a) => a.articleType === "GUIDE")
    .slice(0, limit);
  const news = links
    .map((l) => l.article)
    .filter((a) => a.articleType === "NEWS")
    .slice(0, limit);

  return { guides, news };
}
