import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto, ResponseSignInUser, SignInUserDto } from "../dto/auth.user.dto";
import { UserService } from "src/users/service/user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { RoleService } from "src/roles/service/role.service";
import { RoleNames } from "src/roles/enum/role.enum";
import { PlanService } from "src/plan/service/plan.service";
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly roleService: RoleService, private readonly planService: PlanService) { }
    async signIn(userDto: SignInUserDto): Promise<ResponseSignInUser> {
        const { password, url } = userDto;
        const hashedPassword = crypto.createHash('md5').update(url).digest('hex');
        const user = await this.userService.findById(hashedPassword);
        if (!user) {
            throw new UnauthorizedException();
        }
        try {
            if (await argon2.verify(user.password, password)) {
                const payload = { sub: user.id };
                delete user.password
                return { token: this.jwtService.sign(payload), page_id: user.page ? user.page.id : null, user_id: user.id, plan: user.plan };
            } else {
                throw new UnauthorizedException();
            }
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
    async createPassword(userDto: SignInUserDto) {
        try {
            const user = await this.userService.findByURL(userDto.url);
            if (user.password) {
                throw new UnauthorizedException('User already exists');
            }
            const pattern = /^[!@#$%^&*]{2}[\w\d]{2,}\d{3}$/;
            if (!pattern.test(userDto.password)) {
                throw new UnauthorizedException('Password does not meet the requirements');
            }
            const hashedPassword = await argon2.hash(userDto.password);
            user.password = hashedPassword
            await this.userService.update(user.id, user)
            const payload = { sub: user.id };
            delete user.password
            return { token: this.jwtService.sign(payload), page_id: user.page ? user.page.id : null, user_id: user.id, plan: user.plan };
        } catch (error) {
            throw new HttpException(error.message, error.code)
        }
    }
    async signUp(userDto: CreateUserDto) {
        try {
            const { password, name, url, planId } = userDto;
            const userId = crypto.createHash('md5').update(url).digest('hex');
            const existingUser = await this.userService.findById(userId);
            if (existingUser) {
                throw new UnauthorizedException('User already exists');
            }
            const pattern = /^[!@#$%^&*]{2}[\w\d]{2,}\d{3}$/;
            if (password !== null && !pattern.test(password)) {
                throw new UnauthorizedException('Password does not meet the requirements');
            }

            const USER_ROLE = await this.roleService.findOneByName(RoleNames.User);
            const PLAN = await this.planService.findById(planId);
            let hashedPassword = null;
            if (password) {
                hashedPassword = await argon2.hash(password);
            }
            const newUser = await this.userService.create({
                id: userId,
                password: hashedPassword,
                name,
                role: USER_ROLE, url,
                plan: PLAN
            });
            const payload = { sub: newUser.id };
            return this.jwtService.sign(payload)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async fincheckPasswordFoundByUrldById(url: string): Promise<boolean> {
        const user = await this.userService.findByURL(url)
        if (!user) {
            throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
        }
        return user.password !== null;
    }
    async getMe(user_id: string) {
        const user = await this.userService.findById(user_id);
        delete user.password
        return user;
    }
}