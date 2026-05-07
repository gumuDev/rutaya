import { CreateVehicleUseCase } from './create-vehicle.use-case';
import { VehicleType } from '../domain/vehicle-type.enum';
import { ServiceType } from '../domain/service-type.enum';

function makeRepo() {
  return { save: jest.fn().mockImplementation((v) => Promise.resolve(v)), findById: jest.fn(), findByCompany: jest.fn(), delete: jest.fn() };
}

const baseInput = {
  plate: 'ABC-123',
  type: VehicleType.BUS,
  capacity: 40,
  companyId: 'company-1',
};

describe('CreateVehicleUseCase', () => {
  it('creates a vehicle with default serviceType normal', async () => {
    const repo = makeRepo();
    const useCase = new CreateVehicleUseCase(repo as never);

    const result = await useCase.execute(baseInput);

    expect(result.plate).toBe('ABC-123');
    expect(result.serviceType).toBe(ServiceType.NORMAL);
    expect(result.companyId).toBe('company-1');
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('creates a vehicle with specified serviceType', async () => {
    const repo = makeRepo();
    const useCase = new CreateVehicleUseCase(repo as never);

    const result = await useCase.execute({ ...baseInput, serviceType: ServiceType.LEITO });

    expect(result.serviceType).toBe(ServiceType.LEITO);
  });

  it('creates a vehicle with driver info', async () => {
    const repo = makeRepo();
    const useCase = new CreateVehicleUseCase(repo as never);

    const result = await useCase.execute({
      ...baseInput,
      driverName: 'Juan Pérez',
      driverPhone: '+59170000000',
    });

    expect(result.driverName).toBe('Juan Pérez');
    expect(result.driverPhone).toBe('+59170000000');
  });

  it('assigns null to optional fields when not provided', async () => {
    const repo = makeRepo();
    const useCase = new CreateVehicleUseCase(repo as never);

    const result = await useCase.execute(baseInput);

    expect(result.brand).toBeNull();
    expect(result.year).toBeNull();
    expect(result.driverName).toBeNull();
    expect(result.driverPhone).toBeNull();
  });

  it('generates a unique id for each vehicle', async () => {
    const repo = makeRepo();
    const useCase = new CreateVehicleUseCase(repo as never);

    const v1 = await useCase.execute(baseInput);
    const v2 = await useCase.execute(baseInput);

    expect(v1.id).not.toBe(v2.id);
  });
});
