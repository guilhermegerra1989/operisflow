export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  active?: boolean;
  rota_id: string;
  endereco?: string;
  cnpj?: string;
  telefone?: string;
  nome_fantasia?: string;
  razao_social?: string;

  // novos campos (somente cliente)
  tel_comercial?: string;
  tel_pessoal?: string;
  bairro?: string;
  estado?: string;
  cep?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
}