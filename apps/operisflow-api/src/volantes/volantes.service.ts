import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateVolanteDto } from './dto/create-volante.dto';
import { UpdateVolanteDto } from './dto/update-volante.dto';

@Injectable()
export class VolantesService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(tenantId: string, dto: CreateVolanteDto) {
    const result = await this.db.query(
      `
      INSERT INTO volantes (tenant_id, codigo, descricao)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [tenantId, dto.codigo, dto.descricao],
    );

    return result.rows[0];
  }

  async findAll(tenantId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM volantes
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
      FROM volantes
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, dto: UpdateVolanteDto) {
    const result = await this.db.query(
      `
      UPDATE volantes
      SET 
        codigo = COALESCE($3, codigo),
        descricao = COALESCE($4, descricao),
        updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
      `,
      [tenantId, id, dto.codigo, dto.descricao],
    );

    return result.rows[0];
  }

  async remove(tenantId: string, id: string) {
    await this.db.query(
      `
      DELETE FROM volantes
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );

    return true;
  }
}