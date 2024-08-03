-- AlterTable
ALTER TABLE "USER" ADD COLUMN     "currentRefreshToken" TEXT,
ADD COLUMN     "currentRefreshTokenExp" TIMESTAMP(3);
