export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  active?: boolean;

  rota_id: string;

  // 👇 novos campos (somente cliente)
  endereco?: string;
  cnpj?: string;
  telefone?: string;
  nome_fantasia?: string;
  razao_social?: string;
}