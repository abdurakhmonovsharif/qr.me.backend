import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entity/section.entity';
import { SectionDto } from '../dto/section.dto';
import { SliderService } from 'src/sliders/service/slider.service';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section)
        private readonly sectionRepository: Repository<Section>,
        private readonly sliderService: SliderService,
    ) { }

    async findAll(): Promise<Section[]> {
        return this.sectionRepository.find();
    }

    async findAllByPageId(pageId: string): Promise<Section[]> {
        return this.sectionRepository.find({ where: { page: { id: pageId } } })
    }

    async findOne(id: string): Promise<Section> {
        return this.sectionRepository.findOne({ where: { id } });
    }

    async create(sectionData: Partial<Section>, pageId: string): Promise<Section> {
        const newSection = this.sectionRepository.create({ ...sectionData, page: { id: pageId } });
        return this.sectionRepository.save(newSection);
    }
    async createSectionsByPageId(sections: SectionDto[], pageId: string) {
        const createdSections: Section[] = [];
        for (const item of sections) {
            let savedSection = null;
            if (item.type === "text" || item.type === "image") {
                savedSection = await this.sectionRepository.save({ ...item, sliders: [], page: { id: pageId } });
            } else {
                await Promise.all(
                    item.sliders.map(async (slider) => {
                        await this.sliderService.create({ ...slider, section: savedSection });
                    }),
                );
            }
            createdSections.push(savedSection);
        }
        return createdSections;
    }

    async update(id: string, sectionData: Partial<SectionDto>[]): Promise<void> {
        const sections = await this.sectionRepository.find({ where: { page: { id } } });
        if (sections.length === 0) {
            throw new HttpException('Sections not found', HttpStatus.NOT_FOUND);
        }

        for (let section of sectionData) {
            if (section.type === 'sliders') {
                console.log(section);
            } else {
                console.log(section);
                const findSection = await this.sectionRepository.findOne({ where: { id: section.id } })
                Object.assign(findSection, section);
                await this.sectionRepository.save(findSection)
            }
        }
    }



    async delete(id: string): Promise<void> {
        const section = await this.sectionRepository.findOne({ where: { id } });
        if (!section) {
            throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
        }
        await this.sectionRepository.remove(section);
    }
    async deleteByPageId(pageId: string): Promise<void> {
        const sections = await this.sectionRepository.find({ where: { page: { id: pageId } }, relations: ["sliders"] });

        if (!sections || sections.length === 0) {
            throw new Error('Sections not found for the given pageId');
        }

        for (const section of sections) {
            if (section.sliders && section.sliders.length > 0) {
                await this.sliderService.deleteBySectionId(section.id);
            }
        }

        await this.sectionRepository.remove(sections);
    }

}
