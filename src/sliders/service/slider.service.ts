// slider.service.ts
import { Injectable } from '@nestjs/common';
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

    async update(id: string, sliderData: Partial<Slider>): Promise<Slider> {
        await this.sliderRepository.update(id, sliderData);
        return await this.sliderRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.sliderRepository.delete(id);
    }
    async deleteBySectionId(sectionId: string): Promise<void> {
        const sliders = await this.sliderRepository.find({ where: { section: { id: sectionId } } })
        await this.sliderRepository.remove(sliders)
    }
}
