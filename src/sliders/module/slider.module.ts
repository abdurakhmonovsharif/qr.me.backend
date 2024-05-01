// slider.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from '../entity/slider.entity';
import { SliderController } from '../controller/slider.contoller';
import { SliderService } from '../service/slider.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slider])],
  controllers: [SliderController],
  providers: [SliderService],
  exports :[SliderService]
})
export class SliderModule {}
