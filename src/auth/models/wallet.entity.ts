import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserPackage } from './package.enum';
import { User } from './user.class';
import { UserEntity } from './user.entity';

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

  @OneToOne(() => UserEntity, user => user.wallet, { cascade: true })
  @JoinColumn({ name: 'id' })
  user: User;

  @BeforeInsert()
  newId() { this.id = this.user.id }
}
