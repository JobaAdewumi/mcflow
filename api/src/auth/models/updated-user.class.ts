import { IsEmail, IsString } from "class-validator";
export class UpdatedUser {
    @IsEmail()
    email: string;
    @IsString()
    password: string;

}