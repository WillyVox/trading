/**
 * Lowercase, hyphen-separated, no leading/trailing/double hyphens -- matches
 * Article.slug and Provider.slug conventions. Previously defined only
 * inline in src/lib/articles/import/schema.ts; extracted here so the admin
 * editor (Block 2) and the importer validate slugs identically instead of
 * two slightly-different regexes drifting apart.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Best-effort slug derivation from a title, for the "auto-generate from title" admin UX. Not guaranteed unique -- callers must still check. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}