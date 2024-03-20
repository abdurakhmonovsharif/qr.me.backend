import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from '../enitity/plan.entity';
import { PlanController } from '../controller/plan.controller';
import { PlanService } from '../service/plan.service';

@Module({
    imports: [TypeOrmModule.forFeature([Plan])],
    controllers: [PlanController],
    providers: [PlanService],
    exports:[PlanService]
})
export class PlanModule { }
