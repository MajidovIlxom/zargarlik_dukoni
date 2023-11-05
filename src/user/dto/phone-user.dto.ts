import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PhoneUserDto {

    @ApiProperty({
        example: "+998961234567", description: "foydalanuvchininig telefon raqami"
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

}