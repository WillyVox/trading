import type { BreadcrumbItem } from "./types";

/** Prepends Home to a trail of breadcrumb items built by the calling page. */
export function breadcrumbTrail(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ name: "Home", path: "/" }, ...items];
}
