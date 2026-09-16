import type { ArticleImportPayload } from './types';

/**
 * Visual templates for auto-generated fallback featured images (see
 * featured-image.ts for the I/O side, and docs/featured-images.md for the
 * full picture). Deliberately pure/string-building only — no filesystem,
 * no sharp, no Prisma — so this half of the feature is trivial to unit
 * test and reason about independent of rasterization or the DB safe-merge
 * rule that decides *whether* to call it.
 *
 * Reuses the same navy/gold/cream palette as
 * src/components/layout/HeroGraphic.tsx so a generated card thumbnail
 * looks like it belongs to the same family as the page hero graphics,
 * even though the two are rendered through completely different pipelines
 * (React/inline-SVG in the browser here vs. a rasterized PNG file there).
 */

export const FEATURED_IMAGE_CONCEPTS = [
  'steps',
  'compare',
  'fees',
  'security',
  'verify',
  'learn',
  'news',
] as const;

export type FeaturedImageConcept = (typeof FEATURED_IMAGE_CONCEPTS)[number];

const NAVY = '#16233f';
const GOLD = '#c79a3d';
const GOLD_SOFT = '#e8d9b5';
const CREAM = '#f5f2ea';

const W = 1200;
const H = 630;

/**
 * `searchIntent` is the most content-meaningful field the import format
 * has without actually reading the article body, so it's the primary
 * signal. `articleType` (NEWS vs GUIDE) is only a fallback for files that
 * skip searchIntent entirely — see pickConcept.
 */
const SEARCH_INTENT_CONCEPTS: Record<string, FeaturedImageConcept> = {
  HOW_TO: 'steps',
  BEGINNER: 'steps',
  COMPARISON: 'compare',
  PROVIDER_GUIDE: 'compare',
  FEES: 'fees',
  SECURITY: 'security',
  WALLET: 'security',
  REGULATION: 'verify',
  LEARN: 'learn',
  MARKET_EDUCATION: 'learn',
};

/**
 * Plain A-Z monograms only — deliberately never a currency glyph like ₿ or
 * Ξ. Those render fine on a workstation with Noto/FreeFont installed, but
 * this SVG gets rasterized by sharp on whatever server runs the import —
 * often a minimal Docker/serverless image with a much smaller fontconfig
 * set — so relying on a specific symbol glyph being present is a
 * production footgun. A-Z always renders on any fallback sans/serif font.
 */
const ASSET_MONOGRAMS: Record<string, string> = {
  bitcoin: 'B',
  ethereum: 'E',
  litecoin: 'L',
  dogecoin: 'D',
  cardano: 'A',
  solana: 'S',
  ripple: 'X',
  xrp: 'X',
};

export function pickConcept(
  payload: Pick<ArticleImportPayload, 'searchIntent' | 'articleType'>
): FeaturedImageConcept {
  const bySearchIntent = payload.searchIntent
    ? SEARCH_INTENT_CONCEPTS[payload.searchIntent]
    : undefined;
  if (bySearchIntent) return bySearchIntent;
  if (payload.articleType === 'NEWS') return 'news';
  return 'steps'; // generic default — matches the most common GUIDE shape
}

function assetMonogram(
  payload: Pick<ArticleImportPayload, 'cryptoAssetSlugs'>
): string | null {
  for (const slug of payload.cryptoAssetSlugs ?? []) {
    const letter = ASSET_MONOGRAMS[slug.toLowerCase()];
    if (letter) return letter;
  }
  return null;
}

function ledgerLines(): string {
  return [200, 280, 360, 440]
    .map(
      (y) =>
        `<line x1="80" y1="${y}" x2="1120" y2="${y}" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />`
    )
    .join('\n');
}

function coinBadge(letter: string): string {
  return `
    <circle cx="1040" cy="150" r="70" fill="${GOLD}" stroke="${NAVY}" stroke-width="4" />
    <text x="1040" y="178" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-weight="700" font-size="72" fill="${NAVY}">${letter}</text>`;
}

// --- one shape function per concept, each staying clear of the top-right
// corner (roughly x>950, y<230) so an optional coin badge never collides ---

