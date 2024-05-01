
import { Page } from 'src/page/entity/page.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  map: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Page, page => page.contact)
  section?: Page;
}
