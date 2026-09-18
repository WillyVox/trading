import { prisma } from '@/lib/prisma';

export default async function AdminAffiliatesPage() {
  const links = await prisma.affiliateLink.findMany({
    include: { _count: { select: { clicks: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-navy text-2xl font-bold">Affiliates</h1>
      {links.length === 0 ? (
        <p className="text-muted mt-6">No affiliate links yet.</p>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-border text-muted border-b text-left">
              <th className="py-2">Partner slug</th>
              <th className="py-2">Active</th>
              <th className="py-2">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className="border-border border-b">
                <td className="py-2">{l.partnerSlug}</td>
                <td className="py-2">{l.active ? 'Yes' : 'No'}</td>
                <td className="py-2">{l._count.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
