import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  
  async create(tenantId: string, userId: string, dto: CreateOrderDto) {
    console.log('CreateOrderDto recebido:', dto); // ajuda a ver no log

    const result = await this.db.query(
      `
      INSERT INTO orders (
        tenant_id,
        client_user_id,
        volante_id,
        numero_nota_fiscal,
        quantidade,
        title,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        tenantId,
        userId,
        dto.volanteId,
        dto.numeroNotaFiscal,
        dto.quantidade,
        dto.title,
        dto.description || null,
      ],
    );

    return result.rows[0];
  }


  async findMyOrders(tenantId: string, userId: string) {
    const result = await this.db.query(
      `
      SELECT 
        o.id,
        o.tenant_id,
        o.client_user_id,
        o.volante_id,
        o.numero_nota_fiscal,
        o.quantidade, 
        o.title,
        o.description,
        o.status,
        o.created_at,
        o.updated_at,

        v.codigo AS volante_codigo,
        v.descricao AS volante_descricao

      FROM orders o
      JOIN volantes v ON v.id = o.volante_id
      WHERE o.tenant_id = $1
        AND o.client_user_id = $2
      ORDER BY o.created_at DESC
      `,
      [tenantId, userId],
    );

    return result.rows;
  }

  async findAll(tenantId: string) {
    const result = await this.db.query(
      `
      SELECT o.*, u.name AS client_name
      FROM orders o
      JOIN users u ON u.id = o.client_user_id
      WHERE o.tenant_id = $1
      ORDER BY o.created_at DESC
      `,
      [tenantId],
    );

    return result.rows;
  }

  async findOne(tenantId: string, id: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM orders
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, dto: UpdateOrderDto) {
    const result = await this.db.query(
      `
      UPDATE orders
      SET
        title = COALESCE($3, title),
        description = COALESCE($4, description),
        status = COALESCE($5, status),
        volante_id = COALESCE($6, volante_id),
        numero_nota_fiscal = COALESCE($7, numero_nota_fiscal),
        quantidade = COALESCE($6, quantidade),
        updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
      `,
      [
        tenantId,
        id,
        dto.title ?? null,
        dto.description ?? null,
        dto.status ?? null,
        dto.volanteId ?? null,
        dto.numeroNotaFiscal ?? null,
        dto.quantidade ?? null,
      ],
    );

    return result.rows[0];
  } 

  async remove(tenantId: string, id: string) {
    await this.db.query(
      `
      DELETE FROM orders
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );
    return true;
  }
}
