import type { VerificationStatus } from "@prisma/client";

/**
 * Domain-agnostic compare engine (see the 2026-09-17 compare-engine-
 * unification analysis). Two domains — crypto exchanges (Provider) and
 * share trading platforms (ProviderOffering) — feed the same shape into
 * the same CompareTable/CompareMobileCards renderer and the same
 * /compare/[slug] resolver. Each domain owns its own row-building logic
 * (src/lib/providers/compare.ts, src/lib/offerings/compare.ts); only the
 * output shape and the rendering/routing layer are shared.
 *
 * Deliberately NOT unifying the two domains' *dimensions* (e.g. no shared
 * enum of "things you can compare") — a crypto exchange's maker fee and a
 * broker's ASX custody arrangement are not the same axis, and forcing them
 * into one taxonomy would be a leaky abstraction. What's shared is the
 * plumbing (table/mobile-card rendering, slug canonicalization, domain
 * resolution), not the dimension vocabulary.
 */

export type ComparisonDomain = "crypto-exchange" | "share-trading";

/** One column in a comparison — the thing being compared, not a fact about it. */
export type ComparisonSubject = {
  id: string;
  slug: string;
  name: string;
  verificationStatus: VerificationStatus;
  /** Where this subject's own profile page lives -- e.g.
   * "/crypto/exchanges/coinspot" or "/share-trading/commsec". Lets
   * CompareTable/CompareMobileCards link out without knowing which
   * domain they're rendering. */
  profileHref: string;
};

/**
 * One row shared across however many subjects are being compared. `values`
 * is deliberately a plain array of display strings, index-aligned to the
 * ComparisonSubject[] passed alongside it -- not a richer per-cell type.
 * Both domains already collapse richer underlying data (a boolean +
 * optional value on the crypto side, an AvailabilityStatus + notes on the
 * offering side) into a single display string before it reaches this
 * shape, the same way buildFeatureSections() has always turned
 * `available: boolean | null` into "✓ / — / ?" rather than passing the
 * boolean through -- so the renderer never needs to branch on domain.
 */
export type ComparisonRow = {
  key: string;
  label: string;
  values: (string | null)[];
};

export type ComparisonSection = {
  title: string;
  rows: ComparisonRow[];
};
