import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType,  ForeignKey,  HasMany,  Model, Table } from "sequelize-typescript";
import { Category } from "../../category/models/category.models";
import { Basket } from "../../basket/models/basket.models";
import { Order } from "../../order/models/order.models";

interface ProductAttrit {
    title: string;
    price: number;
    description: string;
    gold: string;
    silver: string;
    count: number;
    category_id: number;
}

@Table({tableName: "products"})
export class Product extends Model<Product, ProductAttrit> {
    @ApiProperty({example: 1, description: "Product ID"})
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({example: "title", description: "title"})
    @Column({
        type: DataType.STRING
    })
    title: string;

    @ApiProperty({example: "price",description: "price"})
    @Column({
        type: DataType.INTEGER
    })
    price: number;

    
    @ApiProperty({example: "description", description: "Product description"})
    @Column({
        type: DataType.STRING
    })
    description: string

    @ApiProperty({example: "gold", description: "Product gold"})
    @Column({
        type: DataType.STRING
    })
    gold: string

    @ApiProperty({example: "silver", description: "Product silver"})
    @Column({
        type: DataType.STRING
    })
    silver: string

    @ApiProperty({example: "count", description: "Product count"})
    @Column({
        type: DataType.INTEGER
    })
    count: number;

    @ForeignKey(()=> Category)
    @ApiProperty({example: "description", description: "Product description"})
    @Column({
        type: DataType.INTEGER
    })
    category_id: number;

    @BelongsTo(()=> Category)
    categorys: Category[];

    @HasMany(() => Basket)
    baskets: Basket[];

    @HasMany(() => Order)
    orders: Order[];
}