-- AlterTable con default para filas existentes
ALTER TABLE "reservations" ADD COLUMN "travelDate" TEXT NOT NULL DEFAULT '2026-01-01';
-- Remover el default para que sea requerido en nuevas filas
ALTER TABLE "reservations" ALTER COLUMN "travelDate" DROP DEFAULT;
