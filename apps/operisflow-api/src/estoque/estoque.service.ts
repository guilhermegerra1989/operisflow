import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateEstoqueDto } from './dto/create-estoque.dto';

@Injectable()
export class EstoqueService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(tenantId: string, dto: CreateEstoqueDto) {
    const result = await this.db.query(
      `
      INSERT INTO estoque (tenant_id, codigo, descricao, qtd_pedidos, qtd_estoque, qtd_injetar)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [tenantId, dto.codigo, dto.descricao, dto.qtd_pedidos, dto.qtd_estoque, dto.qtd_injetar],
    );

    return result.rows[0];
  }

  async findAll(tenantId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM estoque
      WHERE tenant_id = $1
      ORDER BY codigo ASC
      `,
      [tenantId],
    );

    return result.rows;
  }

  async findOne(tenantId: string, id: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM estoque
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, dto: CreateEstoqueDto) {
    const result = await this.db.query(
      `
      UPDATE estoque
      SET 
        codigo = COALESCE($3, codigo),
        descricao = COALESCE($4, descricao),
        qtd_pedidos = COALESCE($5, qtd_pedidos),
        qtd_estoque = COALESCE($6, qtd_estoque),
        qtd_injetar = COALESCE($7, qtd_injetar),
        updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
      `,
      [tenantId, id, dto.codigo, dto.descricao, dto.qtd_pedidos, dto.qtd_estoque, dto.qtd_injetar],
    );

    return result.rows[0];
  }

  async remove(tenantId: string, id: string) {
    await this.db.query(
      `
      DELETE FROM estoque
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return true;
  }

  async removeAllByTenant(tenantId: string) {
    await this.db.query(
        `
        DELETE FROM estoque
        WHERE tenant_id = $1
        `,
        [tenantId],
    );

    return true;
    }
}