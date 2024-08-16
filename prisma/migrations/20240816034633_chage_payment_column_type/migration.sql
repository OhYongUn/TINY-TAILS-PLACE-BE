/*
  Warnings:

  - The primary key for the `PAYMENTS` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PAYMENTS" DROP CONSTRAINT "PAYMENTS_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PAYMENTS_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PAYMENTS_id_seq";
