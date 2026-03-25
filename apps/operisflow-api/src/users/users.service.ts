import { Injectable, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  private sanitize(user: any) {
    // Remove campo de senha do retorno
    const { password, ...rest } = user;
    return rest;
  }

  async findAll(tenantId: string) {
    const result = await this.db.query(
      `
      SELECT id, tenant_id, name, email, role, active, created_at, updated_at
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId],
    );
    return result.rows;
  }

  async findOne(tenantId: string, id: string) {
    const result = await this.db.query(
      `
      SELECT id, tenant_id, name, email, role, active, created_at, updated_at
      FROM users
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );
    return result.rows[0];
  }

  async create(tenantId: string, dto: CreateUserDto) {
    const role = dto.role || 'client';
    const active = dto.active ?? true;
    const rota_id = dto.rota_id;

    const result = await this.db.query(
      `
      INSERT INTO users (tenant_id, name, email, password, role, active, rota_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, tenant_id, name, email, role, active, rota_id, created_at, updated_at
      `,
      [tenantId, dto.name, dto.email, dto.password, role, active, rota_id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, dto: UpdateUserDto) {
    // Se quiser, pode bloquear alteração de email ou role aqui.
    const result = await this.db.query(
      `
      UPDATE users
      SET 
        name = COALESCE($3, name),
        email = COALESCE($4, email),
        password = COALESCE($5, password),
        role = COALESCE($6, role),
        active = COALESCE($7, active),
        rota_id = COALESCE($8, rota_id),
        updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING id, tenant_id, name, email, role, active, rota_id, updated_at
      `,
      [
        tenantId,
        id,
        dto.name ?? null,
        dto.email ?? null,
        dto.password ?? null,
        dto.role ?? null,
        dto.active ?? null,
        dto.rota_id,
      ],
    );

    return result.rows[0];
  }

  async remove(tenantId: string, id: string) {
    await this.db.query(
      `
      DELETE FROM users
      WHERE tenant_id = $1 AND id = $2
      `,
      [tenantId, id],
    );
    return true;
  }
}