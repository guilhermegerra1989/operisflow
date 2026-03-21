// src/marcas/marcas.service.ts
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(tenantId: string, dto: CreateMarcaDto) {
    const result = await this.db.query(
      `
      INSERT INTO marcas (tenant_id, nome, descricao)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [tenantId, dto.nome, dto.descricao ?? null],
    );

    return result.rows[0];
  }

  async findAll(tenantId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM marcas
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
      FROM marcas
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, dto: UpdateMarcaDto) {
    const result = await this.db.query(
      `
      UPDATE marcas
      SET 
        nome = COALESCE($3, nome),
        descricao = COALESCE($4, descricao)
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
      `,
      [tenantId, id, dto.nome ?? null, dto.descricao ?? null],
    );

    return result.rows[0];
  }

  async remove(tenantId: string, id: string) {
    await this.db.query(
      `
      DELETE FROM marcas
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return true;
  }
}