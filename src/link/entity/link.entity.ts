import { Page } from "src/page/entity/page.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column()
    link: string;

    @Column()
    img: string;

    @ManyToOne(() => Page, page => page.links)
    page: Page;
}