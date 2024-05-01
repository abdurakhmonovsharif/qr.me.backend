import { User } from "src/users/entity/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Groups {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: string;

    @OneToMany(() => User, (user) => user.group)
    users: User[];
}
