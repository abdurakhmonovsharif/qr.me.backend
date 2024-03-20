import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlanService } from '../service/plan.service';
import { Plan } from '../enitity/plan.entity';


@Controller('plan')
export class PlanController {
    constructor(private readonly planService: PlanService) { }

    @Get()
    async findAll(): Promise<Plan[]> {
        return this.planService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Plan> {
        return this.planService.findById(id);
    }
   
    @Post()
    async create(@Body() planData: Partial<Plan>): Promise<Plan> {
        return this.planService.create(planData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() planData: Partial<Plan>): Promise<Plan> {
        return this.planService.update(id, planData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.planService.remove(id);
    }
}
