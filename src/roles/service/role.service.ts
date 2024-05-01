import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { UserService } from 'src/users/service/user.service';
import { RoleNames } from '../enum/role.enum';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly userService: UserService,
    ) { }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }
    async findUserRole(userId: string): Promise<string> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const roleId = user.role.id;
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
            throw new Error('Role not found');
        }
        return role.name;
    }

    async findOne(id: string): Promise<Role> {
        return this.roleRepository.findOne({ where: { id } });
    }
    async findOneByName(name: string): Promise<Role> {
        return this.roleRepository.findOne({ where: { name } });
    }

    async create(roleData: Partial<Role>): Promise<Role> {
        const newRole = this.roleRepository.create(roleData);
        return this.roleRepository.save(newRole);
    }
    async createRolesAuto(): Promise<void> {
        const existingRoles = await this.roleRepository.find();
        if (existingRoles.length === 0) {
            const rolesToCreate = [
                RoleNames.Admin,
                RoleNames.Developer,
                RoleNames.User,
            ];
            for (const roleName of rolesToCreate) {
                const role = this.roleRepository.create({ name: roleName });
                await this.roleRepository.save(role);
            }
        }
    }

    async update(id: string, roleData: Partial<Role>): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new Error('Role not found');
        }
        Object.assign(role, roleData);
        return this.roleRepository.save(role);
    }

    async delete(id: string): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new Error('Role not found');
        }
        await this.roleRepository.remove(role);
    }
}
