import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('PG_POOL') private readonly db: Pool,
  ) {}

  async validateUser(email: string, password: string) {
    const result = await this.db.query(
      'SELECT id, tenant_id, name, email, password, role FROM users WHERE email = $1',
      [email],
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      tenantId: user.tenant_id,
      role: user.role,
      rota: user.rota
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
      name: user.name,
      rota: user.rota
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user,
    };
  }



/**
   * Retorna os dados completos do usuário logado,
   * incluindo nome e rota (nome da rota).
   */
  async getMe(payload: any) {
    const { id, tenantId } = payload;

    const result = await this.db.query(
      `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        u.tenant_id,
        u.rota_id,
        r.nome AS rota_nome
      FROM users u
      LEFT JOIN rotas r 
        ON r.id = u.rota_id 
       AND r.tenant_id = u.tenant_id
      WHERE u.id = $1
        AND u.tenant_id = $2
      `,
      [id, tenantId],
    );

    const row = result.rows[0];

    if (!row) {
      // fallback: se por algum motivo não achar o user, devolve o payload
      return payload;
    }

    return {
      id: row.id,
      email: row.email,
      role: row.role,
      tenantId: row.tenant_id,
      name: row.name,
      rotaId: row.rota_id,
      rotaNome: row.rota_nome,
    };
  }


}