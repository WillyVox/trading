"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SelectableProvider = { id: string; slug: string; name: string };

/**
 * Lets a person tick 2+ providers and jump straight to their comparison
 * page, instead of hand-typing an "a-vs-b" URL (a real source of the kind
 * of typo'd 404 this component exists to avoid -- see Phase 5). The
 * resulting slug order doesn't matter: /compare/[slug] canonicalizes and
 * redirects regardless (see src/lib/seo/canonical.ts).
 */
export function CompareSelector({ providers }: { providers: SelectableProvider[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function goToComparison() {
    if (selected.length < 2) return;
    router.push(`/compare/${selected.join("-vs-")}`);
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-panel p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-navy">Build your own comparison</h2>
      <p className="mt-1 text-sm text-muted">Pick 2 or more exchanges to compare fees, features, and verified facts side by side.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {providers.map((p) => {
          const active = selected.includes(p.slug);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.slug)}
              aria-pressed={active}
              className={
                active
                  ? "rounded-full border border-gold-soft bg-panel-secondary px-3 py-1.5 text-sm font-medium text-navy"
                  : "rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:border-gold-soft"
              }
            >
              {p.name}
            </button>
          );
        })}
        {providers.length === 0 && <p className="text-sm text-muted">No providers seeded yet.</p>}
      </div>

      <button
        type="button"
        onClick={goToComparison}
        disabled={selected.length < 2}
        className="mt-4 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-background hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        Compare selected{selected.length > 0 ? ` (${selected.length})` : ""}
      </button>
    </div>
  );
}
