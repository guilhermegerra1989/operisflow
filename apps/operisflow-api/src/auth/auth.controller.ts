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

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // NOVO: retorna os dados do usuário logado (usado pela tela de pedido)
 @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    // user aqui é o payload do JWT (id, email, role, tenantId, etc.)
    return this.authService.getMe(user);
  }

}