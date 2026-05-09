-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "RecommendationCategory" AS ENUM ('KEYWORD', 'CONTENT', 'BACKLINK', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "Effort" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('BLOG_POST_IDEA', 'BLOG_COMMENT', 'SOCIAL_POST', 'DIRECTORY_SUBMISSION', 'OUTREACH_EMAIL', 'FORUM_POST');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "geography" TEXT,
    "services" TEXT[],
    "competitors" TEXT[],
    "current_keywords" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_reports" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "raw_crawl_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seo_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_analyses" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "primary_keywords" TEXT[],
    "secondary_keywords" TEXT[],
    "longtail_keywords" TEXT[],
    "reasoning" JSONB,

    CONSTRAINT "keyword_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_analyses" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "competitor_url" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "competitor_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "category" "RecommendationCategory" NOT NULL,
    "priority" "Priority" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expected_impact" TEXT NOT NULL,
    "effort" "Effort" NOT NULL,
    "action_items" TEXT[],

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_contents" (
    "id" TEXT NOT NULL,
    "recommendation_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "platform" TEXT NOT NULL,
    "platform_url" TEXT,
    "content" TEXT NOT NULL,
    "hashtags" TEXT[],
    "status" "ExecutionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "execution_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keyword_analyses_report_id_key" ON "keyword_analyses"("report_id");

-- AddForeignKey
ALTER TABLE "seo_reports" ADD CONSTRAINT "seo_reports_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyword_analyses" ADD CONSTRAINT "keyword_analyses_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "seo_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_analyses" ADD CONSTRAINT "competitor_analyses_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "seo_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "seo_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_contents" ADD CONSTRAINT "execution_contents_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_contents" ADD CONSTRAINT "execution_contents_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "seo_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
