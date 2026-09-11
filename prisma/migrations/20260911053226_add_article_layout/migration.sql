-- CreateEnum
CREATE TYPE "ArticleSourceType" AS ENUM ('OFFICIAL_PROVIDER', 'REGULATOR', 'GOVERNMENT', 'OFFICIAL_DOCUMENTATION', 'NEWS', 'RESEARCH', 'OTHER');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "featuredImageAlt" TEXT;

-- AlterTable
ALTER TABLE "ArticleSource" ADD COLUMN     "sourceType" "ArticleSourceType";
