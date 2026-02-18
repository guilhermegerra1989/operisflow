import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
  private db: Pool;

  constructor(private readonly jwtService: JwtService) {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async validateUser(email: string, password: string) {
    const result = await this.db.query(
      'SELECT id, tenant_id, name, email, password, role FROM users WHERE email = $1',
      [email],
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // POC: comparação em texto puro (depois trocamos por bcrypt)
    if (user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      tenantId: user.tenant_id,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user,
    };
  }
}