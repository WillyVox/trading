-- CreateEnum
CREATE TYPE "ArticleSearchIntent" AS ENUM ('LEARN', 'HOW_TO', 'BEGINNER', 'COMPARISON', 'PROVIDER_GUIDE', 'FEES', 'SECURITY', 'WALLET', 'REGULATION', 'MARKET_EDUCATION');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "keyTakeaways" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lastReviewedAt" TIMESTAMP(3),
ADD COLUMN     "searchIntent" "ArticleSearchIntent",
ADD COLUMN     "region" TEXT,
ADD COLUMN     "canonicalArticleId" TEXT;

-- CreateTable
CREATE TABLE "ArticleRelated" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "relatedArticleId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleRelated_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Article_category_idx" ON "Article"("category");

-- CreateIndex
CREATE INDEX "Article_region_idx" ON "Article"("region");

-- CreateIndex
CREATE INDEX "Article_searchIntent_idx" ON "Article"("searchIntent");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRelated_articleId_relatedArticleId_key" ON "ArticleRelated"("articleId", "relatedArticleId");

-- CreateIndex
CREATE INDEX "ArticleRelated_articleId_idx" ON "ArticleRelated"("articleId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_canonicalArticleId_fkey" FOREIGN KEY ("canonicalArticleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRelated" ADD CONSTRAINT "ArticleRelated_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRelated" ADD CONSTRAINT "ArticleRelated_relatedArticleId_fkey" FOREIGN KEY ("relatedArticleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
