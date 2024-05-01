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
    size: string;

    @Column({ default: 0 })
    view_count: number;

    @Column({ default: 0 })
    max_view_count: number;

    @Column({ default: 0 })
    edited_count: number;

    @Column({ default: 0 })
    max_edit_count: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    start_date: string;

    @Column()
    end_date: string;

    @Column({ nullable: true })
    password_edit: string;

    @Column({ nullable: true })
    password_view: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: string;

    @Column({ default: null })
    last_view_date: string;


    @Column()
    type: string;

    @OneToMany(() => Section, section => section.page)
    sections: Section[];

    @ManyToOne(() => Theme, theme => theme.pages, { onDelete: 'CASCADE' })
    theme: Theme;

    @OneToOne(() => User, user => user.page, { onDelete: 'CASCADE' })
    user: User;

    @OneToOne(() => Contact, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    contact: Contact;

    @OneToMany(() => Link, link => link.page, { cascade: true })
    links: Link[];
}
