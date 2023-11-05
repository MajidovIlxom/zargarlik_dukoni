import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductFeatureDto  {

    @IsOptional()
    @IsNumber()
    product_id: number;
    
    @IsOptional()
    @IsString()
    product_key: string;
    
    @IsOptional()
    @IsString()
    product_value: string;
}
