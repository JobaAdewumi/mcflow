import { IsEmail, IsString } from 'class-validator';

export class Vendor {
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
}
