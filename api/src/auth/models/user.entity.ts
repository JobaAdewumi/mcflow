import { SponsoredPostEntity } from './../../post/models/post.entity';
import { UserPackage } from './package.enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { Wallet } from './wallet.interface';
import { Role } from '../../post/models/role.enum';

@Entity('user')
export class UserEntity {
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

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'enum', enum: UserPackage })
  userPackage: UserPackage;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ unique: true })
  referralLink: string;

  @Column({ nullable: true, default: null })
  lastLogin: Date;

  @Column({ nullable: true, default: null })
  lastSharedLogin: Date;

  @OneToOne(() => WalletEntity, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToMany(
    () => SponsoredPostEntity,
    (sponsoredPostEntity) => sponsoredPostEntity.author
  )
  sponsoredPosts: SponsoredPostEntity[];
}
