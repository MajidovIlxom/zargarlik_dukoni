import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../user/Models/user.models";
import { Product } from "../../product/models/product.models";
import { Payment } from "../../payment/models/payment.model";

interface OrderAttribute{
    user_id: number;
    product_id: number;
    address: string;
    location: string;
    phone_number: string;
}

@Table({tableName: "orders"})
export class Order extends Model<Order, OrderAttribute> {
    @ApiProperty({example: 1, description: "ID serial"})
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(()=> User)
    @ApiProperty({example: "user_id", description: "user_id"})
    @Column({
        type: DataType.INTEGER,
    })
    user_id: number;

    @ForeignKey(()=> Product)
    @ApiProperty({example: "product_id", description: "product_id"})
    @Column({
        type: DataType.INTEGER,
    })
    product_id: number;


    @ApiProperty({example: "address", description: "address"})
    @Column({
        type: DataType.STRING,
    })
    address: string;


    @ApiProperty({example: "location", description: "location"})
    @Column({
        type: DataType.STRING,
    })
    location: string;

    @ApiProperty({example: "photo_number", description: "photo_number"})
    @Column({
        type: DataType.STRING,
    })
    phone_number: string;


    @BelongsTo(()=> User)
    users: User;

    @BelongsTo(()=> Product)
    product: Product;

    @HasMany(() => Payment)
    payments: Payment[];
}
