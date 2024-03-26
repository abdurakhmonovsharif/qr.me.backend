import { forwardRef, Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { GroupsModule } from 'src/groups/module/group.module';
import { PlanModule } from 'src/plan/module/plan.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([User]),PlanModule ],
    exports: [UserService]
})
export class UsersModule { }
