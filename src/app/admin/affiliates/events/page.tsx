import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getAffiliateEventsAdmin } from "@/lib/affiliates/service";
const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
export default async function AdminAffiliateEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const { items, total, pageCount } = await getAffiliateEventsAdmin(page);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-navy text-lg font-bold">
          Affiliate events
        </h2>
        <p className="text-muted text-sm">{total} total</p>
      </div>
      {items.length === 0 ? (
        <p className="text-muted mt-4">No events recorded yet.</p>
      ) : (
        <>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-border text-muted border-b text-left">
                <th className="py-2">Offering</th>
                <th>Type</th>
                <th>Source</th>
                <th>Placement</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-border border-b">
                  <td className="py-2">
                    {e.engagement.offering.name}
                    <div className="text-muted font-mono text-xs">
                      {e.engagement.offering.slug}
                    </div>
                  </td>
                  <td>{e.eventType}</td>
                  <td className="text-muted max-w-[220px] truncate">
                    {e.sourcePage ?? "—"}
                  </td>
                  <td>{e.placement ?? "—"}</td>
                  <td className="text-muted">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageCount > 1 && (
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted">
                Page {page} of {pageCount}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/affiliates/events?page=${page - 1}`}>
                    Previous
                  </Link>
                )}
                {page < pageCount && (
                  <Link href={`/admin/affiliates/events?page=${page + 1}`}>
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
