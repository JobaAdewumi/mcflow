import { PackageName } from './package.enum';

export interface Wallet {
  id?: number;
  userName?: string;
  mcfPoints?: number;
  referralBalance?: number;
  balance?: number;
  userPackage?: PackageName;
}
