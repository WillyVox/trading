import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ToolDefinition } from "@/lib/tools/types";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const comingSoon = tool.status === "COMING_SOON";

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
          {tool.category === "TRADING_COSTS" ? "Trading costs" : "Ownership & custody"}
        </p>
        {comingSoon && <Badge tone="muted">Coming soon</Badge>}
      </div>
      <h2 className="font-display text-navy mt-3 text-xl font-bold">{tool.name}</h2>
      <p className="text-muted mt-2 flex-1 text-sm leading-6">{tool.description}</p>
      {comingSoon ? (
        <span className="text-muted mt-5 text-sm font-semibold" aria-label={`${tool.name} coming soon`}>
          In development
        </span>
      ) : (
        <Link href={tool.href} className="text-blue mt-5 text-sm font-semibold underline">
          Open tool →
        </Link>
      )}
    </Card>
  );
}
