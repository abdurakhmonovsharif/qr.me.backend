
import { Plan } from 'src/plan/enitity/plan.entity';
import { Page } from 'src/page/entity/page.entity';
import { Role } from 'src/roles/entity/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Groups } from 'src/groups/entity/group.entity';

@Entity()
export class User {
    @PrimaryColumn('varchar', { length: 255 })
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: string

    @Column({ unique: true, nullable: true })
    url: string;

    @Column({ default: false })
    active: boolean;

    @Column({ default: false })
    block: boolean;

    @Column({ nullable: true })
    last_online: string;

    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @ManyToOne(() => Plan, plan => plan.users)
    plan: Plan;

    @OneToOne(() => Page, page => page.user)
    @JoinColumn()
    page: Page;

    @ManyToOne(() => Groups, (groups) => groups.users)
    group: Groups;
}