import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { KeyTakeaways } from "@/components/guide/KeyTakeaways";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import { GuideSourceList } from "@/components/guide/GuideSourceList";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { guideBreadcrumbTrail } from "@/lib/seo/breadcrumbs";

export type ResearchGuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ResearchGuideSource = { id: string; label: string; url: string };
export type ResearchGuideLink = {
  href: string;
  title: string;
  description: string;
};

export type ResearchGuideConfig = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  readMinutes: number;
  takeaways: string[];
  sections: ResearchGuideSection[];
  sources: ResearchGuideSource[];
  next: ResearchGuideLink[];
};

export function ResearchGuidePage({
  config,
  evidence,
}: {
  config: ResearchGuideConfig;
  evidence?: ReactNode;
}) {
  const trail = guideBreadcrumbTrail(config.title, config.path);
  const headings = config.sections.map((section) => ({
    id: section.id,
    text: section.title,
    level: 2 as const,
  }));

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: config.title,
          description: config.description,
          author: "Trading Guide Editorial Team",
          datePublished: config.published,
          dateModified: config.updated,
          path: config.path,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        breadcrumbs={trail}
        eyebrow={config.eyebrow}
        title={config.title}
        subheading={config.description}
        meta={[
          "By Trading Guide Editorial Team",
          `Published ${config.published}`,
          `Last reviewed ${config.updated}`,
          `${config.readMinutes} min read`,
        ]}
        graphic="guides"
      />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl min-w-0">
            <KeyTakeaways items={config.takeaways} />
            {evidence}
            <div className="mt-6 lg:hidden">
              <GuideTableOfContents headings={headings} />
            </div>
            <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none">
              {config.sections.map((section) => (
                <section key={section.id}>
                  <h2 id={section.id}>{section.title}</h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {section.bullets?.length ? (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
            <Card className="mt-8">
              <h2 className="font-display text-navy text-lg font-bold">
                Use this guide with live Trading Guide research
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {config.next.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-border hover:border-gold-soft rounded-xl border p-4 transition-colors"
                  >
                    <p className="text-navy font-semibold">{item.title}</p>
                    <p className="text-muted mt-1 text-sm leading-5">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
            <GuideSourceList sources={config.sources} />
            <p className="text-muted mt-4 text-xs leading-5">
              Sources were reviewed on {config.updated}. Provider pricing and
              product terms can change; verify current terms with the provider
              before acting. This guide is general educational information, not
              personal financial advice.
            </p>
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <GuideTableOfContents headings={headings} />
              <Card>
                <p className="font-display text-navy text-sm font-bold">
                  Research standard
                </p>
                <p className="text-muted mt-2 text-sm leading-6">
                  Official Australian regulator, exchange and provider sources
                  are preferred. Unknown, conditional and variable costs are not
                  treated as zero.
                </p>
                <Link
                  href="/methodology"
                  className="text-blue mt-3 inline-block text-sm font-semibold underline"
                >
                  Methodology →
                </Link>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
