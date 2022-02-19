import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PackageName } from './package.enum';

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

  @Column({ unsigned: true })
  balance: number;

  @Column({ type: 'enum', enum: PackageName })
  userPackage: PackageName;
}
