import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    // @IsNotEmpty()
    // @IsNumber()
    // image_galery_id: number;
    
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
    
    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    gold?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    silver: string;
    
    @IsNotEmpty()
    @IsNumber()
    count: number;

    @IsNotEmpty()
    @IsNumber()
    category_id: number;
}
