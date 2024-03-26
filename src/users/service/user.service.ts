import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import * as argon2 from 'argon2';
import { PageService } from "src/page/service/page.service";
import { PlanService } from "src/plan/service/plan.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly planService: PlanService,
    ) { }

    async findAll(): Promise<User[]> {
        let users = await this.userRepository.find({ relations: ['plan', 'page'] });
        if (!users) return [];
        const usersWithoutPassword = await Promise.all(users.map(async (user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }));
        return usersWithoutPassword;
    }
   
    async findById(id: string) {
        return await this.userRepository.findOne({ where: { id }, relations: ["plan","page"] });
    }
    async findByURL(url: string) {
        const user = await this.userRepository.findOne({ where: { url }, relations: ['plan'] })
        return user;
    }

    async getUsersByGroupId(groupId: string) {
        const users = await this.userRepository.findBy({ group: { id: groupId } });
        return users;
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create({ ...userData, email: userData.email.toLowerCase() });
        return await this.userRepository.save(newUser);
    }

    async updateStatus(id: string, status: { value: boolean, key: keyof User }): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        if (status.key === "active" || status.key === "block") {
            user[status.key] = status.value;
            await this.userRepository.save(user);
        }
    }

    async updatePlan(id: string, newPlan: { planId: string }): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const plan = await this.planService.findById(newPlan.planId)
        if (!plan) throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
        user.plan = plan;
        await this.userRepository.save(user);
    }

    async update(id: string, updateUserDto: Partial<User>): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        await this.userRepository.remove(user);
    }
}
