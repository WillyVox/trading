import Link from "next/link";
import { FeeCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  markOfferingFeeStale,
  verifyOfferingFee,
} from "@/lib/admin/pricing-verification-actions";

function date(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(value)
    : "—";
}

export default async function PricingVerificationPage() {
  const fees = await prisma.offeringFee.findMany({
    where: { feeCategory: FeeCategory.BROKERAGE, offering: { active: true } },
    include: {
      offering: { include: { provider: { select: { name: true } } } },
      market: true,
    },
    orderBy: [{ reviewDueAt: "asc" }, { label: "asc" }],
  });
  const now = new Date();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-navy text-2xl font-bold">
            Pricing verification
          </h1>
          <p className="text-muted mt-2 max-w-3xl text-sm">
            Review calculator pricing against the linked official source. Mark
            verified only after confirming the structured rule and conditions
            still match the publisher.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        {fees.map((fee) => {
          const overdue = !fee.reviewDueAt || fee.reviewDueAt < now;
          return (
            <article
              key={fee.id}
              className="border-border bg-panel rounded-2xl border p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                    {fee.offering.provider.name} ·{" "}
                    {fee.market?.code ?? "All markets"}
                  </p>
                  <h2 className="text-navy mt-1 font-semibold">{fee.label}</h2>
                  <p className="text-muted mt-2 text-sm">
                    Status:{" "}
                    <strong className="text-navy">
                      {fee.verificationStatus}
                    </strong>{" "}
                    · Last verified: {date(fee.verifiedAt)} · Review due:{" "}
                    <span
                      className={overdue ? "font-semibold text-amber-800" : ""}
                    >
                      {date(fee.reviewDueAt)}
                    </span>
                  </p>
                  {fee.sourceUrl && (
                    <Link
                      className="text-blue mt-2 inline-block text-sm underline"
                      href={fee.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open official pricing source ↗
                    </Link>
                  )}
                </div>
                <div className="flex gap-2">
                  <form action={verifyOfferingFee}>
                    <input type="hidden" name="feeId" value={fee.id} />
                    <button className="bg-navy min-h-11 rounded-lg px-4 text-sm font-semibold text-white">
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
        })}
      </div>
    </div>
  );
}
