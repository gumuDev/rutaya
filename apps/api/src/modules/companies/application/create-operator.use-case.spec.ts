import { ConflictException } from '@nestjs/common';
import { CreateOperatorUseCase } from './create-operator.use-case';

function makeRepo(existing = false) {
  return {
    findByEmail: jest.fn().mockResolvedValue(existing ? { id: 'x' } : null),
    save: jest.fn().mockImplementation((c) => Promise.resolve(c)),
    findById: jest.fn(), findAll: jest.fn(), findByParent: jest.fn(), delete: jest.fn(),
  };
}

const baseInput = {
  name: 'Ana Operadora',
  email: 'ana@empresa.com',
  password: 'secret123',
  phone: '+59170000000',
  city: 'La Paz',
  parentCompanyId: 'company-1',
};

describe('CreateOperatorUseCase', () => {
  it('creates an operator with role operator', async () => {
    const repo = makeRepo(false);
    const useCase = new CreateOperatorUseCase(repo as never);

    const result = await useCase.execute(baseInput);

    expect(result.role).toBe('operator');
    expect(result.parentCompanyId).toBe('company-1');
    expect(result.name).toBe('Ana Operadora');
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('hashes the password before saving', async () => {
    const repo = makeRepo(false);
    const useCase = new CreateOperatorUseCase(repo as never);

    const result = await useCase.execute(baseInput);

    expect(result.password).not.toBe('secret123');
    expect(result.password.startsWith('$2b$')).toBe(true);
  });

  it('throws ConflictException when email is already taken', async () => {
    const repo = makeRepo(true);
    const useCase = new CreateOperatorUseCase(repo as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(ConflictException);
  });

  it('generates a unique id for each operator', async () => {
    const repo = makeRepo(false);
    const useCase = new CreateOperatorUseCase(repo as never);

    const o1 = await useCase.execute(baseInput);
    const o2 = await useCase.execute({ ...baseInput, email: 'other@empresa.com' });

    expect(o1.id).not.toBe(o2.id);
  });
});
