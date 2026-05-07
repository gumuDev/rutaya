import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty() @IsString() origin: string;
  @IsNotEmpty() @IsString() destination: string;
  @IsNumber() @IsPositive() basePrice: number;
}

export class UpdateRouteDto {
  @IsOptional() @IsString() origin?: string;
  @IsOptional() @IsString() destination?: string;
  @IsOptional() @IsNumber() @IsPositive() basePrice?: number;
}
