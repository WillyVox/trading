import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { LearningPathOverviewClient } from "@/components/learning/LearningPathOverviewClient";
import { LEARNING_PATHS } from "@/lib/learning/paths";
import { buildMetadata } from "@/lib/seo/metadata";
const path = LEARNING_PATHS.find((p) => p.id === "share-trading-foundations")!;
export const metadata = buildMetadata({
  title: "Learn Share Trading in Australia | Trading Guide",
  description:
    "A beginner learning path covering share trading basics, costs, brokerage, CHESS, HINs and fractional shares in Australia.",
  path: "/learn/share-trading",
});
export default function Page() {
  const mins = path.lessons.reduce((n, l) => n + l.minutes, 0);
  return (
    <>
      <PageHero
        eyebrow="Learning path"
        title="Share Trading Foundations"
        subheading="Learn the foundations in a practical order—from how share trading works to costs, brokerage and common Australian ownership structures."
      />
      <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <p className="text-muted text-base leading-7">
          This beginner path is designed to be followed in order, but every
          lesson also works on its own. It focuses on concepts and research
          skills rather than telling you which product to choose.
        </p>
        <p className="text-muted mt-3 text-sm">
          {path.lessons.length} lessons · about {mins} minutes
        </p>
        <LearningPathOverviewClient path={path} />
        <div className="border-border mt-10 border-t pt-8">
          <h2 className="font-display text-navy text-2xl font-bold">
            Learn, then research
          </h2>
          <p className="text-muted mt-2 leading-7">
            After the foundations, you can use Trading Guide&lsquo;s calculators
            and source-linked platform research to investigate costs and
            features yourself.
          </p>
          <Link
            href="/tools"
            className="text-blue mt-4 inline-block font-semibold"
          >
            Explore research tools →
          </Link>
        </div>
      </main>
    </>
  );
}
