import type { BreadcrumbItem } from "./types";

/** Prepends Home to a trail of breadcrumb items built by the calling page. */
export function breadcrumbTrail(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ name: "Home", path: "/" }, ...items];
}

/**
 * Canonical breadcrumb hierarchy for every guide detail page.
 * Category/taxonomy belongs in the page hero, not between Guides and the article.
 */
export function guideBreadcrumbTrail(
  title: string,
  path: string
): BreadcrumbItem[] {
  return breadcrumbTrail([
    { name: "Guides", path: "/guides" },
    { name: title, path },
  ]);
}
