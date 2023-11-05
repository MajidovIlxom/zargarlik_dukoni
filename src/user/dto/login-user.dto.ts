import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        example: 'user@gmail.com',
        description: "User email",
    })
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @ApiProperty({
        example: 'Uzbek!$st0n',
        description: "User password",
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password:string;

}