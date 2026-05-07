import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchSchedulesDto {
  @IsNotEmpty() @IsString() origin: string;
  @IsNotEmpty() @IsString() destination: string;
  @IsDateString() date: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) passengers?: number;
}

export class CreateReservationDto {
  @IsNotEmpty() @IsString() scheduleId: string;
  @IsNotEmpty() @IsString() passengerName: string;
  @IsNotEmpty() @IsString() passengerPhone: string;
  @IsInt() @Min(1) quantity: number;
  @IsEnum(['bank_transfer', 'qr']) paymentMethod: 'bank_transfer' | 'qr';
  @IsOptional() @IsString() proofImageUrl?: string;
  @IsDateString() travelDate: string;
  @IsOptional() @IsArray() @IsNumber({}, { each: true }) selectedSeats?: number[];
}

export class PosReservationDto {
  @IsNotEmpty() @IsString() scheduleId: string;
  @IsNotEmpty() @IsString() passengerName: string;
  @IsNotEmpty() @IsString() passengerPhone: string;
  @IsInt() @Min(1) quantity: number;
  @IsEnum(['cash', 'qr']) paymentMethod: 'cash' | 'qr';
  @IsDateString() travelDate: string;
  @IsOptional() @IsArray() @IsNumber({}, { each: true }) selectedSeats?: number[];
}
