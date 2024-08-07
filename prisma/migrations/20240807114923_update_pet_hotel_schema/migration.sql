/*
  Warnings:

  - You are about to drop the `BOOKING` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ORDER` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ORDER_ITEM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PAYMENT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PRODUCT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ROOM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ROOM_AVAILABILITY` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('BASE', 'SEASONAL', 'WEEKEND', 'HOLIDAY', 'SPECIAL_EVENT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "BOOKING" DROP CONSTRAINT "BOOKING_roomId_fkey";

-- DropForeignKey
ALTER TABLE "BOOKING" DROP CONSTRAINT "BOOKING_userId_fkey";

-- DropForeignKey
ALTER TABLE "ORDER" DROP CONSTRAINT "ORDER_userId_fkey";

-- DropForeignKey
ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "ORDER_ITEM_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ORDER_ITEM" DROP CONSTRAINT "ORDER_ITEM_productId_fkey";

-- DropForeignKey
ALTER TABLE "PAYMENT" DROP CONSTRAINT "PAYMENT_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "PAYMENT" DROP CONSTRAINT "PAYMENT_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ROOM_AVAILABILITY" DROP CONSTRAINT "ROOM_AVAILABILITY_roomId_fkey";

-- DropTable
DROP TABLE "BOOKING";

-- DropTable
DROP TABLE "ORDER";

-- DropTable
DROP TABLE "ORDER_ITEM";

-- DropTable
DROP TABLE "PAYMENT";

-- DropTable
DROP TABLE "PRODUCT";

-- DropTable
DROP TABLE "ROOM";

-- DropTable
DROP TABLE "ROOM_AVAILABILITY";

-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "USERS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_refresh_token" TEXT,
    "current_refresh_token_exp" TIMESTAMP(3),

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROOMS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "image_urls" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ROOMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROOM_DETAILS" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "room_number" TEXT NOT NULL,
    "current_check_in" TIMESTAMP(3),
    "current_check_out" TIMESTAMP(3),
    "status" "RoomStatus" NOT NULL,
    "last_cleaned" TIMESTAMP(3),
    "next_cleaning" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ROOM_DETAILS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROOM_AVAILABILITIES" (
    "id" SERIAL NOT NULL,
    "room_detail_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "available_count" INTEGER NOT NULL,

    CONSTRAINT "ROOM_AVAILABILITIES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROOM_PRICES" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "PriceType" NOT NULL,

    CONSTRAINT "ROOM_PRICES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOOKINGS" (
    "id" SERIAL NOT NULL,
    "booking_num" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "room_detail_id" INTEGER NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "requested_late_checkout" BOOLEAN NOT NULL DEFAULT false,
    "requested_early_checkin" BOOLEAN NOT NULL DEFAULT false,
    "actual_late_checkout" BOOLEAN NOT NULL DEFAULT false,
    "actual_early_checkin" BOOLEAN NOT NULL DEFAULT false,
    "pet_count" INTEGER NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "additional_fees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_price" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "special_requests" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOOKINGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CLEANING_LOGS" (
    "id" SERIAL NOT NULL,
    "room_detail_id" INTEGER NOT NULL,
    "cleaned_at" TIMESTAMP(3) NOT NULL,
    "cleaned_by" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "CLEANING_LOGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MAINTENANCE_LOGS" (
    "id" SERIAL NOT NULL,
    "room_detail_id" INTEGER NOT NULL,
    "issue" TEXT NOT NULL,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "MAINTENANCE_LOGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCTS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "image_urls" TEXT[],
    "stock_quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PRODUCTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDERS" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ORDERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDER_ITEMS" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ORDER_ITEMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PAYMENTS" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "booking_id" INTEGER,
    "order_id" INTEGER,
    "transaction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PAYMENTS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");

-- CreateIndex
CREATE INDEX "USERS_email_idx" ON "USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ROOM_DETAILS_room_number_key" ON "ROOM_DETAILS"("room_number");

-- CreateIndex
CREATE INDEX "ROOM_DETAILS_room_id_idx" ON "ROOM_DETAILS"("room_id");

-- CreateIndex
CREATE INDEX "ROOM_DETAILS_status_idx" ON "ROOM_DETAILS"("status");

-- CreateIndex
CREATE INDEX "ROOM_AVAILABILITIES_date_idx" ON "ROOM_AVAILABILITIES"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ROOM_AVAILABILITIES_room_detail_id_date_key" ON "ROOM_AVAILABILITIES"("room_detail_id", "date");

-- CreateIndex
CREATE INDEX "ROOM_PRICES_room_id_idx" ON "ROOM_PRICES"("room_id");

-- CreateIndex
CREATE INDEX "ROOM_PRICES_start_date_end_date_idx" ON "ROOM_PRICES"("start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "BOOKINGS_booking_num_key" ON "BOOKINGS"("booking_num");

-- CreateIndex
CREATE INDEX "BOOKINGS_user_id_idx" ON "BOOKINGS"("user_id");

-- CreateIndex
CREATE INDEX "BOOKINGS_room_detail_id_idx" ON "BOOKINGS"("room_detail_id");

-- CreateIndex
CREATE INDEX "BOOKINGS_check_in_date_check_out_date_idx" ON "BOOKINGS"("check_in_date", "check_out_date");

-- CreateIndex
CREATE INDEX "BOOKINGS_status_idx" ON "BOOKINGS"("status");

-- CreateIndex
CREATE INDEX "CLEANING_LOGS_room_detail_id_idx" ON "CLEANING_LOGS"("room_detail_id");

-- CreateIndex
CREATE INDEX "CLEANING_LOGS_cleaned_at_idx" ON "CLEANING_LOGS"("cleaned_at");

-- CreateIndex
CREATE INDEX "MAINTENANCE_LOGS_room_detail_id_idx" ON "MAINTENANCE_LOGS"("room_detail_id");

-- CreateIndex
CREATE INDEX "MAINTENANCE_LOGS_status_idx" ON "MAINTENANCE_LOGS"("status");

-- CreateIndex
CREATE INDEX "PRODUCTS_category_idx" ON "PRODUCTS"("category");

-- CreateIndex
CREATE INDEX "PRODUCTS_price_idx" ON "PRODUCTS"("price");

-- CreateIndex
CREATE INDEX "ORDERS_user_id_idx" ON "ORDERS"("user_id");

-- CreateIndex
CREATE INDEX "ORDERS_status_idx" ON "ORDERS"("status");

-- CreateIndex
CREATE INDEX "ORDER_ITEMS_order_id_idx" ON "ORDER_ITEMS"("order_id");

-- CreateIndex
CREATE INDEX "ORDER_ITEMS_product_id_idx" ON "ORDER_ITEMS"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "PAYMENTS_booking_id_key" ON "PAYMENTS"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "PAYMENTS_order_id_key" ON "PAYMENTS"("order_id");

-- CreateIndex
CREATE INDEX "PAYMENTS_status_idx" ON "PAYMENTS"("status");

-- CreateIndex
CREATE INDEX "PAYMENTS_method_idx" ON "PAYMENTS"("method");

-- CreateIndex
CREATE INDEX "PAYMENTS_type_idx" ON "PAYMENTS"("type");

-- AddForeignKey
ALTER TABLE "ROOM_DETAILS" ADD CONSTRAINT "ROOM_DETAILS_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "ROOMS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ROOM_AVAILABILITIES" ADD CONSTRAINT "ROOM_AVAILABILITIES_room_detail_id_fkey" FOREIGN KEY ("room_detail_id") REFERENCES "ROOM_DETAILS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ROOM_PRICES" ADD CONSTRAINT "ROOM_PRICES_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "ROOMS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOOKINGS" ADD CONSTRAINT "BOOKINGS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOOKINGS" ADD CONSTRAINT "BOOKINGS_room_detail_id_fkey" FOREIGN KEY ("room_detail_id") REFERENCES "ROOM_DETAILS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CLEANING_LOGS" ADD CONSTRAINT "CLEANING_LOGS_room_detail_id_fkey" FOREIGN KEY ("room_detail_id") REFERENCES "ROOM_DETAILS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MAINTENANCE_LOGS" ADD CONSTRAINT "MAINTENANCE_LOGS_room_detail_id_fkey" FOREIGN KEY ("room_detail_id") REFERENCES "ROOM_DETAILS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDERS" ADD CONSTRAINT "ORDERS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDER_ITEMS" ADD CONSTRAINT "ORDER_ITEMS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ORDERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDER_ITEMS" ADD CONSTRAINT "ORDER_ITEMS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAYMENTS" ADD CONSTRAINT "PAYMENTS_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BOOKINGS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAYMENTS" ADD CONSTRAINT "PAYMENTS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ORDERS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
