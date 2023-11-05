import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "../../product/models/product.models";

interface ProductFeatureAttrit{
    product_id: number;
    product_key: string;
    product_value: string;
}

@Table({tableName: "product_featured"})
export class ProductFeature extends Model<ProductFeature, ProductFeatureAttrit>{
    @ApiProperty({example: 1, description: "Product Featured ID"})
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    // @ForeignKey(()=> Product)
    @ApiProperty({example: 1, description: "Product Product ID"})
    @Column({
        type: DataType.INTEGER,
    })
    product_id: number;

    @ApiProperty({example: 1, description: "Product Key"})
    @Column({
        type: DataType.STRING
    })
    product_key: string

    
    @ApiProperty({example: "value", description: "Product Feature Value"})
    @Column({
        type: DataType.STRING
    })
    product_value: string

    // @BelongsTo(()=> Product)
    // products: Product[]
}
