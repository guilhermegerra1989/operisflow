export class UpdateOrderDto {
  title?: string;
  description?: string;
  status?: string;

  volanteId?: string;
  numeroNotaFiscal?: string;
  quantidade: number;
}