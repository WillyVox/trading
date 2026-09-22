import Link from "next/link";
import type { OfferingFeatureType, VerificationStatus } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";

type Feature = {
  id: string;
  featureType: OfferingFeatureType;
  label: string | null;
  value: string | null;
  available: boolean | null;
  sourceUrl: string | null;
  verificationStatus: VerificationStatus;
};

function featureLabel(feature: Feature) {
  return (
    feature.label ??
    feature.featureType
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
  );
}

export function OfferingFeatureSection({ features }: { features: Feature[] }) {
  if (!features.length) return null;
  return (
    <Card className="mt-4">
      <h2 className="font-display text-navy text-lg font-bold">
        Platform features
      </h2>
      <div className="mt-4 divide-y divide-[var(--border)]">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-navy text-sm font-semibold">
                {featureLabel(feature)}
              </p>
              <p className="text-muted mt-1 text-sm">
                {feature.value ??
                  (feature.available === true
                    ? "Available"
                    : feature.available === false
                      ? "Not available"
                      : "Not yet confirmed")}
              </p>
              {feature.sourceUrl && (
                <Link
                  href={feature.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue mt-1 inline-block text-xs underline"
                >
                  Source ↗
                </Link>
              )}
            </div>
            <VerificationBadge status={feature.verificationStatus} />
          </div>
        ))}
      </div>
    </Card>
  );
}
