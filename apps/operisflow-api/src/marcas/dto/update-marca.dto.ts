import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMarcaDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}