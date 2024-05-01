import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SectionService } from '../service/section.service';
import { Section } from '../entity/section.entity';
import { SectionDto } from '../dto/section.dto';

@Controller('sections')
export class SectionController {
    constructor(private readonly sectionService: SectionService) { }

    @Get()
    async findAll(): Promise<Section[]> {
        return this.sectionService.findAll();
    }

    @Get(':id')
    async findAllByPageId(@Param('id') pageId: string): Promise<Section[]> {
        return this.sectionService.findAllByPageId(pageId)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() sectionData: SectionDto[]): Promise<void> {
        this.sectionService.update(id, sectionData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.sectionService.delete(id);
    }
}
