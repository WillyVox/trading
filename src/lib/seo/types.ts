/** Admin-editable SEO override fields, shared by any domain model that has them. */
export interface SeoOverrides {
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path, e.g. "/crypto/guides/how-to-buy-bitcoin" */
  path: string;
}
