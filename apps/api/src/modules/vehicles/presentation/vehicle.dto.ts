import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { VehicleType } from '../domain/vehicle-type.enum';
import { ServiceType } from '../domain/service-type.enum';

export class CreateVehicleDto {
  @IsNotEmpty() @IsString() plate: string;
  @IsEnum(VehicleType) type: VehicleType;
  @IsOptional() @IsEnum(ServiceType) serviceType?: ServiceType;
  @IsInt() @Min(1) capacity: number;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsInt() @Min(1900) @Max(2100) year?: number;
  @IsOptional() @IsString() driverName?: string;
  @IsOptional() @IsString() driverPhone?: string;
}

export class UpdateVehicleDto {
  @IsOptional() @IsString() plate?: string;
  @IsOptional() @IsEnum(VehicleType) type?: VehicleType;
  @IsOptional() @IsEnum(ServiceType) serviceType?: ServiceType;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsInt() @Min(1900) @Max(2100) year?: number;
  @IsOptional() @IsString() driverName?: string;
  @IsOptional() @IsString() driverPhone?: string;
}
