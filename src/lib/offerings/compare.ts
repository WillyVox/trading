import type {
  ComparisonRow,
  ComparisonSection,
  ComparisonSubject,
} from "@/lib/compare/types";
import type { OfferingDetail } from "./service";
import {
  formatAvailability,
  formatProductType,
  formatAccountType,
  custodyTypeCopy,
} from "./labels";

/**
 * Mirrors src/lib/providers/compare.ts's shape and structure exactly (see
 * src/lib/compare/types.ts for why the output shape is shared). The one
 * structural difference from the crypto builder, worth calling out: rows
 * here key off real enums (market code, InvestmentProductType,
 * AccountType) rather than matching free-text labels across offerings --
 * a real advantage of the typed offering schema, not just parity with the
 * crypto side.
 *
 * `null` in a row's values means "no row recorded for this offering" (the
 * fact hasn't been researched at all); a formatted "Not yet confirmed"
 * string means a row exists but its AvailabilityStatus is UNKNOWN. Those
 * are different signals and deliberately rendered differently -- same
 * distinction the crypto builder draws between a missing fact and an
 * unresolved boolean.
 */

export function toComparisonSubjects(
  offerings: OfferingDetail[]
): ComparisonSubject[] {
  return offerings.map((o) => ({
    id: o.id,
    slug: o.slug,
    name: o.name,
    verificationStatus: o.verificationStatus,
    profileHref: `/share-trading/${o.slug}`,
  }));
}

export function buildMarketRows(offerings: OfferingDetail[]): ComparisonRow[] {
  const seen = new Map<string, string>(); // code -> market name, first-seen order
  for (const o of offerings) {
    for (const m of o.markets) {
      if (!seen.has(m.market.code)) seen.set(m.market.code, m.market.name);
    }
  }
  return Array.from(seen.entries()).map(([code, name]) => ({
    key: `market:${code}`,
    label: name,
    values: offerings.map((o) => {
      const row = o.markets.find((m) => m.market.code === code);
      return row ? formatAvailability(row.availability) : null;
    }),
  }));
}

export function buildProductRows(offerings: OfferingDetail[]): ComparisonRow[] {
  const seen: OfferingDetail["products"][number]["productType"][] = [];
  for (const o of offerings) {
    for (const p of o.products) {
      if (!seen.includes(p.productType)) seen.push(p.productType);
    }
  }
  return seen.map((productType) => ({
    key: `product:${productType}`,
    label: formatProductType(productType),
    values: offerings.map((o) => {
      const row = o.products.find((p) => p.productType === productType);
      return row ? formatAvailability(row.availability) : null;
    }),
  }));
}

export function buildAccountTypeRows(
  offerings: OfferingDetail[]
): ComparisonRow[] {
  const seen: OfferingDetail["accountTypes"][number]["accountType"][] = [];
  for (const o of offerings) {
    for (const a of o.accountTypes) {
      if (!seen.includes(a.accountType)) seen.push(a.accountType);
    }
  }
  return seen.map((accountType) => ({
    key: `accountType:${accountType}`,
    label: formatAccountType(accountType),
    values: offerings.map((o) => {
      const row = o.accountTypes.find((a) => a.accountType === accountType);
      return row ? formatAvailability(row.availability) : null;
    }),
  }));
}

/**
 * Keyed by market (or "_all" for an offering-wide row, marketId null --
 * see the OfferingCustody schema comment) since custody is genuinely
 * market-scoped, not a flat fact. Milestone 1's seed always sets marketId
 * explicitly, so the "_all" bucket is exercised by future data, not
 * today's -- included for correctness, not speculatively.
 */
export function buildCustodyRows(offerings: OfferingDetail[]): ComparisonRow[] {
  const seen = new Map<string, string>(); // bucket key -> row label
  for (const o of offerings) {
    for (const c of o.custody) {
      const bucketKey = c.market?.code ?? "_all";
      if (!seen.has(bucketKey)) {
        seen.set(bucketKey, c.market ? c.market.name : "All markets");
      }
    }
  }
  return Array.from(seen.entries()).map(([bucketKey, label]) => ({
    key: `custody:${bucketKey}`,
    label,
    values: offerings.map((o) => {
      const row = o.custody.find(
        (c) => (c.market?.code ?? "_all") === bucketKey
      );
      if (!row) return null;
      const copy = custodyTypeCopy(row.custodyType);
      return row.custodianName
        ? `${copy.label} (${row.custodianName})`
        : copy.label;
    }),
  }));
}

export function buildOfferingComparisonSections(
  offerings: OfferingDetail[]
): ComparisonSection[] {
  return [
    { title: "Markets", rows: buildMarketRows(offerings) },
    { title: "Products", rows: buildProductRows(offerings) },
    { title: "Custody & ownership", rows: buildCustodyRows(offerings) },
    { title: "Account types", rows: buildAccountTypeRows(offerings) },
  ].filter((section) => section.rows.length > 0);
}
