import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/module/user.module';
import { ThemesModule } from './themes/module/theme.module';
import { PageModule } from './page/module/page.module';
import { SectionModule } from './sections/module/section.module';
import { RoleModule } from './roles/module/role.module';
import { AuthModule } from './auth/module/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { PlanModule } from './plan/module/plan.module';
import { SliderModule } from './sliders/module/slider.module';

@Module({
  imports: [
    RoleModule,
    PlanModule,
    AuthModule,
    UsersModule,
    ThemesModule,
    PageModule,
    SectionModule,
    SliderModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
