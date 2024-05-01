import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '../entity/section.entity';
import { SectionService } from '../service/section.service';
import { SectionController } from '../controller/section.contoller';
import { SliderModule } from 'src/sliders/module/slider.module';

@Module({
    imports: [TypeOrmModule.forFeature([Section]),SliderModule],
    controllers: [SectionController],
    providers: [SectionService],
    exports: [SectionService]
})
export class SectionModule { }
