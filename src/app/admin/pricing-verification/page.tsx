import Link from "next/link";
import { FeeCategory, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  markOfferingFeeStale,
  verifyOfferingFee,
} from "@/lib/admin/pricing-verification-actions";

const CRYPTO_CATEGORIES: FeeCategory[] = [
  FeeCategory.CRYPTO_TRADING,
  FeeCategory.MAKER,
  FeeCategory.TAKER,
  FeeCategory.INSTANT_BUY,
  FeeCategory.FIAT_DEPOSIT,
  FeeCategory.FIAT_WITHDRAWAL,
  FeeCategory.CRYPTO_WITHDRAWAL,
  FeeCategory.SPREAD,
];

function date(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(value)
    : "—";
}

function number(value: { toString(): string } | null) {
  return value == null ? null : value.toString();
}

function statusClass(status: VerificationStatus, overdue: boolean) {
  if (overdue || status === VerificationStatus.STALE)
    return "border-red-200 bg-red-50 text-red-800";
  if (status === VerificationStatus.VERIFIED)
    return "border-green-200 bg-green-50 text-green-800";
  return "border-border bg-panel-secondary text-muted";
}

export default async function PricingVerificationPage() {
  const now = new Date();
  const fees = await prisma.offeringFee.findMany({
    where: { offering: { active: true } },
    include: {
      offering: { include: { provider: { select: { name: true } } } },
      market: true,
      tiers: { orderBy: { position: "asc" } },
    },
    orderBy: [{ reviewDueAt: "asc" }, { label: "asc" }],
  });

  const cryptoFees = fees.filter((fee) =>
    CRYPTO_CATEGORIES.includes(fee.feeCategory)
  );
  const otherFees = fees.filter(
    (fee) => !CRYPTO_CATEGORIES.includes(fee.feeCategory)
  );
  const overdueCount = fees.filter(
    (fee) => fee.reviewDueAt != null && fee.reviewDueAt < now
  ).length;
  const unverifiedCount = fees.filter(
    (fee) => fee.verificationStatus !== VerificationStatus.VERIFIED
  ).length;

  const [unverifiedOfferings, staleOfferings, missingSourceFacts] =
    await Promise.all([
      prisma.providerOffering.count({
        where: {
          active: true,
          verificationStatus: { not: VerificationStatus.VERIFIED },
        },
      }),
      prisma.providerOffering.count({
        where: { active: true, verificationStatus: VerificationStatus.STALE },
      }),
      Promise.all([
        prisma.offeringFee.count({
          where: { offering: { active: true }, sourceUrl: null },
        }),
        prisma.offeringMarket.count({
          where: { offering: { active: true }, sourceUrl: null },
        }),
        prisma.offeringProduct.count({
          where: { offering: { active: true }, sourceUrl: null },
        }),
        prisma.offeringCustody.count({
          where: { offering: { active: true }, sourceUrl: null },
        }),
        prisma.offeringFeature.count({
          where: { offering: { active: true }, sourceUrl: null },
        }),
        prisma.offeringProsCon.count({
          where: { offering: { active: true }, sourceUrl: null },
        }),
      ]).then((counts) => counts.reduce((total, count) => total + count, 0)),
    ]);

  const renderFee = (fee: (typeof fees)[number]) => {
    const overdue = fee.reviewDueAt != null && fee.reviewDueAt < now;
    const isCrypto = CRYPTO_CATEGORIES.includes(fee.feeCategory);
    return (
      <article
        key={fee.id}
        className="border-border bg-panel rounded-2xl border p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                {fee.offering.provider.name} ·{" "}
                {fee.market?.code ?? "All markets"}
              </p>
              <span className="border-border rounded-full border px-2 py-0.5 text-[11px] font-semibold">
                {fee.feeCategory.replaceAll("_", " ")}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass(fee.verificationStatus, overdue)}`}
              >
                {overdue ? "REVIEW OVERDUE" : fee.verificationStatus}
              </span>
            </div>

            <h2 className="text-navy mt-2 font-semibold">{fee.label}</h2>
            <p className="text-muted mt-2 text-sm">
              {fee.calculationBasis.replaceAll("_", " ")}
              {fee.percentage != null ? ` · ${number(fee.percentage)}%` : ""}
              {fee.flatAmount != null
                ? ` · ${fee.currency ?? ""} ${number(fee.flatAmount)}`
                : ""}
              {fee.displayValue ? ` · ${fee.displayValue}` : ""}
            </p>

            {isCrypto && (
              <div className="border-border bg-panel-secondary mt-4 grid gap-2 rounded-xl border p-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="text-muted block text-xs">Pricing plan</span>
                  <strong className="text-navy">
                    {fee.pricingPlan ?? "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-muted block text-xs">
                    Volume currency
                  </span>
                  <strong className="text-navy">
                    {fee.tierVolumeCurrency ?? "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-muted block text-xs">
                    Assets currency
                  </span>
                  <strong className="text-navy">
                    {fee.tierAssetsCurrency ?? "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-muted block text-xs">
                    Structured tiers
                  </span>
                  <strong className="text-navy">{fee.tiers.length}</strong>
                </div>
              </div>
            )}

            {fee.tiers.length > 0 && (
              <details className="mt-3">
                <summary className="text-blue cursor-pointer text-sm font-semibold">
                  Review {fee.tiers.length} structured tier
                  {fee.tiers.length === 1 ? "" : "s"}
                </summary>
                <div className="border-border mt-2 overflow-x-auto rounded-lg border">
                  <table className="w-full min-w-[720px] text-left text-xs">
                    <thead className="bg-panel-secondary text-muted">
                      <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Trade range</th>
                        <th className="px-3 py-2">30-day volume ≥</th>
                        <th className="px-3 py-2">Assets ≥</th>
                        <th className="px-3 py-2">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fee.tiers.map((tier) => (
                        <tr key={tier.id} className="border-border border-t">
                          <td className="px-3 py-2">{tier.position + 1}</td>
                          <td className="px-3 py-2">
                            {number(tier.minAmount)} –{" "}
                            {number(tier.maxAmount) ?? "∞"}
                          </td>
                          <td className="px-3 py-2">
                            {number(tier.minRolling30DayVolume) ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            {number(tier.minAssetsOnPlatform) ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            {tier.percentage != null
                              ? `${number(tier.percentage)}%`
                              : tier.flatAmount != null
                                ? `${fee.currency ?? ""} ${number(tier.flatAmount)}`
                                : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            {fee.notes && (
              <p className="text-muted mt-3 text-sm leading-6">{fee.notes}</p>
            )}

            <p className="text-muted mt-3 text-sm">
              Last verified:{" "}
              <strong className="text-navy">{date(fee.verifiedAt)}</strong> ·
              Review due:{" "}
              <strong className={overdue ? "text-red-700" : "text-navy"}>
                {date(fee.reviewDueAt)}
              </strong>
            </p>
            {fee.sourceUrl ? (
              <Link
                className="text-blue mt-2 inline-block text-sm underline"
                href={fee.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open pricing source ↗
              </Link>
            ) : (
              <p className="mt-2 text-sm font-semibold text-red-700">
                No source URL recorded
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <form action={verifyOfferingFee}>
              <input type="hidden" name="feeId" value={fee.id} />
              <button
                disabled={!fee.sourceUrl}
                className="bg-navy min-h-11 rounded-lg px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Mark verified
              </button>
            </form>
            <form action={markOfferingFeeStale}>
              <input type="hidden" name="feeId" value={fee.id} />
              <button className="border-border min-h-11 rounded-lg border px-4 text-sm font-semibold">
                Mark stale
              </button>
            </form>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-navy text-2xl font-bold">
            Pricing verification
          </h1>
          <p className="text-muted mt-2 max-w-3xl text-sm leading-6">
            Review structured calculator pricing against its linked source. For
            crypto, verify the fee type, maker/taker or instant-buy context,
            tier thresholds, qualification currency and funding/withdrawal
            conditions before marking a record verified.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="border-border bg-panel rounded-xl border p-4">
          <p className="text-muted text-xs uppercase">Active fee records</p>
          <p className="text-navy mt-1 text-2xl font-bold">{fees.length}</p>
        </div>
        <div className="border-border bg-panel rounded-xl border p-4">
          <p className="text-muted text-xs uppercase">Needs verification</p>
          <p className="text-navy mt-1 text-2xl font-bold">{unverifiedCount}</p>
        </div>
        <div className="border-border bg-panel rounded-xl border p-4">
          <p className="text-muted text-xs uppercase">Review overdue</p>
          <p className="text-navy mt-1 text-2xl font-bold">{overdueCount}</p>
        </div>
        <div className="border-border bg-panel rounded-xl border p-4">
          <p className="text-muted text-xs uppercase">Offering quality flags</p>
          <p className="text-navy mt-1 text-2xl font-bold">
            {unverifiedOfferings}
          </p>
          <p className="text-muted mt-1 text-xs">
            Includes {staleOfferings} stale active offering
            {staleOfferings === 1 ? "" : "s"}
          </p>
        </div>
        <div className="border-border bg-panel rounded-xl border p-4">
          <p className="text-muted text-xs uppercase">Missing source links</p>
          <p className="text-navy mt-1 text-2xl font-bold">
            {missingSourceFacts}
          </p>
          <p className="text-muted mt-1 text-xs">
            Across structured offering facts
          </p>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="crypto-pricing-heading">
        <h2
          id="crypto-pricing-heading"
          className="font-display text-navy text-xl font-bold"
        >
          Crypto pricing
        </h2>
        <p className="text-muted mt-1 text-sm">
          Trading, maker/taker, instant-buy, deposit and withdrawal records used
          by the Phase 7 tools.
        </p>
        <div className="mt-4 grid gap-4">
          {cryptoFees.length ? (
            cryptoFees.map(renderFee)
          ) : (
            <p className="text-muted text-sm">
              No active crypto pricing records.
            </p>
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="other-pricing-heading">
        <h2
          id="other-pricing-heading"
          className="font-display text-navy text-xl font-bold"
        >
          Share trading & other pricing
        </h2>
        <div className="mt-4 grid gap-4">
          {otherFees.length ? (
            otherFees.map(renderFee)
          ) : (
            <p className="text-muted text-sm">
              No other active pricing records.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
