import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.models';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category) 
  private readonly categoryRepo: typeof Category
  ){}


  create(createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryRepo.create(createCategoryDto)
    } catch (error) {
      console.log(error);
      if (error) throw new BadRequestException("Siz noto'g'ri malumot kirittingiz")
      
    }
  }

  findAll() {
    return this.categoryRepo.findAll({include: {all: true}});
  }

  findOne(id: number) {
    if (!id) throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    return this.categoryRepo.findByPk(id,{include: {all: true}});
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.update(updateCategoryDto, {where: {id: id}, returning: true})
    
    return category[1][0]
  }

  async remove(id: number) {
    const category = await this.categoryRepo.destroy({where: {id}});
    if(!category){
      throw new HttpException("Kategoreya topilmadi",HttpStatus.NOT_FOUND)
    }
    return {message: "Kategoreya o'chirildi"};
  }
}
