/*
  Warnings:

  - You are about to drop the column `endDate` on the `BOOKING` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `BOOKING` table. All the data in the column will be lost.
  - The `imageUrl` column on the `PRODUCT` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `available` on the `ROOM` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ROOM` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ROOM` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `BOOKING` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkInDate` to the `BOOKING` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `BOOKING` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `PAYMENT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `ROOM` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class` to the `ROOM` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BOOKING" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "actualEarlyCheckin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "actualLateCheckout" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "additionalFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "checkInDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "checkOutDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "requestedEarlyCheckin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestedLateCheckout" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PAYMENT" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PRODUCT" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- AlterTable
ALTER TABLE "ROOM" DROP COLUMN "available",
DROP COLUMN "price",
DROP COLUMN "type",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "class" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ROOM_AVAILABILITY" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "availableCount" INTEGER NOT NULL,

    CONSTRAINT "ROOM_AVAILABILITY_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ROOM_AVAILABILITY_date_idx" ON "ROOM_AVAILABILITY"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ROOM_AVAILABILITY_roomId_date_key" ON "ROOM_AVAILABILITY"("roomId", "date");

-- CreateIndex
CREATE INDEX "BOOKING_checkInDate_checkOutDate_idx" ON "BOOKING"("checkInDate", "checkOutDate");

-- CreateIndex
CREATE INDEX "BOOKING_roomId_checkInDate_checkOutDate_idx" ON "BOOKING"("roomId", "checkInDate", "checkOutDate");

-- CreateIndex
CREATE INDEX "BOOKING_status_createdAt_idx" ON "BOOKING"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BOOKING_userId_status_idx" ON "BOOKING"("userId", "status");

-- CreateIndex
CREATE INDEX "PAYMENT_status_createdAt_idx" ON "PAYMENT"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PAYMENT_bookingId_type_idx" ON "PAYMENT"("bookingId", "type");

-- AddForeignKey
ALTER TABLE "ROOM_AVAILABILITY" ADD CONSTRAINT "ROOM_AVAILABILITY_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ROOM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
