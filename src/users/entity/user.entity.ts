
import { Plan } from 'src/plan/enitity/plan.entity';
import { Page } from 'src/page/entity/page.entity';
import { Role } from 'src/roles/entity/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password?: string;

    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @ManyToOne(() => Plan, plan => plan.users)
    plan: Plan;

    @OneToMany(() => Page, page => page.user)
    pages: Page[];

}