import { ConflictException, Injectable, Request, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto, SignInUserDto } from "../dto/auth.user.dto";
import { UserService } from "src/users/service/user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { RoleService } from "src/roles/service/role.service";
import { Role } from "src/roles/enum/role.enum";
import { QueryFailedError } from "typeorm";
import { PlanService } from "src/plan/service/plan.service";
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly roleService: RoleService, private readonly planService: PlanService) { }
    async signIn(userDto: SignInUserDto) {
        const { password } = userDto;

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const user = await this.userService.findById(hashedPassword);
        if (!user) {
            throw new UnauthorizedException();
        }

        try {
            if (await argon2.verify(user.password, password)) {
                const payload = { sub: user.id };
                delete user.password
                return { token: this.jwtService.sign(payload), user };
            } else {
                throw new UnauthorizedException();
            }
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    async signUp(userDto: CreateUserDto) {
        try {
            const { email, password, name, url, last_online, planId } = userDto;
            const userId = crypto.createHash('md5').update(password).digest('hex');
            const existingUser = await this.userService.findById(userId);
            if (existingUser) {
                throw new UnauthorizedException('User already exists');
            }

            const pattern = /^[!@#$%^&*]{2}[\w\d]{2,}\d{3}$/;
            if (!pattern.test(password)) {
                throw new UnauthorizedException('Password does not meet the requirements');
            }

            const USER_ROLE = await this.roleService.findOneByName(Role.User);
            const PLAN = await this.planService.findById(planId);
            const hashedPassword = await argon2.hash(password);
            const newUser = await this.userService.create({
                id: userId,
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                role: USER_ROLE, url,
                last_online: "",
                plan: PLAN
            });
            const payload = { sub: newUser.id };
            return this.jwtService.sign(payload);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                if (error.message.includes('duplicate key value violates unique constraint "IDX_USER_EMAIL"')) {
                    throw new ConflictException('Email is already in use');
                } else if (error.message.includes('duplicate key value violates unique constraint "IDX_USER_URL"')) {
                    throw new ConflictException('URL is already in use');
                }
            }
            throw error;
        }

    }
    async getMe(user_id: string) {
        const user = await this.userService.findById(user_id);
        delete user.password
        return user;
    }
}