import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Order } from "../../order/models/order.models";

@Table({ tableName: "payment" })
export class Payment extends Model<Payment> {

    @ApiProperty({ example: 1, description: "ID serial" })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "quantity", description: "quantity" })
    @Column({
        type: DataType.INTEGER,
    })
    quantity: number;

    @ApiProperty({ example: "phone", description: "phone" })
    @Column({
        type: DataType.STRING,
    })
    phone: string;

    @ApiProperty({ example: "number", description: "number" })
    @Column({
        type: DataType.STRING,
    })
    number: string;

    @ApiProperty({ example: "year", description: "year" })
    @Column({
        type: DataType.INTEGER,
    })
    year: number;

    @ApiProperty({ example: "month", description: "month" })
    @Column({
        type: DataType.INTEGER,
    })
    month: number;

    @ForeignKey(() => Order)
    @ApiProperty({ example: "order ID", description: "Order ID" })
    @Column({
        type: DataType.INTEGER,
    })
    order_id: number;

    @BelongsTo(() => Order)
    order: Order;
}