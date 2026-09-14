import { PageHero } from "@/components/layout/PageHero";
import { Notice } from "@/components/ui/Notice";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";

// noIndex: true — this is an honest placeholder, not a real guide yet.
// Search engines shouldn't index a page whose only content is "coming
// soon" (thin-content risk); it becomes indexable once real content
// replaces this.
export const metadata = buildMetadata({
  title: "Share Trading for Beginners — Guide Coming Soon",
  description: "A beginner's guide to share trading is on the way as we expand beyond crypto.",
  path: "/guides/share-trading-for-beginners",
  noIndex: true,
});

export default function ShareTradingForBeginnersPage() {
  const trail = breadcrumbTrail([
    { name: "Guides", path: "/guides" },
    { name: "Share trading for beginners", path: "/guides/share-trading-for-beginners" },
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides · Coming soon"
        title="Share trading for beginners"
        subheading="We're expanding beyond crypto — this guide is being written now."
        ctas={[{ label: "Browse crypto guides", href: "/guides", variant: "gold" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Notice>
          We don&apos;t have a share trading guide published yet — we&apos;d rather leave this page honest
          than fill it with generic content. In the meantime, our crypto guides cover buying, wallets, fees,
          and how exchanges work.
        </Notice>
      </div>
    </>
  );
}
