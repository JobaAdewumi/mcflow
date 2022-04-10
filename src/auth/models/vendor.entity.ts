import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vendor')
export class VendorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ select: false })
  password: string;
}
