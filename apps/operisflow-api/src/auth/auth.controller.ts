import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // ajuste o caminho se necessário
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';


class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // NOVO: retorna os dados do usuário logado (usado pela tela de pedido)
 @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user);
  }

  
@Post('register')
  async register(@Body() dto: CreateUserDto) {

    // ✅ IMPORTANTÍSSIMO: definir tenant manual
    const tenantId = '3f2d2d48-1f8f-4ebe-a5e5-cdc1d18f4eab';


 const rota = await this.usersService['db'].query(`
    SELECT id FROM rotas LIMIT 1
  `);

    return this.usersService.create(tenantId, {
      ...dto,

      // ✅ FORÇA cliente (segurança)
      role: 'client',
      active: true,
      rota_id: rota.rows[0].id,
    });
  }



}