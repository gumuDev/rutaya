import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';
import * as bcrypt from 'bcrypt';

export interface UpdateOperatorInput {
  operatorId: string;
  parentCompanyId: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

@Injectable()
export class UpdateOperatorUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(input: UpdateOperatorInput): Promise<void> {
    const operator = await this.companies.findById(input.operatorId);
    if (!operator || operator.role !== 'operator') throw new NotFoundException('operator_not_found');
    if (operator.parentCompanyId !== input.parentCompanyId) throw new ForbiddenException('operator_not_found');

    if (input.email && input.email !== operator.email) {
      const existing = await this.companies.findByEmail(input.email);
      if (existing) throw new ConflictException('email_already_registered');
      operator.email = input.email;
    }

    if (input.name) operator.name = input.name;
    if (input.phone !== undefined) operator.phone = input.phone;
    if (input.password) operator.password = await bcrypt.hash(input.password, 10);

    await this.companies.save(operator);
  }
}
