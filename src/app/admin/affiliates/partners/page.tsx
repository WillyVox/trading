import { getPartnershipsAdmin, getProvidersForPartnershipForm } from "@/lib/affiliates/service";
import { createPartnership, updatePartnershipStatus } from "@/lib/affiliates/actions";
import { Card } from "@/components/ui/Card";
import { PartnerStatusBadge } from "@/components/admin/Partnerstatusbadge";

const STATUS_OPTIONS = ["PROSPECT", "APPLIED", "APPROVED", "ACTIVE", "PAUSED", "REJECTED", "ENDED"] as const;

export default async function AdminAffiliatePartnersPage() {
  const [partnerships, providers] = await Promise.all([
    getPartnershipsAdmin(),
    getProvidersForPartnershipForm(),
  ]);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="font-display text-lg font-bold text-navy">New partnership</h2>
        <p className="mt-1 text-sm text-muted">
          A partnership is the record that a Provider is being pursued as an affiliate — it holds no commercial
          terms itself (that's the Program) and never affects whether the Provider's profile or comparisons render.
        </p>
        <form action={createPartnership} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-muted">Provider</span>
            <select
              name="providerId"
              required
              className="min-w-[220px] rounded-lg border border-border bg-panel-secondary px-3 py-2 text-navy"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-muted">Initial status</span>
            <select
              name="status"
              defaultValue="PROSPECT"
              className="rounded-lg border border-border bg-panel-secondary px-3 py-2 text-navy"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-background hover:bg-navy-dark"
          >
            Create partnership
          </button>
        </form>
        {providers.length === 0 && (
          <p className="mt-3 text-sm text-muted">No providers exist yet — seed or add one before creating a partnership.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-bold text-navy">Partnerships</h2>
        {partnerships.length === 0 ? (
          <p className="mt-4 text-muted">No partnerships yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-2">Provider</th>
                <th className="py-2">Status</th>
                <th className="py-2">Programs</th>
                <th className="py-2">Links</th>
                <th className="py-2">Update status</th>
              </tr>
            </thead>
            <tbody>
              {partnerships.map((p) => {
                const linkCount = p.programs.reduce((sum, prog) => sum + prog._count.links, 0);
                return (
                  <tr key={p.id} className="border-b border-border align-top">
                    <td className="py-3">{p.provider.name}</td>
                    <td className="py-3">
                      <PartnerStatusBadge status={p.status} />
                    </td>
                    <td className="py-3">{p.programs.length}</td>
                    <td className="py-3">{linkCount}</td>
                    <td className="py-3">
                      <form action={updatePartnershipStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={p.id} />
                        <select
                          name="status"
                          defaultValue={p.status}
                          className="rounded-lg border border-border bg-panel-secondary px-2 py-1 text-navy"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-navy hover:bg-panel-secondary"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}