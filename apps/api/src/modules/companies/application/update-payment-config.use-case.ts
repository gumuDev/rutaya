import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../domain/company.repository';

export interface UpdatePaymentConfigInput {
  companyId: string;
  bankName?: string;
  bankAccount?: string;
  bankAccountHolder?: string;
  qrImageUrl?: string;
  telegramChatId?: string;
}

@Injectable()
export class UpdatePaymentConfigUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(input: UpdatePaymentConfigInput) {
    const company = await this.companies.findById(input.companyId);
    if (!company) throw new NotFoundException('company_not_found');

    if (input.bankName !== undefined) company.bankName = input.bankName;
    if (input.bankAccount !== undefined) company.bankAccount = input.bankAccount;
    if (input.bankAccountHolder !== undefined) company.bankAccountHolder = input.bankAccountHolder;
    if (input.qrImageUrl !== undefined) company.qrImageUrl = input.qrImageUrl;
    if (input.telegramChatId !== undefined) company.telegramChatId = input.telegramChatId;

    await this.companies.save(company);

    return {
      bankName: company.bankName,
      bankAccount: company.bankAccount,
      bankAccountHolder: company.bankAccountHolder,
      qrImageUrl: company.qrImageUrl,
      telegramChatId: company.telegramChatId,
    };
  }
}
