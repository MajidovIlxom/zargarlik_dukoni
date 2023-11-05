import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePaymentDto {
    @IsNumber()
    @IsOptional()
    quantity: number;
    
    @IsString()
    @IsOptional()
    phone: string;
    
    @IsString()
    @IsOptional()
    number: string;
    
    @IsOptional()
    @IsNumber()
    year: number;

    @IsNumber()
    @IsOptional()
    month: number;
}
