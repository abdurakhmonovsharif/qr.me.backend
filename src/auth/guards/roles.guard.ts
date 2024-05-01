import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/roles/service/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly roleService: RoleService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const userRoles = await this.roleService.findUserRole(userId);
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        return hasRequiredRole;
    }
}
