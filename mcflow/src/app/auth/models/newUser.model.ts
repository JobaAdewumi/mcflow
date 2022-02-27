import { UserPackage } from "./package.enum";

export interface NewUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  userPackage: UserPackage;
  password: string;
}
