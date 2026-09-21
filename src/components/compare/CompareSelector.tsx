"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

type SelectableProvider = { id: string; slug: string; name: string };

/** Hard ceiling on how many subjects one comparison can hold. Past 4 the
 * desktop table needs sideways scrolling and the mobile view becomes a very
 * long stack of cards, so the selector stops it at the source. */
const DEFAULT_MAX_SELECTED = 4;

/** Above this many providers the pill list gets a search box. Below it, a
 * single visible row of pills is quicker than typing. */
const DEFAULT_SEARCH_THRESHOLD = 8;

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

function sameSet(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((slug) => b.includes(slug));
}

/** Up to two initials for the little logo tile on each pill. Providers have
 * no logo yet (see ProviderLogo), so this mirrors its initials fallback. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Lets a person tick 2-4 providers and jump straight to their comparison
 * page, instead of hand-typing an "a-vs-b" URL (a real source of the kind
 * of typo'd 404 this component exists to avoid -- see Phase 5). Navigates
 * straight to the canonical (alpha-sorted) slug order -- the same order
 * the domain comparison routes redirect non-canonical orderings to -- so
 * clicking providers in click order (e.g. independent-reserve then
 * btc-markets) doesn't visit independent-reserve-vs-btc-markets first and
 * then get redirect()ed to btc-markets-vs-independent-reserve; it goes
 * straight to the canonical URL and the address bar never flips.
 *
 * Used on both the always-complete hubs (/crypto/exchanges/compare,
 * /share-trading/compare) and the /compare/[slug] result pages. The
 * comparison itself is always rendered server-side after navigation, so
 * rows and sections are recomputed for exactly the chosen subset -- this
 * component never filters a table in place.
 *
 * Ordering is never influenced by click order or by commercial
 * relationship: the URL is alphabetical and the pills follow the order of
 * the `providers` prop (alphabetical from the services).
 */
export function CompareSelector({
  providers,
  initialSelected = [],
  noun = "options",
  comparisonBasePath,
  maxSelected = DEFAULT_MAX_SELECTED,
  searchThreshold = DEFAULT_SEARCH_THRESHOLD,
}: {
  providers: SelectableProvider[];
  /** Slugs to pre-check on mount -- e.g. the providers already shown on
   * the comparison page this selector is rendered on, so the user can
   * add/swap a provider without re-ticking the ones they're already
   * viewing. Empty on the hubs. May exceed `maxSelected` if the URL
   * already did; the cap only blocks *adding* beyond it. */
  initialSelected?: string[];
  /** Plural noun for what's in the pool -- "exchanges" on a crypto
   * comparison, "platforms" on a share trading one. The pool itself is
   * always domain-scoped by the caller, so this only affects copy, not
   * behaviour. */
  noun?: string;
  comparisonBasePath: string;
  maxSelected?: number;
  searchThreshold?: number;
}) {
  const router = useRouter();
  const searchId = useId();
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const showSearch = providers.length > searchThreshold;
  const trimmedQuery = query.trim().toLowerCase();
  const atCap = selected.length >= maxSelected;
  const canCompare = selected.length >= 2;

  // With no search term the pills keep the prop's (alphabetical) order so
  // nothing jumps around while ticking. While searching, selected pills are
  // pinned first so a search never hides what's already chosen.
  const visible = trimmedQuery
    ? [
        ...providers.filter((p) => selected.includes(p.slug)),
        ...providers.filter(
          (p) =>
            !selected.includes(p.slug) &&
            p.name.toLowerCase().includes(trimmedQuery)
        ),
      ]
    : providers;

  const selectedNames = providers
    .filter((p) => selected.includes(p.slug))
    .map((p) => p.name);

  // The mobile bar only appears once the person has changed something --
  // on a /compare/[slug] page the selector starts pre-ticked, and a bar
  // shouting "3 selected" on arrival would be noise.
  const showBar = selected.length > 0 && !sameSet(selected, initialSelected);

  function toggle(provider: SelectableProvider) {
    if (selected.includes(provider.slug)) {
      setSelected((prev) => prev.filter((s) => s !== provider.slug));
      setMessage("");
      return;
    }
    if (atCap) {
      setMessage(
        `That's the max of ${maxSelected}. Remove one to swap in ${provider.name}.`
      );
      return;
    }
    setSelected((prev) => [...prev, provider.slug]);
    setMessage(selected.length === 0 ? "Pick one more to compare." : "");
  }

  function clear() {
    setSelected([]);
    setMessage("");
  }

  function goToComparison() {
    if (!canCompare) {
      setMessage(`Pick at least 2 ${noun} to compare.`);
      return;
    }
    router.push(`${comparisonBasePath}/${canonicalOrder(selected)}`);
  }

  const compareLabel = canCompare
    ? `Compare ${selected.length} ${noun}`
    : "Compare selected";

  return (
    <div
      id="build-your-own"
      className="border-border bg-panel mt-8 scroll-mt-20 rounded-2xl border p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-navy text-lg font-bold">
          Build your own comparison
        </h2>
        <p className="text-muted text-xs" aria-live="polite">
          {selected.length} of {maxSelected} selected
        </p>
      </div>
      <p className="text-muted mt-1 text-sm">
        Pick 2 to {maxSelected} {noun}. Results always show A to Z, never
        ranked.
      </p>

      {showSearch && (
        <div className="mt-4">
          <label htmlFor={searchId} className="sr-only">
            Search {noun}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${noun}`}
            className="border-border bg-panel text-navy placeholder:text-muted focus:border-gold w-full rounded-full border px-4 py-2 text-sm outline-none"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {visible.map((p) => {
          const active = selected.includes(p.slug);
          const blocked = !active && atCap;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p)}
              aria-pressed={active}
              className={[
                "inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm transition-colors",
                active
                  ? "border-gold bg-gold-soft/25 text-navy font-medium"
                  : "border-border text-muted hover:border-gold-soft",
                blocked ? "opacity-40" : "",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="bg-navy text-gold-soft flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold"
              >
                {initials(p.name)}
              </span>
              {p.name}
              {active && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6.5 5 9l5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
        {providers.length === 0 && (
          <p className="text-muted text-sm">No {noun} seeded yet.</p>
        )}
        {providers.length > 0 && visible.length === 0 && (
          <p className="text-muted text-sm">
            No {noun} match &ldquo;{query.trim()}&rdquo;.
          </p>
        )}
      </div>

      <p
        className="text-muted mt-3 min-h-[1.25rem] text-xs"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>

      <div className="mt-1 flex items-center gap-4">
        <button
          type="button"
          onClick={goToComparison}
          aria-disabled={!canCompare}
          className={`bg-navy text-background hover:bg-navy-dark rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity ${
            canCompare ? "" : "opacity-40"
          }`}
        >
          {compareLabel}
        </button>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-navy text-xs font-medium underline"
          >
            Clear
          </button>
        )}
      </div>

      {showBar && (
        <div className="border-border bg-panel fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t px-4 py-3 md:hidden">
          <div className="min-w-0 flex-1">
            <p className="text-navy text-sm font-medium">
              {selected.length} selected
            </p>
            <p className="text-muted truncate text-xs">
              {selectedNames.join(", ")}
            </p>
          </div>
          <button
            type="button"
            onClick={goToComparison}
            aria-disabled={!canCompare}
            className={`bg-navy text-background rounded-full px-4 py-2.5 text-sm font-semibold ${
              canCompare ? "" : "opacity-40"
            }`}
          >
            Compare
          </button>
        </div>
      )}
    </div>
  );
}
