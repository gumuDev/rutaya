export type CompanyRole = 'superadmin' | 'admin' | 'operator';

export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public taxId: string | null,
    public phone: string,
    public city: string,
    public email: string,
    public password: string,
    public role: CompanyRole,
    public parentCompanyId: string | null,
    public logoUrl: string | null,
    public bankName: string | null,
    public bankAccount: string | null,
    public bankAccountHolder: string | null,
    public qrImageUrl: string | null,
    public telegramChatId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
