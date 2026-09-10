-- CreateEnum
CREATE TYPE "ProviderProsConsType" AS ENUM ('PRO', 'LIMITATION');

-- CreateTable
CREATE TABLE "ProviderProsCon" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "ProviderProsConsType" NOT NULL,
    "label" TEXT NOT NULL,
    "detail" TEXT,
    "sourceUrl" TEXT,
    "jurisdiction" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProviderProsCon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderProsCon_providerId_idx" ON "ProviderProsCon"("providerId");

-- CreateIndex
CREATE INDEX "ProviderProsCon_type_idx" ON "ProviderProsCon"("type");

-- AddForeignKey
ALTER TABLE "ProviderProsCon" ADD CONSTRAINT "ProviderProsCon_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
