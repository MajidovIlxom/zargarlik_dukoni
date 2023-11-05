import { 
    IsDateString, 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsPhoneNumber, 
    IsString, 
    IsStrongPassword, 
    MinLength 
} from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    username: string;

    @IsStrongPassword()
    @MinLength(6)
    @IsOptional()
    password: string;
    
    @IsStrongPassword()
    @MinLength(6)
    @IsOptional()
    confirm_password: string;

    @IsString()
    @IsOptional()
    telegram_link: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone: string;

    
    @IsPhoneNumber('UZ')
    @IsOptional()
    user_photo: string;
    
    @IsString()
    @IsDateString()
    @IsOptional()
    birthday: Date;


}
