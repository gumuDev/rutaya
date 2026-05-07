import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateOperatorUseCase } from './update-operator.use-case';
import { Company } from '../domain/company.entity';

function makeOperator(overrides: Partial<{ parentCompanyId: string; role: string }> = {}): Company {
  return new Company(
    'op-1', 'Ana', null, '+591700', 'La Paz', 'ana@empresa.com', '$2b$hash',
    (overrides.role ?? 'operator') as never,
    overrides.parentCompanyId ?? 'company-1',
    null, null, null, null, null, null,
    new Date(), new Date(),
  );
}

function makeRepo(operator: Company | null = null, emailTaken = false) {
  return {
    findById: jest.fn().mockResolvedValue(operator),
    findByEmail: jest.fn().mockResolvedValue(emailTaken ? { id: 'other' } : null),
    save: jest.fn().mockImplementation((c) => Promise.resolve(c)),
    findAll: jest.fn(), findByParent: jest.fn(), delete: jest.fn(),
  };
}

describe('UpdateOperatorUseCase', () => {
  it('updates name of an operator', async () => {
    const operator = makeOperator();
    const repo = makeRepo(operator);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await useCase.execute({ operatorId: 'op-1', parentCompanyId: 'company-1', name: 'Ana Nueva' });

    expect(operator.name).toBe('Ana Nueva');
    expect(repo.save).toHaveBeenCalledWith(operator);
  });

  it('updates email when new email is not taken', async () => {
    const operator = makeOperator();
    const repo = makeRepo(operator, false);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await useCase.execute({ operatorId: 'op-1', parentCompanyId: 'company-1', email: 'nueva@empresa.com' });

    expect(operator.email).toBe('nueva@empresa.com');
  });

  it('hashes new password when provided', async () => {
    const operator = makeOperator();
    const repo = makeRepo(operator);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await useCase.execute({ operatorId: 'op-1', parentCompanyId: 'company-1', password: 'newpass123' });

    expect(operator.password).not.toBe('newpass123');
    expect(operator.password.startsWith('$2b$')).toBe(true);
  });

  it('does not change password when not provided', async () => {
    const operator = makeOperator();
    const original = operator.password;
    const repo = makeRepo(operator);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await useCase.execute({ operatorId: 'op-1', parentCompanyId: 'company-1', name: 'Nuevo Nombre' });

    expect(operator.password).toBe(original);
  });

  it('throws ConflictException when new email is already taken', async () => {
    const operator = makeOperator();
    const repo = makeRepo(operator, true);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await expect(useCase.execute({ operatorId: 'op-1', parentCompanyId: 'company-1', email: 'taken@empresa.com' }))
      .rejects.toThrow(ConflictException);
  });

  it('throws NotFoundException when operator does not exist', async () => {
    const repo = makeRepo(null);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await expect(useCase.execute({ operatorId: 'nonexistent', parentCompanyId: 'company-1' }))
      .rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when operator belongs to another company', async () => {
    const operator = makeOperator({ parentCompanyId: 'other-company' });
    const repo = makeRepo(operator);
    const useCase = new UpdateOperatorUseCase(repo as never);

    await expect(useCase.execute({ operatorId: 'op-1', parentCompanyId: 'company-1' }))
      .rejects.toThrow(ForbiddenException);
  });
});
