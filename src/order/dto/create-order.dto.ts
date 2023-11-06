import { IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    
    @IsNumber()
    product_id: number;
    
    @IsString()
    address: string;
    
    @IsString()
    location: string;
    
    @IsString()
    phone_number: string;
}
