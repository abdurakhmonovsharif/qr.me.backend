// plan.entity.ts

import { User } from 'src/users/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nameEn: string;

    @Column()
    nameRu: string;

    @OneToMany(() => User, user => user.plan)
    users: User[];
}
