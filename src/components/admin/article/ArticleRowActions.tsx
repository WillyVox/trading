import Link from "next/link";
import {
  submitArticleForReview,
  moveArticleBackToDraft,
  publishArticle,
  unpublishArticle,
  archiveArticle,
  restoreArticleFromArchive,
} from "@/lib/articles/actions";

type Status = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

const BTN = "rounded-full border border-border bg-panel-secondary px-3 py-1 text-xs font-semibold text-navy hover:bg-border";
const BTN_PRIMARY = "rounded-full bg-navy px-3 py-1 text-xs font-semibold text-background hover:bg-navy-dark";
const BTN_GREEN = "rounded-full bg-green px-3 py-1 text-xs font-semibold text-background hover:opacity-90";
const BTN_RED = "rounded-full border border-red/40 bg-red/10 px-3 py-1 text-xs font-semibold text-red hover:bg-red/20";

/**
 * Same server actions PublishingPanel uses on the full editor page — this
 * is just a smaller-footprint rendering for the /admin/articles table row,
 * not a second implementation of the transition logic. Each button is its
 * own <form>; requireAdmin() and the current-status check happen server-side
 * on every submit regardless of which button was visible client-side.
 */
export function ArticleRowActions({ articleId, status }: { articleId: string; status: Status }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link href={`/admin/articles/${articleId}`} className={BTN}>
        Edit
      </Link>
      <Link href={`/admin/articles/${articleId}/preview`} className={BTN}>
        Preview
      </Link>

      {status === "DRAFT" && (
        <>
          <form action={submitArticleForReview}>
            <input type="hidden" name="id" value={articleId} />
            <button type="submit" className={BTN_PRIMARY}>
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
            <button type="submit" className={BTN}>
              Back to draft
            </button>
          </form>
          <form action={publishArticle}>
            <input type="hidden" name="id" value={articleId} />
            <button type="submit" className={BTN_GREEN}>
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
            <button type="submit" className={BTN}>
              Unpublish
            </button>
          </form>
          <ArchiveButton articleId={articleId} />
        </>
      )}

      {status === "ARCHIVED" && (
        <form action={restoreArticleFromArchive}>
          <input type="hidden" name="id" value={articleId} />
          <button type="submit" className={BTN}>
            Restore to draft
          </button>
        </form>
      )}
    </div>
  );
}

function ArchiveButton({ articleId }: { articleId: string }) {
  return (
    <form action={archiveArticle}>
      <input type="hidden" name="id" value={articleId} />
      <button type="submit" className={BTN_RED}>
        Archive
      </button>
    </form>
  );
}