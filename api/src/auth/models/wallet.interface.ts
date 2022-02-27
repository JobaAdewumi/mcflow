import { UserPackage } from './package.enum';

export interface Wallet {
  id?: number;
  userName?: string;
  mcfPoints?: number;
  referralBalance?: number;
  referred?: number;
  userPackage?: UserPackage;
}
