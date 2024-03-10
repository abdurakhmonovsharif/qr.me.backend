// page.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne, Timestamp, ManyToMany } from "typeorm";
import { Theme } from 'src/themes/entity/theme.entity';
import { Section } from 'src/sections/entity/section.entity';
import { User } from "../../users/entity/user.entity";
import { Contact } from "src/contact/entity/contact.entity";
import { Link } from "src/link/entity/link.entity";

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

    @ManyToOne(() => Theme, theme => theme.pages)
    theme: Theme;
    @Column({ default: 0 })
    view_count: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) // Default to current timestamp
    start_date: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' }) // Default to current timestamp
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
    
    @OneToMany(() => Link, link => link.page)
    links: Link[];
}
