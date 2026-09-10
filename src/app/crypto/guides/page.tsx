import { getPublishedArticles } from "@/lib/articles/service";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Crypto Guides Australia \u2014 How-To & Educational Articles",
  description: "Step-by-step crypto guides for Australians \u2014 buying, wallets, fees, and how exchanges work.",
  path: "/crypto/guides",
});

export default async function GuidesPage() {
  const { items } = await getPublishedArticles({ category: "guide" });
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-navy">Guides</h1>
      {items.length === 0 && <p className="mt-4 text-muted">No guides published yet.</p>}
      <ul className="mt-6 space-y-4">
        {items.map((a: any) => (
          <li key={a.id} className="text-navy">
            {a.title}
            </li>
        ))}
      </ul>
    </div>
  );
}
