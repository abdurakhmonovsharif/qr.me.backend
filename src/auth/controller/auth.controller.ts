import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto, SignInUserDto } from '../dto/auth.user.dto';
import { AuthService } from "../service/auth.service";
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @UseGuards(LocalAuthGuard)
    @HttpCode(201)
    @Post("sign_in")
    async signIn(@Body() userDto: SignInUserDto) {
        return await this.authService.signIn(userDto)
    }

    @HttpCode(201)
    @Post("sign_up")
    async signUp(@Body() userDto: CreateUserDto) {
        return await this.authService.signUp(userDto)
    }
    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getMe(@Request() req) {
        return await this.authService.getMe(req.user.id);
    }
} 