import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // ✅ Libera preflight CORS
    if (req.method === 'OPTIONS') {
      return true;
    }

    return super.canActivate(context);
  }
}
