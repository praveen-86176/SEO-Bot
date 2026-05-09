-- AlterTable
ALTER TABLE "recommendations" ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "success_metrics" TEXT[],
ADD COLUMN     "timeframe" TEXT,
ADD COLUMN     "tools_suggested" TEXT[];

-- AlterTable
ALTER TABLE "seo_reports" ADD COLUMN     "jobId" TEXT;
