import { Card } from "@/components/ui/Card";
import {
  createAffiliateEngagement,
  updateAffiliateEngagementStatus,
} from "@/lib/affiliates/actions";
import {
  getAffiliateEngagementsAdmin,
  getPartnershipsForEngagementForm,
} from "@/lib/affiliates/service";

const COMMISSION_TYPES = ["NONE", "CPA", "REVSHARE", "HYBRID"] as const;
const ENGAGEMENT_STATUSES = ["DRAFT", "ACTIVE", "PAUSED", "ENDED"] as const;

export default async function AdminAffiliateEngagementsPage() {
  const [engagements, partnerships] = await Promise.all([
    getAffiliateEngagementsAdmin(),
    getPartnershipsForEngagementForm(),
  ]);
  return (
    <div className="space-y-8">
      <Card>
        <h2 className="font-display text-navy text-lg font-bold">
          New engagement
        </h2>
        <form
          action={createAffiliateEngagement}
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <select
            name="partnershipId"
            required
            className="border-border rounded-lg border p-2"
          >
            <option value="">Partnership</option>
            {partnerships.map((p) => (
              <option key={p.id} value={p.id}>
                {p.provider.name} — {p.status}
              </option>
            ))}
          </select>
          <select
            name="offeringId"
            required
            className="border-border rounded-lg border p-2"
          >
            <option value="">Offering</option>
            {partnerships.flatMap((p) =>
              p.provider.offerings.map((o) => (
                <option key={`${p.id}:${o.id}`} value={o.id}>
                  {p.provider.name} — {o.name} ({o.slug})
                </option>
              ))
            )}
          </select>
          <input
            name="destinationUrl"
            type="url"
            required
            placeholder="https://approved-destination.example/..."
            className="border-border rounded-lg border p-2"
          />
          <select
            name="commissionType"
            className="border-border rounded-lg border p-2"
          >
            {COMMISSION_TYPES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <button className="bg-navy text-background rounded-full px-4 py-2 font-semibold md:col-span-2">
            Create engagement
          </button>
        </form>
        <p className="text-muted mt-3 text-xs">
          The server validates that the selected Offering belongs to the
          Partnership Provider.
        </p>
      </Card>
      <Card>
        <h2 className="font-display text-navy text-lg font-bold">
          Engagements
        </h2>
        {engagements.length === 0 ? (
          <p className="text-muted mt-4">No affiliate engagements yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-border text-muted border-b text-left">
                <th className="py-2">Provider</th>
                <th>Offering</th>
                <th>Status</th>
                <th>Commission</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              {engagements.map((e) => (
                <tr key={e.id} className="border-border border-b">
                  <td className="py-2">{e.partnership.provider.name}</td>
                  <td>
                    {e.offering.name}
                    <div className="text-muted font-mono text-xs">
                      {e.offering.slug}
                    </div>
                  </td>
                  <td>
                    <form
                      action={updateAffiliateEngagementStatus}
                      className="flex gap-2"
                    >
                      <input type="hidden" name="id" value={e.id} />
                      <select
                        name="status"
                        defaultValue={e.status}
                        className="border-border rounded border p-1"
                      >
                        {ENGAGEMENT_STATUSES.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                      <button className="text-navy font-semibold">Save</button>
                    </form>
                  </td>
                  <td>{e.commissionType}</td>
                  <td>{e._count.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
