import { cache } from 'react';
import { getProviders, getProvidersBySlugs } from '@/lib/providers/service';
import { getActiveAffiliateLinksForProviderSlugs } from '@/lib/affiliates/service';
import {
  buildComparisonSections,
  toComparisonSubjects as toProviderSubjects,
  type ComparisonProvider,
} from '@/lib/providers/compare';
import {
  getAllOfferingsForCompare,
  getOfferingsBySlugs,
} from '@/lib/offerings/service';
import {
  buildOfferingComparisonSections,
  toComparisonSubjects as toOfferingSubjects,
} from '@/lib/offerings/compare';
import { parseCompareSlugs } from '@/lib/seo/canonical';
import type {
  ComparisonDomain,
  ComparisonSection,
  ComparisonSubject,
} from './types';

export type ResolvedComparison = {
  domain: ComparisonDomain;
  subjects: ComparisonSubject[];
  sections: ComparisonSection[];
};

/** What CompareSelector needs to offer a subject as an "add another" chip. */
export type SelectableSubject = { id: string; slug: string; name: string };

/**
 * Per-domain copy and routing. Lives here rather than being inlined in the
 * page so /compare/[slug] renders the right nouns without branching on
 * `domain` in four separate places in JSX.
 */
export const DOMAIN_COPY: Record<
  ComparisonDomain,
  {
    /** Plural noun for the things being compared, lowercase, mid-sentence. */
    noun: string;
    /** The always-complete, indexable comparison for this domain. */
    indexPath: string;
    /** What the comparison rows are drawn from, for the hero subheading. */
    sourceLabel: string;
    /** Metadata description fragment. */
    metaDescriptor: string;
  }
> = {
  'crypto-exchange': {
    noun: 'exchanges',
    indexPath: '/compare/crypto-exchanges',
    sourceLabel: 'the Provider domain',
    metaDescriptor: 'crypto exchanges',
  },
  'share-trading': {
    noun: 'platforms',
    indexPath: '/compare/trading-platforms',
    sourceLabel: 'the Offering domain',
    metaDescriptor: 'share trading platforms',
  },
};

/**
 * /compare/[slug] no longer assumes every slug is a crypto exchange -- it
 * could be a set of share trading offerings instead. Tries both domains in
 * parallel; whichever one has ALL the requested slugs wins.
 *
 * A slug list split across domains (e.g. "coinspot-vs-commsec") returns
 * null, same as a slug list where nothing exists anywhere -- comparing a
 * crypto exchange against a share trading platform isn't a comparison this
 * site renders, so the caller 404s exactly as it already does for a
 * genuinely nonexistent slug. This is a deliberate product decision, not
 * an oversight: see the compare-engine-unification analysis.
 *
 * Takes the raw route slug (not a string[]) so React's `cache()` can key on
 * it -- generateMetadata() and the page body both need the resolution, and
 * an array argument would be a fresh reference on each call and miss the
 * cache, doubling the queries on every request.
 */
export const resolveComparison = cache(
  async (slug: string): Promise<ResolvedComparison | null> => {
    const slugs = parseCompareSlugs(slug);
    if (slugs.length === 0) return null;

    const [providers, offerings] = await Promise.all([
      getProvidersBySlugs(slugs),
      getOfferingsBySlugs(slugs),
    ]);

    if (providers.length === slugs.length) {
      const rows = providers as unknown as ComparisonProvider[];
      // One batched query for every subject in this comparison, not one
      // per subject -- see getActiveAffiliateLinksForProviderSlugs.
      const affiliateLinks = await getActiveAffiliateLinksForProviderSlugs(
        rows.map((p) => p.slug)
      );
      return {
        domain: 'crypto-exchange',
        subjects: toProviderSubjects(rows, affiliateLinks),
        sections: buildComparisonSections(rows),
      };
    }

    if (offerings.length === slugs.length) {
      return {
        domain: 'share-trading',
        subjects: toOfferingSubjects(offerings),
        sections: buildOfferingComparisonSections(offerings),
      };
    }

    return null;
  }
);

/**
 * URL for removing one subject from the current comparison -- what each
 * column's "x" links to. Built from the already-resolved subject list
 * (not re-parsed from the raw slug) so a duplicate-slug URL like
 * "coinspot-vs-coinspot" removes the one column, not both. Doesn't
 * pre-canonicalize the order: /compare/[slug] already redirects a
 * non-canonical slug list to the sorted URL, so this can stay a plain
 * join and let that redirect do its job.
 */
export function compareHrefWithout(
  subjects: ComparisonSubject[],
  slugToRemove: string
): string {
  const remaining = subjects
    .map((s) => s.slug)
    .filter((slug) => slug !== slugToRemove);
  return `/compare/${remaining.join('-vs-')}`;
}

/**
 * The pool of subjects the "add another" chips offer, scoped to the domain
 * of the comparison being viewed. Without this the chips under an offering
 * comparison would suggest adding a crypto exchange -- which resolves to a
 * mixed-domain slug and 404s, i.e. the UI would actively hand the user a
 * dead link.
 */
export async function getComparisonPool(
  domain: ComparisonDomain
): Promise<SelectableSubject[]> {
  if (domain === 'share-trading') {
    const offerings = await getAllOfferingsForCompare();
    return offerings.map((o) => ({ id: o.id, slug: o.slug, name: o.name }));
  }
  const { items } = await getProviders({ pageSize: 100 });
  return (items as SelectableSubject[]).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
  }));
}
