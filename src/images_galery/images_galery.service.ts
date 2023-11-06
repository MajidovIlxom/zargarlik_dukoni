import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateImagesGaleryDto } from './dto/create-images_galery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ImagesGalery } from './models/images_galery.models';
import { Product } from '../product/models/product.models';
import { FilesService } from '../files/files.service';

@Injectable()
export class ImagesGaleryService {
  constructor(@InjectModel(ImagesGalery)
  private readonly imagesGaleryRepo: typeof ImagesGalery,
  private readonly fileService:FilesService
  ){}

  async create(createImagesGaleryDto: CreateImagesGaleryDto, image: any) {
    try {
      const images = await this.fileService.createFile(image);
      console.log(images);
      
      const imagesGalery = await this.imagesGaleryRepo.create({
        ...createImagesGaleryDto,
        photo: images,
      });      
      return imagesGalery;
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      throw error;
    }
  }

  findAll() {
    return this.imagesGaleryRepo.findAll({include: {all: true}});
  }

  findOne(id: number) {
    return this.imagesGaleryRepo.findByPk(id,{include: {all: true}});
  }

  async remove(id: number) {
    const category = await this.imagesGaleryRepo.destroy({where: {id}});
    if(!category){
      throw new HttpException("surat(lar) topilmadi",HttpStatus.NOT_FOUND)
    }
    return {message: "Surat(lar)  o'chirildi"};
  }
}
