import { ArticleForm } from "@/components/admin/article/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-navy">New article</h1>
      <p className="mt-2 text-sm text-muted">
        Saves as DRAFT — publishing rules and Preview become available once the article exists.
      </p>
      <div className="mt-6">
        <ArticleForm mode="create" />
      </div>
    </div>
  );
}