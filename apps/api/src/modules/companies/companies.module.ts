import { Module } from '@nestjs/common';
import { CompaniesController } from './presentation/companies.controller';
import { RegisterCompanyUseCase } from './application/register-company.use-case';
import { LoginCompanyUseCase } from './application/login-company.use-case';
import { UpdatePaymentConfigUseCase } from './application/update-payment-config.use-case';
import { ListCompaniesUseCase } from './application/list-companies.use-case';
import { ImpersonateCompanyUseCase } from './application/impersonate-company.use-case';
import { CreateOperatorUseCase } from './application/create-operator.use-case';
import { ListOperatorsUseCase } from './application/list-operators.use-case';
import { DeleteOperatorUseCase } from './application/delete-operator.use-case';
import { UpdateOperatorUseCase } from './application/update-operator.use-case';
import { PrismaCompanyRepository } from './infrastructure/prisma-company.repository';
import { CompanyRepository } from './domain/company.repository';
import { TelegramNotifierService } from './infrastructure/telegram-notifier.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    RegisterCompanyUseCase,
    LoginCompanyUseCase,
    UpdatePaymentConfigUseCase,
    ListCompaniesUseCase,
    ImpersonateCompanyUseCase,
    CreateOperatorUseCase,
    ListOperatorsUseCase,
    DeleteOperatorUseCase,
    UpdateOperatorUseCase,
    TelegramNotifierService,
    { provide: CompanyRepository, useClass: PrismaCompanyRepository },
  ],
  exports: [TelegramNotifierService],
})
export class CompaniesModule {}
