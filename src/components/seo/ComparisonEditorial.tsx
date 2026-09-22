import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { CuratedComparison } from "@/lib/seo/curated-comparisons";

export function ComparisonEditorial({
  comparison,
}: {
  comparison: CuratedComparison;
}) {
  return (
    <Card className="mb-8">
      <p className="text-muted text-sm leading-6">{comparison.intro}</p>
      <h2 className="font-display text-navy mt-5 text-lg font-bold">
        What this comparison covers
      </h2>
      <ul className="text-muted mt-3 grid gap-2 text-sm sm:grid-cols-2">
        {comparison.focus.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <p className="text-muted mt-5 text-xs leading-5">
        Data comes from our structured provider catalogue and should be checked
        against the linked source before acting on it. See{" "}
        <Link href="/methodology/comparisons" className="underline">
          comparison methodology
        </Link>
        .
      </p>
    </Card>
  );
}
