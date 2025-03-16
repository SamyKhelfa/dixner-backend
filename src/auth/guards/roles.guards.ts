import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole =
      this.reflector.get<string>('role', context.getHandler()) ||
      this.reflector.get<string>('role', context.getClass());

    console.log('🔍 Rôle requis:', requiredRole);

    if (!requiredRole) return true; // Si aucun rôle n'est requis, accès autorisé.

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('👤 Utilisateur Authentifié:', user);

    if (!user) {
      throw new ForbiddenException(
        '❌ Accès refusé - Utilisateur non authentifié',
      );
    }

    if (!user.role || !user.role.includes(requiredRole)) {
      throw new ForbiddenException('🚫 Accès refusé - Rôle insuffisant');
    }

    return true;
  }
}