function stepsShapes(): string {
  return `
    <rect x="300" y="190" width="400" height="240" rx="14" fill="none" stroke="${CREAM}" stroke-width="4" />
    <polygon points="260,440 740,440 700,470 300,470" fill="${GOLD_SOFT}" />
    <rect x="340" y="330" width="40" height="60" fill="${GOLD_SOFT}" />
    <rect x="400" y="300" width="40" height="90" fill="${GOLD}" />
    <rect x="460" y="260" width="40" height="130" fill="${GOLD_SOFT}" />
    <rect x="520" y="230" width="40" height="160" fill="${GOLD}" />
    <polyline points="360,330 420,300 480,260 540,230" fill="none" stroke="${CREAM}" stroke-width="3" />
    <rect x="300" y="480" width="210" height="46" rx="23" fill="none" stroke="${GOLD}" stroke-width="3" />
    <text x="330" y="510" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="22" fill="${CREAM}">STEP BY STEP</text>
    <line x1="820" y1="560" x2="1060" y2="560" stroke="${CREAM}" stroke-width="2" />
    <circle cx="820" cy="560" r="22" fill="${GOLD}" />
    <text x="820" y="569" text-anchor="middle" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${NAVY}">1</text>
    <circle cx="940" cy="560" r="22" fill="${GOLD_SOFT}" />
    <text x="940" y="569" text-anchor="middle" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${NAVY}">2</text>
    <circle cx="1060" cy="560" r="22" fill="${GOLD_SOFT}" />
    <text x="1060" y="569" text-anchor="middle" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${NAVY}">3</text>`;
}

function compareShapes(): string {
  return `
    <line x1="420" y1="260" x2="820" y2="260" stroke="${CREAM}" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="6,8" />
    <rect x="420" y="310" width="90" height="150" fill="${GOLD_SOFT}" />
    <rect x="550" y="220" width="90" height="240" fill="${GOLD}" />
    <rect x="680" y="360" width="90" height="100" fill="${GOLD_SOFT}" />
    <circle cx="465" cy="296" r="6" fill="${CREAM}" />
    <circle cx="595" cy="206" r="6" fill="${CREAM}" />
    <circle cx="725" cy="346" r="6" fill="${CREAM}" />
    <text x="420" y="510" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${CREAM}">SIDE BY SIDE</text>`;
}

function feesShapes(): string {
  return `
    <circle cx="420" cy="430" r="70" fill="${GOLD_SOFT}" stroke="${NAVY}" stroke-width="3" />
    <circle cx="480" cy="390" r="70" fill="${GOLD}" stroke="${NAVY}" stroke-width="3" />
    <circle cx="540" cy="350" r="70" fill="${GOLD_SOFT}" stroke="${NAVY}" stroke-width="3" />
    <text x="760" y="400" text-anchor="middle" font-family="Georgia, 'DejaVu Serif', serif" font-weight="700" font-size="150" fill="${GOLD}">%</text>
    <rect x="420" y="500" width="180" height="46" rx="23" fill="none" stroke="${GOLD}" stroke-width="3" />
    <text x="450" y="530" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${CREAM}">TRUE COST</text>`;
}

function securityShapes(): string {
  return `
    <path d="M600 175 L745 230 V365 Q745 490 600 545 Q455 490 455 365 V230 Z" fill="none" stroke="${CREAM}" stroke-width="4" />
    <circle cx="600" cy="340" r="30" fill="${GOLD}" />
    <rect x="588" y="360" width="24" height="46" fill="${GOLD}" />
    <text x="600" y="500" text-anchor="middle" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${CREAM}">STAY SAFE</text>`;
}

function verifyShapes(): string {
  return `
    <rect x="460" y="190" width="220" height="270" rx="8" fill="none" stroke="${CREAM}" stroke-width="3" />
    <line x1="490" y1="240" x2="650" y2="240" stroke="${CREAM}" stroke-opacity="0.7" stroke-width="3" />
    <line x1="490" y1="280" x2="650" y2="280" stroke="${CREAM}" stroke-opacity="0.7" stroke-width="3" />
    <line x1="490" y1="320" x2="600" y2="320" stroke="${CREAM}" stroke-opacity="0.7" stroke-width="3" />
    <line x1="490" y1="360" x2="630" y2="360" stroke="${CREAM}" stroke-opacity="0.7" stroke-width="3" />
    <circle cx="780" cy="420" r="55" fill="none" stroke="${GOLD}" stroke-width="6" />
    <line x1="818" y1="458" x2="855" y2="495" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" />
    <path d="M755 420 L772 437 L808 397" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    <text x="460" y="500" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${CREAM}">SOURCED &amp; VERIFIED</text>`;
}

