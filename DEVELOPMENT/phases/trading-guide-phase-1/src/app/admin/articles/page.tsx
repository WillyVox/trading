import Link from "next/link";
import { getAdminArticles } from "@/lib/articles/service";

export default async function AdminArticlesPage() {
  const { items } = await getAdminArticles();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy">Articles</h1>
        <Link href="/admin/articles/new" className="rounded-full bg-navy px-4 py-1.5 text-sm font-semibold text-background hover:bg-navy-dark">
          New article
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-6 text-muted">No articles yet.</p>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2">Title</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a: any) => (
              <tr key={a.id} className="border-b border-border">
                <td className="py-2">
                  <Link href={`/admin/articles/${a.id}`}>{a.title}</Link>
                </td>
                <td className="py-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
