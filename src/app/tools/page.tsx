import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { ToolCard } from "@/components/tools/ToolCard";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { TOOLS } from "@/lib/tools/catalog";

export const metadata = buildMetadata({
  title: "Tools — Trading Cost Calculators & Ownership Explorers",
  description:
    "Use transparent Trading Guide tools to understand brokerage, FX costs, CHESS sponsorship and custody using explainable calculations and source-linked research.",
  path: "/tools",
});

export default function ToolsPage() {
  const trail = breadcrumbTrail([{ name: "Tools", path: "/tools" }]);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow="Research tools"
        title="Understand the numbers before you compare"
        subheading="Calculators and interactive explainers designed to show what was calculated, which rule applied, what is not included, and where the underlying information came from."
      />
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <section aria-labelledby="tools-principle" className="max-w-3xl">
          <h2
            id="tools-principle"
            className="font-display text-navy text-2xl font-bold"
          >
            Learn → calculate → verify
          </h2>
          <p className="text-muted mt-3 leading-7">
            Trading Guide tools are educational research aids. Provider-derived
            calculations will only produce an estimate when the structured data
            can support it. Unknown, variable, stale or unsupported pricing will
            be labelled instead of treated as zero.
          </p>
        </section>

        <section aria-labelledby="phase-one-tools" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
                Phase 1
              </p>
              <h2
                id="phase-one-tools"
                className="font-display text-navy mt-2 text-2xl font-bold"
              >
                First tools
              </h2>
            </div>
            <p className="text-muted max-w-xl text-sm">
              We are starting with three focused experiences rather than
              publishing a large collection of unreliable calculators.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <section aria-labelledby="tool-trust" className="mt-12">
          <h2
            id="tool-trust"
            className="font-display text-navy text-2xl font-bold"
          >
            What a provider-derived result must show
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Rule",
                "The published pricing rule that applies to the selected scenario.",
              ],
              [
                "Calculation",
                "The steps used to produce the estimate, not just the final number.",
              ],
              [
                "Limits",
                "Assumptions and costs that are not included in the estimate.",
              ],
              [
                "Evidence",
                "The underlying source, verification status and verified date where available.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="border-border rounded-xl border p-4">
                <h3 className="text-navy font-bold">{title}</h3>
                <p className="text-muted mt-2 text-sm leading-6">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <Notice>
            General information only. These tools are designed to explain
            published pricing and ownership structures for hypothetical
            scenarios. They do not recommend a platform or make a financial
            decision for you.
          </Notice>
        </div>
      </main>
    </>
  );
}
