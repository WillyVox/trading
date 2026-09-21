import Link from "next/link";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/affiliates", label: "Affiliates" },
  { href: "/admin/pricing-verification", label: "Pricing verification" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="border-border bg-panel w-56 shrink-0 border-r p-4">
      <nav className="space-y-1">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted hover:bg-panel-secondary hover:text-navy block rounded-xl px-3 py-2 text-sm"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
