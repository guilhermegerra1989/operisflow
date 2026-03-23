import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateRotaDto } from './dto/create-rota.dto';
import { UpdateRotaDto } from './dto/update-rota.dto';

@Injectable()
export class RotasService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(tenantId: string, dto: CreateRotaDto) {
    const result = await this.db.query(
      `
      INSERT INTO rotas (tenant_id, nome, descricao)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [tenantId, dto.nome, dto.descricao],
    );

    return result.rows[0];
  }

  async findAll(tenantId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM rotas
      WHERE tenant_id = $1
      ORDER BY nome ASC
      `,
      [tenantId],
    );

    return result.rows;
  }

  async findOne(tenantId: string, id: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM rotas
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, dto: UpdateRotaDto) {
    const result = await this.db.query(
      `
      UPDATE rotas
      SET 
        nome = COALESCE($3, nome),
        descricao = COALESCE($4, descricao),
        updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
      `,
      [tenantId, id, dto.nome, dto.descricao],
    );

    return result.rows[0];
  }

  async remove(tenantId: string, id: string) {
    await this.db.query(
      `
      DELETE FROM rotas
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return true;
  }
}