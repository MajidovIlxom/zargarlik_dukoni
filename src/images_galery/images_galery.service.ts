import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateImagesGaleryDto } from './dto/create-images_galery.dto';
import { UpdateImagesGaleryDto } from './dto/update-images_galery.dto';
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

  async update(id: number, updateImagesGaleryDto: UpdateImagesGaleryDto) {
    const images = await this.imagesGaleryRepo.findOne({where: {id: id}});
    
    const updatedImages = await this.imagesGaleryRepo.update(updateImagesGaleryDto,{
      where: {id: images.id}
    })
    if (!updatedImages)  throw new BadRequestException("the contract is inactive")
    
    return updatedImages;
  }

  remove(id: number) {
    return `This action removes a #${id} imagesGalery`;
  }
}
