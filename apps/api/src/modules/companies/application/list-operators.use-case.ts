import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';

@Injectable()
export class ListOperatorsUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(parentCompanyId: string) {
    const operators = await this.companies.findByParent(parentCompanyId);
    return operators.map((o) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      phone: o.phone,
      createdAt: o.createdAt,
    }));
  }
}
