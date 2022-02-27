import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Role } from '../../post/models/role.enum';
import { UserPackage } from './package.enum';
import { Wallet } from './wallet.interface';

export class User {
  id?: number;
  @IsString()
  firstName?: string;
  @IsString()
  lastName?: string;
  userName?: string;
  @IsEmail()
  email?: string;
  @IsString()
  phoneNumber?: string;
  @IsString()
  password?: string;
  imagePath?: string;
  userPackage?: UserPackage;
  role?: Role;
  referralLink?: string;
  lastLogin?: Date;
  // wallet?: Wallet;
}
