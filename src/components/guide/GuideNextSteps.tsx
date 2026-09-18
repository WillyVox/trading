import Link from "next/link";
import { Card } from "@/components/ui/Card";

type NextStep = { id: string; slug: string; title: string; href?: string };

export function GuideNextSteps({
  steps,
  heading = "New to crypto?",
}: {
  steps: NextStep[];
  /** Section heading. Defaults to the original crypto-guide copy so
   * existing callers are unaffected; other guide topics (e.g. share
   * trading) should pass their own, e.g. "Next steps". */
  heading?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <section className="border-border mt-10 border-t pt-6">
      <h2 className="font-display text-navy text-lg font-bold">{heading}</h2>
      <Card className="mt-4">
        <ol className="space-y-2.5 text-sm">
          {steps.map((step, i) => (
            <li key={step.id} className="flex gap-3">
              <span className="font-display text-gold font-bold">{i + 1}.</span>
              <Link
                href={step.href ?? `/guides/${step.slug}`}
                className="text-navy hover:underline"
              >
                {step.title}
              </Link>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}