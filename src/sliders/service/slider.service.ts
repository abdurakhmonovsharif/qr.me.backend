// slider.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from '../entity/slider.entity';

@Injectable()
export class SliderService {
    constructor(
        @InjectRepository(Slider)
        private sliderRepository: Repository<Slider>,
    ) { }

    async findAll(): Promise<Slider[]> {
        return await this.sliderRepository.find();
    }

    async findOne(id: string): Promise<Slider> {
        return await this.sliderRepository.findOne({ where: { id } });
    }

    async create(sliderData: Partial<Slider>): Promise<Slider> {
        const slider = this.sliderRepository.create(sliderData);
        return await this.sliderRepository.save(slider);
    }

    async updateAll(sliderIds: string[], slidersData: Partial<Slider[]>): Promise<void> {
        for (let i = 0; i < sliderIds.length; i++) {
            const sliderId = sliderIds[i];
            const sliderData = slidersData[i];
            // Find the slider by its ID and update its properties
            const slider = await this.sliderRepository.findOne({ where: { id: sliderId }, relations: ['section'] });
            if (!slider) {
                throw new Error(`Slider with id ${sliderId} not found`);
            }
            Object.assign(slider, sliderData);
            await this.sliderRepository.save(slider);
        }
    }


    async remove(id: string): Promise<void> {
        await this.sliderRepository.delete(id);
    }
    async deleteBySectionId(sectionId: string): Promise<void> {
        const sliders = await this.sliderRepository.find({ where: { section: { id: sectionId } } })
        await this.sliderRepository.remove(sliders)
    }
}
