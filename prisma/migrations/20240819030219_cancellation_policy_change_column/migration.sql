/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CANCELLATION_POLICIES` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CANCELLATION_POLICIES` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `CANCELLATION_POLICIES` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CANCELLATION_POLICIES" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
