// plan.entity.ts

import { User } from 'src/users/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    @Column()
    price: string;

    @Column()
    description: string;

    @Column()
    textEnabled: boolean;

    @Column()
    cvEnabled: boolean;

    @Column()
    siteEnabled: boolean;

    @OneToMany(() => User, user => user.plan)
    users: User[];
}
