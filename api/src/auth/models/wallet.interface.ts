import { UserPackage } from './package.enum';
import { User } from './user.class';

export interface Wallet {
  id?: number;
  userName?: string;
  mcfPoints?: number;
  referralBalance?: number;
  referred?: number;
  userPackage?: UserPackage;
  user?: User;
}
