// slider.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SliderService } from '../service/slider.service';
import { Slider } from '../entity/slider.entity';

@Controller('sliders')
export class SliderController {
  constructor(private readonly sliderService: SliderService) { }

  @Get()
  findAll(): Promise<Slider[]> {
    return this.sliderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Slider> {
    return this.sliderService.findOne(id);
  }

  @Post()
  create(@Body() sliderData: Partial<Slider>): Promise<Slider> {
    return this.sliderService.create(sliderData);
  }


  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.sliderService.remove(id);
  }
}
