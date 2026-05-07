import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CompanyRepository } from '../domain/company.repository';
import { Company, CompanyRole } from '../domain/company.entity';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Company | null> {
    const row = await this.prisma.company.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: string): Promise<Company | null> {
    const row = await this.prisma.company.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Company[]> {
    const rows = await this.prisma.company.findMany({
      where: { role: { not: 'superadmin' }, parentCompanyId: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByParent(parentCompanyId: string): Promise<Company[]> {
    const rows = await this.prisma.company.findMany({
      where: { parentCompanyId, role: 'operator' },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(company: Company): Promise<Company> {
    const row = await this.prisma.company.upsert({
      where: { id: company.id },
      create: {
        id: company.id,
        name: company.name,
        taxId: company.taxId,
        phone: company.phone,
        city: company.city,
        email: company.email,
        password: company.password,
        role: company.role,
        parentCompanyId: company.parentCompanyId,
        logoUrl: company.logoUrl,
        bankName: company.bankName,
        bankAccount: company.bankAccount,
        bankAccountHolder: company.bankAccountHolder,
        qrImageUrl: company.qrImageUrl,
        telegramChatId: company.telegramChatId,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
      update: {
        name: company.name,
        taxId: company.taxId,
        phone: company.phone,
        city: company.city,
        email: company.email,
        password: company.password,
        role: company.role,
        parentCompanyId: company.parentCompanyId,
        logoUrl: company.logoUrl,
        bankName: company.bankName,
        bankAccount: company.bankAccount,
        bankAccountHolder: company.bankAccountHolder,
        qrImageUrl: company.qrImageUrl,
        telegramChatId: company.telegramChatId,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({ where: { id } });
  }

  private toDomain(row: {
    id: string; name: string; taxId: string | null; phone: string;
    city: string; email: string; password: string; role: string;
    parentCompanyId: string | null; logoUrl: string | null;
    bankName: string | null; bankAccount: string | null;
    bankAccountHolder: string | null; qrImageUrl: string | null;
    telegramChatId: string | null; createdAt: Date; updatedAt: Date;
  }): Company {
    return new Company(
      row.id, row.name, row.taxId, row.phone, row.city,
      row.email, row.password, row.role as CompanyRole,
      row.parentCompanyId, row.logoUrl,
      row.bankName, row.bankAccount, row.bankAccountHolder,
      row.qrImageUrl, row.telegramChatId, row.createdAt, row.updatedAt,
    );
  }
}
