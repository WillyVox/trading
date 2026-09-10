"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { href: "/admin/affiliates", label: "Overview" },
  { href: "/admin/affiliates/partners", label: "Partners" },
  { href: "/admin/affiliates/links", label: "Links" },
  { href: "/admin/affiliates/clicks", label: "Clicks" },
];

export function AffiliateTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        const isActive = tab.href === "/admin/affiliates" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "-mb-px rounded-t-lg border border-b-0 border-transparent px-3 py-2 text-sm font-medium",
              isActive ? "border-border bg-panel text-navy" : "text-muted hover:text-navy"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}