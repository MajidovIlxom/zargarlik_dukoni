import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "../../product/models/product.models";

interface ImagesGaleryAttribt{
    photo: string;
    product_id: number;
}

@Table({tableName: "images"})
export class ImagesGalery extends Model<ImagesGalery, ImagesGaleryAttribt>{

    @ApiProperty({example: 1, description: "ID serial"})
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({example: "photo", description: "photo url "})
    @Column({
        type: DataType.STRING,
    })
    photo: string;


    @ApiProperty({example: 1, description: "Product ID"})
    @Column({
        type: DataType.INTEGER,
    })
    product_id: number;
}
