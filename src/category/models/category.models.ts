import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Table, Model, HasMany, } from "sequelize-typescript";
import { Product } from "../../product/models/product.models";

interface CategoryAttr {
    name: string;
}

@Table({tableName: "category"})
export class Category extends Model<Category, CategoryAttr> {
    @ApiProperty({example: 1, description: "Category ID"})
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({example: "name", description: "Category name"})
    @Column({
        type: DataType.STRING,
    })
    name: string

    @HasMany(()=> Product)
    product: Product;
}
