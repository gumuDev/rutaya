import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';

@Injectable()
export class ListCompaniesUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute() {
    const all = await this.companies.findAll();
    return all.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      city: c.city,
      taxId: c.taxId,
      role: c.role,
      createdAt: c.createdAt,
    }));
  }
}
