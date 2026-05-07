import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteOperatorUseCase } from './delete-operator.use-case';
import { Company } from '../domain/company.entity';

function makeOperator(overrides: Partial<{ role: string; parentCompanyId: string }> = {}): Company {
  return new Company(
    'op-1', 'Ana', null, '+591700', 'La Paz', 'ana@empresa.com', 'hash',
    (overrides.role ?? 'operator') as never,
    overrides.parentCompanyId ?? 'company-1',
    null, null, null, null, null, null,
    new Date(), new Date(),
  );
}

function makeRepo(operator: Company | null = null) {
  return {
    findById: jest.fn().mockResolvedValue(operator),
    delete: jest.fn().mockResolvedValue(undefined),
    findByEmail: jest.fn(), findAll: jest.fn(), findByParent: jest.fn(), save: jest.fn(),
  };
}

describe('DeleteOperatorUseCase', () => {
  it('deletes an operator that belongs to the company', async () => {
    const operator = makeOperator();
    const repo = makeRepo(operator);
    const useCase = new DeleteOperatorUseCase(repo as never);

    await useCase.execute('op-1', 'company-1');

    expect(repo.delete).toHaveBeenCalledWith('op-1');
  });

  it('throws NotFoundException when operator does not exist', async () => {
    const repo = makeRepo(null);
    const useCase = new DeleteOperatorUseCase(repo as never);

    await expect(useCase.execute('nonexistent', 'company-1'))
      .rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when trying to delete a non-operator role', async () => {
    const admin = makeOperator({ role: 'admin' });
    const repo = makeRepo(admin);
    const useCase = new DeleteOperatorUseCase(repo as never);

    await expect(useCase.execute('op-1', 'company-1'))
      .rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when operator belongs to another company', async () => {
    const operator = makeOperator({ parentCompanyId: 'other-company' });
    const repo = makeRepo(operator);
    const useCase = new DeleteOperatorUseCase(repo as never);

    await expect(useCase.execute('op-1', 'company-1'))
      .rejects.toThrow(ForbiddenException);
  });
});
