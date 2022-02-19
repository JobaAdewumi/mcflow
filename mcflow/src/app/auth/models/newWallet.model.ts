import { PackageName } from "./package.enum";

export interface NewWallet {
  userName: string;
  mcfPoints?: number;
  referralBalance?: number;
  balance?: number;
  packageName: PackageName;
}
