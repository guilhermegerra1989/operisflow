export class Order {
  id: string;
  tenant_id: string;
  client_user_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}