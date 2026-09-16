'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SelectableProvider = { id: string; slug: string; name: string };

/**
 * Lets a person tick 2+ providers and jump straight to their comparison
 * page, instead of hand-typing an "a-vs-b" URL (a real source of the kind
 * of typo'd 404 this component exists to avoid -- see Phase 5). The
 * resulting slug order doesn't matter: /compare/[slug] canonicalizes and
 * redirects regardless (see src/lib/seo/canonical.ts).
 */
export function CompareSelector({
  providers,
  initialSelected = [],
}: {
  providers: SelectableProvider[];
  /** Slugs to pre-check on mount -- e.g. the providers already shown on
   * the comparison page this selector is rendered on, so the user can
   * add/swap a provider without re-ticking the ones they're already
   * viewing. */
  initialSelected?: string[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialSelected);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function goToComparison() {
    if (selected.length < 2) return;
    router.push(`/compare/${selected.join('-vs-')}`);
  }

  return (
    <div className="border-border bg-panel mt-8 rounded-2xl border p-6 shadow-sm">
      <h2 className="font-display text-navy text-lg font-bold">
        Build your own comparison
      </h2>
      <p className="text-muted mt-1 text-sm">
        Pick 2 or more exchanges to compare fees, features, and verified facts
        side by side.
      </p>

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
                  ? 'border-gold-soft bg-panel-secondary text-navy rounded-full border px-3 py-1.5 text-sm font-medium'
                  : 'border-border text-muted hover:border-gold-soft rounded-full border px-3 py-1.5 text-sm'
              }
            >
              {p.name}
            </button>
          );
        })}
        {providers.length === 0 && (
          <p className="text-muted text-sm">No providers seeded yet.</p>
        )}
      </div>

      <button
        type="button"
        onClick={goToComparison}
        disabled={selected.length < 2}
        className="bg-navy text-background hover:bg-navy-dark mt-4 rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Compare selected{selected.length > 0 ? ` (${selected.length})` : ''}
      </button>
    </div>
  );
}
