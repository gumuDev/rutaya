import { NotFoundException } from '@nestjs/common';
import { UpdateVehicleUseCase } from './update-vehicle.use-case';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleType } from '../domain/vehicle-type.enum';
import { ServiceType } from '../domain/service-type.enum';

function makeVehicle(): Vehicle {
  return new Vehicle(
    'v-1', 'ABC-123', VehicleType.BUS, ServiceType.NORMAL,
    40, null, null, null, null, 'company-1', new Date(), new Date(),
  );
}

function makeRepo(vehicle: Vehicle | null = null) {
  return {
    findById: jest.fn().mockResolvedValue(vehicle),
    save: jest.fn().mockImplementation((v) => Promise.resolve(v)),
    findByCompany: jest.fn(),
    delete: jest.fn(),
  };
}

describe('UpdateVehicleUseCase', () => {
  it('updates vehicle fields', async () => {
    const vehicle = makeVehicle();
    const repo = makeRepo(vehicle);
    const useCase = new UpdateVehicleUseCase(repo as never);

    const result = await useCase.execute({
      id: 'v-1', companyId: 'company-1',
      plate: 'XYZ-999', capacity: 50,
      driverName: 'Pedro López', brand: 'Volvo', year: 2022,
    });

    expect(result.plate).toBe('XYZ-999');
    expect(result.capacity).toBe(50);
    expect(result.driverName).toBe('Pedro López');
    expect(result.brand).toBe('Volvo');
    expect(result.year).toBe(2022);
  });

  it('throws NotFoundException when vehicle does not exist', async () => {
    const repo = makeRepo(null);
    const useCase = new UpdateVehicleUseCase(repo as never);

    await expect(useCase.execute({ id: 'nonexistent', companyId: 'company-1' }))
      .rejects.toThrow(NotFoundException);
  });

  it('does not change fields that are not provided', async () => {
    const vehicle = makeVehicle();
    const repo = makeRepo(vehicle);
    const useCase = new UpdateVehicleUseCase(repo as never);

    const result = await useCase.execute({ id: 'v-1', companyId: 'company-1', plate: 'NEW-000' });

    expect(result.plate).toBe('NEW-000');
    expect(result.capacity).toBe(40); // unchanged
    expect(result.driverName).toBeNull(); // unchanged
  });
});
