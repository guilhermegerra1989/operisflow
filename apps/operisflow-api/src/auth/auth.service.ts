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