-- CreateTable
CREATE TABLE "seat_reservations" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "travelDate" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "seat_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seat_reservations_scheduleId_travelDate_idx" ON "seat_reservations"("scheduleId", "travelDate");

-- CreateIndex
CREATE UNIQUE INDEX "seat_reservations_scheduleId_travelDate_seatNumber_key" ON "seat_reservations"("scheduleId", "travelDate", "seatNumber");

-- AddForeignKey
ALTER TABLE "seat_reservations" ADD CONSTRAINT "seat_reservations_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
