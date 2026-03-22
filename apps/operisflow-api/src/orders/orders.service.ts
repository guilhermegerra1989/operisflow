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
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // 1) Insere o cabeçalho do pedido em "orders"
      const orderResult = await client.query(
        `
        INSERT INTO orders (
          tenant_id,
          client_user_id,
          title,
          description
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [tenantId, userId, dto.title, dto.description ?? null],
      );

      const order = orderResult.rows[0];

      // 2) Insere os itens em "order_items"
      if (dto.items && dto.items.length > 0) {
        const values: any[] = [];
        const placeholders: string[] = [];

        dto.items.forEach((item, index) => {
          const baseIndex = index * 4;
          placeholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
              baseIndex + 4
            })`,
          );
          values.push(order.id, tenantId, item.volanteId, item.quantidade);
        });

        await client.query(
          `
          INSERT INTO order_items (
            order_id,
            tenant_id,
            volante_id,
            quantidade
          )
          VALUES ${placeholders.join(', ')}
          `,
          values,
        );
      }

      await client.query('COMMIT');

      // você pode retornar o pedido com ou sem itens; por enquanto, só o cabeçalho:
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao criar pedido:', error);
      throw error;
    } finally {
      client.release();
    }
  }



 async findMyOrders(tenantId: string, userId: string) {
  const result = await this.db.query(
    `
    SELECT
      o.id AS order_id,
      o.title,
      o.description,
      o.status,
      o.created_at,
      o.numero_pedido,

      oi.quantidade,
      v.codigo AS volante_codigo,
      v.descricao AS volante_descricao,

      m.nome AS marca_nome
    FROM orders o
    LEFT JOIN order_items oi
      ON oi.order_id = o.id
    LEFT JOIN volantes v
      ON v.id = oi.volante_id
    LEFT JOIN marcas m
      ON m.id = v.marca_id
    WHERE o.tenant_id = $1
      AND o.client_user_id = $2
    ORDER BY o.created_at DESC, m.nome ASC, v.codigo ASC
    `,
    [tenantId, userId],
  );

  return result.rows;
}

  async findAll(tenantId: string) {
  const result = await this.db.query(
    `
      SELECT 
        o.id,
        o.tenant_id,
        o.client_user_id,
        o.volante_id,
        o.numero_pedido,
        o.quantidade, 
        o.title,
        o.description,
        o.status,
        o.created_at,
        o.updated_at,

        u.name AS client_name,
        v.codigo AS volante_codigo,
        v.descricao AS volante_descricao

      FROM orders o
      JOIN users u ON u.id = o.client_user_id
      JOIN volantes v ON v.id = o.volante_id
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
