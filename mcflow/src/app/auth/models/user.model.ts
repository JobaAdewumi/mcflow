import { Wallet } from './wallet.model';
import { PackageName } from './package.enum';
import { Role } from './role.enum';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  imagePath?: string;
  lastLogin: Date;
  packageName: PackageName;
  role: Role;
  wallet?: Wallet;
}
