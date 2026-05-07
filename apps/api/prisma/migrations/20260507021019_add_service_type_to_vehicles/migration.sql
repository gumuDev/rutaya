-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('normal', 'semicama', 'cama', 'leito');

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "serviceType" "ServiceType" NOT NULL DEFAULT 'normal';
