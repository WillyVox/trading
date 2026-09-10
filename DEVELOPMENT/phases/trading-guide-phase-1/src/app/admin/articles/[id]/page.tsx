export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Edit Article</h1>
      <p className="mt-4 text-muted">
        Placeholder for article {id} — no editor or updateArticle()/publishArticle() actions yet.
      </p>
    </div>
  );
}
