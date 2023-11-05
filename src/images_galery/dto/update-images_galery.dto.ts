import { IsString } from 'class-validator';

export class UpdateImagesGaleryDto {
    
    @IsString()
    photo: string
}
