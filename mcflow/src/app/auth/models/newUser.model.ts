import { PackageName } from "./package.enum";

export interface NewUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  packageName: PackageName;
  password: string;
}
