import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyRepository } from '../domain/company.repository';
import * as bcrypt from 'bcrypt';

export interface LoginCompanyInput {
  email: string;
  password: string;
}

export interface LoginCompanyOutput {
  accessToken: string;
  companyId: string;
  companyName: string;
  role: string;
}

@Injectable()
export class LoginCompanyUseCase {
  constructor(
    private readonly companies: CompanyRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: LoginCompanyInput): Promise<LoginCompanyOutput> {
    const company = await this.companies.findByEmail(input.email);
    if (!company) throw new UnauthorizedException('invalid_credentials');

    const valid = await bcrypt.compare(input.password, company.password);
    if (!valid) throw new UnauthorizedException('invalid_credentials');

    const accessToken = this.jwt.sign({
      sub: company.id,
      email: company.email,
      role: company.role,
    });

    return { accessToken, companyId: company.id, companyName: company.name, role: company.role };
  }
}
