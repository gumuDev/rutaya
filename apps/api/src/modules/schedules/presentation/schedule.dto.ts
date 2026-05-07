import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty() @IsString() routeId: string;
  @IsNotEmpty() @IsString() vehicleId: string;
  @IsNotEmpty() @Matches(/^\d{2}:\d{2}$/) departureTime: string;
  @IsArray() @IsString({ each: true }) days: string[];
  @IsNumber() @IsPositive() price: number;
}

export class UpdateScheduleDto {
  @IsOptional() @Matches(/^\d{2}:\d{2}$/) departureTime?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) days?: string[];
  @IsOptional() @IsNumber() @IsPositive() price?: number;
}
