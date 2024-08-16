/*
  Warnings:

  - The values [PAYPAL] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - The values [PARTIALLY_REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REFUND] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `BOOKINGS` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actual_early_checkin` on the `BOOKINGS` table. All the data in the column will be lost.
  - You are about to drop the column `actual_late_checkout` on the `BOOKINGS` table. All the data in the column will be lost.
  - You are about to drop the column `booking_num` on the `BOOKINGS` table. All the data in the column will be lost.
  - You are about to drop the column `pet_count` on the `BOOKINGS` table. All the data in the column will be lost.
  - You are about to drop the column `requested_early_checkin` on the `BOOKINGS` table. All the data in the column will be lost.
  - You are about to drop the column `requested_late_checkout` on the `BOOKINGS` table. All the data in the column will be lost.
  - You are about to drop the column `special_requests` on the `BOOKINGS` table. All the data in the column will be lost.
  - The primary key for the `ORDERS` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('LATE_CHECKOUT', 'EARLY_CHECKIN', 'MINIBAR', 'ROOM_SERVICE', 'OTHER');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH');
ALTER TABLE "PAYMENTS" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
ALTER TABLE "PAYMENTS" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('INITIAL', 'ADDITIONAL');
ALTER TABLE "PAYMENTS" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ORDER_ITEMS" DROP CONSTRAINT "ORDER_ITEMS_order_id_fkey";

-- DropForeignKey
ALTER TABLE "PAYMENTS" DROP CONSTRAINT "PAYMENTS_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "PAYMENTS" DROP CONSTRAINT "PAYMENTS_order_id_fkey";

-- DropIndex
DROP INDEX "BOOKINGS_booking_num_key";

-- DropIndex
DROP INDEX "PAYMENTS_booking_id_key";

-- AlterTable
ALTER TABLE "BOOKINGS" DROP CONSTRAINT "BOOKINGS_pkey",
DROP COLUMN "actual_early_checkin",
DROP COLUMN "actual_late_checkout",
DROP COLUMN "booking_num",
DROP COLUMN "pet_count",
DROP COLUMN "requested_early_checkin",
DROP COLUMN "requested_late_checkout",
DROP COLUMN "special_requests",
ADD COLUMN     "cancellation_date" TIMESTAMP(3),
ADD COLUMN     "cancellation_fee" DOUBLE PRECISION,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BOOKINGS_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BOOKINGS_id_seq";

-- AlterTable
ALTER TABLE "ORDERS" DROP CONSTRAINT "ORDERS_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ORDERS_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ORDERS_id_seq";

-- AlterTable
ALTER TABLE "ORDER_ITEMS" ALTER COLUMN "order_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PAYMENTS" ALTER COLUMN "booking_id" SET DATA TYPE TEXT,
ALTER COLUMN "order_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ROOM_DETAILS" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "BOOKING_DETAILS" (
    "id" SERIAL NOT NULL,
    "booking_id" TEXT NOT NULL,
    "pet_count" INTEGER NOT NULL,
    "request" TEXT DEFAULT '',
    "requested_late_checkout" BOOLEAN NOT NULL DEFAULT false,
    "requested_early_checkin" BOOLEAN NOT NULL DEFAULT false,
    "actual_late_checkout" BOOLEAN NOT NULL DEFAULT false,
    "actual_early_checkin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BOOKING_DETAILS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOOKING_STATUS_HISTORIES" (
    "id" SERIAL NOT NULL,
    "bookin_id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BOOKING_STATUS_HISTORIES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ADDITIONAL_FEES" (
    "id" SERIAL NOT NULL,
    "booking_id" TEXT NOT NULL,
    "fee_type" "FeeType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ADDITIONAL_FEES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CANCELLATION_POLICIES" (
    "id" SERIAL NOT NULL,
    "days_before_checkin" INTEGER NOT NULL,
    "fee_percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CANCELLATION_POLICIES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REFUNDS" (
    "id" SERIAL NOT NULL,
    "booking_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "RefundStatus" NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "REFUNDS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BOOKING_DETAILS_booking_id_key" ON "BOOKING_DETAILS"("booking_id");

-- CreateIndex
CREATE INDEX "BOOKING_STATUS_HISTORIES_bookin_id_idx" ON "BOOKING_STATUS_HISTORIES"("bookin_id");

-- CreateIndex
CREATE INDEX "ADDITIONAL_FEES_booking_id_idx" ON "ADDITIONAL_FEES"("booking_id");

-- CreateIndex
CREATE INDEX "REFUNDS_booking_id_idx" ON "REFUNDS"("booking_id");

-- CreateIndex
CREATE INDEX "PAYMENTS_booking_id_idx" ON "PAYMENTS"("booking_id");

-- CreateIndex
CREATE INDEX "PAYMENTS_order_id_idx" ON "PAYMENTS"("order_id");

-- AddForeignKey
ALTER TABLE "BOOKING_DETAILS" ADD CONSTRAINT "BOOKING_DETAILS_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BOOKINGS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOOKING_STATUS_HISTORIES" ADD CONSTRAINT "BOOKING_STATUS_HISTORIES_bookin_id_fkey" FOREIGN KEY ("bookin_id") REFERENCES "BOOKINGS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDER_ITEMS" ADD CONSTRAINT "ORDER_ITEMS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ORDERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAYMENTS" ADD CONSTRAINT "PAYMENTS_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BOOKINGS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAYMENTS" ADD CONSTRAINT "PAYMENTS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ORDERS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADDITIONAL_FEES" ADD CONSTRAINT "ADDITIONAL_FEES_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BOOKINGS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REFUNDS" ADD CONSTRAINT "REFUNDS_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BOOKINGS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
