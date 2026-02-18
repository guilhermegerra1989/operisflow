import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Tenant } from '../common/decorators/tenant.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private ensureAdmin(user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem acessar este recurso');
    }
  }

  // ADMIN → listar todos os usuários do tenant (clientes + admins)
  @Get()
  findAll(@Tenant() tenantId: string, @CurrentUser() user: any) {
    this.ensureAdmin(user);
    return this.usersService.findAll(tenantId);
  }

  // ADMIN → criar novo usuário (geralmente client)
  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateUserDto,
  ) {
    this.ensureAdmin(user);
    return this.usersService.create(tenantId, dto);
  }

  // ADMIN → detalhes de um usuário
  @Get(':id')
  findOne(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    this.ensureAdmin(user);
    return this.usersService.findOne(tenantId, id);
  }

  // ADMIN → atualizar usuário
  @Patch(':id')
  update(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    this.ensureAdmin(user);
    return this.usersService.update(tenantId, id, dto);
  }

  // ADMIN → remover usuário
  @Delete(':id')
  remove(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    this.ensureAdmin(user);
    return this.usersService.remove(tenantId, id);
  }
}