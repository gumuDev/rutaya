import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';

@Injectable()
export class DeleteOperatorUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(operatorId: string, parentCompanyId: string): Promise<void> {
    const operator = await this.companies.findById(operatorId);
    if (!operator || operator.role !== 'operator') throw new NotFoundException('operator_not_found');
    if (operator.parentCompanyId !== parentCompanyId) throw new ForbiddenException('operator_not_found');
    await this.companies.delete(operatorId);
  }
}
