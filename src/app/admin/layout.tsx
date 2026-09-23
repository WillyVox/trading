import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isDatabaseUnavailableError } from "@/lib/data/database-errors";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Proxy already blocks non-admins from reaching here; this is the
  // independent server-side check for the layout's own data access.
  try {
    await requireAdmin();
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6">
          <h1 className="font-serif text-2xl font-semibold text-[var(--navy)]">
            Admin temporarily unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Trading Guide cannot verify current admin access while the data
            service is unavailable. Access is denied until verification can
            complete successfully.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
