import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.models';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) 
  private readonly productRepo: typeof Product
  ){}
  create(createProductDto: CreateProductDto) {
    return this.productRepo.create(createProductDto);
  }

  findAll() {
    return this.productRepo.findAll({include: {all: true}});
  }

  findOne(id: number) {
    return this.productRepo.findByPk(id, {include: {all: true}});
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.update(updateProductDto, {where: {id: id},returning: true });   
    return product[1][0]
  }

  async remove(id: number) {
    const product = await this.productRepo.destroy({where: {id}});
    if(!product){
      throw new HttpException("Product topilmadi",HttpStatus.NOT_FOUND)
    }
    return {message: "Product o'chirildi"};
  }
}
