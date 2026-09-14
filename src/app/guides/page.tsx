import { getPublishedArticles } from "@/lib/articles/service";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Crypto Guides Australia \u2014 How-To & Educational Articles",
  description: "Step-by-step crypto guides for Australians \u2014 buying, wallets, fees, and how exchanges work.",
  path: "/guides",
});

export default async function GuidesPage() {
  const { items } = await getPublishedArticles({ articleType: "GUIDE" });
  const trail = breadcrumbTrail([
    { name: "Crypto", path: "/crypto" },
    { name: "Guides", path: "/guides" },
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides"
        title="Step-by-step crypto guides for Australians"
        subheading="How-to guides for buying, storing, and trading crypto safely."
        graphic="guides"
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
      {items.length === 0 && <p className="mt-4 text-muted">No guides published yet.</p>}
      <ul className="mt-6 space-y-4">
        {items.map((a: any) => (
          <li key={a.id} className="text-navy">
            {a.title}
            </li>
        ))}
      </ul>
      </div>
    </>
  );
}