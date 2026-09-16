import Link from "next/link";
import { getAffiliateClicksAdmin } from "@/lib/affiliates/service";
import { Card } from "@/components/ui/Card";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminAffiliateClicksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, total, pageCount } = await getAffiliateClicksAdmin(page);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-navy text-lg font-bold">Clicks</h2>
        <p className="text-muted text-sm">{total} total</p>
      </div>
      {items.length === 0 ? (
        <p className="text-muted mt-4">No clicks recorded yet.</p>
      ) : (
        <>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-border text-muted border-b text-left">
                <th className="py-2">Partner slug</th>
                <th className="py-2">Source page</th>
                <th className="py-2">Placement</th>
                <th className="py-2">Campaign</th>
                <th className="py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-border border-b">
                  <td className="py-2 font-mono text-xs">
                    {c.link.partnerSlug}
                  </td>
                  <td className="text-muted max-w-[220px] truncate py-2">
                    {c.sourcePage ?? "\u2014"}
                  </td>
                  <td className="py-2">{c.placement ?? "\u2014"}</td>
                  <td className="py-2">{c.campaign ?? "\u2014"}</td>
                  <td className="text-muted py-2">{formatDate(c.createdAt)}</td>
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
                    href={`/admin/affiliates/clicks?page=${page - 1}`}
                    className="border-border text-navy hover:bg-panel-secondary rounded-full border px-3 py-1"
                  >
                    Previous
                  </Link>
                )}
                {page < pageCount && (
                  <Link
                    href={`/admin/affiliates/clicks?page=${page + 1}`}
                    className="border-border text-navy hover:bg-panel-secondary rounded-full border px-3 py-1"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
