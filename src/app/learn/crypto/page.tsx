import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { LearningPathOverviewClient } from "@/components/learning/LearningPathOverviewClient";
import { LEARNING_PATHS } from "@/lib/learning/paths";
import { buildMetadata } from "@/lib/seo/metadata";
const path = LEARNING_PATHS.find((p) => p.id === "crypto-foundations")!;
export const metadata = buildMetadata({
  title: "Learn Crypto Basics in Australia | Trading Guide",
  description:
    "A beginner crypto learning path covering risk, exchanges, funding, fees and Australian registration context.",
  path: "/learn/crypto",
});
export default function Page() {
  const mins = path.lessons.reduce((n, l) => n + l.minutes, 0);
  return (
    <>
      <PageHero
        eyebrow="Learning path"
        title="Crypto Foundations"
        subheading="Build a grounded understanding of crypto risk, exchanges, funding and fees before researching individual providers."
      />
      <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <p className="text-muted text-base leading-7">
          This path focuses on concepts, costs, security context and research
          skills. It does not assume that crypto is suitable for you or
          recommend an exchange.
        </p>
        <p className="text-muted mt-3 text-sm">
          {path.lessons.length} lessons · about {mins} minutes
        </p>
        <LearningPathOverviewClient path={path} />
        <div className="border-border mt-10 border-t pt-8">
          <h2 className="font-display text-navy text-2xl font-bold">
            Understand the costs before comparing
          </h2>
          <p className="text-muted mt-2 leading-7">
            Use the educational calculators to explore hypothetical fee paths,
            then inspect source-linked exchange information when you&lsquo;re ready.
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
