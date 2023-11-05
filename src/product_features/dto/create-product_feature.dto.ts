import { IsNumber, IsString } from "class-validator";

export class CreateProductFeatureDto {
    
    @IsNumber()
    product_id: number;

    @IsString()
    product_key: string;
    
    @IsString()
    product_value: string;
}
