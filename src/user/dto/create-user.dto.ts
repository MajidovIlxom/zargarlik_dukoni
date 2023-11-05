import {  IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsStrongPassword()
    @MinLength(6)
    password: string;
    
    @IsStrongPassword()
    @MinLength(6)
    confirm_password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    
    @IsPhoneNumber('UZ')
    phone: string;



}
