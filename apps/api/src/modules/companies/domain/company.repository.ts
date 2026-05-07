import { Company } from './company.entity';

export abstract class CompanyRepository {
  abstract findByEmail(email: string): Promise<Company | null>;
  abstract findById(id: string): Promise<Company | null>;
  abstract findAll(): Promise<Company[]>;
  abstract findByParent(parentCompanyId: string): Promise<Company[]>;
  abstract save(company: Company): Promise<Company>;
  abstract delete(id: string): Promise<void>;
}
