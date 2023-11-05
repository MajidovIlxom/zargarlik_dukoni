import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Table, Model } from "sequelize-typescript";

interface AdminAttr {
    fullname: string;
    email: string;
    hashed_password: string;
    confirm_password: string;
    phoneNumber: string;
    hashed_refresh_token: string;
    is_active: boolean;
}

@Table({tableName: "admins"})
export class Admin extends Model<Admin, AdminAttr> {

    @ApiProperty({example: 1, description: "user ID"})
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({example: "username", description: "Foydalnuvchining usernamei"})
    @Column({
        type: DataType.STRING,
    })
    fullname: string;

    @ApiProperty({example: "link", description: "Foydalnuvchining telegram_link"})
    @Column({
        type: DataType.STRING,
    })
    hashed_password: string;

    @ApiProperty({example: "user@gmail.com", description: "Foydalnuvchining email"})
    @Column({
        type: DataType.STRING,
        unique: true,
    })
    email: string;

    @ApiProperty({example: "phoneNumber", description: "Foydalnuvchining phoneNumber"})
    @Column({
        type: DataType.STRING,
    })
    phoneNumber: string;

    @ApiProperty({example: "false", description: "Foydalnuvchining is_active ligi"})
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_active: boolean;

    @ApiProperty({example: "refresh_token", description: "Foydalnuvchining hashed_refresh_token"})
    @Column({
        type: DataType.STRING,
    })
    hashed_refresh_token: string;

    @Column({
        type: DataType.STRING,
    })
    activation_link: string
    
}
