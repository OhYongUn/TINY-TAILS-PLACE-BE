/*
  Warnings:

  - Changed the type of `status` on the `PAYMENTS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `method` on the `PAYMENTS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `PAYMENTS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PAYMENTS" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" "PaymentMethod" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "PaymentType" NOT NULL;

-- CreateIndex
CREATE INDEX "PAYMENTS_status_idx" ON "PAYMENTS"("status");

-- CreateIndex
CREATE INDEX "PAYMENTS_method_idx" ON "PAYMENTS"("method");

-- CreateIndex
CREATE INDEX "PAYMENTS_type_idx" ON "PAYMENTS"("type");
