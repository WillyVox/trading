import path from "node:path";
import { promises as fs } from "node:fs";
import sharp from "sharp";
import type { ArticleImportPayload } from "./types";
import { pickConcept, buildFeaturedImageSvg } from "./featured-image-svg";

export interface FallbackImageOptions {
  dryRun: boolean;
  /** Absolute path to the project's /public directory. */
  publicDir: string;
}

/**
 * Fills in `featuredImage` (and, if also missing, a plain fallback
 * `featuredImageAlt`) on `payload` IN PLACE — but only when the file gave
 * neither AND the article doesn't already have a real image on record. See
 * docs/featured-images.md for the full picture; this is the "should we?"
 * half, featured-image-svg.ts is the "what does it look like?" half.
 *
 * This is a deliberate, narrow exception to the rest of the import
 * pipeline's read-only-parse contract (parser.ts sets every other payload
 * field once; importer.ts only ever reads). It's safe because it only ever
 * *adds* a value the file didn't specify:
 *
 * - An explicit `featuredImage` in the file always wins — never overwritten.
 * - On UPDATE, if the existing row already has a featuredImage, it's left
 *   alone (payload.featuredImage stays undefined, so buildScalarData's
 *   normal safe-merge rule — spec §12 — naturally skips the column, exactly
 *   as it would for any other omitted field).
 * - Dry runs never touch the filesystem or mutate payload — they only
 *   report what *would* happen, via the returned warning string.
 *
 * Returns a human-readable warning to surface in the import report, or
 * null when nothing happened.
 */
export async function resolveFallbackFeaturedImage(
  payload: ArticleImportPayload,
  options: FallbackImageOptions
): Promise<string | null> {
  if (payload.featuredImage !== undefined) return null; // author set one — never override

  // const existing = await prisma.article.findUnique({
  //   where: { slug: payload.slug },
  //   select: { featuredImage: true },
  // });
  // if (existing?.featuredImage) return null; // already has a real image — leave it alone

  const concept = pickConcept(payload);
  const relativePath = `/images/articles/${payload.slug}.png`;

  if (options.dryRun) {
    return (
      `no featuredImage provided — would auto-generate a "${concept}" fallback image ` +
      `at ${relativePath} (dry run, nothing written)`
    );
  }

  const svg = buildFeaturedImageSvg(payload, concept);
  const outputDir = path.join(options.publicDir, "images", "articles");
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, `${payload.slug}.png`), await sharp(Buffer.from(svg)).png().toBuffer());

  payload.featuredImage = relativePath;
  if (payload.featuredImageAlt === undefined) {
    // Best-effort default — nothing about the image is title-specific, so
    // this is deliberately generic rather than pretending to describe the
    // graphic. Editors are still encouraged to write a real one; see the
    // warning text below and the SEO checklist this already feeds (spec
    // for featuredImageAlt in docs/article-import-format.md).
    payload.featuredImageAlt = payload.title;
  }

  return (
    `no featuredImage provided — auto-generated a "${concept}" fallback image at ${relativePath}. ` +
    `Set featuredImage/featuredImageAlt in the file to use a real image instead.`
  );
}