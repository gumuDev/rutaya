import { ConflictException, Injectable } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';
import { Company } from '../domain/company.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export interface RegisterCompanyInput {
  name: string;
  taxId?: string;
  phone: string;
  city: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterCompanyUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(input: RegisterCompanyInput): Promise<Company> {
    const existing = await this.companies.findByEmail(input.email);
    if (existing) throw new ConflictException('email_already_registered');

    const hashed = await bcrypt.hash(input.password, 10);
    const now = new Date();

    const company = new Company(
      randomUUID(),
      input.name,
      input.taxId ?? null,
      input.phone,
      input.city,
      input.email,
      hashed,
      'admin',
      null, // parentCompanyId
      null, null, null, null, null, null,
      now,
      now,
    );

    return this.companies.save(company);
  }
}
