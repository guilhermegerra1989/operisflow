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
      SELECT id, tenant_id, name, email, role, active, rota_id, password, nome_fantasia, razao_social,
       endereco, cnpj, telefone,tel_comercial,tel_pessoal,bairro,estado,cep,inscricao_estadual,inscricao_municipal,
       created_at, updated_at
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
      SELECT id, tenant_id, name, email, role, active, rota_id, password, nome_fantasia, razao_social,
       endereco, cnpj, telefone,tel_comercial,tel_pessoal,bairro,estado,cep,inscricao_estadual,inscricao_municipal,
       created_at, updated_at
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

    let endereco = '';
    let cnpj = '';
    let telefone = '';

    // ✅ regra: só cliente pode ter esses campos
    if (role === 'client') {
      if (!dto.endereco || !dto.cnpj || !dto.telefone) {
        throw new ForbiddenException('Dados do cliente incompletos');
      }

      endereco = dto.endereco;
      cnpj = dto.cnpj;
      telefone = dto.telefone;
    }

    const result = await this.db.query(
      `
      INSERT INTO users 
      (tenant_id, name, email, password, role, active, rota_id, endereco, cnpj, telefone, nome_fantasia, razao_social,tel_comercial,
      tel_pessoal, bairro, estado, cep, inscricao_estadual, inscricao_municipal)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id, tenant_id, name, email, role, active, rota_id, endereco, cnpj, telefone, created_at, updated_at, nome_fantasia, razao_social, tel_comercial,
      tel_pessoal, bairro, estado, cep, inscricao_estadual, inscricao_municipal
      `,
      [
        tenantId,
        dto.name,
        dto.email,
        dto.password,
        role,
        active,
        dto.rota_id,
        endereco,
        cnpj,
        telefone,
        dto.nome_fantasia,
        dto.razao_social,
        dto.tel_comercial,
        dto.tel_pessoal,
        dto.bairro,
        dto.estado,
        dto.cep,
        dto.inscricao_estadual,
        dto.inscricao_municipal
      ],
    );

    return this.sanitize(result.rows[0]);
  }

  async update(tenantId: string, id: string, dto: UpdateUserDto) {

    let endereco = dto.endereco ?? null;
    let cnpj = dto.cnpj ?? null;
    let telefone = dto.telefone ?? null;

    // ✅ Se vier role e não for client → limpa tudo
    if (dto.role && dto.role !== 'client') {
      endereco = null;
      cnpj = null;
      telefone = null;
    }

    // ✅ Se for client → valida
    if (dto.role === 'client') {
      if (!dto.endereco || !dto.cnpj || !dto.telefone) {
        throw new ForbiddenException('Dados do cliente incompletos');
      }
    }

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
        endereco = $9,
        cnpj = $10,
        telefone = $11,
        nome_fantasia = $12,
        razao_social = $13,
        tel_comercial = $14,
        tel_pessoal = $15,
        bairro = $16,
        estado = $17,
        cep = $18,
        inscricao_estadual = $19, 
        inscricao_municipal = $20,
        updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING id, tenant_id, name, email, role, active, rota_id, endereco, cnpj, telefone, updated_at, nome_fantasia, razao_social, tel_comercial, tel_pessoal, bairro,
        estado, cep,  inscricao_estadual, inscricao_municipal
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
        endereco,
        cnpj,
        telefone,
        dto.nome_fantasia,
        dto.razao_social,
        dto.tel_comercial,
        dto.tel_pessoal,
        dto.bairro,
        dto.estado,
        dto.cep,
        dto.inscricao_estadual,
        dto.inscricao_municipal
      ],
    );

    return this.sanitize(result.rows[0]);
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