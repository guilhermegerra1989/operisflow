import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class ResetPasswordDto {

  @IsNotEmpty()
  cnpj: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
