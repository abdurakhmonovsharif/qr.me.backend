
import { Page } from 'src/page/entity/page.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Theme {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    background_color: string;

    @Column()
    font_family: string;

    @Column({default:"#FFF"})
    color: string;

   
    @OneToMany(() => Page, page => page.theme)
    pages: Page[];
}
