ALTER TABLE "OfferingFee"
  ADD COLUMN "reviewDueAt" TIMESTAMP(3),
  ADD COLUMN "verifiedByUserId" TEXT;

CREATE INDEX "OfferingFee_reviewDueAt_idx" ON "OfferingFee"("reviewDueAt");
