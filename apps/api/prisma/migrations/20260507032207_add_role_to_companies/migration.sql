-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('admin', 'operator');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "role" "CompanyRole" NOT NULL DEFAULT 'admin';
