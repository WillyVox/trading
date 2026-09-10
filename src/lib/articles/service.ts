import { articleRepository } from "@/lib/repository";

export function getPublishedArticles(opts: { page?: number; pageSize?: number; category?: string } = {}) {
  return articleRepository.paginate({
    where: { status: "PUBLISHED", ...(opts.category ? { category: opts.category } : {}) },
    orderBy: { publishedAt: "desc" },
    page: opts.page,
    pageSize: opts.pageSize,
  });
}

export async function getArticleBySlug(slug: string) {
  const article = await articleRepository.findBySlug(slug, {
    include: { tags: true, sources: true, providers: { include: { provider: true } } },
  });
  if (!article || article.status !== "PUBLISHED") return null;
  return article;
}

export function getAdminArticles(opts: { page?: number; pageSize?: number } = {}) {
  return articleRepository.paginate({ orderBy: { updatedAt: "desc" }, page: opts.page, pageSize: opts.pageSize });
}
