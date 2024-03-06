// page.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Theme } from 'src/themes/entity/theme.entity';
import { Section } from 'src/sections/entity/section.entity';
import { User } from "../../users/entity/user.entity";
import { Contact } from "src/contact/entity/contact.entity";

@Entity()
export class Page {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    site_link: string;

    @Column({ nullable: true })
    site_name: string;

    @Column()
    logo: string; // Assuming the logo is stored as a string representing the image URL

    @Column()
    description: string;

    @Column()
    qr_code: string;

    @OneToMany(() => Section, section => section.page)
    sections: Section[];

    @OneToOne(() => Theme)
    @JoinColumn()
    theme: Theme;

    @Column({ default: 0 })
    view_count: number;

    @Column()
    start_date: string;

    @Column()
    end_date: string;

    @Column()
    password: string;

    @Column()
    type: string; // Assuming type can be 'site', 'cv', 'text', etc.

    @ManyToOne(() => User, user => user.pages)
    user: User;

    @OneToOne(() => Contact, { cascade: true })
    @JoinColumn()
    contact: Contact;
}
