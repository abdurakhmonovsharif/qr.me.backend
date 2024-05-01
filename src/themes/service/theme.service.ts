import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from '../entity/theme.entity';

@Injectable()
export class ThemeService {
    constructor(
        @InjectRepository(Theme)
        private readonly themeRepository: Repository<Theme>,
    ) { }

    async findAll(): Promise<Theme[]> {
        return this.themeRepository.find();
    }

    async findOne(id: string): Promise<Theme> {
        return this.themeRepository.findOne({ where: { id } });
    }

    async create(themeData: Partial<Theme>): Promise<Theme> {
        let baseName = "Тема";
        let suffix = 1;
        let uniqueNameFound = false;
        while (!uniqueNameFound) {
            const newName = `${baseName} ${suffix}`;
            const existingTheme = await this.themeRepository.findOne({ where: { name: newName } });
            if (!existingTheme) {
                themeData.name = newName;
                uniqueNameFound = true;
            } else {
                suffix++;
            }
        }
        const newTheme = this.themeRepository.create(themeData);
        return this.themeRepository.save(newTheme);
    }

    async update(id: string, themeData: Partial<Theme>): Promise<Theme> {
        const theme = await this.themeRepository.findOne({ where: { id } });
        if (!theme) {
            throw new Error('Theme not found');
        }
        Object.assign(theme, themeData);
        return this.themeRepository.save(theme);
    }

    async delete(id: string): Promise<void> {
        const theme = await this.themeRepository.findOne({ where: { id } });
        if (!theme) {
            throw new Error('Theme not found');
        }
        await this.themeRepository.remove(theme);
    }
}
