import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ThemeService } from '../service/theme.service';
import { Theme } from '../entity/theme.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('themes')
export class ThemesController {
    constructor(private readonly themeService: ThemeService) { }
    @UseGuards(RolesGuard)
    @Get()
    findAll(): Promise<Theme[]> {
        return this.themeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Theme> {
        return this.themeService.findOne(id);
    }

    @Post()
    create(@Body() themeData: Partial<Theme>): Promise<Theme> {
        return this.themeService.create(themeData);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() themeData: Partial<Theme>): Promise<Theme> {
        return this.themeService.update(id, themeData);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.themeService.delete(id);
    }
}
