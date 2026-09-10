import Link from "next/link";
import { Card } from "@/components/ui/Card";

type NextStep = { id: string; slug: string; title: string };

export function GuideNextSteps({ steps }: { steps: NextStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-bold text-navy">New to crypto?</h2>
      <Card className="mt-4">
        <ol className="space-y-2.5 text-sm">
          {steps.map((step, i) => (
            <li key={step.id} className="flex gap-3">
              <span className="font-display font-bold text-gold">{i + 1}.</span>
              <Link href={`/crypto/guides/${step.slug}`} className="text-navy hover:underline">
                {step.title}
              </Link>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
