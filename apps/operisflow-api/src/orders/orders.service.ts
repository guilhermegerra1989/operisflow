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
    const result = await this.db.query(
      `
      INSERT INTO orders (
        tenant_id,
        client_user_id,
        volante_id,
        numero_nota_fiscal,
        title,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        tenantId,
        userId,
        dto.volanteId,
        dto.numeroNotaFiscal,
        dto.title,
        dto.description || null,
      ],
    );

    return result.rows[0];
  }

  async findMyOrders(tenantId: string, userId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM orders
      WHERE tenant_id = $1
        AND client_user_id = $2
      ORDER BY created_at DESC
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
