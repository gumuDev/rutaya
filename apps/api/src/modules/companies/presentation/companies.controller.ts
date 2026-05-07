import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseGuards, Request } from '@nestjs/common';
import { RegisterCompanyUseCase } from '../application/register-company.use-case';
import { LoginCompanyUseCase } from '../application/login-company.use-case';
import { UpdatePaymentConfigUseCase } from '../application/update-payment-config.use-case';
import { ListCompaniesUseCase } from '../application/list-companies.use-case';
import { ImpersonateCompanyUseCase } from '../application/impersonate-company.use-case';
import { CreateOperatorUseCase } from '../application/create-operator.use-case';
import { ListOperatorsUseCase } from '../application/list-operators.use-case';
import { DeleteOperatorUseCase } from '../application/delete-operator.use-case';
import { UpdateOperatorUseCase } from '../application/update-operator.use-case';
import { RegisterCompanyDto, LoginCompanyDto, UpdatePaymentConfigDto, CreateOperatorDto, UpdateOperatorDto } from './company.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../shared/auth';
import { CompanyRepository } from '../domain/company.repository';

interface AuthRequest { user: { companyId: string; email: string; role: string } }

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly register: RegisterCompanyUseCase,
    private readonly login: LoginCompanyUseCase,
    private readonly updatePayment: UpdatePaymentConfigUseCase,
    private readonly listCompanies: ListCompaniesUseCase,
    private readonly impersonate: ImpersonateCompanyUseCase,
    private readonly createOperator: CreateOperatorUseCase,
    private readonly listOperators: ListOperatorsUseCase,
    private readonly deleteOperator: DeleteOperatorUseCase,
    private readonly updateOperator: UpdateOperatorUseCase,
    private readonly companies: CompanyRepository,
  ) {}

  @Post('register')
  async registerCompany(@Body() dto: RegisterCompanyDto) {
    const company = await this.register.execute(dto);
    return { id: company.id, name: company.name, email: company.email };
  }

  @Post('login')
  async loginCompany(@Body() dto: LoginCompanyDto) {
    return this.login.execute(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: AuthRequest) {
    return req.user;
  }

  @Get('payment-config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getPaymentConfig(@Request() req: AuthRequest) {
    const company = await this.companies.findById(req.user.companyId);
    return {
      bankName: company?.bankName ?? null,
      bankAccount: company?.bankAccount ?? null,
      bankAccountHolder: company?.bankAccountHolder ?? null,
      qrImageUrl: company?.qrImageUrl ?? null,
      telegramChatId: company?.telegramChatId ?? null,
    };
  }

  @Patch('payment-config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updatePaymentConfig(@Body() dto: UpdatePaymentConfigDto, @Request() req: AuthRequest) {
    return this.updatePayment.execute({ companyId: req.user.companyId, ...dto });
  }

  @Get('operators')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getOperators(@Request() req: AuthRequest) {
    return this.listOperators.execute(req.user.companyId);
  }

  @Post('operators')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async addOperator(@Body() dto: CreateOperatorDto, @Request() req: AuthRequest) {
    const admin = await this.companies.findById(req.user.companyId);
    const operator = await this.createOperator.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone ?? admin?.phone ?? '',
      city: admin?.city ?? '',
      parentCompanyId: req.user.companyId,
    });
    return { id: operator.id, name: operator.name, email: operator.email };
  }

  @Put('operators/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  editOperator(@Param('id') id: string, @Body() dto: UpdateOperatorDto, @Request() req: AuthRequest) {
    return this.updateOperator.execute({ operatorId: id, parentCompanyId: req.user.companyId, ...dto });
  }

  @Delete('operators/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeOperator(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.deleteOperator.execute(id, req.user.companyId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  getAllCompanies() {
    return this.listCompanies.execute();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  async getCompany(@Param('id') id: string) {
    const company = await this.companies.findById(id);
    if (!company) return null;
    return {
      id: company.id, name: company.name, email: company.email,
      phone: company.phone, city: company.city, taxId: company.taxId,
      role: company.role, createdAt: company.createdAt,
    };
  }

  @Post(':id/impersonate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  impersonateCompany(@Param('id') id: string) {
    return this.impersonate.execute(id);
  }
}
