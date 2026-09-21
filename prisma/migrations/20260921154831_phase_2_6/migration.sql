-- AlterTable
ALTER TABLE "OfferingAccountType" ADD COLUMN     "reviewDueAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;

-- AlterTable
ALTER TABLE "OfferingCustody" ADD COLUMN     "reviewDueAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;

-- AlterTable
ALTER TABLE "OfferingMarket" ADD COLUMN     "reviewDueAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;

-- AlterTable
ALTER TABLE "OfferingProduct" ADD COLUMN     "reviewDueAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;
