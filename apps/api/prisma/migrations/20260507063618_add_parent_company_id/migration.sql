-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "parentCompanyId" TEXT;

-- CreateIndex
CREATE INDEX "companies_parentCompanyId_idx" ON "companies"("parentCompanyId");
