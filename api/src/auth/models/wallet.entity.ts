import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserPackage } from './package.enum';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unsigned: true })
  mcfPoints: number;

  @Column({ unsigned: true })
  referralBalance: number;

  @Column()
  referred: number;

  @Column({ type: 'enum', enum: UserPackage })
  userPackage: UserPackage;
}
