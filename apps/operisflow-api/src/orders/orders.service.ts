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
      v.id AS volante_id,
      v.codigo AS volante_codigo,
      v.descricao AS volante_descricao,
      v.img AS img,
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
    ORDER BY 
      o.created_at DESC,
      m.nome ASC NULLS LAST,
      v.codigo ASC NULLS LAST
    `,
    [tenantId, userId],
  );

  return this.groupOrdersWithItems(result.rows);
}

async findAll(tenantId: string) {
  const result = await this.db.query(
    `
    SELECT
      o.id AS order_id,
      o.title,
      o.description,
      o.status,
      o.created_at,
      o.numero_pedido,

      u.name AS client_name,

      oi.quantidade,
      v.id AS volante_id,
      v.codigo AS volante_codigo,
      v.descricao AS volante_descricao,
      v.img AS img,
      m.nome AS marca_nome

    FROM orders o
    JOIN users u
      ON u.id = o.client_user_id
    LEFT JOIN order_items oi
      ON oi.order_id = o.id
    LEFT JOIN volantes v
      ON v.id = oi.volante_id
    LEFT JOIN marcas m
      ON m.id = v.marca_id
    WHERE o.tenant_id = $1
    ORDER BY 
      o.created_at DESC,
      u.name ASC,
      m.nome ASC NULLS LAST,
      v.codigo ASC NULLS LAST
    `,
    [tenantId],
  );

  return this.groupOrdersWithItems(result.rows);
}

async groupOrdersWithItems(rows: any[]) {
  const ordersMap = new Map<string, any>();

  for (const row of rows) {
    // tenta buscar se já existe esse pedido no mapa
    let order = ordersMap.get(row.order_id);

    // se ainda não existe, cria o "cabeçalho" do pedido
    if (!order) {
      order = {
        id: row.order_id,
        title: row.title,
        description: row.description,
        status: row.status,
        createdAt: row.created_at,
        numeroPedido: row.numero_pedido,
        clientName: row.client_name,   // no findMyOrders não vem, tudo bem
        items: [] as any[],
      };

      ordersMap.set(row.order_id, order);
    }

    // agora trata o item do pedido, se tiver volante
    if (row.volante_id) {
      order.items.push({
        volanteId: row.volante_id,
        codigo: row.volante_codigo,
        descricao: row.volante_descricao,
        quantidade: row.quantidade,
        marcaNome: row.marca_nome,
        img: row.img,
      });
    }
  }

  // devolve um array de pedidos
  return Array.from(ordersMap.values());
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
      quantidade = COALESCE($8, quantidade),
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

  async updateStatus(tenantId: string, id: string, status: string) {
    const result = await this.db.query(
      `
      UPDATE orders
      SET status = $3,
          updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
      `,
      [tenantId, id, status],
    );

    return result.rows[0];
  }

  
}
