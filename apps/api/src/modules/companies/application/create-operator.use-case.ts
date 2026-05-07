import { ConflictException, Injectable } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';
import { Company } from '../domain/company.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export interface CreateOperatorInput {
  name: string;
  email: string;
  password: string;
  parentCompanyId: string;
  city: string;
  phone: string;
}

@Injectable()
export class CreateOperatorUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(input: CreateOperatorInput): Promise<Company> {
    const existing = await this.companies.findByEmail(input.email);
    if (existing) throw new ConflictException('email_already_registered');

    const hashed = await bcrypt.hash(input.password, 10);
    const now = new Date();

    const operator = new Company(
      randomUUID(),
      input.name,
      null,
      input.phone,
      input.city,
      input.email,
      hashed,
      'operator',
      input.parentCompanyId,
      null, null, null, null, null, null,
      now, now,
    );

    return this.companies.save(operator);
  }
}
