import { IsEmail, IsNotEmpty } from 'class-validator';

export class ValidateResetDto {
  @IsNotEmpty()
  cnpj: string;

  @IsEmail()
  email: string;
}