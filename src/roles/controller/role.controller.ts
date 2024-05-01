import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { Role } from '../entity/role.entity';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    async findAll(): Promise<Role[]> {
        return this.roleService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Role> {
        return this.roleService.findOne(id);
    }

    @Post()
    async create(@Body() roleData: Partial<Role>): Promise<Role> {
        return this.roleService.create(roleData);
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() roleData: Partial<Role>): Promise<Role> {
        return this.roleService.update(id, roleData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.roleService.delete(id);
    }
}
