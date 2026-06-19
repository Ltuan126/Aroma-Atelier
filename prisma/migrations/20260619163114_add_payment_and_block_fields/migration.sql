-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;
