// basket.models.ts
import { ApiProperty } from "@nestjs/swagger";
import {  BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "../../product/models/product.models";
import { User } from "../../user/Models/user.models";


interface BasketAttributes {
  product_id: number;
  user_id: number;
  subtotal: number;
}

@Table({ tableName: "basket" })
export class Basket extends Model<Basket, BasketAttributes> {
  @ApiProperty({ example: 1, description: "Basket ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;


  @ForeignKey(()=> Product)
  @ApiProperty({ example: 1, description: "Product ID" })
  @Column({
    type: DataType.INTEGER,
  })
  product_id: number;
  
  @ApiProperty({ example: 100, description: "Jami summa" })
  @Column({
    type: DataType.INTEGER,
  })
  subtotal: number;
  

  @BelongsTo(()=> Product)
  product: Product;

}
