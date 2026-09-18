export type GuideSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  author: string | null;
  publishedAt: Date | string | null;
  updatedAt: Date | string | null;
  source: 'STATIC' | 'DATABASE';
};
