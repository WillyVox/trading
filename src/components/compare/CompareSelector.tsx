"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SelectableProvider = { id: string; slug: string; name: string };

/**
 * Same alpha-sort as canonicalCompareSlugMulti in src/lib/seo/canonical.ts
 * -- duplicated here (rather than imported) so this client component
 * doesn't pull in that module's import of src/lib/seo/config.ts, which
 * reads server env vars (NEXTAUTH_URL, VERCEL) at module load purely for
 * its unrelated absoluteUrl() export. If canonicalCompareSlugMulti's
 * ordering rule ever changes, update it there too.
 */
function canonicalOrder(slugs: string[]): string {
  return [...slugs].sort((a, b) => a.localeCompare(b)).join("-vs-");
}

/**
 * Lets a person tick 2+ providers and jump straight to their comparison
 * page, instead of hand-typing an "a-vs-b" URL (a real source of the kind
 * of typo'd 404 this component exists to avoid -- see Phase 5). Navigates
 * straight to the canonical (alpha-sorted) slug order -- the same order
 * /compare/[slug] itself redirects non-canonical orderings to -- so
 * clicking providers in click order (e.g. independent-reserve then
 * btc-markets) doesn't visit independent-reserve-vs-btc-markets first and
 * then get redirect()ed to btc-markets-vs-independent-reserve; it goes
 * straight to the canonical URL and the address bar never flips.
 */
export function CompareSelector({
  providers,
  initialSelected = [],
  noun = "options",
}: {
  providers: SelectableProvider[];
  /** Slugs to pre-check on mount -- e.g. the providers already shown on
   * the comparison page this selector is rendered on, so the user can
   * add/swap a provider without re-ticking the ones they're already
   * viewing. */
  initialSelected?: string[];
  /** Plural noun for what's in the pool -- "exchanges" on a crypto
   * comparison, "platforms" on a share trading one. The pool itself is
   * always domain-scoped by the caller (see getComparisonPool), so this
   * only affects copy, not behaviour. */
  noun?: string;
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
    router.push(`/compare/${canonicalOrder(selected)}`);
  }

  return (
    <div
      id="build-your-own"
      className="border-border bg-panel mt-8 scroll-mt-20 rounded-2xl border p-6 shadow-sm"
    >
      <h2 className="font-display text-navy text-lg font-bold">
        Build your own comparison
      </h2>
      <p className="text-muted mt-1 text-sm">
        Pick 2 or more {noun} to compare them side by side.
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
                  ? "border-gold-soft bg-panel-secondary text-navy rounded-full border px-3 py-1.5 text-sm font-medium"
                  : "border-border text-muted hover:border-gold-soft rounded-full border px-3 py-1.5 text-sm"
              }
            >
              {p.name}
            </button>
          );
        })}
        {providers.length === 0 && (
          <p className="text-muted text-sm">No {noun} seeded yet.</p>
        )}
      </div>

      <button
        type="button"
        onClick={goToComparison}
        disabled={selected.length < 2}
        className="bg-navy text-background hover:bg-navy-dark mt-4 rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Compare selected{selected.length > 0 ? ` (${selected.length})` : ""}
      </button>
    </div>
  );
}
