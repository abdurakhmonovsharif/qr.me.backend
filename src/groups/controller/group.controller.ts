import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { Groups } from '../entity/group.entity';
import { GroupsService } from '../service/group.service';
import { UserService } from 'src/users/service/user.service';
import { User } from 'src/users/entity/user.entity';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService, private readonly usersService: UserService) { }

  @Get()
  findAll(): Promise<Groups[]> {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Groups> {
    return this.groupsService.findOne(id);
  }

  @Get(":groupId/users") // Adjusted the route
  async getUsersByGroupId(@Param("groupId") groupId: string): Promise<User[]> {
    try {
      if (!groupId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        throw new NotFoundException("Group not found!");
      }
      const group = await this.groupsService.findOne(groupId);
      if (!group) throw new NotFoundException("Group not found!");
      const users = await this.usersService.getUsersByGroupId(groupId);
      return users;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  create(@Body() groupData: Partial<Groups>): Promise<Groups> {
    return this.groupsService.create(groupData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() groupData: Partial<Groups>): Promise<Groups> {
    return this.groupsService.update(id, groupData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}
