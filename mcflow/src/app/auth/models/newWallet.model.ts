import { UserPackage } from "./package.enum";

export interface NewWallet {
  userName: string;
  mcfPoints?: number;
  referralBalance?: number;
  userPackage: UserPackage;
}
