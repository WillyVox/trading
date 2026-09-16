import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [articleCount, providerCount, activeAffiliateCount] = await Promise.all(
    [
      prisma.article.count(),
      prisma.provider.count(),
      prisma.affiliateLink.count({ where: { active: true } }),
    ]
  );

  return (
    <div>
      <h1 className="font-display text-navy text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="border-border bg-panel rounded-2xl border p-4 shadow-sm">
          <p className="text-muted text-sm">Articles</p>
          <p className="font-display text-navy text-2xl font-bold">
            {articleCount}
          </p>
        </div>
        <div className="border-border bg-panel rounded-2xl border p-4 shadow-sm">
          <p className="text-muted text-sm">Providers</p>
          <p className="font-display text-navy text-2xl font-bold">
            {providerCount}
          </p>
        </div>
        <div className="border-border bg-panel rounded-2xl border p-4 shadow-sm">
          <p className="text-muted text-sm">Active affiliate links</p>
          <p className="font-display text-navy text-2xl font-bold">
            {activeAffiliateCount}
          </p>
        </div>
      </div>
    </div>
  );
}
