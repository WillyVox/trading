import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already blocks non-admins from reaching here; this is the
  // independent server-side check for the layout's own data access.
  await requireAdmin();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
