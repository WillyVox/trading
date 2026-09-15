import path from "node:path";
import { promises as fs } from "node:fs";
import sharp from "sharp";
import { buildFeaturedImageSvg, buildBrandOgImage, type FeaturedImageConcept } from "@/lib/articles/import/featured-image-svg";

/**
 * Generates every *static* (non-CMS) page-level OG/Twitter-card image the
 * site uses, plus the sitewide og-default.png fallback — see
 * docs/og-images.md for the bug this fixes and the full picture.
 *
 * "Static" is the operative word: this covers hub/legal pages whose
 * content doesn't change per-request (home, /crypto, /compare,
 * /methodology, the hand-written guide pages, etc.) and the one generic
 * fallback. It deliberately does NOT cover CMS article pages
 * (guides/[slug], news/[slug]) — those already get a real, article-specific
 * image via src/lib/articles/import/featured-image.ts at import time, or a
 * genuinely custom one a human supplied — nor does it cover per-instance
 * dynamic pages like a specific crypto asset or a specific exchange
 * profile, which intentionally share one image per *route type* here
 * (e.g. every /crypto/[slug] page uses the same "learn"-concept image)
 * rather than getting a unique image per slug; doing that properly would
 * mean generating from the database, which is a bigger feature than fixing
 * the current "no image at all" bug called for.
 *
 * Safe to re-run any time (e.g. after tweaking a concept template in
 * featured-image-svg.ts) — every entry is regenerated and overwritten
 * unconditionally, there's no "skip if it already exists" logic here like
 * there is for per-article images (see featured-image.ts) because these
 * aren't user-authored content that a real image might have replaced.
 */

interface PageImageSpec {
  /** Path relative to /public. */
  outputPath: string;
  concept: FeaturedImageConcept;
  /** Adds a coin monogram badge for pages about one specific asset. */
  cryptoAssetSlug?: string;
}

const PAGE_IMAGES: PageImageSpec[] = [
  { outputPath: "images/og/home.png", concept: "steps" },
  { outputPath: "images/og/crypto.png", concept: "learn" },
  { outputPath: "images/og/crypto-asset.png", concept: "learn" },
  { outputPath: "images/og/exchanges.png", concept: "compare" },
  { outputPath: "images/og/exchange-profile.png", concept: "verify" },
  { outputPath: "images/og/compare.png", concept: "compare" },
  { outputPath: "images/og/compare-crypto-exchanges.png", concept: "compare" },
  { outputPath: "images/og/compare-detail.png", concept: "compare" },
  { outputPath: "images/og/methodology.png", concept: "verify" },
  { outputPath: "images/og/methodology-comparisons.png", concept: "verify" },
  { outputPath: "images/og/editorial-policy.png", concept: "verify" },
  { outputPath: "images/og/affiliate-disclosure.png", concept: "verify" },
  { outputPath: "images/og/how-we-get-paid.png", concept: "fees" },
  { outputPath: "images/og/news.png", concept: "news" },
  { outputPath: "images/og/guides.png", concept: "steps" },
  // Replaces the 3 hand-written guide pages' previous .svg images — SVG
  // isn't reliably rendered as an og:image by social crawlers (see
  // docs/og-images.md), so these move to the same PNG pipeline.
  { outputPath: "images/articles/share-trading-for-beginners.png", concept: "steps" },
  { outputPath: "images/articles/how-to-start-investing-in-crypto-for-beginners.png", concept: "learn" },
  { outputPath: "images/articles/simple-steps-to-buy-cryptocurrency.png", concept: "learn" },
];

async function writeImage(publicDir: string, outputPath: string, svg: string) {
  const outPath = path.join(publicDir, outputPath);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, await sharp(Buffer.from(svg)).png().toBuffer());
  console.log(`wrote ${outputPath}`);
}

async function main() {
  const publicDir = path.resolve(process.cwd(), "public");

  // The sitewide fallback buildMetadata() points to when a page sets no
  // `image` at all — this is the file that was simply missing.
  await writeImage(publicDir, "og-default.png", buildBrandOgImage());

  for (const spec of PAGE_IMAGES) {
    const svg = buildFeaturedImageSvg(
      { cryptoAssetSlugs: spec.cryptoAssetSlug ? [spec.cryptoAssetSlug] : undefined },
      spec.concept
    );
    await writeImage(publicDir, spec.outputPath, svg);
  }

  console.log(`\nDone — ${PAGE_IMAGES.length + 1} images written.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
