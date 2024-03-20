import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
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
    qr_code: string;

    @OneToMany(() => Section, section => section.page)
    sections: Section[];

    @ManyToOne(() => Theme, theme => theme.pages)
    theme: Theme;

    @Column({ default: 0 })
    view_count: number;

    @Column()
    max_view_count: number;

    @Column({ default: 0 })
    edited_count: number;

    @Column({ default: 0 })
    max_edit_count: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    start_date: string;

    @Column()
    end_date: string;

    @Column()
    password_edit: string;

    @Column()
    password_view: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: string;

    @Column({ default: null })
    last_view_date: string;

    @Column({ default: "" })
    comment: string;

    @Column()
    type: string; // Assuming type can be 'site', 'cv', 'text'

    @OneToOne(() => User, user => user.page)
    user: User;

    @OneToOne(() => Contact, { cascade: true })
    @JoinColumn()
    contact: Contact;

    @OneToMany(() => Link, link => link.page)
    links: Link[];
}
