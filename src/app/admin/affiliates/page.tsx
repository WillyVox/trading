import { prisma } from "@/lib/prisma";
export default async function AdminAffiliatesPage() {
  const [partnerships, engagements, events] = await Promise.all([
    prisma.affiliatePartnership.count(),
    prisma.affiliateEngagement.count(),
    prisma.affiliateEvent.count(),
  ]);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Partnerships", partnerships],
        ["Engagements", engagements],
        ["Events", events],
      ].map(([label, value]) => (
        <div
          key={String(label)}
          className="border-border bg-panel rounded-2xl border p-4"
        >
          <p className="text-muted text-sm">{label}</p>
          <p className="font-display text-navy text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}
