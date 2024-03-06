import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme } from '../entity/theme.entity';
import { ThemesController } from '../controller/theme.controller';
import { ThemeService } from '../service/theme.service';
import { RoleModule } from 'src/roles/module/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Theme]), RoleModule],
  controllers: [ThemesController],
  providers: [ThemeService],
  exports: [ThemeService],
})
export class ThemesModule { }
