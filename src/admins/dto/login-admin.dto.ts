import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
export class LoginAdminDto  {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsStrongPassword()
    @IsNotEmpty()
    hashed_password: string;
}