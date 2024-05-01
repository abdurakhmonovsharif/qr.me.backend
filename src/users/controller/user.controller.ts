import { Controller, Get, HttpCode, Post, Body, Param, Put, Delete, HttpException, NotFoundException, HttpStatus, Patch } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User } from "../entity/user.entity";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService,) { }

    @Get()
    @HttpCode(200)
    async getUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get(":id")
    @HttpCode(200)
    async getUser(@Param("id") id: string): Promise<User> {
        return await this.userService.findById(id)
    }

    @Post()
    @HttpCode(201)
    async createUser(@Body() userData: Partial<User>): Promise<User> {
        return await this.userService.create(userData);
    }

    @Put(":id")
    @HttpCode(201)
    async updateUser(@Param("id") id: string, @Body() userData: Partial<User>): Promise<void> {
        await this.userService.update(id, userData);
    }
    @Patch("/status/:id")
    @HttpCode(204)
    async updateStatus(@Param("id") id: string, @Body() status: { value: boolean, key: keyof User }): Promise<void> {
        await this.userService.updateStatus(id, status);
    }

    @HttpCode(204)
    @Patch("comment/:id")
    async updatePageComment(@Param("id") id: string, @Body() data: { comment: string }): Promise<void> {
        await this.userService.updateUserComment(id, data)
    }
    
    @Patch("/plan/:id")
    @HttpCode(204)
    async updatePlan(@Param("id") id: string, @Body() newPlan: { planId: string }): Promise<void> {
        await this.userService.updatePlan(id, newPlan);
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
