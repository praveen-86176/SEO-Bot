/*
  Warnings:

  - You are about to drop the column `expected_impact` on the `recommendations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recommendations" DROP COLUMN "expected_impact",
ADD COLUMN     "impact_score" INTEGER NOT NULL DEFAULT 50;
