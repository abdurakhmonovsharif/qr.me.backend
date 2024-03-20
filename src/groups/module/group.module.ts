import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '../service/group.service';
import { GroupsController } from '../controller/group.controller';
import { Groups } from '../entity/group.entity';
import { UsersModule } from 'src/users/module/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Groups]),UsersModule],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports:[GroupsService]
})
export class GroupsModule {}