function learnShapes(): string {
  return `
    <path d="M420 440 V330 Q420 315 435 315 H520 V450 H435 Q420 450 420 440 Z" fill="none" stroke="${CREAM}" stroke-width="4" />
    <path d="M520 315 H605 Q620 315 620 330 V440 Q620 450 605 450 H520 Z" fill="none" stroke="${CREAM}" stroke-width="4" />
    <line x1="520" y1="315" x2="520" y2="450" stroke="${CREAM}" stroke-width="4" />
    <polyline points="680,430 740,380 800,400 860,320 920,340" fill="none" stroke="${GOLD}" stroke-width="4" />
    <circle cx="920" cy="340" r="8" fill="${GOLD}" />
    <text x="420" y="500" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${CREAM}">LEARN THE BASICS</text>`;
}

function newsShapes(): string {
  return `
    <circle cx="600" cy="360" r="180" fill="none" stroke="${CREAM}" stroke-opacity="0.18" stroke-width="3" />
    <circle cx="600" cy="360" r="120" fill="none" stroke="${CREAM}" stroke-opacity="0.3" stroke-width="3" />
    <circle cx="600" cy="360" r="60" fill="none" stroke="${GOLD}" stroke-width="4" />
    <circle cx="600" cy="360" r="14" fill="${GOLD}" />
    <text x="600" y="560" text-anchor="middle" font-family="'DejaVu Sans', Arial, sans-serif" font-weight="700" font-size="24" fill="${CREAM}">LATEST NEWS</text>`;
}

const CONCEPT_SHAPES: Record<FeaturedImageConcept, () => string> = {
  steps: stepsShapes,
  compare: compareShapes,
  fees: feesShapes,
  security: securityShapes,
  verify: verifyShapes,
  learn: learnShapes,
  news: newsShapes,
};

export function buildFeaturedImageSvg(
  payload: Pick<
    ArticleImportPayload,
    'searchIntent' | 'articleType' | 'cryptoAssetSlugs'
  >,
  concept: FeaturedImageConcept = pickConcept(payload)
): string {
  const badge = assetMonogram(payload);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${NAVY}" />
  ${ledgerLines()}
  ${CONCEPT_SHAPES[concept]()}
  ${badge ? coinBadge(badge) : ''}
</svg>`;
}

/**
 * The sitewide `og-default.png` fallback (see buildMetadata in
 * src/lib/seo/metadata.ts) — used only when a page sets no `image` at all.
 * Deliberately just the logo mark, centered and large, rather than any of
 * the 7 topic concepts above: a page generic enough to need the fallback
 * (currently /terms and /privacy) shouldn't get a topic it isn't about.
 * Mirrors public/header-logo.svg's icon proportions, scaled up.
 */
export function buildBrandOgImage(): string {
  const iconScale = 4.4;
  const barsLocal = [
    { x: 0, y: 16, w: 9, h: 24, fill: GOLD },
    { x: 13, y: 4, w: 9, h: 36, fill: CREAM },
    { x: 26, y: 20, w: 9, h: 20, fill: GOLD },
    { x: 39, y: -6, w: 9, h: 46, fill: CREAM },
  ];
  const iconWidth = 48 * iconScale;
  const wordFontSize = 64;
  // Rough Georgia-bold average-advance estimate, same purpose as the width
  // guard in the header-logo generation scripts: just needs to be in the
  // right neighborhood to center the lockup, not pixel-exact.
  const wordWidth = 'Trading Guide'.length * wordFontSize * 0.52;
  const gap = 28;
  const lockupWidth = iconWidth + gap + wordWidth;
  const iconX = (W - lockupWidth) / 2;
  const wordX = iconX + iconWidth + gap;
  const centerY = H / 2;

  const bars = barsLocal
    .map(
      (b) =>
        `<rect x="${iconX + b.x * iconScale}" y="${centerY - 23 * iconScale + b.y * iconScale}" width="${b.w * iconScale}" height="${b.h * iconScale}" fill="${b.fill}" />`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${NAVY}" />
  ${bars}
  <text x="${wordX}" y="${centerY + wordFontSize * 0.32}" font-family="Georgia, 'DejaVu Serif', serif" font-weight="700" font-size="${wordFontSize}" fill="${CREAM}">Trading Guide</text>
</svg>`;
}
