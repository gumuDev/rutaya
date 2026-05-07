-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('bank_transfer', 'qr');

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'pending_payment';

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bankAccountHolder" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "qrImageUrl" TEXT;

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "proofImageUrl" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending_payment';
