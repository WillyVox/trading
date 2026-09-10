import Link from "next/link";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/affiliates", label: "Affiliates" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-panel p-4">
      <nav className="space-y-1">
        {ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm text-muted hover:bg-panel-secondary hover:text-navy">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
