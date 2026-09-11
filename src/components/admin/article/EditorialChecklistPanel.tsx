import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import type { ChecklistItem } from "@/lib/articles/editorial-checklist";

const DOT_CLASS: Record<ChecklistItem["level"], string> = {
  good: "bg-green",
  warning: "bg-gold",
  info: "bg-muted",
};

/** Advisory only — see Req.md §12: never a fake score, never a publish blocker. */
export function EditorialChecklistPanel({ items }: { items: ChecklistItem[] }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold text-navy">Editorial checklist</h2>
      <p className="mt-1 text-xs text-muted">Advisory only — this never blocks publishing.</p>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={clsx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", DOT_CLASS[item.level])} />
            <span className="text-navy">{item.message}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
