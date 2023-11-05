import { IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    
    @IsNumber()
    quantity: number;
    
    @IsString()
    phone: string;
    
    @IsString()
    number: string;
    
    @IsNumber()
    year: number;
    
    @IsNumber()
    month: number;
    
    @IsNumber()
    order_id: number;
}
