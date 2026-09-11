/*
  Warnings:

  - Added the required column `articleType` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('NEWS', 'GUIDE');

-- AlterEnum
ALTER TYPE "ArticleStatus" ADD VALUE 'REVIEW';

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "articleType" "ArticleType" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Article_status_articleType_publishedAt_idx" ON "Article"("status", "articleType", "publishedAt");
