import { Slider } from "src/sliders/entity/slider.entity";

export class SectionDto {
    id?:string;
    type: string;
    imageURL: string;
    title: string;
    content: string;
    pageId?: string;
    sliders: Slider[]
}