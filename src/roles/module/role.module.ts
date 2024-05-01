import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { RoleController } from '../controller/role.controller';
import { RoleService } from '../service/role.service';
import { UsersModule } from 'src/users/module/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UsersModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule { }
