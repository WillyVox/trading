import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [articleCount, providerCount, activeAffiliateCount] = await Promise.all([
    prisma.article.count(),
    prisma.provider.count(),
    prisma.affiliateLink.count({ where: { active: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-panel p-4 shadow-sm">
          <p className="text-sm text-muted">Articles</p>
          <p className="font-display text-2xl font-bold text-navy">{articleCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 shadow-sm">
          <p className="text-sm text-muted">Providers</p>
          <p className="font-display text-2xl font-bold text-navy">{providerCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 shadow-sm">
          <p className="text-sm text-muted">Active affiliate links</p>
          <p className="font-display text-2xl font-bold text-navy">{activeAffiliateCount}</p>
        </div>
      </div>
    </div>
  );
}
