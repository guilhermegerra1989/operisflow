export class CreateUserDto {
  name: string;
  email: string;
  password: string;

  role?: string;    // default: 'client'
  active?: boolean; // default: true

  rota_id: string;

  // ✅ novos campos (cliente)
  endereco?: string;
  cnpj?: string;
  telefone?: string;
}
