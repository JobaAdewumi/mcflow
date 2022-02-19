import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Role } from '../../post/models/role.enum';
import { PackageName } from './package.enum';
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
  packageName?: PackageName;
  role?: Role;
  lastLogin?: Date;
  // wallet?: Wallet;
}
