import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../enitity/plan.entity';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
    ) { }

    async findAll(): Promise<Plan[]> {
        return await this.planRepository.find();
    }

    async findById(id: string): Promise<Plan> {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) throw new Error('Plan not found');
        return plan;
    }

    async create(planData: Partial<Plan>): Promise<Plan> {
        return await this.planRepository.save(planData);
    }
    async createDefaultPlans(): Promise<void> {
        const existingPlans = await this.planRepository.find();
        if (existingPlans.length === 0) {
            const plansToCreate = [
                { nameEn: 'text', nameRu: 'текст' },
                { nameEn: 'b_card', nameRu: 'визитка' },
                { nameEn: 'blog', nameRu: 'блог' },
            ];

            for (const planData of plansToCreate) {
                const plan = this.planRepository.create(planData);
                await this.planRepository.save(plan);
            }
        }
    }
    async update(id: string, planData: Partial<Plan>): Promise<Plan> {
        await this.planRepository.update(id, planData);
        return await this.planRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new Error('Plan not found');
        }
        await this.planRepository.delete(id);
    }
}
