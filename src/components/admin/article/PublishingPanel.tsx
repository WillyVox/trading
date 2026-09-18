import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  submitArticleForReview,
  moveArticleBackToDraft,
  publishArticle,
  unpublishArticle,
  archiveArticle,
  restoreArticleFromArchive,
} from "@/lib/articles/actions";

type Status = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

const STATUS_TONE: Record<Status, "muted" | "gold" | "green" | "red"> = {
  DRAFT: "muted",
  REVIEW: "gold",
  PUBLISHED: "green",
  ARCHIVED: "red",
};

function fmt(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Every button here is its own <form> (HTML forms can't nest, and this is
 * "one button = one server action" per Req.md §43/§4 — each transition
 * independently calls requireAdmin() and re-checks the current status
 * server-side, so nothing here is trusted just because the button is
 * visible).
 */
export function PublishingPanel({
  articleId,
  status,
  createdAt,
  updatedAt,
  publishedAt,
}: {
  articleId: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-navy text-lg font-bold">Publishing</h2>
        <Badge tone={STATUS_TONE[status]}>{status}</Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">Created</dt>
          <dd className="text-navy">{fmt(createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted">Updated</dt>
          <dd className="text-navy">{fmt(updatedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted">Published</dt>
          <dd className="text-navy">{fmt(publishedAt)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/articles/${articleId}/preview`}
          className="border-border bg-panel-secondary text-navy hover:bg-border rounded-full border px-4 py-2 text-sm font-semibold"
        >
          Preview
        </Link>

        {status === "DRAFT" && (
          <>
            <form action={submitArticleForReview}>
              <input type="hidden" name="id" value={articleId} />
              <button
                type="submit"
                className="bg-navy text-background hover:bg-navy-dark rounded-full px-4 py-2 text-sm font-semibold"
              >
                Submit for review
              </button>
            </form>
            <ArchiveButton articleId={articleId} />
          </>
        )}

        {status === "REVIEW" && (
          <>
            <form action={moveArticleBackToDraft}>
              <input type="hidden" name="id" value={articleId} />
              <button
                type="submit"
                className="border-border bg-panel-secondary text-navy hover:bg-border rounded-full border px-4 py-2 text-sm font-semibold"
              >
                Back to draft
              </button>
            </form>
            <form action={publishArticle}>
              <input type="hidden" name="id" value={articleId} />
              <button
                type="submit"
                className="bg-green text-background rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                Publish
              </button>
            </form>
            <ArchiveButton articleId={articleId} />
          </>
        )}

        {status === "PUBLISHED" && (
          <>
            <form action={unpublishArticle}>
              <input type="hidden" name="id" value={articleId} />
              <button
                type="submit"
                className="border-border bg-panel-secondary text-navy hover:bg-border rounded-full border px-4 py-2 text-sm font-semibold"
              >
                Unpublish (back to draft)
              </button>
            </form>
            <ArchiveButton articleId={articleId} />
          </>
        )}

        {status === "ARCHIVED" && (
          <form action={restoreArticleFromArchive}>
            <input type="hidden" name="id" value={articleId} />
            <button
              type="submit"
              className="border-border bg-panel-secondary text-navy hover:bg-border rounded-full border px-4 py-2 text-sm font-semibold"
            >
              Restore to draft
            </button>
          </form>
        )}
      </div>
    </Card>
  );
}

function ArchiveButton({ articleId }: { articleId: string }) {
  return (
    <form action={archiveArticle}>
      <input type="hidden" name="id" value={articleId} />
      <button
        type="submit"
        className="border-red/40 bg-red/10 text-red hover:bg-red/20 rounded-full border px-4 py-2 text-sm font-semibold"
      >
        Archive
      </button>
    </form>
  );
}
