import { Injectable, Request, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto, SignInUserDto } from "../dto/auth.user.dto";
import { UserService } from "src/users/service/user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from 'argon2';
import { RoleService } from "src/roles/service/role.service";
import { Role } from "src/roles/enum/role.enum";
import { User } from "src/users/entity/user.entity";
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly roleService: RoleService) { }
    async signIn(userDto: SignInUserDto) {
        const { email, password } = userDto;

        const user = await this.userService.findOneByEmail(email);
        console.log(user);

        if (!user) {
            throw new UnauthorizedException();
        }

        try {
            if (await argon2.verify(user.password, password)) {
                const payload = { sub: user.id, email: user.email };
                return this.jwtService.sign(payload);
            } else {
                throw new UnauthorizedException();
            }
        } catch (err) {
            throw new UnauthorizedException();
        }
    }


    async signUp(userDto: CreateUserDto) {
        const { email, password, name } = userDto;
        const existingUser = await this.userService.findOneByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }
        const USER_ROLE = await this.roleService.findOneByName(Role.User);
        const hashedPassword = await argon2.hash(password);
        const newUser = await this.userService.create({ email: email.toLowerCase(), password: hashedPassword, name, role: USER_ROLE });
        const payload = { sub: newUser.id, email: newUser.email };
        return this.jwtService.sign(payload);
    }

    async getMe(user_id: string) {
        const user=await this.userService.findById(user_id);
        delete user.password
        return user;
    }
}