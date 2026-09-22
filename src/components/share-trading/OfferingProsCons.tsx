import Link from "next/link";
import type { OfferingProsConsType, VerificationStatus } from "@prisma/client";
import { Card } from "@/components/ui/Card";

type Item = {
  id: string;
  type: OfferingProsConsType;
  label: string;
  detail: string | null;
  sourceUrl: string | null;
  verificationStatus: VerificationStatus;
};

export function OfferingProsCons({ items }: { items: Item[] }) {
  if (!items.length) return null;
  const groups = [
    { type: "PRO" as OfferingProsConsType, title: "Documented capabilities" },
    {
      type: "LIMITATION" as OfferingProsConsType,
      title: "Documented limitations",
    },
  ];
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {groups.map((group) => {
        const rows = items.filter((item) => item.type === group.type);
        if (!rows.length) return null;
        return (
          <Card key={group.type}>
            <h2 className="font-display text-navy text-lg font-bold">
              {group.title}
            </h2>
            <div className="mt-4 space-y-4">
              {rows.map((item) => (
                <div key={item.id}>
                  <p className="text-navy text-sm font-semibold">
                    {item.label}
                  </p>
                  {item.detail && (
                    <p className="text-muted mt-1 text-sm leading-6">
                      {item.detail}
                    </p>
                  )}
                  <div className="text-muted mt-1 flex gap-2 text-xs">
                    <span>{item.verificationStatus}</span>
                    {item.sourceUrl && (
                      <Link
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue underline"
                      >
                        Source ↗
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
