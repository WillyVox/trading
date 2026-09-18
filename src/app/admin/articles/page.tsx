import Link from "next/link";
import type { Article } from "@prisma/client";
import {
  getAdminArticles,
  getAdminArticleCategories,
} from "@/lib/articles/service";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArticleRowActions } from "@/components/admin/article/ArticleRowActions";

type Status = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

const STATUS_OPTIONS: Status[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];
const TYPE_OPTIONS = ["NEWS", "GUIDE"] as const;

const STATUS_TONE: Record<Status, "muted" | "gold" | "green" | "red"> = {
  DRAFT: "muted",
  REVIEW: "gold",
  PUBLISHED: "green",
  ARCHIVED: "red",
};

function fmt(d: Date | null | undefined): string {
  if (!d) return "\u2014";
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(d));
}

/** Builds a query string for the pagination links that preserves the current filters. */
function pageHref(
  params: Record<string, string | undefined>,
  page: number
): string {
  const usp = new URLSearchParams();
  if (params.status) usp.set("status", params.status);
  if (params.articleType) usp.set("articleType", params.articleType);
  if (params.category) usp.set("category", params.category);
  if (params.search) usp.set("search", params.search);
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `/admin/articles?${qs}` : "/admin/articles";
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    articleType?: string;
    category?: string;
    search?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = (STATUS_OPTIONS as readonly string[]).includes(sp.status ?? "")
    ? (sp.status as Status)
    : undefined;
  const articleType = (TYPE_OPTIONS as readonly string[]).includes(
    sp.articleType ?? ""
  )
    ? (sp.articleType as (typeof TYPE_OPTIONS)[number])
    : undefined;
  const category = sp.category?.trim() || undefined;
  const search = sp.search?.trim() || undefined;

  const [{ items, total, pageCount }, categories] = await Promise.all([
    getAdminArticles({ page, status, articleType, category, search }),
    getAdminArticleCategories(),
  ]);

  const filterParams = { status, articleType, category, search };
  const hasFilters = Boolean(status || articleType || category || search);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-navy text-2xl font-bold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-navy text-background hover:bg-navy-dark rounded-full px-4 py-1.5 text-sm font-semibold"
        >
          New article
        </Link>
      </div>

      <Card className="mt-6">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm">
            <span className="text-muted mb-1">Status</span>
            <select
              name="status"
              defaultValue={status ?? ""}
              className="border-border bg-panel-secondary text-navy min-w-[140px] rounded-lg border px-3 py-2"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-muted mb-1">Type</span>
            <select
              name="articleType"
              defaultValue={articleType ?? ""}
              className="border-border bg-panel-secondary text-navy min-w-[140px] rounded-lg border px-3 py-2"
            >
              <option value="">All types</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-muted mb-1">Category</span>
            <select
              name="category"
              defaultValue={category ?? ""}
              className="border-border bg-panel-secondary text-navy min-w-[160px] rounded-lg border px-3 py-2"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-muted mb-1">Search</span>
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Title or slug"
              className="border-border bg-panel-secondary text-navy min-w-[200px] rounded-lg border px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="bg-navy text-background hover:bg-navy-dark rounded-full px-5 py-2 text-sm font-semibold"
          >
            Apply filters
          </button>
          {hasFilters && (
            <Link
              href="/admin/articles"
              className="border-border text-navy hover:bg-panel-secondary rounded-full border px-5 py-2 text-sm font-semibold"
            >
              Clear
            </Link>
          )}
        </form>
      </Card>

      <p className="text-muted mt-4 text-sm">
        {total} article{total === 1 ? "" : "s"}
        {hasFilters ? " matching these filters" : ""}
      </p>

      {items.length === 0 ? (
        <p className="text-muted mt-2">
          {hasFilters ? "No articles match these filters." : "No articles yet."}
        </p>
      ) : (
        <Card className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted border-b text-left">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Updated</th>
                <th className="py-2 pr-4">Published</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a: Article) => (
                <tr key={a.id} className="border-border border-b align-top">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="text-navy font-medium hover:underline"
                    >
                      {a.title}
                    </Link>
                    <div className="text-muted text-xs">{a.slug}</div>
                  </td>
                  <td className="text-navy py-2 pr-4">{a.articleType}</td>
                  <td className="py-2 pr-4">
                    <Badge tone={STATUS_TONE[a.status as Status]}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="text-muted py-2 pr-4">
                    {a.category ?? "\u2014"}
                  </td>
                  <td className="text-muted py-2 pr-4">{fmt(a.updatedAt)}</td>
                  <td className="text-muted py-2 pr-4">{fmt(a.publishedAt)}</td>
                  <td className="py-2">
                    <ArticleRowActions
                      articleId={a.id}
                      status={a.status as Status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted">
                Page {page} of {pageCount}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={pageHref(filterParams, page - 1)}
                    className="border-border text-navy hover:bg-panel-secondary rounded-full border px-3 py-1"
                  >
                    Previous
                  </Link>
                )}
                {page < pageCount && (
                  <Link
                    href={pageHref(filterParams, page + 1)}
                    className="border-border text-navy hover:bg-panel-secondary rounded-full border px-3 py-1"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
