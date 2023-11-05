import { IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsStrongPassword()
    @MinLength(6)
    hashed_password: string;
    
    @IsStrongPassword()
    @MinLength(6)    
    confirm_password: string;


    @IsPhoneNumber()
    phoneNumber: string;
}
