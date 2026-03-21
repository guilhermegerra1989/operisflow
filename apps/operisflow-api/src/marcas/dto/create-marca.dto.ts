// src/marcas/dto/create-marca.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
