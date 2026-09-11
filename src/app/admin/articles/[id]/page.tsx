import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/articles/service";
import { ArticleForm } from "@/components/admin/article/ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-navy">Edit article</h1>
      <p className="mt-2 text-sm text-muted">{article.title}</p>
      <div className="mt-6">
        <ArticleForm mode="edit" article={article} />
      </div>
    </div>
  );
}