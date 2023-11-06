import { IsNumber } from "class-validator";

export class CreateBasketDto {
    @IsNumber()
    product_id: number;

    @IsNumber()
    subtotal: number
}
