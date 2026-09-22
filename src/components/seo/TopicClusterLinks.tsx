import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getTopicCluster, type TopicClusterId } from "@/lib/seo/topic-clusters";

const KIND_LABELS = {
  guide: "Learn",
  tool: "Tool",
  compare: "Compare",
  research: "Research",
} as const;

export function TopicClusterLinks({
  clusterId,
  excludeHref,
  limit = 4,
  title = "Continue your research",
}: {
  clusterId: TopicClusterId;
  excludeHref?: string;
  limit?: number;
  title?: string;
}) {
  const cluster = getTopicCluster(clusterId);
  const links = cluster.links
    .filter((item) => item.href !== excludeHref)
    .slice(0, limit);

  return (
    <Card className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
            Topic path
          </p>
          <h2 className="font-display text-navy mt-1 text-lg font-bold">
            {title}
          </h2>
        </div>
        <Link
          href={cluster.hubHref}
          className="text-blue text-sm font-semibold underline"
        >
          View the full {cluster.id === "crypto" ? "crypto" : "share trading"}{" "}
          path →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-border hover:border-gold-soft rounded-lg border p-4 transition-colors"
          >
            <span className="text-gold-dark text-[11px] font-bold tracking-wider uppercase">
              {KIND_LABELS[item.kind]}
            </span>
            <span className="text-navy mt-1 block text-sm font-semibold">
              {item.title}
            </span>
            <span className="text-muted mt-1 block text-xs leading-5">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
