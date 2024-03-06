import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        let users = await this.userRepository.find();
        const usersWithoutPassword = await Promise.all(users.map(async (user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }));
        return usersWithoutPassword;
    }
    async findById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        delete user.password;
        return user;
    }


    async findOneByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email: email.toLowerCase() } })
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create({ ...userData, email: userData.email.toLowerCase() });
        return await this.userRepository.save(newUser);
    }

    async update(id: string, updateUserDto: Partial<User>): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) return undefined;
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) return false;
        await this.userRepository.remove(user);
        return true;
    }
}
