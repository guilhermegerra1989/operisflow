export class CreateOrderDto {
  volanteId: string;
  numeroNotaFiscal: string;
  quantidade: number;   // 👈 obrigatório
  title: string;
  description?: string;
}