import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductFeatureDto } from './dto/create-product_feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product_feature.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ProductFeature } from './models/product_feature.models';

@Injectable()
export class ProductFeaturesService {

  constructor(@InjectModel(ProductFeature)
  private readonly productFeaturesRepo: typeof ProductFeature
  ){}


  create(createProductFeatureDto: CreateProductFeatureDto) {
    return this.productFeaturesRepo.create(createProductFeatureDto);
  }

  findAll() {
    return this.productFeaturesRepo.findAll({include: {all: true}});
  }

  findOne(id: number) {
    return this.productFeaturesRepo.findByPk(id,{include: {all: true}})
  }

  async update(id: number, updateProductFeatureDto: UpdateProductFeatureDto) {
    const productFeature = await this.productFeaturesRepo.update(updateProductFeatureDto, {where: {id: id},returning: true});
    return productFeature[1][0]
  }

  async remove(id: number) {
    const category = await this.productFeaturesRepo.destroy({where: {id}});
    if(!category){
      throw new HttpException("ProductFeature topilmadi",HttpStatus.NOT_FOUND)
    }
    return {message: "ProductFeature o'chirildi"};
  }
}
