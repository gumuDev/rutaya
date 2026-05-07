import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyRepository } from '../domain/company.repository';

@Injectable()
export class ImpersonateCompanyUseCase {
  constructor(
    private readonly companies: CompanyRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(companyId: string) {
    const company = await this.companies.findById(companyId);
    if (!company) throw new NotFoundException('company_not_found');

    // Token impersonado — role admin dentro del contexto de esa empresa
    const accessToken = this.jwt.sign({
      sub: company.id,
      email: company.email,
      role: 'admin',
      impersonated: true,
    });

    return {
      accessToken,
      companyId: company.id,
      companyName: company.name,
      role: 'admin',
    };
  }
}
