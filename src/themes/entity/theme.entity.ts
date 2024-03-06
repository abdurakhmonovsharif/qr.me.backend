
import { Page } from 'src/page/entity/page.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Theme {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    backgroup_color: string;

    @Column()
    font_family: string;

    @ManyToMany(() => Page)
    @JoinTable()
    pages: Page[];
}
