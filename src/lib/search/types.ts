export type SearchDocumentType = "GUIDE" | "ARTICLE" | "NEWS" | "TOOL";
export type SearchDocumentSource = "STATIC" | "DATABASE";

export type SearchDocument = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: SearchDocumentType;
  category?: string | null;
  keywords?: string[];
  source: SearchDocumentSource;
  publishedAt?: string | null;
};

export type SearchResponse = {
  query: string;
  results: SearchDocument[];
  database: "available" | "unavailable";
  partial: boolean;
};
