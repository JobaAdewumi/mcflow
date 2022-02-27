import { User } from "./user.model";
import { Wallet } from "./wallet.model";

export interface userResponse {
  user: User;
  wallet: Wallet;
  exp: number;
  ist: number;
}
