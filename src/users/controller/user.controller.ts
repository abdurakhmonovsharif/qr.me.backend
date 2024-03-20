import { Controller, Get, HttpCode, Post, Body, Param, Put, Delete, HttpException, NotFoundException, HttpStatus } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User } from "../entity/user.entity";
import { GroupsService } from "src/groups/service/group.service";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService,) { }

    @Get()
    async getUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(":id")
    async getUser(@Param("id") id: string): Promise<User> {
        try {
            const user = await this.userService.findById(id)
            return user;
        } catch (error) {
            throw new NotFoundException("User is not found!");
        }
    }

    @Post()
    async createUser(@Body() userData: Partial<User>): Promise<User> {
        return await this.userService.create(userData);
    }

    @Put(":id")
    async updateUser(@Param("id") id: string, @Body() userData: Partial<User>): Promise<User> {
        return await this.userService.update(id, userData);
    }

    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param("id") id: string): Promise<void> {
        try {
            await this.userService.delete(id);
        } catch (error) {
            throw new HttpException(`Error deleting user with ID ${id}: ${error.message}`, HttpStatus.BAD_REQUEST)
        }

    }
}
