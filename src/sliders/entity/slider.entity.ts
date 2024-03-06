// slider.entity.ts
import { Section } from 'src/sections/entity/section.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Slider {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    imageURL: string;

    @Column()
    title: string;

    @ManyToOne(() => Section, section => section.sliders)
    section: Section;
}
