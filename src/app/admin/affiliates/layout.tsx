import { AffiliateTabs } from "@/components/admin/Affiliatetabs";

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  // requireAdmin() already runs in src/app/admin/layout.tsx for every
  // /admin/* route; this sub-layout only adds the Overview/Partners/Links/
  // Clicks navigation, no additional data access.
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Affiliates</h1>
      <AffiliateTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
}