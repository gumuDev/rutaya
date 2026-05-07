-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'expired', 'boarded');

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "passengerName" TEXT NOT NULL,
    "passengerPhone" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservations_code_key" ON "reservations"("code");

-- CreateIndex
CREATE INDEX "reservations_companyId_idx" ON "reservations"("companyId");

-- CreateIndex
CREATE INDEX "reservations_code_idx" ON "reservations"("code");

-- CreateIndex
CREATE INDEX "reservations_passengerPhone_idx" ON "reservations"("passengerPhone");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
