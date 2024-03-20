
import { Contact } from 'src/contact/entity/contact.entity';
import { Page } from 'src/page/entity/page.entity';
import { Slider } from 'src/sliders/entity/slider.entity';
import { Entity, PrimaryGeneratedColumn, Column,  ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;   

    @Column()
    imageURL: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @OneToMany(() => Slider, slider => slider.section)
    sliders: Slider[]
    
    @ManyToOne(() => Page, page => page.sections)
    page: Page;

    @Column({default:()=>"CURRENT_TIMESTAMP"})
    created_at:string;

}
