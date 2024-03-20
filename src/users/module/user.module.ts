import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { GroupsModule } from 'src/groups/module/group.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService]
})
export class UsersModule { }
