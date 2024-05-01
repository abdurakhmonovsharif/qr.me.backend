import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/module/user.module';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from 'src/roles/module/role.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { PlanModule } from 'src/plan/module/plan.module';

@Module({
    imports: [UsersModule,
        RoleModule,
        PassportModule,
        PlanModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
