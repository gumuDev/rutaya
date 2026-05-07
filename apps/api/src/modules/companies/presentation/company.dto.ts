import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class LoginCompanyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateOperatorDto {
  @IsNotEmpty() @IsString() name: string;
  @IsEmail() email: string;
  @IsNotEmpty() @MinLength(6) password: string;
  @IsOptional() @IsString() phone?: string;
}

export class UpdateOperatorDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @MinLength(6) password?: string;
  @IsOptional() @IsString() phone?: string;
}

export class UpdatePaymentConfigDto {
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsString() bankAccount?: string;
  @IsOptional() @IsString() bankAccountHolder?: string;
  @IsOptional() @IsString() qrImageUrl?: string;
  @IsOptional() @IsString() telegramChatId?: string;
}
